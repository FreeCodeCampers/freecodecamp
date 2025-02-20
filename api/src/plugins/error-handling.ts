import type { FastifyPluginCallback } from 'fastify';
import * as Sentry from '@sentry/node';
import fp from 'fastify-plugin';

import { getRedirectParams } from '../utils/redirection';

declare module 'fastify' {
  interface FastifyInstance {
    Sentry: typeof Sentry;
  }
}

/**
 * Plugin to handle errors and send them to Sentry.
 *
 * @param fastify The Fastify instance.
 * @param _options Options passed to the plugin via `fastify.register(plugin, options)`.
 * @param done Callback to signal that the logic has completed.
 */
const errorHandling: FastifyPluginCallback = (fastify, _options, done) => {
  Sentry.setupFastifyErrorHandler(fastify);

  fastify.decorate('Sentry', Sentry);

  fastify.setErrorHandler((error, request, reply) => {
    const logger = fastify.log.child({ req: request });
    const accepts = request.accepts().type(['json', 'html']);
    const { returnTo } = getRedirectParams(request);

    if (!reply.statusCode || reply.statusCode === 200) {
      const statusCode =
        error.statusCode && error.statusCode >= 400 ? error.statusCode : 500;
      reply.code(statusCode);
    }

    const isCSRFError =
      error.code === 'FST_CSRF_INVALID_TOKEN' ||
      error.code === 'FST_CSRF_MISSING_SECRET';

    if (isCSRFError) {
      // log nothing, since we don't want to fill up the logs with CSRF errors
    } else if (reply.statusCode >= 500) {
      logger.error(error);
    } else {
      logger.warn(error);
    }

    const message =
      reply.statusCode === 500 || isCSRFError
        ? 'flash.generic-error'
        : error.message;
    if (accepts === 'json') {
      void reply.send({
        message,
        type: 'danger'
      });
    } else {
      void reply.status(302);
      void reply.redirectWithMessage(returnTo, {
        type: 'danger',
        content: message
      });
    }
  });

  done();
};

export default fp(errorHandling, {
  dependencies: ['redirect-with-message', '@fastify/accepts']
});
