import { execSync } from 'child_process';

import { test as setup } from '@playwright/test';

setup.describe('certifieduser', () => {
  setup.use({ storageState: { cookies: [], origins: [] } });

  setup.beforeAll(() => {
    execSync('node ./tools/scripts/seed/seed-demo-user --certified-user ');
  });

  setup('can sign in', async ({ request }) => {
    await request.get(process.env.API_LOCATION + '/signin');
    await request.storageState({
      path: 'e2e/playwright/.auth/certified-user.json'
    });
  });
});

setup.describe('developmentuser', () => {
  // We need to make sure the development user does not have any cookies from the certified user.
  // As the certified user now has the default storage state.
  setup.use({ storageState: { cookies: [], origins: [] } });

  // We can only sign in as a single user (one with email: 'foo@bar.com'), so
  // changing users means changing the record with that email in the database.
  setup.beforeAll(() => {
    execSync('node ./tools/scripts/seed/seed-demo-user');
  });

  setup.afterAll(() => {
    execSync('node ./tools/scripts/seed/seed-demo-user --certified-user');
  });

  setup('can sign in', async ({ request }) => {
    await request.get(process.env.API_LOCATION + '/signin');
    await request.storageState({
      path: 'e2e/playwright/.auth/development-user.json'
    });
  });
});
