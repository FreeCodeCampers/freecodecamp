import { test, expect } from '@playwright/test';

test.describe('Certification intro page', () => {
  test('Should render', async ({ page }) => {
    await page.goto('/learn/coding-interview-prep');
    await expect(
      page.getByText(
        "If you're looking for free coding exercises to prepare for your next job interview, we've got you covered."
      )
    ).toBeVisible();
    await expect(page).toHaveTitle('Coding Interview Prep | freeCodeCamp.org');
  });
});
