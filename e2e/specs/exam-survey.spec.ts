import { execSync } from 'child_process';
import { test, expect } from '@playwright/test';
const url =
  '/learn/foundational-c-sharp-with-microsoft/foundational-c-sharp-with-microsoft-certification-exam/foundational-c-sharp-with-microsoft-certification-exam';
test.describe('Exam Survey', () => {
  test.beforeAll(() => {
    execSync('node ./tools/scripts/seed/seed-demo-user --certified-user');
    execSync('node tools/scripts/seed/seed-surveys.js delete-only');
  });

  test('Should show the survey alert and be able to complete the survey', async ({
    page
  }) => {
    await page.goto(url);

    await expect(page.getByTestId('c-sharp-survey-alert')).toBeVisible();
    await page.getByRole('button', { name: 'Take the survey' }).click();
    await expect(page.getByRole('dialog')).toBeVisible();
    await expect(
      page.getByRole('heading', {
        name: 'Foundational C# with Microsoft Survey'
      })
    ).toBeVisible();

    await page.getByText('Student developer').click();
    await expect(
      page.getByRole('button', { name: 'Submit the survey' })
    ).toBeDisabled();

    await page.getByText('Novice (no prior experience)').click();

    await page.getByRole('button', { name: 'Submit the survey' }).click();

    await expect(page.getByTestId('flash-message')).toContainText(
      /Thank you. Your survey was submitted./
    );
  });
});
