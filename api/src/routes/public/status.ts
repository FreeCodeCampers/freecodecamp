import { type FastifyPluginCallbackTypebox } from '@fastify/type-provider-typebox';

/**
 * Plugin for the health check endpoint.
 *
 * @param fastify The Fastify instance.
 * @param _options Options passed to the plugin via `fastify.register(plugin,
 * options)`.
 * @param done The callback to signal that the plugin is ready.
 */
export const statusRoute: FastifyPluginCallbackTypebox = (
  fastify,
  _options,
  done
) => {
  fastify.get('/status/ping', async (req, _reply) => {
    fastify.log.child({ req }).debug('pong');
    return { msg: 'pong' };
  });

  done();
};
