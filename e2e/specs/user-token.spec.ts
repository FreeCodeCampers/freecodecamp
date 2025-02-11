import { execSync } from 'child_process';
import { test, expect } from '@playwright/test';

import translations from '../../client/i18n/locales/english/translations.json';
import { alertToBeVisible } from '../utils/alerts';

test.use({ storageState: 'e2e/playwright/.auth/development-user.json' });

test.beforeEach(() => {
  execSync('node ./tools/scripts/seed/seed-demo-user');
});

test.afterAll(() => {
  execSync('node ./tools/scripts/seed/seed-demo-user --certified-user');
});

test.describe('Initially', () => {
  test('should not render', async ({ page }) => {
    await page.goto('/settings');
    await expect(
      page.getByText('User Token', { exact: true })
    ).not.toBeVisible();
  });
});

test.describe('After creating token', () => {
  test('should allow you to delete your token', async ({ page }) => {
    await page.goto(
      '/learn/relational-database/learn-bash-by-building-a-boilerplate/build-a-boilerplate'
    );
    await page.getByRole('button', { name: 'Start the course' }).click();

    await page.goto('/settings');
    // Set `exact` to `true` to only match the panel heading
    await expect(page.getByText('User Token', { exact: true })).toBeVisible();
    await expect(
      page.getByText(
        'Your user token is used to save your progress on curriculum sections that use a virtual machine. If you suspect it has been compromised, you can delete it without losing any progress. A new one will be created automatically the next time you open a project.'
      )
    ).toBeVisible();
    await page.getByRole('button', { name: 'Delete my user token' }).click();

    await alertToBeVisible(page, translations.flash['token-deleted']);
    await expect(
      page.getByText('User Token', { exact: true })
    ).not.toBeVisible();
  });
});
