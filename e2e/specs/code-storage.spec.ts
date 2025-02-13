import { test, expect } from '@playwright/test';

import { getEditors } from '../utils/editor';

test.describe('Challenge with editor', function () {
  test.skip(({ isMobile }) => isMobile);
  test('the shortcut "Ctrl + S" saves the code', async ({ page }) => {
    await page.goto(
      '/learn/2022/responsive-web-design/learn-html-by-building-a-cat-photo-app/step-2'
    );

    const editor = getEditors(page);

    await editor.fill('Something funny');
    await page.keyboard.down('Control');
    await page.keyboard.press('S');

    await expect(
      page.getByText(
        "Saved! Your code was saved to your browser's local storage."
      )
    ).toBeVisible();

    await page.reload();

    // check editor content
    await expect(editor).toHaveValue(/Something funny/);
  });
});
