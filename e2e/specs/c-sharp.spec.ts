import { test, expect } from '@playwright/test';
import translations from '../../client/i18n/locales/english/translations.json';
const checkAnswerButtonText = translations.buttons['check-answer'];
const askForHelpButtonText = translations.buttons['ask-for-help'];
const trophyButtonText = translations.buttons['verify-trophy'];
const unlinkAccountButtonText = translations.buttons['unlink-account'];

const challenge =
  '/learn/foundational-c-sharp-with-microsoft/write-your-first-code-using-c-sharp/write-your-first-c-sharp-code';

const trophy =
  '/learn/foundational-c-sharp-with-microsoft/write-your-first-code-using-c-sharp/trophy-write-your-first-code-using-c-sharp';

test('renders buttons on challenge page', async ({ page }) => {
  await page.goto(challenge);
  await expect(
    page.getByRole('button', { name: checkAnswerButtonText })
  ).toBeVisible();

  await expect(
    page.getByRole('button', {
      name: askForHelpButtonText
    })
  ).toBeVisible();
});

test('renders buttons on trophy page', async ({ page }) => {
  await page.goto(trophy);

  await expect(
    page.getByRole('button', { name: unlinkAccountButtonText })
  ).toBeVisible();

  await expect(
    page.getByRole('button', {
      name: trophyButtonText
    })
  ).toBeVisible();

  await expect(
    page.getByRole('button', {
      name: askForHelpButtonText
    })
  ).toBeVisible();
});
