import { test, expect } from '@playwright/test';
import translations from '../../client/i18n/locales/english/translations.json';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test.describe('Staging Warning Modal E2E Test Suite', () => {
  test('Verifies the Correct Rendering of the Staging Warning Modal', async ({
    page
  }) => {
    if (
      process.env.DEPLOYMENT_ENV === 'staging' &&
      process.env.FREECODECAMP_NODE_ENV === 'production'
    ) {
      await expect(
        page.getByText(translations['staging-warning'].heading)
      ).toBeVisible();
      await expect(
        page.getByText(translations['staging-warning'].p1)
      ).toBeVisible();
      await expect(
        page.getByText(translations['staging-warning'].p2)
      ).toBeVisible();

      await expect(
        page.getByRole('button', {
          name: translations['staging-warning'].certain
        })
      ).toBeVisible();

      const link = page.getByRole('link', { name: 'following this link' });
      await expect(link).toHaveAttribute(
        'href',
        'https://contribute.freecodecamp.org/#/devops?id=known-limitations'
      );
      await expect(link).toHaveAttribute('target', '_blank');
      await expect(link).toHaveAttribute('rel', 'noopener noreferrer nofollow');

      await expect(
        page.getByRole('button', { name: translations.buttons.close })
      ).toBeVisible();
    } else {
      await expect(
        page.getByText(translations['staging-warning'].heading)
      ).not.toBeVisible();
      await expect(
        page.getByText(translations['staging-warning'].p1)
      ).not.toBeVisible();
      await expect(
        page.getByText(translations['staging-warning'].p2)
      ).not.toBeVisible();

      await expect(
        page.getByRole('button', {
          name: translations['staging-warning'].certain
        })
      ).not.toBeVisible();
      await expect(
        page.getByRole('button', { name: translations.buttons.close })
      ).not.toBeVisible();
    }
  });

  test('Closes the Staging Warning Modal When the User clicks on cancel button', async ({
    page
  }) => {
    if (
      process.env.DEPLOYMENT_ENV === 'staging' &&
      process.env.FREECODECAMP_NODE_ENV === 'production'
    ) {
      await page
        .getByRole('button', { name: translations.buttons.close })
        .click();
      await expect(
        page.getByText(translations['staging-warning'].heading)
      ).not.toBeVisible();
    }
  });

  test('Closes the Modal when the User Accepts the Staging Warning', async ({
    page
  }) => {
    if (
      process.env.DEPLOYMENT_ENV === 'staging' &&
      process.env.FREECODECAMP_NODE_ENV === 'production'
    ) {
      await page
        .getByRole('button', { name: translations['staging-warning'].certain })
        .click();
      await expect(
        page.getByText(translations['staging-warning'].heading)
      ).not.toBeVisible();
    }
  });
});
