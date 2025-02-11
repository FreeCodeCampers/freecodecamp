import { execSync } from 'child_process';
import { expect, test } from '@playwright/test';

test.describe('Public profile certifications', () => {
  test('Should show claimed certifications if the username has all lowercase characters', async ({
    page
  }) => {
    await page.goto('/certifieduser');

    // If you build the client locally, delete the button click below.
    if (!process.env.CI) {
      await page
        .getByRole('button', { name: 'Preview custom 404 page' })
        .click();
    }

    await expect(
      page.getByRole('link', { name: /View.+Certification/ })
    ).toHaveCount(19);
  });

  test('Should show claimed certifications if the username includes uppercase characters', async ({
    page
  }) => {
    await page.goto('/certifieduser');

    if (!process.env.CI) {
      await page
        .getByRole('button', { name: 'Preview custom 404 page' })
        .click();
    }
    await page.getByRole('button', { name: 'Edit my profile' }).click();

    await page.getByLabel('Username').fill('CertifiedBoozer');
    await page.getByRole('button', { name: 'Save' }).nth(0).click();
    await expect(page.getByTestId('flash-message')).toContainText(
      /We have updated your username to/
    );
    await page.goto('/certifiedboozer');

    // If you build the client locally, delete the button click below.
    if (!process.env.CI) {
      await page
        .getByRole('button', { name: 'Preview custom 404 page' })
        .click();
    }

    await page.waitForURL('/certifiedboozer');
    await expect(
      page.getByRole('link', { name: /View.+Certification/ })
    ).toHaveCount(19);
  });

  test.afterAll(() => {
    execSync('node ./tools/scripts/seed/seed-demo-user --certified-user');
  });
});
