import { test, expect } from '@playwright/test';
import intro from '../../client/i18n/locales/english/intro.json';
import translations from '../../client/i18n/locales/english/translations.json';

const examUrl =
  '/learn/foundational-c-sharp-with-microsoft/foundational-c-sharp-with-microsoft-certification-exam/foundational-c-sharp-with-microsoft-certification-exam';

test.beforeEach(async ({ page }) => {
  await page.goto(examUrl);
});

test.describe('Exam Show E2E Test Suite for qualified user', () => {
  test('The page renders with correct title', async ({ page }) => {
    await expect(page).toHaveTitle(
      'Foundational C# with Microsoft Certification Exam: Foundational C# with Microsoft Certification Exam | freeCodeCamp.org'
    );
  });

  test('The page has correct header', async ({ page }) => {
    const header = page.getByTestId('challenge-title');
    await expect(header).toBeVisible();
    await expect(header).toContainText(
      intro['foundational-c-sharp-with-microsoft'].blocks[
        'foundational-c-sharp-with-microsoft-certification-exam'
      ].title
    );
  });

  test('The page has qualified for exam alert ', async ({ page }) => {
    await expect(
      page.getByText(translations.learn.exam['not-qualified'])
    ).not.toBeVisible();
    await expect(
      page.getByText(translations.learn.exam.qualified)
    ).toBeVisible();
  });

  test('Verifies the Correct Rendering of the Exam show', async ({ page }) => {
    const startExam = page.getByRole('button', {
      name: translations.buttons['click-start-exam']
    });
    await startExam.isVisible();
    await startExam.isEnabled();
    await expect(
      page.getByText(
        'Pass this exam to earn your Foundational C# with Microsoft Certification. Before starting the exam, please review the following guidelines:'
      )
    ).toBeVisible();
  });

  test('Exam Show When the User clicks on Start exam button', async ({
    page
  }) => {
    await page
      .getByRole('button', {
        name: translations.buttons['click-start-exam']
      })
      .click();
    await expect(page).toHaveURL(examUrl);
  });
});
