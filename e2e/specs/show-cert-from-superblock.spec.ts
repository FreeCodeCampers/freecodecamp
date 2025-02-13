import { execSync } from 'child_process';
import { expect, test } from '@playwright/test';

test.describe('When the user HAS NOT claimed their cert', () => {
  test.use({ storageState: 'e2e/playwright/.auth/development-user.json' });

  test.beforeAll(() => {
    execSync('node ./tools/scripts/seed/seed-demo-user');
  });

  test.beforeEach(async ({ page }) => {
    await page.goto('/learn/front-end-development-libraries');
  });

  test('should see a "Go to settings to claim your certification" pointing to "/settings#cert-front-end-development-libraries"', async ({
    page
  }) => {
    const link = page.getByRole('link', {
      name: 'Go to settings to claim your certification'
    });

    await expect(link).toBeVisible();
    await expect(link).toHaveAttribute(
      'href',
      '/settings#cert-front-end-development-libraries'
    );
  });

  test.afterAll(() => {
    execSync('node ./tools/scripts/seed/seed-demo-user --certified-user');
  });
});

test.describe('When the user HAS claimed their cert', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/learn/front-end-development-libraries');
  });

  test('should see a "Show Certification" link pointing to "/certification/certifieduser/front-end-development-libraries"', async ({
    page
  }) => {
    const link = page.getByRole('link', {
      name: 'Show Certification'
    });

    await expect(link).toBeVisible();
    await expect(link).toHaveAttribute(
      'href',
      '/certification/certifieduser/front-end-development-libraries'
    );
  });
});
