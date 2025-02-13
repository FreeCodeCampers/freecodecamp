import { test, expect } from '@playwright/test';
import translations from '../../client/i18n/locales/english/translations.json';
import metaTags from '../../client/i18n/locales/english/meta-tags.json';

test.describe('The unsubscribed page without unsubscribeId', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/unsubscribed');
  });

  test('The page renders with correct title', async ({ page }) => {
    await expect(page).toHaveTitle(
      `${metaTags['youre-unsubscribed']} | freeCodeCamp.org`
    );
  });

  test('The page has correct main heading', async ({ page }) => {
    const mainHeading = page.getByTestId('main-heading');

    await expect(mainHeading).toBeVisible();
    await expect(mainHeading).toContainText(translations.misc['unsubscribed']);
  });

  test('The page has correct motivation text', async ({ page }) => {
    const motivationText = page.getByTestId('motivation-text');

    await expect(motivationText).toBeVisible();
    await expect(motivationText).toContainText(
      translations.misc['keep-coding']
    );
  });

  test('The page has no button to resubscribe', async ({ page }) => {
    const resubscribeButton = page.getByRole('link', {
      name: translations.buttons['resubscribe']
    });

    await expect(resubscribeButton).not.toBeVisible();
  });
});

test.describe('The unsubscribed page with unsubscribeId', () => {
  const encoded_url_text =
    '?messages=success%5B0%5D%3DWe%2527ve%2520successfully%2520updated%2520your%2520email%2520preferences.%2520Thank%2520you%2520for%2520resubscribing.';
  // This value is sourced from self/freeCodeCamp/tools/scripts/seed/certified-user-data.js
  // The file certified-user-data.js is used to seed the database before running the tests.
  const unsubscribeId = 'tBX8stC5jiustPBteF2mV';

  test.beforeEach(async ({ page }) => {
    await page.goto(`/unsubscribed/${unsubscribeId}`);
  });

  test('The page renders with correct title and other texts', async ({
    page
  }) => {
    await expect(page).toHaveTitle(
      `${metaTags['youre-unsubscribed']} | freeCodeCamp.org`
    );

    const mainHeading = page.getByTestId('main-heading');

    await expect(mainHeading).toBeVisible();
    await expect(mainHeading).toContainText(translations.misc['unsubscribed']);

    const motivationText = page.getByTestId('motivation-text');

    await expect(motivationText).toBeVisible();
    await expect(motivationText).toContainText(
      translations.misc['keep-coding']
    );
  });

  test('Resubscribe and redirect to home with encoded text in the url', async ({
    page
  }) => {
    const resubscribeButton = page.getByRole('link', {
      name: translations.buttons['resubscribe']
    });

    await expect(resubscribeButton).toBeVisible();
    const resubscribeButtonHref = await resubscribeButton.getAttribute('href');
    expect(resubscribeButtonHref).toContain(`/resubscribe/${unsubscribeId}`);
    await resubscribeButton.click();

    await expect(page).toHaveURL(`${encoded_url_text}`);
    await expect(
      page.getByText(
        "We've successfully updated your email preferences. Thank you for resubscribing."
      )
    ).toBeVisible();
  });
});
