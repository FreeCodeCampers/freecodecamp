import type { FastifyPluginCallbackTypebox } from '@fastify/type-provider-typebox';
import { ObjectId } from 'mongodb';
import _ from 'lodash';
import { FastifyInstance, FastifyReply } from 'fastify';
import jwt from 'jsonwebtoken';

import * as schemas from '../../schemas';
import { createResetProperties } from '../../utils/create-user';
import { customNanoid } from '../../utils/ids';
import { encodeUserToken } from '../../utils/tokens';
import { trimTags } from '../../utils/validation';
import { generateReportEmail } from '../../utils/email-templates';
import { splitUser } from '../helpers/user-utils';
import {
  normalizeChallenges,
  normalizeFlags,
  normalizeProfileUI,
  normalizeSurveys,
  normalizeTwitter,
  removeNulls
} from '../../utils/normalize';
import type { UpdateReqType } from '../../utils';
import {
  getCalendar,
  getPoints,
  ProgressTimestamp
} from '../../utils/progress';
import { JWT_SECRET } from '../../utils/env';

/**
 * Helper function to get the api url from the shared transcript link.
 *
 * @param msTranscript Shared transcript link.
 * @returns Microsoft transcript api url.
 */
export const getMsTranscriptApiUrl = (msTranscript: string) => {
  // example msTranscriptUrl: https://learn.microsoft.com/en-us/users/mot01/transcript/8u6awert43q1plo
  const url = new URL(msTranscript);

  // TODO(Post-MVP): throw if it doesn't match?
  const transcriptUrlRegex = /\/transcript\/([^/]+)\/?/;
  const id = transcriptUrlRegex.exec(url.pathname)?.[1];
  return `https://learn.microsoft.com/api/profiles/transcript/share/${
    id ?? ''
  }`;
};

/**
 * Wrapper for endpoints related to user account management,
 * such as account deletion.
 *
 * @param fastify The Fastify instance.
 * @param _options Fastify options I guess?
 * @param done Callback to signal that the logic has completed.
 */
export const userRoutes: FastifyPluginCallbackTypebox = (
  fastify,
  _options,
  done
) => {
  fastify.post(
    '/account/delete',
    {
      schema: schemas.deleteMyAccount
    },
    async (req, reply) => {
      await fastify.prisma.userToken.deleteMany({
        where: { userId: req.user!.id }
      });
      await fastify.prisma.msUsername.deleteMany({
        where: { userId: req.user!.id }
      });
      await fastify.prisma.survey.deleteMany({
        where: { userId: req.user!.id }
      });
      await fastify.prisma.user.delete({
        where: { id: req.user!.id }
      });
      reply.clearOurCookies();

      return {};
    }
  );

  fastify.post(
    '/account/reset-progress',
    {
      schema: schemas.resetMyProgress
    },
    async req => {
      await fastify.prisma.userToken.deleteMany({
        where: { userId: req.user!.id }
      });
      await fastify.prisma.msUsername.deleteMany({
        where: { userId: req.user!.id }
      });
      await fastify.prisma.survey.deleteMany({
        where: { userId: req.user!.id }
      });
      await fastify.prisma.user.update({
        where: { id: req.user!.id },
        data: createResetProperties()
      });

      return {};
    }
  );
  // TODO(Post-MVP): POST -> PUT
  fastify.post('/user/user-token', async req => {
    await fastify.prisma.userToken.deleteMany({
      where: { userId: req.user?.id }
    });

    const token = await fastify.prisma.userToken.create({
      data: {
        created: new Date(),
        id: customNanoid(),
        userId: req.user!.id,
        // TODO(Post-MVP): expire after ttl has passed.
        ttl: 77760000000 // 900 * 24 * 60 * 60 * 1000
      }
    });

    return {
      userToken: encodeUserToken(token.id)
    };
  });

  fastify.delete(
    '/user/user-token',
    {
      schema: schemas.deleteUserToken
    },
    async (req, reply) => {
      const { count } = await fastify.prisma.userToken.deleteMany({
        where: { userId: req.user?.id }
      });

      if (count === 0) {
        void reply.code(404);
        return {
          message: 'userToken not found',
          type: 'info'
        } as const;
      }
      return { userToken: null };
    }
  );

  fastify.post(
    '/user/report-user',
    {
      schema: schemas.reportUser,
      preHandler: (req, _reply, done) => {
        req.body.reportDescription = trimTags(req.body.reportDescription);
        done();
      }
    },
    async (req, reply) => {
      const user = await fastify.prisma.user.findUniqueOrThrow({
        where: { id: req.user?.id }
      });
      const { username, reportDescription: report } = req.body;

      if (!username || !report) {
        // NOTE: Do we want to log these instances?
        void reply.code(400);
        return {
          type: 'danger',
          message: 'flash.provide-username'
        } as const;
      }

      await fastify.sendEmail({
        from: 'team@freecodecamp.org',
        to: 'support@freecodecamp.org',
        cc: user.email,
        subject: `Abuse Report : Reporting ${username}'s profile.`,
        text: generateReportEmail(user, username, report)
      });

      return {
        type: 'info',
        message: 'flash.report-sent',
        variables: { email: user.email }
      } as const;
    }
  );

  fastify.delete(
    '/user/ms-username',
    {
      schema: schemas.deleteMsUsername
    },
    async (req, reply) => {
      try {
        await fastify.prisma.msUsername.deleteMany({
          where: { userId: req.user?.id }
        });

        // TODO(Post-MVP): return a generic success message.
        return { msUsername: null };
      } catch (err) {
        fastify.log.error(err);
        fastify.Sentry.captureException(err);
        void reply.code(500);
        void reply.send({
          message: 'flash.ms.transcript.unlink-err',
          type: 'error'
        });
      }
    }
  );

  fastify.post(
    '/user/ms-username',
    {
      schema: schemas.postMsUsername,
      errorHandler(error, request, reply) {
        if (error.validation) {
          void reply.code(400).send({
            message: 'flash.ms.transcript.link-err-1',
            type: 'error'
          });
        } else {
          fastify.errorHandler(error, request, reply);
        }
      }
    },
    async (req, reply) => {
      try {
        const user = await fastify.prisma.user.findUniqueOrThrow({
          where: { id: req.user?.id }
        });

        const msApiRes = await fetch(
          getMsTranscriptApiUrl(req.body.msTranscriptUrl)
        );

        if (!msApiRes.ok) {
          return reply
            .status(404)
            .send({ type: 'error', message: 'flash.ms.transcript.link-err-2' });
        }

        const { userName } = (await msApiRes.json()) as { userName: string };

        if (!userName) {
          return reply.status(500).send({
            type: 'error',
            message: 'flash.ms.transcript.link-err-3'
          });
        }

        // TODO(Post-MVP): make msUsername unique, then we can simply try to
        // create the record and catch the error.
        const usernameUsed = !!(await fastify.prisma.msUsername.findFirst({
          where: {
            msUsername: userName
          }
        }));

        if (usernameUsed) {
          return reply.status(403).send({
            type: 'error',
            message: 'flash.ms.transcript.link-err-4'
          });
        }

        // TODO(Post-MVP): do we need to store tll in the database? We aren't
        // storing the creation date, so we can't expire it.

        // 900 days in ms
        const ttl = 900 * 24 * 60 * 60 * 1000;

        // TODO(Post-MVP): make userId unique and then we can upsert.

        await fastify.prisma.msUsername.deleteMany({
          where: { userId: user.id }
        });

        await fastify.prisma.msUsername.create({
          data: {
            msUsername: userName,
            ttl,
            userId: user.id
          }
        });

        return { msUsername: userName };
      } catch (err) {
        fastify.log.error(err);
        fastify.Sentry.captureException(err);
        return reply.code(500).send({
          type: 'error',
          message: 'flash.ms.transcript.link-err-6'
        });
      }
    }
  );

  fastify.post(
    '/user/submit-survey',
    {
      schema: schemas.submitSurvey,
      errorHandler(error, request, reply) {
        if (error.validation) {
          void reply.code(400).send({
            type: 'error',
            message: 'flash.survey.err-1'
          });
        } else {
          fastify.errorHandler(error, request, reply);
        }
      }
    },
    async (req, reply) => {
      try {
        const user = await fastify.prisma.user.findUniqueOrThrow({
          where: { id: req.user?.id }
        });
        const { surveyResults } = req.body;
        const { title } = surveyResults;

        const completedSurveys = await fastify.prisma.survey.findMany({
          where: { userId: user.id }
        });

        const surveyAlreadyTaken = completedSurveys.some(
          s => s.title === title
        );
        if (surveyAlreadyTaken) {
          return reply.code(400).send({
            type: 'error',
            message: 'flash.survey.err-2'
          });
        }

        const newSurvey = {
          ...surveyResults,
          userId: user.id
        };

        await fastify.prisma.survey.create({
          data: newSurvey
        });

        return {
          type: 'success',
          message: 'flash.survey.success'
        } as const;
      } catch (err) {
        fastify.log.error(err);
        fastify.Sentry.captureException(err);
        void reply.code(500);
        return {
          type: 'error',
          message: 'flash.survey.err-3'
        } as const;
      }
    }
  );

  fastify.post(
    '/user/exam-environment/token',
    {
      schema: schemas.userExamEnvironmentToken
    },
    examEnvironmentTokenHandler
  );

  done();
};

// eslint-disable-next-line jsdoc/require-param
/**
 * Generate a new authorization token for the given user, and invalidates any existing tokens.
 *
 * Requires the user to be authenticated.
 */
async function examEnvironmentTokenHandler(
  this: FastifyInstance,
  req: UpdateReqType<typeof schemas.userExamEnvironmentToken>,
  reply: FastifyReply
) {
  const userId = req.user?.id;
  if (!userId) {
    throw new Error('Unreachable. User should be authenticated.');
  }
  // Delete (invalidate) any existing tokens for the user.
  await this.prisma.examEnvironmentAuthorizationToken.deleteMany({
    where: {
      userId
    }
  });

  const ONE_YEAR_IN_MS = 365 * 24 * 60 * 60 * 1000;

  const token = await this.prisma.examEnvironmentAuthorizationToken.create({
    data: {
      expireAt: new Date(Date.now() + ONE_YEAR_IN_MS),
      userId
    }
  });

  const examEnvironmentAuthorizationToken = jwt.sign(
    { examEnvironmentAuthorizationToken: token.id },
    JWT_SECRET
  );

  void reply.code(201);
  void reply.send({
    examEnvironmentAuthorizationToken
  });
}

/**
 * Plugin containing GET routes for user account management. They are kept
 * separate because they do not require CSRF protection.
 *
 * @param fastify The Fastify instance.
 * @param _options Options passed to the plugin via `fastify.register(plugin, options)`.
 * @param done Callback to signal that the logic has completed.
 */
export const userGetRoutes: FastifyPluginCallbackTypebox = (
  fastify,
  _options,
  done
) => {
  fastify.get(
    '/user/get-session-user',
    {
      schema: schemas.getSessionUser
    },
    async (req, res) => {
      try {
        const userTokenP = fastify.prisma.userToken.findFirst({
          where: { userId: req.user!.id }
        });

        const userP = fastify.prisma.user.findUnique({
          where: { id: req.user!.id },
          select: {
            about: true,
            acceptedPrivacyTerms: true,
            completedChallenges: true,
            completedExams: true,
            completedModules: true,
            completedChapters: true,
            currentChallengeId: true,
            quizAttempts: true,
            email: true,
            emailVerified: true,
            githubProfile: true,
            id: true,
            is2018DataVisCert: true,
            is2018FullStackCert: true,
            isApisMicroservicesCert: true,
            isBackEndCert: true,
            isCheater: true,
            isCollegeAlgebraPyCertV8: true,
            isDataAnalysisPyCertV7: true,
            isDataVisCert: true,
            isDonating: true,
            isFoundationalCSharpCertV8: true,
            isFrontEndCert: true,
            isFrontEndLibsCert: true,
            isFullStackCert: true,
            isHonest: true,
            isInfosecCertV7: true,
            isInfosecQaCert: true,
            isJsAlgoDataStructCert: true,
            isJsAlgoDataStructCertV8: true,
            isMachineLearningPyCertV7: true,
            isQaCertV7: true,
            isRelationalDatabaseCertV8: true,
            isRespWebDesignCert: true,
            isSciCompPyCertV7: true,
            keyboardShortcuts: true,
            linkedin: true,
            location: true,
            name: true,
            partiallyCompletedChallenges: true,
            picture: true,
            portfolio: true,
            profileUI: true,
            progressTimestamps: true,
            savedChallenges: true,
            sendQuincyEmail: true,
            theme: true,
            twitter: true,
            username: true,
            usernameDisplay: true,
            website: true,
            yearsTopContributor: true
          }
        });

        const completedSurveysP = fastify.prisma.survey.findMany({
          where: { userId: req.user!.id }
        });

        const msUsernameP = fastify.prisma.msUsername.findFirst({
          where: { userId: req.user?.id }
        });

        const [userToken, user, completedSurveys, msUsername] =
          await Promise.all([
            userTokenP,
            userP,
            completedSurveysP,
            msUsernameP
          ]);

        if (!user?.username) {
          void res.code(500);
          return { user: {}, result: '' };
        }
        // TODO: DRY this (the creation of the response body) and
        // get-public-profile's response body creation.

        const encodedToken = userToken
          ? encodeUserToken(userToken.id)
          : undefined;

        const [flags, rest] = splitUser(user);

        const {
          username,
          usernameDisplay,
          completedChallenges,
          progressTimestamps,
          twitter,
          profileUI,
          currentChallengeId,
          location,
          name,
          theme,
          ...publicUser
        } = rest;

        await res.send({
          user: {
            [username]: {
              ...removeNulls(publicUser),
              ...normalizeFlags(flags),
              currentChallengeId: currentChallengeId ?? '',
              completedChallenges: normalizeChallenges(completedChallenges),
              completedChallengeCount: completedChallenges.length,
              // This assertion is necessary until the database is normalized.
              calendar: getCalendar(
                progressTimestamps as ProgressTimestamp[] | null
              ),
              // This assertion is necessary until the database is normalized.
              points: getPoints(
                progressTimestamps as ProgressTimestamp[] | null
              ),
              profileUI: normalizeProfileUI(profileUI),
              // TODO(Post-MVP) remove this and just use emailVerified
              isEmailVerified: user.emailVerified,
              joinDate: new ObjectId(user.id).getTimestamp().toISOString(),
              location: location ?? '',
              name: name ?? '',
              theme: theme ?? 'default',
              twitter: normalizeTwitter(twitter),
              username: usernameDisplay || username,
              userToken: encodedToken,
              completedSurveys: normalizeSurveys(completedSurveys),
              msUsername: msUsername?.msUsername
            }
          },
          result: user.username
        });
      } catch (err) {
        fastify.log.error(err);
        fastify.Sentry.captureException(err);
        void res.code(500);
        return { user: {}, result: '' };
      }
    }
  );

  done();
};
