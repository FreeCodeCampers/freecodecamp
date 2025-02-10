import { setupServer, superRequest } from '../jest.utils';
import { HOME_LOCATION } from './utils/env';

jest.mock('./utils/env', () => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return {
    ...jest.requireActual('./utils/env'),
    COOKIE_DOMAIN: 'freecodecamp.org'
  };
});

describe('server', () => {
  setupServer();

  describe('GET /', () => {
    test('should have OWASP recommended headers', async () => {
      const res = await superRequest('/', { method: 'GET' });
      expect(res.headers).toMatchObject({
        'cache-control': 'no-store',
        'content-security-policy': "frame-ancestors 'none'",
        'content-type': 'application/json; charset=utf-8',
        'x-content-type-options': 'nosniff',
        'x-frame-options': 'DENY'
        // In production we also set strict-transport-security, but in order to
        // test this we would need to mock FREECODECAMP_NODE_ENV to production.
        // This is possible, but has side effects (like using the normal
        // database instead of the test ones). On balance it's not worth it.
      });
    });

    test.each([
      'https://www.freecodecamp.org',
      'https://www.freecodecamp.dev',
      'https://beta.freecodecamp.org',
      'https://beta.freecodecamp.dev',
      'https://chinese.freecodecamp.org',
      'https://chinese.freecodecamp.dev'
    ])(
      'should have Access-Control-Allow-Origin header for %s',
      async origin => {
        const res = await superRequest('/', { method: 'GET' }).set(
          'origin',
          origin
        );
        expect(res.headers).toMatchObject({
          'access-control-allow-origin': origin
        });
      }
    );

    test('should have HOME_LOCATION Access-Control-Allow-Origin header for other origins', async () => {
      const res = await superRequest('/', { method: 'GET' }).set(
        'origin',
        'https://www.google.com'
      );
      expect(res.headers).toMatchObject({
        'access-control-allow-origin': HOME_LOCATION
      });
    });

    test('should have CORS headers', async () => {
      const res = await superRequest('/', { method: 'GET' });
      expect(res.headers).toMatchObject({
        'access-control-allow-headers':
          'Origin, X-Requested-With, Content-Type, Accept, Csrf-Token, Coderoad-User-Token, Exam-Environment-Authorization-Token',
        'access-control-allow-credentials': 'true',
        'access-control-allow-methods': 'GET, PUT, POST, DELETE'
      });
    });
  });

  describe('GET /documentation', () => {
    test('should have OWASP recommended headers, except content-type', async () => {
      const res = await superRequest('/documentation/static/index.html', {
        method: 'GET'
      });
      expect(res.headers).toMatchObject({
        'cache-control': 'no-store',
        'content-security-policy': "frame-ancestors 'none'",
        'x-content-type-options': 'nosniff',
        'x-frame-options': 'DENY'
      });
    });
  });
});
