import { exec } from 'child_process';
import { promisify } from 'util';
import { test, expect } from '@playwright/test';
import translations from '../../client/i18n/locales/english/translations.json';

const execP = promisify(exec);

test.beforeEach(async ({ page }) => {
  await page.goto('/settings');
});

test.afterEach(async () => {
  await execP('node ./tools/scripts/seed/seed-demo-user --certified-user');
});

test.describe('Progress reset modal', () => {
  test('should display the content properly', async ({ page }) => {
    await page
      .getByRole('button', { name: 'Reset all of my progress' })
      .click();

    await expect(
      page.getByRole('dialog', { name: 'Reset My Progress' })
    ).toBeVisible();

    await expect(
      page.getByText(
        'This will permanently delete and reset all of the following:'
      )
    ).toBeVisible();

    await expect(
      page.getByText(
        'Your progress through each step/challenge (all completed challenges will be lost)'
      )
    ).toBeVisible();

    await expect(
      page.getByText(
        'Any saved code, including partially completed challenges, and certification project code'
      )
    ).toBeVisible();

    await expect(
      page.getByText('All completed and claimed certifications')
    ).toBeVisible();

    await expect(
      page.getByText(
        'You will effectively be set back to the very first day you signed up.'
      )
    ).toBeVisible();

    await expect(
      page.getByText(
        "We won't be able to recover any of it for you later, even if you change your mind."
      )
    ).toBeVisible();

    await expect(
      page.getByRole('button', {
        name: "Nevermind, I don't want to delete all of my progress"
      })
    ).toBeVisible();

    await expect(
      page.getByRole('button', {
        name: 'Reset everything. I want to start from the beginning'
      })
    ).toBeVisible();

    await expect(
      page.getByRole('button', {
        name: 'Reset everything. I want to start from the beginning'
      })
    ).toBeDisabled();
  });

  test('should close the dialog if the user clicks the cancel button', async ({
    page
  }) => {
    await page
      .getByRole('button', { name: 'Reset all of my progress' })
      .click();

    await expect(
      page.getByRole('dialog', { name: 'Reset My Progress' })
    ).toBeVisible();

    await page
      .getByRole('button', {
        name: "Nevermind, I don't want to delete all of my progress"
      })
      .click();

    await expect(
      page.getByRole('dialog', { name: 'Reset My Progress' })
    ).toBeHidden();
  });

  test('Reset progress button should be disabled if user incorrectly fills verify input text', async ({
    page
  }) => {
    await page
      .getByRole('button', { name: 'Reset all of my progress' })
      .click();

    await expect(
      page.getByRole('dialog', { name: 'Reset My Progress' })
    ).toBeVisible();

    const verifyResetInput = page.getByRole('textbox', {
      exact: true
    });
    await verifyResetInput.fill('incorrect text');

    await expect(
      page.getByRole('button', {
        name: 'Reset everything. I want to start from the beginning'
      })
    ).toBeDisabled();
  });

  test('should reset the progress if the user fills the verify input text and clicks the reset button', async ({
    page
  }) => {
    await page
      .getByRole('button', { name: 'Reset all of my progress' })
      .click();

    await expect(
      page.getByRole('dialog', { name: 'Reset My Progress' })
    ).toBeVisible();

    const verifyResetText = translations.settings.danger['verify-reset-text'];

    const verifyResetInput = page.getByRole('textbox', {
      exact: true
    });
    await verifyResetInput.fill(verifyResetText);

    await page
      .getByRole('button', {
        name: 'Reset everything. I want to start from the beginning'
      })
      .click();

    await page.waitForURL('/');
    await expect(page.getByText('Your progress has been reset')).toBeVisible();

    // Go to /settings and confirm that all certifications are reset
    await page.goto('/settings');
    await expect(
      page.getByRole('link', { name: 'Show Certification' })
    ).toBeHidden();
  });
});
