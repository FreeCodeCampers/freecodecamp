import { test, expect } from '@playwright/test';

import translations from '../../client/i18n/locales/english/translations.json';
import stripeJson from '../fixtures/donation/stripe.json';
import { alertToBeVisible } from '../utils/alerts';

test.describe('third-party donation tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/donate');
  });

  test('All elements are present in the widget', async ({ page }) => {
    await page.getByRole('button', { name: 'Donate', exact: true }).click();

    // Paypal button should be present

    const paypalButtonIframe = page.frameLocator('.component-frame');
    const paypalButton = paypalButtonIframe.getByRole('link');
    await expect(paypalButton).toBeVisible();
    await expect(paypalButton).toHaveAttribute('aria-label', 'PayPal');

    // Patreon button should be present

    const patreonButton = page.locator('.patreon-button');
    await expect(patreonButton).toBeVisible();

    // "Or dontate with card" button should be present

    await expect(page.getByText('Or donate with card')).toBeVisible();
  });

  test('It is possible to donate with a card', async ({ page }) => {
    await page.getByRole('button', { name: 'Donate', exact: true }).click();

    const cardNumberIframe = page
      .frameLocator('iframe[src*="elements-inner-card"]')
      .nth(0);

    const cardExpiryIframe = page
      .frameLocator('iframe[src*="elements-inner-card"]')
      .nth(1);

    await cardNumberIframe
      .locator('input[data-elements-stable-field-name="cardNumber"]')
      .fill('4242424242424242');

    await cardExpiryIframe
      .locator('input[data-elements-stable-field-name="cardExpiry"]')
      .fill('1025');

    await page.getByRole('button', { name: 'Donate', exact: true }).click();

    await page.route(
      'https://api.stripe.com/v1/payment_methods',
      async route => {
        await route.fulfill({ json: stripeJson });
      }
    );

    await page.route(
      new URL('donate/charge-stripe-card', process.env.API_LOCATION).toString(),
      async route => {
        await route.fulfill({ json: { isDonating: true } });
      }
    );

    await expect(page.getByRole('alert')).toBeVisible();

    await alertToBeVisible(page, translations.donate['free-tech']);
    await alertToBeVisible(page, translations.donate['visit-supporters']);
  });
});
