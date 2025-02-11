import { execSync } from 'child_process';
import { test, expect } from '@playwright/test';
import translations from '../../client/i18n/locales/english/translations.json';
import { alertToBeVisible } from '../utils/alerts';

test.describe('When the user has not accepted the Academic Honesty Policy', () => {
  test.use({ storageState: 'e2e/playwright/.auth/development-user.json' });

  test.beforeEach(() => {
    execSync('node ./tools/scripts/seed/seed-demo-user');
  });

  test.afterAll(() => {
    execSync('node ./tools/scripts/seed/seed-demo-user --certified-user');
  });

  test('they should be able to accept it', async ({ page }) => {
    await page.goto('/settings');
    await expect(
      page.getByRole('heading', {
        name: translations.settings.headings.honesty
      })
    ).toBeVisible();
    await expect(
      page.getByText(translations.settings.honesty.p1)
    ).toBeVisible();
    await expect(
      page.getByText(translations.settings.honesty.p2)
    ).toBeVisible();
    await expect(
      page.getByText(translations.settings.honesty.p3)
    ).toBeVisible();
    await expect(
      page.getByText(translations.settings.honesty.p4)
    ).toBeVisible();
    await expect(
      page.getByText(translations.settings.honesty.p5)
    ).toBeVisible();
    await expect(
      page.getByText(translations.settings.honesty.p6)
    ).toBeVisible();
    const agreeButton = page.getByRole('button', {
      name: translations.buttons['agree-honesty']
    });
    await agreeButton.click();

    await expect(
      page.getByRole('button', {
        name: translations.buttons['accepted-honesty']
      })
    ).toBeVisible();
  });

  test('Should show an error message', async ({ page }) => {
    await page.goto('/settings#cert-responsive-web-design');

    const claimCertButton = page.getByRole('button', {
      name: 'Claim Certification Responsive Web Design'
    });
    await claimCertButton.click();

    await alertToBeVisible(page, translations.flash['honest-first']);

    const agreeButton = page.getByRole('button', {
      name: translations.buttons['agree-honesty']
    });
    await agreeButton.click();
    await alertToBeVisible(page, translations.buttons['accepted-honesty']);

    await page.reload();

    await claimCertButton.click();

    await alertToBeVisible(
      page,
      'It looks like you have not completed the necessary steps. Please complete the required projects to claim the Responsive Web Design Certification.'
    );
  });
});
