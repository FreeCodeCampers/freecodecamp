import { test, expect } from '@playwright/test';
import translations from '../client/i18n/locales/english/translations.json';
import { allowTrailingSlash } from './utils/url';
import {
  deleteAllEmails,
  getAllEmails,
  getFirstEmail,
  getSubject
} from './utils/mailhog';

test.beforeEach(async () => {
  await deleteAllEmails();
});

test.describe('The update-email page when the user is signed in', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/update-email');
  });

  test('should display the content correctly', async ({ page }) => {
    await expect(page).toHaveTitle(
      'Update your email address | freeCodeCamp.org'
    );
    await expect(
      page.getByRole('heading', { name: 'Update your email address here' })
    ).toBeVisible();

    const form = page.getByTestId('update-email-form');
    const emailInput = page.getByLabel('Email');
    const submitButton = page.getByRole('button', { name: 'Update my Email' });

    await expect(form).toBeVisible();
    await expect(emailInput).toBeVisible();
    await expect(emailInput).toHaveAttribute('type', 'email');
    await expect(emailInput).toHaveAttribute(
      'placeholder',
      'camperbot@example.com'
    );
    await expect(submitButton).toBeVisible();
    await expect(submitButton).toHaveAttribute('type', 'submit');

    const signOutButton = page.getByRole('link', { name: 'Sign out' });

    await expect(signOutButton).toBeVisible();
    await expect(signOutButton).toHaveAttribute('href', '/signout');
  });

  test('should enable the submit button if the email input is valid', async ({
    page
  }) => {
    const emailInput = page.getByLabel(translations.misc.email);
    const submitButton = page.getByRole('button', { name: 'Update my Email' });

    await expect(submitButton).toBeDisabled();
    await emailInput.fill('123');
    await expect(submitButton).toBeDisabled();
    await emailInput.fill('123@gmail.com');
    await expect(submitButton).toBeEnabled();
  });

  test('actually sends an email', async ({ page }) => {
    const emailInput = page.getByLabel(translations.misc.email);
    const submitButton = page.getByRole('button', { name: 'Update my Email' });

    await expect(submitButton).toBeDisabled();
    await emailInput.fill('123');
    await expect(submitButton).toBeDisabled();
    await emailInput.fill('123@gmail.com');
    await submitButton.click();
    await expect(async () => {
      const emails = await getAllEmails();
      expect(emails.items).toHaveLength(1);
      expect(getSubject(getFirstEmail(emails))).toBe(
        'Please confirm your updated email address for freeCodeCamp.org'
      );
    }).toPass();
  });
});

test.describe('The update-email page when the user is not signed in', () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test.beforeEach(async ({ page }) => {
    await page.goto('/update-email');
  });

  test('should sign the user in and redirect them to /learn', async ({
    page,
    browserName
  }) => {
    // The signin step involves multiple navigations, which results a network error in Firefox.
    // The error is harmless but Playwright doesn't suppress it, causing the test to fail.
    // Ref: https://github.com/microsoft/playwright/issues/20749
    test.skip(browserName === 'firefox');

    await page.waitForURL(allowTrailingSlash('/learn'));

    await expect(
      page.getByRole('heading', { name: 'Welcome back, Full Stack User' })
    ).toBeVisible();
  });
});
