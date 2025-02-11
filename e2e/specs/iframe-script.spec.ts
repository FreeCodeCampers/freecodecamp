import { expect, test } from '@playwright/test';
import translations from '../../client/i18n/locales/english/translations.json';
import { focusEditor } from '../utils/editor';

test.beforeEach(async ({ page }) => {
  await page.goto(
    '/learn/javascript-algorithms-and-data-structures-v8/build-a-cash-register-project/build-a-cash-register'
  );
});

test.describe('Preventing Script From Displaying in Preview', () => {
  // this test is for inserting problematic <style> tag and checking if the preview is empty

  test('should render an empty preview after inserting CSS', async ({
    page,
    isMobile
  }) => {
    await focusEditor({ page, isMobile });

    //  the pain in the butt <style> tag with display: block rule into the editor
    const styleTag = `
  <style>
  * {
    margin: 0;
    padding: 0;
    display: block;
  }
  </style>`;
    await page.keyboard.insertText(styleTag);

    if (isMobile) {
      await page
        .getByRole('tab', { name: translations.learn['editor-tabs'].preview })
        .click();
    }

    // Checks that the iframe preview is empty
    const frame = page.frameLocator('#fcc-main-frame').first();

    // Make sure there are no visible elements inside the iframe's body
    await expect(frame.locator('body')).toBeEmpty();
  });
});
