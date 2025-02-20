import { Career, Portfolio } from '@prisma/client';
import { type FastifyPluginCallbackTypebox } from '@fastify/type-provider-typebox';
import { ObjectId } from 'mongodb';
import _ from 'lodash';

import { isRestricted } from '../helpers/is-restricted';
import * as schemas from '../../schemas';
import { splitUser } from '../helpers/user-utils';
import {
  normalizeChallenges,
  NormalizedChallenge,
  normalizeFlags,
  normalizeProfileUI,
  normalizeTwitter,
  removeNulls
} from '../../utils/normalize';
import {
  Calendar,
  getCalendar,
  getPoints,
  ProgressTimestamp
} from '../../utils/progress';
import { challengeTypes } from '../../../../shared/config/challenge-types';

type ProfileUI = Partial<{
  isLocked: boolean;
  showAbout: boolean;
  showCerts: boolean;
  showDonation: boolean;
  showHeatMap: boolean;
  showLocation: boolean;
  showName: boolean;
  showPoints: boolean;
  showPortfolio: boolean;
  showTimeLine: boolean;
  showCareer: boolean;
}>;

type RawUser = {
  about: string;
  completedChallenges: NormalizedChallenge[];
  calendar: Calendar;
  id: string;
  isDonating: boolean;
  joinDate: string;
  location: string;
  name: string;
  points: number;
  portfolio: Portfolio[];
  profileUI: ProfileUI;
  career: Career[];
};

/**
 * Creates an object with the properties that are shared with the public.
 * @param user The raw user object.
 * @returns The shared user object.
 */
export const replacePrivateData = (user: RawUser) => {
  const {
    showAbout,
    showHeatMap,
    showCerts,
    showDonation,
    showLocation,
    showName,
    showPoints,
    showPortfolio,
    showTimeLine,
    showCareer
  } = user.profileUI;

  return {
    about: showAbout ? user.about : '',
    calendar: showHeatMap ? user.calendar : {},
    completedChallenges: showTimeLine
      ? showCerts
        ? user.completedChallenges
        : user.completedChallenges.filter(
            c => c.challengeType !== challengeTypes.step
          )
      : [],
    isDonating: showDonation ? user.isDonating : null,
    joinDate: showAbout ? user.joinDate : '',
    location: showLocation ? user.location : '',
    name: showName ? user.name : '',
    points: showPoints ? user.points : null,
    portfolio: showPortfolio ? user.portfolio : [],
    career: showCareer ? user.career : []
  };
};

const blockedUserAgentParts = ['python', 'google-apps-script', 'curl'];
/**
 * Plugin containing public GET routes for user account management. They are kept
 * separate because they do not require CSRF protection or authorization.
 *
 * @param fastify The Fastify instance.
 * @param _options Options passed to the plugin via `fastify.register(plugin, options)`.
 * @param done Callback to signal that the logic has completed.
 */
export const userPublicGetRoutes: FastifyPluginCallbackTypebox = (
  fastify,
  _options,
  done
) => {
  fastify.get(
    '/api/users/get-public-profile',
    {
      schema: schemas.getPublicProfile,
      onRequest: (req, reply, done) => {
        const userAgent = req.headers['user-agent'];

        if (
          userAgent &&
          blockedUserAgentParts.some(ua => userAgent.toLowerCase().includes(ua))
        ) {
          void reply.code(400);
          void reply.send(
            'This endpoint is no longer available outside of the freeCodeCamp ecosystem'
          );
        }
        done();
      }
    },
    async (req, reply) => {
      // TODO(Post-MVP): look for duplicates unless we can make username unique in the db.
      const user = await fastify.prisma.user.findFirst({
        where: { username: req.query.username }
        // TODO: only select desired fields, then stop 'omit'ing the undesired
        // ones.
      });

      if (!user) {
        void reply.code(404);
        return reply.send({});
      }

      const [flags, rest] = splitUser(user);

      const publicUser = _.omit(rest, [
        'currentChallengeId',
        'email',
        'emailVerified',
        'sendQuincyEmail',
        'theme',
        // keyboardShortcuts is included in flags.
        // 'keyboardShortcuts',
        'acceptedPrivacyTerms',
        'progressTimestamps',
        'unsubscribeId',
        'donationEmails',
        'externalId',
        'usernameDisplay',
        'isBanned'
      ]);

      const normalizedProfileUI = normalizeProfileUI(user.profileUI);

      void reply.code(200);
      if (normalizedProfileUI.isLocked) {
        // TODO(Post-MVP): just return isLocked: true and either a null user
        // or no user at all. (see other TODO in the else branch below)
        return reply.send({
          entities: {
            user: {
              [user.username]: {
                isLocked: true,
                profileUI: normalizedProfileUI,
                username: user.username
              }
            }
          },
          result: user.username
        });
      } else {
        const progressTimestamps = user.progressTimestamps as
          | ProgressTimestamp[]
          | null;
        const sharedUser = replacePrivateData({
          ...user,
          calendar: getCalendar(progressTimestamps),
          completedChallenges: normalizeChallenges(user.completedChallenges),
          location: user.location ?? '',
          joinDate: new ObjectId(user.id).getTimestamp().toISOString(),
          name: user.name ?? '',
          points: getPoints(progressTimestamps),
          profileUI: normalizedProfileUI
        });

        const returnedUser = {
          ...removeNulls(publicUser),
          ...normalizeFlags(flags),
          ...sharedUser,
          profileUI: normalizedProfileUI,
          // TODO: should this always be returned? Shouldn't some privacy
          // setting control it? Same applies to website, githubProfile,
          // and linkedin.
          twitter: normalizeTwitter(user.twitter),
          yearsTopContributor: user.yearsTopContributor
        };
        return reply.send({
          // TODO(Post-MVP): just return a user object (i.e. returnedUser) and
          // isLocked: false. The there should be no need for Type.Union in the
          // schema. Alternatively, have the user object be nullable and don't
          // bother with isLocked.
          entities: {
            user: { [user.username]: returnedUser }
          },
          result: user.username
        });
      }
    }
  );

  fastify.get(
    '/api/users/exists',
    {
      schema: schemas.userExists,
      attachValidation: true
    },
    async (req, reply) => {
      if (req.validationError) {
        void reply.code(400);
        // TODO(Post-MVP): return a message telling the requester that their
        // request was malformed.
        return await reply.send({ exists: true });
      }

      const username = req.query.username.toLowerCase();

      if (isRestricted(username)) return await reply.send({ exists: true });

      const exists =
        (await fastify.prisma.user.count({
          where: { username }
        })) > 0;

      await reply.send({ exists });
    }
  );

  done();
};
