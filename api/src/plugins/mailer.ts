import type { FastifyPluginCallback } from 'fastify';
import fp from 'fastify-plugin';

declare module 'fastify' {
  interface FastifyInstance {
    sendEmail: SendEmail;
  }
}

export type SendEmailArgs = {
  to: string;
  from: string;
  subject: string;
  text: string;
  cc?: string;
};

type SendEmail = (args: SendEmailArgs) => Promise<void>;

export interface MailProvider {
  send: SendEmail;
}

const plugin: FastifyPluginCallback<{ provider: MailProvider }> = (
  fastify,
  options,
  done
) => {
  const { provider } = options;

  fastify.decorate(
    'sendEmail',
    async (args: SendEmailArgs) => await provider.send(args)
  );

  done();
};

export default fp(plugin);
