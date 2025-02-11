import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto(
    '/learn/python-for-everybody/python-for-everybody/introduction-why-program'
  );
});

test.describe('Challenge Video Player Component Tests', () => {
  test('should render video player and play button', async ({ page }) => {
    await expect(page.locator('.display-youtube-video')).toBeVisible();

    await expect(
      page.locator('iframe[title="YouTube video player"]')
    ).toBeVisible();
  });
});
