import { execSync } from 'child_process';

import { test, expect } from '@playwright/test';

import translations from '../../client/i18n/locales/english/translations.json';

const settingsPageElement = {
  emailVerificationAlert: 'email-verification-alert',
  emailVerificationLink: 'email-verification-link',
  flashMessageAlert: 'flash-message',
  newEmailValidation: 'new-email-validation',
  confirmEmailValidation: 'confirm-email-validation'
} as const;

const originalEmail = 'foo@bar.com';
const newEmail = 'foo-update@bar.com';

test.beforeEach(async ({ page }) => {
  execSync('node ./tools/scripts/seed/seed-demo-user --certified-user');
  await page.goto('/settings');
});

test.describe('Email Settings', () => {
  test('should display the content correctly', async ({ page }) => {
    await expect(
      page.getByRole('heading', { name: translations.settings.email.heading })
    ).toBeVisible();

    await expect(page.getByText(originalEmail)).toBeVisible();

    await expect(
      page.getByRole('button', {
        name: `${translations.buttons.save} ${translations.settings.email.heading}`
      })
    ).toBeDisabled();

    await expect(
      page
        .getByRole('group', { name: translations.settings.email.weekly })
        .locator('legend')
    ).toBeVisible();

    await expect(
      page.getByRole('button', {
        name: translations.buttons['yes-please']
      })
    ).toHaveAttribute('aria-pressed', 'false');

    await expect(
      page.getByRole('button', {
        name: translations.buttons['no-thanks']
      })
    ).toHaveAttribute('aria-pressed', 'true');
  });

  test('should display email verification alert after email update', async ({
    page
  }) => {
    const flashMessageAlert = page.getByTestId(
      settingsPageElement.flashMessageAlert
    );
    // Need exact match as there are "New email" and "Confirm new email" labels
    await page
      .getByLabel(translations.settings.email.new, { exact: true })
      .fill(newEmail);

    await page.getByLabel(translations.settings.email.confirm).fill(newEmail);

    await page
      .getByRole('button', {
        name: `${translations.buttons.save} ${translations.settings.email.heading}`
      })
      .click();

    await expect(flashMessageAlert).toBeVisible();
    await expect(flashMessageAlert).toContainText(
      'Check your email and click the link we sent you to confirm your new email address.'
    );

    await page.reload();
    await expect(
      page.getByTestId(settingsPageElement.emailVerificationAlert)
    ).toBeVisible();

    const emailVerificationLink = page.getByTestId(
      settingsPageElement.emailVerificationLink
    );
    await expect(emailVerificationLink).toHaveAttribute(
      'href',
      '/update-email'
    );
  });

  test('should show the user error messages if the input is invalid', async ({
    page
  }) => {
    const newEmailInput = page.getByLabel(translations.settings.email.new, {
      exact: true
    });
    const confirmEmailInput = page.getByLabel(
      translations.settings.email.confirm
    );
    const confirmValidation = page.getByTestId(
      settingsPageElement.confirmEmailValidation
    );
    const newEmailValidation = page.getByTestId(
      settingsPageElement.newEmailValidation
    );

    await newEmailInput.fill(newEmail);
    await confirmEmailInput.fill(originalEmail);

    await expect(confirmValidation).toBeVisible();
    await expect(confirmValidation).toContainText(
      translations.validation['email-mismatch']
    );

    await newEmailInput.fill(originalEmail);

    await expect(newEmailValidation).toBeVisible();
    await expect(newEmailValidation).toContainText(
      translations.validation['same-email']
    );
  });

  test('should toggle email subscription correctly', async ({ page }) => {
    const yesPleaseButton = page.getByRole('button', {
      name: translations.buttons['yes-please']
    });
    const noThanksButton = page.getByRole('button', {
      name: translations.buttons['no-thanks']
    });

    await yesPleaseButton.click();
    await expect(yesPleaseButton).toHaveAttribute('aria-pressed', 'true');
    await expect(noThanksButton).toHaveAttribute('aria-pressed', 'false');

    await noThanksButton.click();
    await expect(yesPleaseButton).toHaveAttribute('aria-pressed', 'false');
    await expect(noThanksButton).toHaveAttribute('aria-pressed', 'true');
  });

  test('should display flash message when email subscription is toggled', async ({
    page
  }) => {
    await page
      .getByRole('button', {
        name: translations.buttons['yes-please']
      })
      .click();

    await expect(
      page.getByTestId(settingsPageElement.flashMessageAlert)
    ).toContainText("We have updated your subscription to Quincy's email");

    // Undo subscription change
    await Promise.all([
      page.waitForResponse(
        response =>
          response.url().includes('update-my-quincy-email') &&
          response.status() === 200
      ),
      page
        .getByRole('button', {
          name: translations.buttons['no-thanks']
        })
        .click()
    ]);
  });
});
