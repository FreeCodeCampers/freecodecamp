import { test, expect } from '@playwright/test';
import translations from '../../client/i18n/locales/english/translations.json';

const examUrl =
  '/learn/foundational-c-sharp-with-microsoft/foundational-c-sharp-with-microsoft-certification-exam/foundational-c-sharp-with-microsoft-certification-exam';
const cancelExamUrl =
  '/learn/foundational-c-sharp-with-microsoft/#foundational-c-sharp-with-microsoft-certification-exam';

test.beforeEach(async ({ page }) => {
  await page.goto(examUrl);
  await page
    .getByRole('button', {
      name: translations.buttons['click-start-exam']
    })
    .click();

  await page
    .getByRole('button', {
      name: translations.buttons['exit-exam']
    })
    .click();
});

test.describe('Exit exam Modal E2E Test Suite', () => {
  test('Verifies the Correct Rendering of the Exit exam Modal', async ({
    page
  }) => {
    await expect(
      page.getByRole('dialog', { name: translations.learn.exam['exit-header'] })
    ).toBeVisible();

    await expect(page.getByText(translations.learn.exam.exit)).toBeVisible();

    await expect(
      page.getByRole('button', {
        name: translations.learn.exam['exit-yes']
      })
    ).toBeVisible();

    await expect(
      page.getByRole('button', {
        name: translations.buttons.close
      })
    ).toBeVisible();

    await expect(
      page.getByRole('button', {
        name: translations.learn.exam['exit-no']
      })
    ).toBeVisible();
  });

  test('Closes the Exit exam Modal When the User clicks on exit-no button', async ({
    page
  }) => {
    await page
      .getByRole('button', { name: translations.learn.exam['exit-no'] })
      .click();

    await expect(
      page.getByRole('dialog', { name: translations.learn.exam['exit-header'] })
    ).not.toBeVisible();

    await expect(page).toHaveURL(examUrl);
  });

  test('Closes the Modal when the User clicks on exit-yes button', async ({
    page
  }) => {
    await page
      .getByRole('button', { name: translations.learn.exam['exit-yes'] })
      .click();

    await expect(
      page.getByRole('dialog', { name: translations.learn.exam['exit-header'] })
    ).not.toBeVisible();

    await expect(page).toHaveURL(cancelExamUrl);
  });

  test('Closes the Modal when the User clicks on X button', async ({
    page
  }) => {
    await page
      .getByRole('button', {
        name: translations.buttons.close
      })
      .click();

    await expect(
      page.getByRole('dialog', { name: translations.learn.exam['exit-header'] })
    ).not.toBeVisible();

    await expect(page).toHaveURL(examUrl);
  });
});
