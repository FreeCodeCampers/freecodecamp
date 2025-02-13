import { execSync } from 'child_process';
import { test, expect } from '@playwright/test';
import translations from '../../client/i18n/locales/english/translations.json';

test.afterAll(() => {
  // change the name back to the original
  execSync('node ./tools/scripts/seed/seed-demo-user --certified-user');
});

const settingsObject = {
  usernamePlaceholder: '{{username}}',
  usernameUpdateToLowerCase: 'quincy',
  usernameUpdateToUpperCase: 'Mrugesh',
  usernameAvailable: 'Sem',
  usernameAvailablePressingEnter: 'Oliver',
  usernameNotAvailable: 'Twaha',
  usernameInvalid: 'user!',
  usernameTooShort: 'us',
  certifiedUsername: 'certifieduser',
  testUser: 'testuser',
  errorCode: '404'
};

test.describe('Username Settings Validation', () => {
  test.beforeEach(async ({ page }) => {
    execSync('node ./tools/scripts/seed/seed-demo-user --certified-user');
    await page.goto(`/certifieduser`);

    if (!process.env.CI) {
      await page
        .getByRole('button', { name: 'Preview custom 404 page' })
        .click();
    }

    await page.getByRole('button', { name: 'Edit my profile' }).click();
  });

  test('Should display Username Input and Save Button', async ({ page }) => {
    const inputLabel = page.getByLabel(translations.settings.labels.username);
    const saveButton = page.getByRole('button', {
      name: translations.settings.labels.username
    });
    await expect(inputLabel).toBeVisible();
    await expect(saveButton).toBeVisible();
  });

  test('Should handle Reserved Username Error', async ({ page }) => {
    const inputLabel = page.getByLabel(translations.settings.labels.username);
    await inputLabel.fill(settingsObject.errorCode);
    await expect(
      page.getByText(
        translations.settings.username['is a reserved error code'].replace(
          settingsObject.usernamePlaceholder,
          settingsObject.errorCode
        )
      )
    ).toBeVisible();
  });

  test('Should handle Invalid Username Error', async ({ page }) => {
    const inputLabel = page.getByLabel(translations.settings.labels.username);
    await inputLabel.fill(settingsObject.usernameInvalid);
    await expect(
      page.getByText(
        translations.settings.username['contains invalid characters'].replace(
          settingsObject.usernamePlaceholder,
          settingsObject.usernameInvalid
        )
      )
    ).toBeVisible();
  });

  test('Should handle Unavailable Username Error', async ({ page }) => {
    const inputLabel = page.getByLabel(translations.settings.labels.username);
    await inputLabel.fill(settingsObject.usernameNotAvailable);
    await expect(
      page.getByText(
        translations.settings.username['unavailable'].replace(
          settingsObject.usernamePlaceholder,
          settingsObject.usernameNotAvailable
        )
      )
    ).toBeVisible();
  });

  test('Should handle Too Short Username Error', async ({ page }) => {
    const inputLabel = page.getByLabel(translations.settings.labels.username);
    await inputLabel.fill(settingsObject.usernameTooShort);
    await expect(
      page.getByText(
        translations.settings.username['is too short'].replace(
          settingsObject.usernamePlaceholder,
          settingsObject.usernameTooShort
        )
      )
    ).toBeVisible();
  });

  test('Should save valid Username', async ({ page }) => {
    const inputLabel = page.getByLabel(translations.settings.labels.username);
    const saveButton = page.getByRole('button', {
      name: translations.settings.labels.username
    });
    const flashText = translations.flash['username-updated'].replace(
      settingsObject.usernamePlaceholder,
      settingsObject.usernameAvailable
    );

    await inputLabel.fill(settingsObject.usernameAvailable);
    await expect(saveButton).not.toBeDisabled();
    await saveButton.click();
    await expect(
      page.getByRole('alert').filter({ hasText: flashText }).first()
    ).toBeVisible();
  });

  test('should update username in lowercase and reflect in the UI', async ({
    page
  }) => {
    const inputLabel = page.getByLabel(translations.settings.labels.username);
    const saveButton = page.getByRole('button', {
      name: translations.settings.labels.username
    });
    const flashText = translations.flash['username-updated'].replace(
      settingsObject.usernamePlaceholder,
      settingsObject.usernameUpdateToLowerCase
    );

    await inputLabel.fill(settingsObject.usernameUpdateToLowerCase);
    await expect(saveButton).not.toBeDisabled();
    await saveButton.click();
    await expect(
      page.getByRole('alert').filter({ hasText: flashText }).first()
    ).toBeVisible();
  });

  test('should update username in uppercase and reflect in the UI', async ({
    page
  }) => {
    const inputLabel = page.getByLabel(translations.settings.labels.username);
    const saveButton = page.getByRole('button', {
      name: translations.settings.labels.username
    });
    const flashText = translations.flash['username-updated'].replace(
      settingsObject.usernamePlaceholder,
      settingsObject.usernameUpdateToUpperCase
    );

    await inputLabel.fill(settingsObject.usernameUpdateToUpperCase);
    await expect(saveButton).not.toBeDisabled();
    await saveButton.click();
    await expect(
      page.getByRole('alert').filter({ hasText: flashText }).first()
    ).toBeVisible();
  });

  test('should update username by pressing enter', async ({ page }) => {
    const inputLabel = page.getByLabel(translations.settings.labels.username);
    await inputLabel.fill(settingsObject.testUser);

    const flashText = translations.flash['username-updated'].replace(
      settingsObject.usernamePlaceholder,
      settingsObject.testUser
    );

    await expect(
      page.getByText(translations.settings.username.available)
    ).toBeVisible();

    await inputLabel.press('Enter');

    await expect(
      page.getByRole('alert').filter({ hasText: flashText }).first()
    ).toBeVisible();
  });

  test('should not be able to update username to the same username', async ({
    page
  }) => {
    const inputLabel = page.getByLabel(translations.settings.labels.username);
    const saveButton = page.getByRole('button', {
      name: translations.settings.labels.username
    });
    await inputLabel.fill(settingsObject.certifiedUsername);
    await expect(saveButton).toBeDisabled();
  });
});
