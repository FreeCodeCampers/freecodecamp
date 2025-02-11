import { test, expect } from '@playwright/test';
import translations from '../../client/i18n/locales/english/translations.json';

test.beforeEach(async ({ page }) => {
  await page.goto(
    '/learn/javascript-algorithms-and-data-structures/basic-javascript/declare-javascript-variables'
  );
});

test.describe('Challenge Side Panel Component', () => {
  test('should render correctly', async ({ page, isMobile }) => {
    const toolPanelItem = page.getByText(translations.buttons['get-help']);
    if (isMobile) {
      await expect(toolPanelItem).not.toBeVisible();
    } else {
      await expect(toolPanelItem).toBeVisible();
    }
    await expect(page.getByTestId('challenge-title')).toBeVisible();
    await expect(page.getByTestId('challenge-description')).toBeVisible();
    await expect(page.getByTestId('test-result')).toBeVisible();
  });
});
