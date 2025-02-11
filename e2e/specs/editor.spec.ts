import { APIRequestContext, expect, test } from '@playwright/test';

import { clearEditor, focusEditor, getEditors } from '../utils/editor';
import { authedRequest } from '../utils/request';

const setTheme = async (
  request: APIRequestContext,
  theme: 'default' | 'night'
) =>
  authedRequest({
    request,
    endpoint: '/update-my-theme',
    method: 'put',
    data: {
      theme
    }
  });

const testPage =
  '/learn/2022/responsive-web-design/learn-html-by-building-a-cat-photo-app/step-3';

test.describe('Editor Component', () => {
  test('should allow the user to insert text', async ({ page, isMobile }) => {
    await page.goto(testPage);

    await focusEditor({ page, isMobile });
    await page.keyboard.insertText('<h2>FreeCodeCamp</h2>');
    const text = page.getByText('<h2>FreeCodeCamp</h2>');
    await expect(text).toBeVisible();
  });
});

test.describe('Python Terminal', () => {
  test('should display error message when the user enters invalid code', async ({
    page,
    isMobile,
    browserName
  }) => {
    await page.goto(
      'learn/scientific-computing-with-python/learn-string-manipulation-by-building-a-cipher/step-2'
    );

    await focusEditor({ page, isMobile });
    await clearEditor({ page, browserName, isMobile });
    // Then enter invalid code
    await getEditors(page).fill('def');

    if (isMobile) {
      await page.getByRole('tab', { name: 'Preview' }).click();
    }

    const preview = page.getByTestId('preview-pane');

    // While it's displayed on multiple lines, the string itself has no newlines, hence:
    const error = `Traceback (most recent call last):  File "main.py", line 1    def       ^SyntaxError: invalid syntax`;
    // It shouldn't take this long, but the Python worker can be slow to respond.
    await expect(preview.getByText(error)).toContainText(error, {
      timeout: 15000
    });
  });
});

test.describe('Editor theme if the system theme is dark', () => {
  test.use({ colorScheme: 'dark' });

  test.describe('If the user is signed in', () => {
    test('should respect the user settings', async ({ page, request }) => {
      const editor = page.locator("div[role='code'].monaco-editor");

      await setTheme(request, 'night');
      await page.goto(testPage);

      await expect(editor).toHaveClass(/vs-dark/);

      await setTheme(request, 'default');
      await page.reload();

      await expect(editor).toHaveClass(/vs(?!\w)/);
    });
  });

  test.describe('If the user is signed out and has no local storage data', () => {
    test.use({ storageState: { cookies: [], origins: [] } });

    test('should be in dark mode', async ({ page }) => {
      await page.goto(testPage);
      const editor = page.locator("div[role='code'].monaco-editor");
      await expect(editor).toHaveClass(/vs-dark/);
    });
  });

  test.describe('if the user is signed out and has a dark theme set in local storage', () => {
    test.use({ storageState: { cookies: [], origins: [] } });

    test('should be in dark mode', async ({ page }) => {
      // go to the test page
      await page.goto(testPage);

      // set the dark theme in local storage
      await page.evaluate(() => {
        localStorage.setItem('theme', 'dark');
      });

      // reload the page to apply the local storage changes
      await page.reload();

      // check if the editor is in dark mode
      const editor = page.locator("div[role='code'].monaco-editor");
      await expect(editor).toHaveClass(/vs-dark/);
    });
  });
});

test.describe('Editor theme if the system theme is light', () => {
  test.use({ colorScheme: 'light' });

  test.describe('If the user is signed in', () => {
    test('should respect the user settings', async ({ page, request }) => {
      const editor = page.locator("div[role='code'].monaco-editor");

      await setTheme(request, 'night');
      await page.goto(testPage);

      await expect(editor).toHaveClass(/vs-dark/);

      await setTheme(request, 'default');
      await page.reload();

      await expect(editor).toHaveClass(/vs(?!\w)/);
    });

    // This should be true for both system themes, but we're only testing light mode to save time.
    test('should switch the editor theme when the user toggles the theme', async ({
      page,
      request
    }) => {
      await setTheme(request, 'default');
      await page.goto(testPage);
      // Open the nav menu and toggle the theme
      await page.getByRole('button', { name: 'Menu' }).click();

      const toggle = page.getByRole('button', { name: 'Night Mode' });
      await expect(toggle).toBeVisible();

      const listItem = page.getByRole('listitem').filter({ has: toggle });

      // The button's click event is intercepted by the `li`,
      // so we need to click on the `li` to trigger the theme change action.
      await listItem.click();

      // Ensure that the action is completed before checking the editor.
      await expect(page.getByText('We have updated your theme')).toBeVisible();

      const editor = page.locator("div[role='code'].monaco-editor");
      await expect(editor).toHaveClass(/vs-dark/);
    });
  });

  test.describe('If the user is signed out and has no local storage value', () => {
    test.use({ storageState: { cookies: [], origins: [] } });

    test('should be in light mode', async ({ page }) => {
      await page.goto(testPage);
      const editor = page.locator("div[role='code'].monaco-editor");
      await expect(editor).toHaveClass(/vs(?!\w)/);
    });

    test.describe('if the user is signed out and has a light theme set in local storage', () => {
      test.use({ storageState: { cookies: [], origins: [] } });

      test('should be in light mode', async ({ page }) => {
        // go to the test page
        await page.goto(testPage);

        // set the light theme in local storage
        await page.evaluate(() => {
          localStorage.setItem('theme', 'light');
        });

        // reload the page to apply the local storage changes
        await page.reload();

        // check if the editor is in light mode
        const editor = page.locator("div[role='code'].monaco-editor");
        await expect(editor).toHaveClass(/vs(?!\w)/);
      });
    });
  });
});
