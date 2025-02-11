import * as fs from 'fs';
import { test, expect } from '@playwright/test';
import translations from '../../client/i18n/locales/english/translations.json';
import intro from '../../client/i18n/locales/english/intro.json';

const examUrl =
  '/learn/foundational-c-sharp-with-microsoft/foundational-c-sharp-with-microsoft-certification-exam/foundational-c-sharp-with-microsoft-certification-exam';

test.describe('Exam Results E2E Test Suite', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(examUrl);
    await page
      .getByRole('button', {
        name: translations.buttons['click-start-exam']
      })
      .click();
    const QUESTION_COUNT = 5;
    for (let i = 0; i < QUESTION_COUNT; i++) {
      await page.getByRole('radio').first().check({ force: true });

      if (i < QUESTION_COUNT - 1) {
        await page
          .getByRole('button', {
            name: translations.buttons['next-question']
          })
          .click();
      } else {
        await page
          .getByRole('button', {
            name: translations.buttons['finish-exam']
          })
          .click();
        await page
          .getByRole('button', { name: translations.learn.exam['finish-yes'] })
          .click();
      }
    }
  });

  test('Verifies the Correct Rendering of the Exam results', async ({
    page
  }) => {
    await expect(
      page
        .locator('div.exam-results-wrapper')
        .getByText(
          intro['foundational-c-sharp-with-microsoft'].blocks[
            'foundational-c-sharp-with-microsoft-certification-exam'
          ].title
        )
    ).toBeVisible();
    await expect(
      page
        .locator('div.exam-results-wrapper')
        .getByText(translations.learn.exam['not-passed-message'])
    ).toBeVisible();
    await expect(
      page
        .locator('div.exam-results-wrapper')
        .getByTestId('exam-results-question-results')
    ).toBeVisible();
    await expect(
      page.locator('div.exam-results-wrapper').getByText(/\d% correct/)
    ).toBeVisible();
    await expect(
      page.locator('div.exam-results-wrapper').getByText(/Time: \d:\d/)
    ).toBeVisible();
    await expect(
      page
        .locator('div.exam-results-wrapper')
        .getByTestId('download-exam-results')
    ).toBeVisible();
    await expect(
      page
        .locator('div.exam-results-wrapper')
        .getByRole('button', { name: translations.buttons.exit })
    ).toBeVisible();
  });

  test('Exam Results when the User clicks on Exit button', async ({ page }) => {
    await page
      .locator('div.exam-results-wrapper')
      .getByRole('button', { name: translations.buttons.exit })
      .click();
    await expect(
      page
        .locator('div.exam-results-wrapper')
        .getByText(
          intro['foundational-c-sharp-with-microsoft'].blocks[
            'foundational-c-sharp-with-microsoft-certification-exam'
          ].title
        )
    ).not.toBeVisible();
    await expect(page).not.toHaveURL(examUrl);
  });

  test.describe('Exam Results E2E Test Suite', () => {
    test('Exam Results When the User clicks on Download button', async ({
      page
    }) => {
      const [download] = await Promise.all([
        page.waitForEvent('download'),
        page
          .locator('div.exam-results-wrapper')
          .getByTestId('download-exam-results')
          .click()
      ]);
      const suggestedFileName = download.suggestedFilename();
      await download.saveAs(suggestedFileName);
      expect(fs.existsSync(suggestedFileName)).toBeTruthy();
      await download.delete();
    });
  });
});
