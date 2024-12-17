import { devLogin, setupServer, superRequest } from '../../../jest.utils';
import { HOME_LOCATION } from '../../utils/env';

describe('GET /signout', () => {
  setupServer();

  beforeEach(async () => {
    await devLogin();
  });
  it('should clear all the cookies', async () => {
    const res = await superRequest('/signout', { method: 'GET' });

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const setCookie = res.headers['set-cookie'];
    expect(setCookie).toEqual(
      expect.arrayContaining([
        expect.stringMatching(
          /^jwt_access_token=; Max-Age=0; Path=\/; Expires=Thu, 01 Jan 1970 00:00:00 GMT/
        ),
        expect.stringMatching(
          /^csrf_token=; Max-Age=0; Path=\/; Expires=Thu, 01 Jan 1970 00:00:00 GMT/
        ),
        expect.stringMatching(
          /^_csrf=; Max-Age=0; Path=\/; Expires=Thu, 01 Jan 1970 00:00:00 GMT/
        )
      ])
    );
    expect(setCookie).toHaveLength(3);
  });

  it('should redirect to / on the client by default', async () => {
    const res = await superRequest('/signout', { method: 'GET' });

    // This happens because localhost:8000 is not an allowed origin and so
    // normalizeParams rejects it and sets the returnTo to /learn. TODO:
    // separate the validation and normalization logic.
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    expect(res.headers.location).toBe(`${HOME_LOCATION}/learn`);
    expect(res.status).toBe(302);
  });
});
