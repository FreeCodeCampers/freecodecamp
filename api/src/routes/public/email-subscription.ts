import { type FastifyPluginCallbackTypebox } from '@fastify/type-provider-typebox';
import * as schemas from '../../schemas';
import { getRedirectParams } from '../../utils/redirection';

/**
 * Endpoints to set 'sendQuincyEmail' to true or false using 'unsubscribeId'.
 *
 * @param fastify The Fastify instance.
 * @param _options Options passed to the plugin via `fastify.register(plugin, options)`.
 * @param done The callback to signal that the plugin is ready.
 */
export const emailSubscribtionRoutes: FastifyPluginCallbackTypebox = (
  fastify,
  _options,
  done
) => {
  fastify.get(
    '/ue/:unsubscribeId',
    {
      schema: schemas.unsubscribe,
      errorHandler(error, request, reply) {
        if (error.validation) {
          const { origin } = getRedirectParams(request);
          void reply.code(302);
          void reply.redirectWithMessage(origin, {
            type: 'info',
            content: 'We could not find an account to unsubscribe.'
          });
        } else {
          fastify.errorHandler(error, request, reply);
        }
      }
    },
    async (req, reply) => {
      try {
        const { origin } = getRedirectParams(req);
        const { unsubscribeId } = req.params;
        const log = fastify.log.child({ req, unsubscribeId });
        log.debug('Processing unsubscribe request');

        const unsubUsers = await fastify.prisma.user.findMany({
          where: { unsubscribeId }
        });

        if (!unsubUsers.length) {
          log.warn('No users found for unsubscribe request');
          void reply.code(302);
          return reply.redirectWithMessage(origin, {
            type: 'info',
            content: 'We could not find an account to unsubscribe.'
          });
        }

        const userUpdatePromises = unsubUsers.map(user =>
          fastify.prisma.user.updateMany({
            where: { email: user.email },
            data: {
              sendQuincyEmail: false
            }
          })
        );

        await Promise.all(userUpdatePromises);
        log.info('Successfully unsubscribed users from email');

        return reply.redirectWithMessage(
          `${origin}/unsubscribed/${unsubscribeId}`,
          {
            type: 'success',
            content: "We've successfully updated your email preferences."
          }
        );
      } catch (error) {
        fastify.log.error(error, 'Failed to unsubscribe user from email');
        fastify.Sentry.captureException(error);
        void reply.code(302);
        return reply.redirectWithMessage(origin, {
          type: 'danger',
          content: `Failed to unsubscribe user, please contact support at support@freecodecamp.org`
        });
      }
    }
  );

  fastify.get(
    '/resubscribe/:unsubscribeId',
    {
      schema: schemas.resubscribe,
      errorHandler(error, request, reply) {
        if (error.validation) {
          const { origin } = getRedirectParams(request);
          void reply.code(302);
          void reply.redirectWithMessage(origin, {
            type: 'info',
            content:
              'We were unable to process this request, please check and try again.'
          });
        } else {
          fastify.errorHandler(error, request, reply);
        }
      }
    },
    async (req, reply) => {
      try {
        const { origin } = getRedirectParams(req);
        const { unsubscribeId } = req.params;
        const log = fastify.log.child({ req, unsubscribeId });
        log.debug('Processing resubscribe request');

        const user = await fastify.prisma.user.findFirst({
          where: { unsubscribeId }
        });

        if (!user) {
          log.warn('No user found for resubscribe request');
          void reply.code(302);
          return reply.redirectWithMessage(origin, {
            type: 'info',
            content: 'We could not find an account to resubscribe.'
          });
        }

        await fastify.prisma.user.update({
          where: { id: user.id },
          data: {
            sendQuincyEmail: true
          }
        });
        log.info('Successfully resubscribed user to email');

        return reply.redirectWithMessage(origin, {
          type: 'success',
          content:
            "We've successfully updated your email preferences. Thank you for resubscribing."
        });
      } catch (error) {
        fastify.log.error(error, 'Failed to resubscribe user to email');
        fastify.Sentry.captureException(error);
        void reply.code(302);
        return reply.redirectWithMessage(origin, {
          type: 'danger',
          content: 'Something went wrong.'
        });
      }
    }
  );

  done();
};
