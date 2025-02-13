import { test, expect } from '@playwright/test';
import translations from '../../client/i18n/locales/english/translations.json';

test.beforeEach(async ({ page }) => {
  await page.goto('/404');
});

test.describe('FourOhFour component', () => {
  test('should display the content correctly', async ({ page }) => {
    const image = page.getByTestId('not-found-image');
    await expect(image).toBeVisible();
    await expect(image).toHaveAttribute(
      'alt',
      translations['404']['not-found']
    );

    const heading = page.getByTestId('not-found-heading');
    await expect(heading).toBeVisible();
    await expect(heading).toContainText(translations['404']['page-not-found']);

    const heresQuoteParagraph = page.getByTestId('heres-quote-paragraph');
    await expect(heresQuoteParagraph).toBeVisible();
    await expect(heresQuoteParagraph).toContainText(
      translations['404']['heres-a-quote']
    );

    await expect(page.getByTestId('quote-wrapper')).toBeVisible();

    const curriculumLinkBtn = page.getByTestId('view-curriculum-btn');
    await expect(curriculumLinkBtn).toBeVisible();
    await expect(curriculumLinkBtn).toHaveAttribute('href', '/learn');
    await expect(curriculumLinkBtn).toContainText(
      translations.buttons['view-curriculum']
    );
  });
});
