import { test, expect, type Page } from '@playwright/test';

test.describe('Certification intro page', () => {
  let page: Page;

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    await page.goto('/learn/coding-interview-prep/');
  });

  test('Should have a relevant page title', async () => {
    await expect(page).toHaveTitle('Coding Interview Prep | freeCodeCamp.org');
  });

  test('Should render', async () => {
    await expect(
      page.locator(
        "text=If you're looking for free coding exercises to prepare for your next job interview, we've got you covered."
      )
    ).toBeVisible();
  });
});
