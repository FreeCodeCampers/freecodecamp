import { test, expect } from '@playwright/test';
import translations from '../../client/i18n/locales/english/translations.json';

// Tests for challenges rendered by `client/src/templates/Challenges/odin/show.tsx`
test.describe('Odin challenges', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(
      '/learn/foundational-c-sharp-with-microsoft/write-your-first-code-using-c-sharp/write-your-first-c-sharp-code'
    );
  });

  test.describe('When the user is signed out', () => {
    test.use({ storageState: { cookies: [], origins: [] } });

    test('should render the content correctly', async ({ page }) => {
      await expect(page).toHaveTitle(
        'Write Your First Code Using C# - Write Your First C# Code | Learn | freeCodeCamp.org'
      );

      await expect(
        page.getByRole('heading', {
          level: 1,
          name: 'Write Your First C# Code'
        })
      ).toBeVisible();

      // Checkmark doesn't show up if the user has completed the challenge but is signed out
      await expect(
        page.getByRole('img', { name: translations.icons.passed })
      ).toBeHidden();

      await expect(
        page.getByRole('button', { name: translations.buttons['check-answer'] })
      ).toBeVisible();

      await expect(
        page.getByRole('button', { name: translations.buttons['ask-for-help'] })
      ).toBeVisible();
    });
  });

  test.describe('When the user is signed in', () => {
    test('should render the content correctly', async ({ page }) => {
      await expect(page).toHaveTitle(
        'Write Your First Code Using C# - Write Your First C# Code | Learn | freeCodeCamp.org'
      );

      await expect(
        page.getByRole('heading', {
          level: 1,
          name: 'Write Your First C# Code'
        })
      ).toBeVisible();

      await expect(
        page.getByRole('img', { name: translations.icons.passed })
      ).toBeVisible();

      await expect(
        page.getByRole('button', { name: translations.buttons['check-answer'] })
      ).toBeVisible();

      await expect(
        page.getByRole('button', { name: translations.buttons['ask-for-help'] })
      ).toBeVisible();
    });
  });
});
