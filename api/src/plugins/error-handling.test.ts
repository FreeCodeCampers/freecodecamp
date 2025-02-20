const SENTRY_DSN = 'https://anything@goes/123';

import Fastify, { FastifyError, type FastifyInstance } from 'fastify';
import accepts from '@fastify/accepts';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import '../instrument';

import errorHandling from './error-handling';
import redirectWithMessage, { formatMessage } from './redirect-with-message';

jest.mock('../utils/env', () => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return {
    ...jest.requireActual('../utils/env'),
    SENTRY_DSN
  };
});

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

describe('errorHandling', () => {
  let fastify: FastifyInstance;

  beforeEach(async () => {
    fastify = Fastify();
    await fastify.register(redirectWithMessage);
    await fastify.register(accepts);
    await fastify.register(errorHandling);

    fastify.get('/test', async (_req, _reply) => {
      const error = Error('a very bad thing happened') as FastifyError;
      error.statusCode = 500;
      throw error;
    });
    fastify.get('/test-bad-request', async (_req, _reply) => {
      const error = Error('a very bad thing happened') as FastifyError;
      error.statusCode = 400;
      throw error;
    });
    fastify.get('/test-csrf-token', async (_req, _reply) => {
      const error = Error() as FastifyError;
      error.code = 'FST_CSRF_INVALID_TOKEN';
      error.statusCode = 403;
      throw error;
    });

    fastify.get('/test-csrf-secret', async (_req, _reply) => {
      const error = Error() as FastifyError;
      error.code = 'FST_CSRF_MISSING_SECRET';
      error.statusCode = 403;
      throw error;
    });
  });

  afterEach(async () => {
    await fastify.close();
    jest.clearAllMocks();
  });

  it('should redirect to the referer if the request does not Accept json', async () => {
    const res = await fastify.inject({
      method: 'GET',
      url: '/test',
      headers: {
        referer: 'https://www.freecodecamp.org/anything',
        accept: 'text/plain'
      }
    });

    expect(res.statusCode).toEqual(302);
  });

  it('should add a generic flash message if it is a server error (i.e. 500+)', async () => {
    const res = await fastify.inject({
      method: 'GET',
      url: '/test',
      headers: {
        referer: 'https://www.freecodecamp.org/anything',
        accept: 'text/plain'
      }
    });

    expect(res.headers['location']).toEqual(
      'https://www.freecodecamp.org/anything?' +
        formatMessage({
          type: 'danger',
          content: 'flash.generic-error'
        })
    );
  });

  it('should return a json response if the request does Accept json', async () => {
    const res = await fastify.inject({
      method: 'GET',
      url: '/test',
      headers: {
        referer: 'https://www.freecodecamp.org/anything',
        accept: 'application/json,text/plain'
      }
    });

    expect(res.statusCode).toEqual(500);
    expect(res.json()).toEqual({
      message: 'flash.generic-error',
      type: 'danger'
    });
  });

  it('should redirect if the request prefers text/html to json', async () => {
    const res = await fastify.inject({
      method: 'GET',
      url: '/test',
      headers: {
        referer: 'https://www.freecodecamp.org/anything',
        // this does accept json, (via the */*), but prefers text/html
        accept: 'text/html,*/*'
      }
    });

    expect(res.statusCode).toEqual(302);
  });

  it('should respect the error status code', async () => {
    const res = await fastify.inject({
      method: 'GET',
      url: '/test-bad-request'
    });

    expect(res.statusCode).toEqual(400);
  });

  it('should return the error message if the status is not 500 ', async () => {
    const res = await fastify.inject({
      method: 'GET',
      url: '/test-bad-request'
    });

    expect(res.json()).toEqual({
      message: 'a very bad thing happened',
      type: 'danger'
    });
  });

  it('should convert CSRF errors to a generic error message', async () => {
    const resToken = await fastify.inject({
      method: 'GET',
      url: '/test-csrf-token'
    });
    const resSecret = await fastify.inject({
      method: 'GET',
      url: '/test-csrf-secret'
    });

    expect(resToken.json()).toEqual({
      message: 'flash.generic-error',
      type: 'danger'
    });
    expect(resSecret.json()).toEqual({
      message: 'flash.generic-error',
      type: 'danger'
    });
  });

  it('should call fastify.log.error when an unhandled error occurs', async () => {
    const logSpy = jest.spyOn(fastify.log, 'error');

    await fastify.inject({
      method: 'GET',
      url: '/test'
    });

    expect(logSpy).toHaveBeenCalledWith(Error('a very bad thing happened'));
  });

  it('should call fastify.log.warn when a bad request error occurs', async () => {
    const logSpy = jest.spyOn(fastify.log, 'warn');

    await fastify.inject({
      method: 'GET',
      url: '/test-bad-request'
    });

    expect(logSpy).toHaveBeenCalledWith(Error('a very bad thing happened'));
  });

  it('should NOT log when a CSRF error is thrown', async () => {
    const errorLogSpy = jest.spyOn(fastify.log, 'error');
    const warnLogSpy = jest.spyOn(fastify.log, 'warn');

    await fastify.inject({
      method: 'GET',
      url: '/test-csrf-token'
    });

    expect(errorLogSpy).not.toHaveBeenCalled();
    expect(warnLogSpy).not.toHaveBeenCalled();

    await fastify.inject({
      method: 'GET',
      url: '/test-csrf-secret'
    });

    expect(errorLogSpy).not.toHaveBeenCalled();
    expect(warnLogSpy).not.toHaveBeenCalled();
  });

  describe('Sentry integration', () => {
    let mockServer: ReturnType<typeof setupServer>;

    beforeAll(() => {
      // The assumption is that Sentry is the only library making requests. Also, we
      // only want to know if a request was made, not what it was.
      const sentryHandler = http.post('*', () =>
        HttpResponse.json({ success: true })
      );
      mockServer = setupServer(sentryHandler);
      mockServer.listen();
    });

    afterEach(() => {
      mockServer.resetHandlers();
    });

    afterAll(() => {
      mockServer.close();
    });

    const createRequestListener = () =>
      new Promise(resolve => {
        mockServer.events.on('request:start', () => {
          resolve(true);
        });
      });

    it('should capture the error with Sentry', async () => {
      const receivedRequest = createRequestListener();

      await fastify.inject({
        method: 'GET',
        url: '/test'
      });

      expect(await Promise.race([receivedRequest, delay(1000)])).toBe(true);
    });

    it('should NOT capture CSRF token errors with Sentry', async () => {
      const receivedRequest = createRequestListener();

      await fastify.inject({
        method: 'GET',
        url: '/test-csrf-token'
      });

      expect(await Promise.race([receivedRequest, delay(200)])).toBeUndefined();
    });

    it('should NOT capture CSRF secret errors with Sentry', async () => {
      const receivedRequest = createRequestListener();

      await fastify.inject({
        method: 'GET',
        url: '/test-csrf-secret'
      });

      expect(await Promise.race([receivedRequest, delay(200)])).toBeUndefined();
    });

    it('should NOT capture bad requests with Sentry', async () => {
      const receivedRequest = createRequestListener();

      await fastify.inject({
        method: 'GET',
        url: '/test-bad-request'
      });

      expect(await Promise.race([receivedRequest, delay(200)])).toBeUndefined();
    });
  });
});
