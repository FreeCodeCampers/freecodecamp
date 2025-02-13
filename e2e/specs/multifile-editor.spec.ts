import { test, expect } from '@playwright/test';

import { getEditors } from '../utils/editor';

test.beforeEach(async ({ page }) => {
  await page.goto(
    '/learn/2022/responsive-web-design/learn-basic-css-by-building-a-cafe-menu/step-15'
  );
});

test.describe('MultifileEditor Component', () => {
  test('Multiple editors should be selected and able to insert text into', async ({
    page,
    isMobile
  }) => {
    // Spawn second editor to test MultifileEditor component
    const stylesEditor = page.getByRole('button', {
      name: 'styles.css Editor'
    });
    await stylesEditor.click();

    // Use the `.toHaveCount()` assertion to ensure that the second editor is on the screen
    // before moving onto other assertions.
    // Note that using the `.all()` locator here would result a flaky test.
    // Ref: https://github.com/freeCodeCamp/freeCodeCamp/pull/53031/files#r1500316812
    const editors = getEditors(page);
    await expect(editors).toHaveCount(2);

    const test_string = 'TestString';
    let index = 0;
    for (const editor of await editors.all()) {
      // For some reason the click event doesn't work on mobile
      if (isMobile) {
        await editor.focus();
      } else {
        await editor.click();
      }

      await page.keyboard.insertText(test_string + index.toString());
      const text = page.getByText(test_string + index.toString());
      await expect(text).toBeVisible();
      index++;
    }
  });

  test('Reloading should preserve the editor layout', async ({
    page,
    isMobile
  }) => {
    test.skip(
      isMobile,
      'The mobile layout does not have resizable panes, so this test is not applicable.'
    );

    const desktopLayout = page.getByTestId('desktop-layout');
    const splitter = desktopLayout.getByTestId('preview-left-splitter');
    const editorPane = desktopLayout.getByTestId('editor-pane');
    const initialStyle = await editorPane.getAttribute('style');
    expect(initialStyle).toContain('flex: 1');

    // Drag the splitter to resize the editor pane
    await splitter.hover();
    await page.mouse.down();
    await page.mouse.move(100, 100);
    await page.mouse.up();

    const newStyle = await editorPane.getAttribute('style');
    // It doesn't matter where it's dragged to, just that it's different:
    expect(newStyle).not.toContain('flex: 1');

    await page.reload();

    expect(await editorPane.getAttribute('style')).toBe(newStyle);
  });
});
