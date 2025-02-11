import { exec } from 'child_process';
import { promisify } from 'util';

import { test, expect } from '@playwright/test';

import translations from '../../client/i18n/locales/english/translations.json';
import { alertToBeVisible } from '../utils/alerts';
import { allowTrailingSlash } from '../utils/url';

const execP = promisify(exec);

test.beforeEach(async ({ page }) => {
  await page.goto('/settings');
});

test.afterAll(
  async () =>
    await Promise.all([
      await execP('node ./tools/scripts/seed/seed-demo-user --certified-user'),
      await execP('node ./tools/scripts/seed/seed-surveys'),
      await execP('node ./tools/scripts/seed/seed-ms-username')
    ])
);

test.describe('Delete Modal component', () => {
  test('should render the modal correctly', async ({ page }) => {
    await page
      .getByRole('button', { name: translations.settings.danger.delete })
      .click();

    await expect(
      page.getByRole('dialog', {
        name: translations.settings.danger['delete-title']
      })
    ).toBeVisible();

    await expect(
      page.getByText(translations.settings.danger['delete-p1'])
    ).toBeVisible();

    await expect(
      page.getByText(translations.settings.danger['delete-p2'])
    ).toBeVisible();

    const supportLink = page.getByRole('link', {
      name: 'support@freeCodeCamp.org'
    });
    await expect(supportLink).toBeVisible();
    await expect(supportLink).toHaveAttribute(
      'href',
      'mailto:support@freecodecamp.org'
    );

    await expect(
      page.getByRole('button', { name: translations.settings.danger.nevermind })
    ).toBeVisible();
    await expect(
      page.getByRole('button', { name: translations.settings.danger.certain })
    ).toBeVisible();

    await expect(
      page.getByRole('button', { name: translations.settings.danger.certain })
    ).toBeDisabled();

    await expect(
      page.getByRole('button', { name: translations.buttons.close })
    ).toBeVisible();
  });

  test('should close the modal after the user cancels account deleting', async ({
    page
  }) => {
    await page
      .getByRole('button', { name: translations.settings.danger.delete })
      .click();

    await expect(
      page.getByRole('dialog', {
        name: translations.settings.danger['delete-title']
      })
    ).toBeVisible();

    await page
      .getByRole('button', { name: translations.settings.danger.nevermind })
      .click();

    await expect(
      page.getByRole('dialog', {
        name: translations.settings.danger['delete-title']
      })
    ).not.toBeVisible();
  });

  test('Delele button should be disabled if user incorrectly fills verify input text', async ({
    page
  }) => {
    await page
      .getByRole('button', { name: translations.settings.danger.delete })
      .click();

    await expect(
      page.getByRole('dialog', {
        name: translations.settings.danger['delete-title']
      })
    ).toBeVisible();

    const verifyDeleteInput = page.getByRole('textbox', {
      exact: true
    });
    await verifyDeleteInput.fill('incorrect text');

    await expect(
      page.getByRole('button', {
        name: translations.settings.danger.certain
      })
    ).toBeDisabled();
  });

  test('should close the modal and redirect to /learn after the user fills the verify input text and clicks delete', async ({
    page
  }) => {
    await page
      .getByRole('button', { name: translations.settings.danger.delete })
      .click();

    await expect(
      page.getByRole('dialog', {
        name: translations.settings.danger['delete-title']
      })
    ).toBeVisible();

    const verifyDeleteText = translations.settings.danger['verify-delete-text'];

    const verifyDeleteInput = page.getByRole('textbox', {
      exact: true
    });
    await verifyDeleteInput.fill(verifyDeleteText);

    await page
      .getByRole('button', { name: translations.settings.danger.certain })
      .click();

    await expect(
      page.getByRole('dialog', {
        name: translations.settings.danger['delete-title']
      })
    ).not.toBeVisible();

    await expect(page).toHaveURL(allowTrailingSlash('/learn'));
    await alertToBeVisible(page, translations.flash['account-deleted']);
    // The user is signed out after their account is deleted
    await expect(page.getByRole('link', { name: 'Sign in' })).toHaveCount(2);
  });
});
