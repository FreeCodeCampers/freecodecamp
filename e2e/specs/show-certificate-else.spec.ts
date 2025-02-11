import { test, expect, type Page } from '@playwright/test';

test.describe('Show certification else', () => {
  let page: Page;
  test.use({ storageState: { cookies: [], origins: [] } });

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    await page.goto('/certification/certifieduser/responsive-web-design');
  });

  test('while viewing someone else, should display the certificate information', async () => {
    await expect(page.getByTestId('successful-completion')).toBeVisible();
    await expect(page.getByTestId('certification-title')).toBeVisible();
    await expect(page.getByTestId('issue-date')).toContainText(
      'Developer Certification on August 3, 2018'
    );
  });

  test('while viewing someone else, should not render a LinkedIn button and Twitter button', async () => {
    await expect(page.getByTestId('linkedin-share-btn')).toBeHidden();
    await expect(page.getByTestId('twitter-share-btn')).toBeHidden();
  });

  test('while viewing someone else, it should not show the donation section', async () => {
    await expect(page.getByRole('button', { name: 'Donate' })).toBeHidden();
  });
});
