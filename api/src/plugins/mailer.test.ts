import Fastify from 'fastify';

import mailer from './mailer';

describe('mailer', () => {
  it('should send an email via the provider', async () => {
    const fastify = Fastify();
    const send = jest.fn();
    await fastify.register(mailer, { provider: { send } });

    const data = {
      to: 'test@add.ress',
      from: 'team@freecodecamp.org',
      subject: 'test',
      text: 'test'
    };

    await fastify.sendEmail(data);

    expect(send).toHaveBeenCalledWith(data);
  });
});
