import { expect, test } from '@playwright/test';
import translations from '../../client/i18n/locales/english/translations.json';

test.beforeEach(async ({ page }) => {
  await page.goto(
    '/learn/2022/responsive-web-design/build-a-survey-form-project/build-a-survey-form'
  );
});

test('should toggle editor visibility correctly', async ({
  page,
  isMobile
}) => {
  const htmlTabToggle = page.getByRole('button', { name: 'index.html Editor' });
  const cssTabToggle = page.getByRole('button', { name: 'styles.css Editor' });
  const htmlTab = page.getByTestId('editor-container-indexhtml');
  const cssTab = page.getByTestId('editor-container-stylescss');

  if (isMobile) {
    const codeButton = page.getByRole('tab', {
      name: translations.learn['editor-tabs'].code
    });
    await codeButton.click();
  }
  await expect(htmlTabToggle).toBeVisible();
  // HTML tab is opened by default
  await expect(htmlTabToggle).toHaveAttribute('aria-expanded', 'true');
  await expect(htmlTab).toBeVisible();
  await htmlTabToggle.click();
  await expect(htmlTabToggle).toHaveAttribute('aria-expanded', 'false');
  await expect(htmlTab).not.toBeVisible();

  await expect(cssTabToggle).toBeVisible();
  // CSS tab is not opened by default
  await expect(cssTabToggle).toHaveAttribute('aria-expanded', 'false');
  await expect(cssTab).not.toBeVisible();
  await cssTabToggle.click();
  await expect(cssTabToggle).toHaveAttribute('aria-expanded', 'true');
  await expect(cssTab).toBeVisible();
});
