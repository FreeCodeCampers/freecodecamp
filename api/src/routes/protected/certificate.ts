import type { CompletedChallenge } from '@prisma/client';
import isEmail from 'validator/lib/isEmail';
import type { FastifyPluginCallbackTypebox } from '@fastify/type-provider-typebox';

import { getChallenges } from '../../utils/get-challenges';
import {
  certIds,
  certSlugTypeMap,
  certTypeTitleMap,
  certTypes,
  currentCertifications,
  legacyCertifications,
  legacyFullStackCertification,
  upcomingCertifications
} from '../../../../shared/config/certification-settings';

import * as schemas from '../../schemas';
import { normalizeChallenges, removeNulls } from '../../utils/normalize';

import { SHOW_UPCOMING_CHANGES } from '../../utils/env';
import { isKnownCertSlug } from '../helpers/certificate-utils';

const {
  legacyFrontEndChallengeId,
  legacyBackEndChallengeId,
  legacyDataVisId,
  legacyInfosecQaId,
  legacyFullStackId,
  respWebDesignId,
  frontEndDevLibsId,
  jsAlgoDataStructId,
  jsAlgoDataStructV8Id,
  dataVis2018Id,
  apisMicroservicesId,
  qaV7Id,
  infosecV7Id,
  sciCompPyV7Id,
  dataAnalysisPyV7Id,
  machineLearningPyV7Id,
  relationalDatabaseV8Id,
  collegeAlgebraPyV8Id,
  foundationalCSharpV8Id
} = certIds;

function isCertAllowed(certSlug: string): boolean {
  if (
    currentCertifications.includes(certSlug) ||
    legacyCertifications.includes(certSlug) ||
    legacyFullStackCertification.includes(certSlug)
  ) {
    return true;
  }
  if (SHOW_UPCOMING_CHANGES && upcomingCertifications.includes(certSlug)) {
    return true;
  }
  return false;
}

function renderCertifiedEmail({
  username,
  name
}: {
  username: string;
  name: string;
}) {
  const certifiedEmailTemplate = `Hi ${name || username},

Congratulations on completing all of the freeCodeCamp certifications!

All of your certifications are now live at: https://www.freecodecamp.org/${username}

Please tell me a bit more about you and your near-term goals.

Are you interested in contributing to our open source projects used by nonprofits?

Also, check out https://contribute.freecodecamp.org/ for some fun and convenient ways you can contribute to the community.

Happy coding,

- Quincy Larson, teacher at freeCodeCamp
`;
  return certifiedEmailTemplate;
}

function hasCompletedTests(
  tests: { id: string }[],
  completedChallenges: CompletedChallenge[]
) {
  return tests.every(({ id }) =>
    completedChallenges.some(({ id: completedId }) => completedId === id)
  );
}

function assertTestsExist(
  tests: ReturnType<typeof getChallenges>[number]['tests']
): asserts tests is { id: string }[] {
  if (!Array.isArray(tests)) {
    throw new Error('Tests is not an array');
  }
  if (!tests.every(test => typeof test === 'object' && test !== null)) {
    throw new Error('Tests contains non-object values');
  }
  if (!tests.every(test => typeof test.id === 'string')) {
    throw new Error('Tests contain non-string ids');
  }
}

function getCertById(
  challengeId: string,
  challenges: ReturnType<typeof getChallenges>
): { id: string; tests: { id: string }[]; challengeType: number } {
  const challengeById = challenges.filter(({ id }) => id === challengeId)[0];
  if (!challengeById) {
    throw new Error(`Challenge with id '${challengeId}' not found`);
  }
  const { id, tests, challengeType } = challengeById;
  assertTestsExist(tests);
  return { id, tests, challengeType };
}

function createCertTypeIds(challenges: ReturnType<typeof getChallenges>) {
  return {
    // legacy
    [certTypes.frontEnd]: getCertById(legacyFrontEndChallengeId, challenges),
    [certTypes.jsAlgoDataStruct]: getCertById(jsAlgoDataStructId, challenges),
    [certTypes.backEnd]: getCertById(legacyBackEndChallengeId, challenges),
    [certTypes.dataVis]: getCertById(legacyDataVisId, challenges),
    [certTypes.infosecQa]: getCertById(legacyInfosecQaId, challenges),
    [certTypes.fullStack]: getCertById(legacyFullStackId, challenges),

    // modern
    [certTypes.respWebDesign]: getCertById(respWebDesignId, challenges),
    [certTypes.frontEndDevLibs]: getCertById(frontEndDevLibsId, challenges),
    [certTypes.dataVis2018]: getCertById(dataVis2018Id, challenges),
    [certTypes.jsAlgoDataStructV8]: getCertById(
      jsAlgoDataStructV8Id,
      challenges
    ),
    [certTypes.apisMicroservices]: getCertById(apisMicroservicesId, challenges),
    [certTypes.qaV7]: getCertById(qaV7Id, challenges),
    [certTypes.infosecV7]: getCertById(infosecV7Id, challenges),
    [certTypes.sciCompPyV7]: getCertById(sciCompPyV7Id, challenges),
    [certTypes.dataAnalysisPyV7]: getCertById(dataAnalysisPyV7Id, challenges),
    [certTypes.machineLearningPyV7]: getCertById(
      machineLearningPyV7Id,
      challenges
    ),
    [certTypes.relationalDatabaseV8]: getCertById(
      relationalDatabaseV8Id,
      challenges
    ),
    [certTypes.collegeAlgebraPyV8]: getCertById(
      collegeAlgebraPyV8Id,
      challenges
    ),
    [certTypes.foundationalCSharpV8]: getCertById(
      foundationalCSharpV8Id,
      challenges
    )

    // upcoming
  };
}

interface CertI {
  isRespWebDesignCert?: boolean;
  isJsAlgoDataStructCert?: boolean;
  isJsAlgoDataStructCertV8?: boolean;
  isFrontEndLibsCert?: boolean;
  is2018DataVisCert?: boolean;
  isApisMicroservicesCert?: boolean;
  isInfosecQaCert?: boolean;
  isQaCertV7?: boolean;
  isInfosecCertV7?: boolean;
  isFrontEndCert?: boolean;
  isBackEndCert?: boolean;
  isDataVisCert?: boolean;
  isFullStackCert?: boolean;
  isSciCompPyCertV7?: boolean;
  isDataAnalysisPyCertV7?: boolean;
  isMachineLearningPyCertV7?: boolean;
  isRelationalDatabaseCertV8?: boolean;
  isCollegeAlgebraPyCertV8?: boolean;
  isFoundationalCSharpCertV8?: boolean;
}

function getUserIsCertMap(user: CertI) {
  const {
    isRespWebDesignCert = false,
    isJsAlgoDataStructCert = false,
    isJsAlgoDataStructCertV8 = false,
    isFrontEndLibsCert = false,
    is2018DataVisCert = false,
    isApisMicroservicesCert = false,
    isInfosecQaCert = false,
    isQaCertV7 = false,
    isInfosecCertV7 = false,
    isFrontEndCert = false,
    isBackEndCert = false,
    isDataVisCert = false,
    isFullStackCert = false,
    isSciCompPyCertV7 = false,
    isDataAnalysisPyCertV7 = false,
    isMachineLearningPyCertV7 = false,
    isRelationalDatabaseCertV8 = false,
    isCollegeAlgebraPyCertV8 = false,
    isFoundationalCSharpCertV8 = false
  } = user;

  return {
    isRespWebDesignCert,
    isJsAlgoDataStructCert,
    isJsAlgoDataStructCertV8,
    isFrontEndLibsCert,
    is2018DataVisCert,
    isApisMicroservicesCert,
    isInfosecQaCert,
    isQaCertV7,
    isInfosecCertV7,
    isFrontEndCert,
    isBackEndCert,
    isDataVisCert,
    isFullStackCert,
    isSciCompPyCertV7,
    isDataAnalysisPyCertV7,
    isMachineLearningPyCertV7,
    isRelationalDatabaseCertV8,
    isCollegeAlgebraPyCertV8,
    isFoundationalCSharpCertV8
  };
}

/**
 * Plugin for the protected certificate endpoints.
 *
 * @param fastify The Fastify instance.
 * @param _options Options passed to the plugin via `fastify.register(plugin, options)`.
 * @param done The callback to signal that the plugin is ready.
 */
export const protectedCertificateRoutes: FastifyPluginCallbackTypebox = (
  fastify,
  _options,
  done
) => {
  const challenges = getChallenges();
  const certTypeIds = createCertTypeIds(challenges);

  // TODO(POST_MVP): Response should not include updated user. If a client wants the updated user, it should make a separate request
  // OR: Always respond with current user - full user object - not random pieces.
  fastify.put(
    '/certificate/verify',
    {
      schema: schemas.certificateVerify,
      errorHandler(error, request, reply) {
        if (error.validation) {
          void reply.code(400).send({
            response: {
              type: 'danger',
              message: 'flash.wrong-name',
              variables: { name: '' }
            }
          });
        } else {
          fastify.errorHandler(error, request, reply);
        }
      }
    },
    async (req, reply) => {
      const { certSlug } = req.body;

      const logger = fastify.log.child({ req });

      if (!isKnownCertSlug(certSlug) || !isCertAllowed(certSlug)) {
        logger.debug('invalid certificate type');
        void reply.code(400);
        return {
          response: {
            type: 'danger',
            // message: 'Certificate type not found'
            message: 'flash.wrong-name',
            variables: { name: certSlug }
          }
        } as const;
      }

      const certType = certSlugTypeMap[certSlug];
      const certName = certTypeTitleMap[certType];

      const user = await fastify.prisma.user.findUnique({
        where: { id: req.user?.id }
      });

      if (!user) {
        void reply.code(500);
        fastify.log.error('User not found');
        fastify.Sentry.captureException(Error('User not found'));
        return {
          type: 'danger',
          // message: 'User not found'
          message: 'flash.went-wrong'
        } as const;
      }
      const { completedChallenges } = user;
      const isCertMap = getUserIsCertMap(removeNulls(user));

      // TODO: Discuss if this is a requirement still
      if (!user.name) {
        logger.debug('user has not set name');
        void reply.code(400);
        return {
          response: {
            type: 'info',
            message: 'flash.name-needed'
          },
          isCertMap,
          completedChallenges: normalizeChallenges(completedChallenges)
        } as const;
      }

      if (user[certType]) {
        void reply.code(200);
        return {
          response: {
            type: 'info',
            message: 'flash.already-claimed',
            variables: {
              name: certName
            }
          },
          isCertMap,
          completedChallenges: normalizeChallenges(completedChallenges)
        } as const;
      }

      const { id, tests, challengeType } = certTypeIds[certType];
      const hasCompletedTestRequirements = hasCompletedTests(
        tests,
        user.completedChallenges
      );

      if (!hasCompletedTestRequirements) {
        logger.debug('user has not completed test requirements');
        void reply.code(400);
        return {
          response: {
            type: 'info',
            message: 'flash.incomplete-steps',
            variables: {
              name: certName
            }
          },
          isCertMap,
          completedChallenges: normalizeChallenges(completedChallenges)
        } as const;
      }

      const updatedUser = await fastify.prisma.user.update({
        where: { id: user.id },
        data: {
          [certType]: true,
          completedChallenges: {
            push: {
              id,
              completedDate: Date.now(),
              challengeType
            }
          }
        },
        select: {
          username: true,
          email: true,
          name: true,
          completedChallenges: true,
          is2018DataVisCert: true,
          is2018FullStackCert: true,
          isApisMicroservicesCert: true,
          isBackEndCert: true,
          isDataVisCert: true,
          isCollegeAlgebraPyCertV8: true,
          isDataAnalysisPyCertV7: true,
          isFoundationalCSharpCertV8: true,
          isFrontEndCert: true,
          isFrontEndLibsCert: true,
          isFullStackCert: true,
          isInfosecCertV7: true,
          isInfosecQaCert: true,
          isJsAlgoDataStructCert: true,
          isJsAlgoDataStructCertV8: true,
          isMachineLearningPyCertV7: true,
          isQaCertV7: true,
          isRelationalDatabaseCertV8: true,
          isRespWebDesignCert: true,
          isSciCompPyCertV7: true
        }
      });

      const updatedUserSansNull = removeNulls(updatedUser);

      const updatedIsCertMap = getUserIsCertMap(updatedUserSansNull);

      // TODO(POST-MVP): Consider sending email based on `user.isEmailVerified` as well
      const hasCompletedAllCerts = currentCertifications
        .map(x => certSlugTypeMap[x])
        .every(certType => updatedIsCertMap[certType]);
      const shouldSendCertifiedEmailToCamper =
        isEmail(updatedUser.email) && hasCompletedAllCerts;

      if (shouldSendCertifiedEmailToCamper) {
        logger.debug('sending certified email to camper');
        const notifyUser = {
          to: updatedUser.email,
          from: 'quincy@freecodecamp.org',
          subject:
            'Congratulations on completing all of the freeCodeCamp certifications!',
          text: renderCertifiedEmail({
            username: updatedUser.username,
            // Safety: `user.name` is required to exist earlier. TODO: Assert
            name: updatedUser.name as string
          })
        };

        // Failed email should not prevent successful response.
        try {
          // TODO(POST-MVP): Ensure Camper knows they **have** claimed the cert, but the email failed to send.
          await fastify.sendEmail(notifyUser);
        } catch (e) {
          fastify.log.error(e);
          fastify.Sentry.captureException(e);
        }
      }

      void reply.code(200);
      return {
        response: {
          type: 'success',
          message: 'flash.cert-claim-success',
          variables: {
            username: updatedUser.username,
            name: certName
          }
        },
        isCertMap: updatedIsCertMap,
        completedChallenges: normalizeChallenges(
          updatedUserSansNull.completedChallenges
        )
      } as const;
    }
  );

  done();
};
