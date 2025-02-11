import { execSync } from 'child_process';

import { test, expect } from '@playwright/test';
import translations from '../../client/i18n/locales/english/translations.json';
import { alertToBeVisible } from '../utils/alerts';

test.beforeEach(async ({ page }) => {
  await page.goto(
    '/learn/foundational-c-sharp-with-microsoft/write-your-first-code-using-c-sharp/trophy-write-your-first-code-using-c-sharp'
  );
});

test.describe('Link MS user component (signed-out user)', () => {
  test.use({ storageState: { cookies: [], origins: [] } });
  test('should display the page content with a signin CTA', async ({
    page
  }) => {
    await expect(
      page.getByRole('heading', {
        name: 'Trophy - Write Your First Code Using C#',
        level: 1
      })
    ).toBeVisible();

    await expect(
      page.getByRole('heading', {
        name: translations.learn.ms['link-header'],
        level: 2
      })
    ).toBeVisible();

    await expect(
      page.getByText(translations.learn.ms['link-signin'])
    ).toBeVisible();

    // There are 2 sign in button on the page: one in the navbar, and one in the page content
    const signInButtons = await page
      .getByRole('link', { name: translations.buttons['sign-in'] })
      .all();
    expect(signInButtons).toHaveLength(2);
  });
});

test.describe('Link MS user component (signed-in user)', () => {
  test.afterEach(() => {
    execSync('node ./tools/scripts/seed/seed-ms-username');
  });

  test("should recognize the user's MS account", async ({ page }) => {
    await expect(
      page.getByRole('heading', {
        name: 'Trophy - Write Your First Code Using C#',
        level: 1
      })
    ).toBeVisible();

    await expect(page.locator('main')).toHaveText(
      /The Microsoft account with username "certifieduser" is currently linked to your freeCodeCamp account\. If this is not your Microsoft username, remove the link\./
    );
  });

  test('should allow the user to unlink their MS account and display a form for re-link', async ({
    page
  }) => {
    const unlinkButton = page.getByRole('button', {
      name: translations.buttons['unlink-account']
    });
    await expect(unlinkButton).toBeVisible();
    await unlinkButton.click();

    await alertToBeVisible(page, translations.flash.ms.transcript.unlinked);

    await expect(
      page.getByRole('heading', {
        name: translations.learn.ms['link-header'],
        level: 2
      })
    ).toBeVisible();
    await expect(page.getByText(translations.learn.ms.unlinked)).toBeVisible();
    await expect(
      page.getByRole('listitem').filter({
        hasText:
          'Using a browser where you are logged into your Microsoft account, go to https://learn.microsoft.com/users/me/transcript'
      })
    ).toBeVisible();
    await expect(
      page
        .getByRole('listitem')
        .filter({ hasText: translations.learn.ms['link-li-2'] })
    ).toBeVisible();
    await expect(
      page
        .getByRole('listitem')
        .filter({ hasText: translations.learn.ms['link-li-3'] })
    ).toBeVisible();
    await expect(
      page
        .getByRole('listitem')
        .filter({ hasText: translations.learn.ms['link-li-4'] })
    ).toBeVisible();
    await expect(
      page.getByRole('listitem').filter({
        hasText:
          'Paste the URL into the input below, it should look similar to this: https://learn.microsoft.com/LOCALE/users/USERNAME/transcript/ID'
      })
    ).toBeVisible();
    await expect(
      page
        .getByRole('listitem')
        .filter({ hasText: translations.learn.ms['link-li-6'] })
    ).toBeVisible();

    const transcriptLinkInput = page.getByLabel(
      translations.learn.ms['transcript-label']
    );
    await expect(transcriptLinkInput).toBeVisible();
    await expect(transcriptLinkInput).toHaveAttribute(
      'placeholder',
      'https://learn.microsoft.com/en-us/users/username/transcript/transcriptId'
    );
  });
});
