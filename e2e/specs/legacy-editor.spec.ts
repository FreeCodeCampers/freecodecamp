import { test, expect } from '@playwright/test';
import { focusEditor } from '../utils/editor';

test.describe('Editor Shortcuts', () => {
  test('Should add a new line if the user presses Alt+Enter', async ({
    page,
    isMobile
  }) => {
    await page.goto(
      'learn/responsive-web-design/basic-html-and-html5/say-hello-to-html-elements'
    );
    await focusEditor({ page, isMobile });

    await page.keyboard.press('Alt+Enter');
    await expect(
      page
        .getByTestId('editor-container-indexhtml')
        .getByText('<h1>Hello</h1>\n')
    ).toBeVisible();
  });

  test('Should not add a new line if the user presses Ctrl+Enter', async ({
    page,
    isMobile
  }) => {
    await page.goto(
      'learn/responsive-web-design/basic-html-and-html5/say-hello-to-html-elements'
    );
    await focusEditor({ page, isMobile });

    await page.keyboard.press('Control+Enter');
    await expect(
      page.getByTestId('editor-container-indexhtml').getByText('<h1>Hello</h1>')
    ).toBeVisible();
  });
});
