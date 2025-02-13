import { test, expect } from '@playwright/test';

test.describe('Reset Editor Layout', () => {
  test('drag layout and reset', async ({ page, isMobile }) => {
    test.skip(
      isMobile,
      'The mobile layout does not have resizable panes, so this test is not applicable.'
    );

    await page.goto(
      '/learn/2022/responsive-web-design/learn-basic-css-by-building-a-cafe-menu/step-15'
    );

    const desktopLayout = page.getByTestId('desktop-layout');
    const splitter = page.getByTestId('preview-left-splitter');
    const editorPane = desktopLayout.getByTestId('editor-pane');
    const initialStyle = await editorPane.getAttribute('style');

    expect(initialStyle).toContain('flex: 1');

    // Drag the splitter to resize the editor pane
    await splitter.hover();
    await page.mouse.down();
    await page.mouse.move(100, 100);
    await page.mouse.up();

    const newStyle = await editorPane.getAttribute('style');
    expect(newStyle).not.toContain('flex: 1');

    await page.goto('/settings#privacy-settings');

    const resetButton = page.getByTestId('reset-layout-btn');
    await resetButton.click();

    await expect(page.getByTestId('flash-message')).toContainText(
      'Your editor layout has been reset'
    );

    await expect(resetButton).toBeDisabled();

    await page.goto(
      '/learn/2022/responsive-web-design/learn-basic-css-by-building-a-cafe-menu/step-15'
    );

    const afterReset = await editorPane.getAttribute('style');
    expect(afterReset).toContain('flex: 1');
  });
});
