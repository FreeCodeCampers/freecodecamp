import { test, expect } from '@playwright/test';
import translations from '../../client/i18n/locales/english/translations.json';

test.beforeEach(async ({ page }) => {
  await page.goto('/certifieduser');

  if (!process.env.CI) {
    await page.getByRole('button', { name: 'Preview custom 404 page' }).click();
  }

  await page.getByRole('button', { name: 'Edit my profile' }).click();
});

test('edit profile modal should render correctly', async ({ page }) => {
  // Internet Presence
  await expect(
    page.getByRole('heading', {
      name: translations.settings.headings.internet
    })
  ).toBeVisible();
  await expect(page.getByTestId('internet-presence')).toBeVisible();
  await expect(
    page.getByRole('button', {
      name: translations.settings.headings.internet
    })
  ).toBeVisible();

  // Personal Information
  await expect(
    page.getByRole('heading', {
      name: translations.settings.headings['personal-info']
    })
  ).toBeVisible();
  await expect(page.getByTestId('camper-identity')).toBeVisible();
  const savePersonalInfoButton = page.getByRole('button', {
    name: translations.settings.headings['personal-info']
  });
  await expect(savePersonalInfoButton).toBeVisible();
  await expect(savePersonalInfoButton).toBeDisabled();
  await expect(
    page.getByLabel(translations.settings.labels.name, { exact: true })
  ).toHaveValue('Full Stack User');
  await expect(
    page.getByLabel(translations.settings.labels.location)
  ).toHaveValue('');
  await expect(
    page.getByLabel(translations.settings.labels.picture)
  ).toHaveValue('');
  await expect(page.getByLabel(translations.settings.labels.about)).toHaveValue(
    ''
  );
});
