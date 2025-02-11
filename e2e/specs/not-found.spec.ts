import { test, expect } from '@playwright/test';
import translations from '../../client/i18n/locales/english/translations.json';
import words from '../../client/i18n/locales/english/motivation.json';

const pageElements = {
  notFoundImage: 'not-found-image',
  notFoundHeading: 'not-found-heading',
  heresQuoteParagraph: 'heres-quote-paragraph',
  quoteWrapper: 'quote-wrapper',
  quoteContent: 'quote-content',
  authorName: 'author-name',
  viewCurriculumBtn: 'view-curriculum-btn'
};

test.beforeEach(async ({ page }) => {
  await page.goto('/404');
});

test.describe('Not-Found Page Tests', () => {
  test('should display correct page title', async ({ page }) => {
    await expect(page).toHaveTitle(
      `${translations[404]['page-not-found']} | freeCodeCamp.org`
    );
  });

  test('should display 404 image', async ({ page }) => {
    const notFoundImage = page.getByTestId(pageElements.notFoundImage);
    await expect(notFoundImage).toBeVisible();
  });

  test('should display not found heading', async ({ page }) => {
    const notFoundHeading = page.getByTestId(pageElements.notFoundHeading);
    await expect(notFoundHeading).toHaveText(
      `${translations[404]['page-not-found']}.`
    );
  });

  test('should display heres a quote message', async ({ page }) => {
    const heresQuoteParagraph = page.getByTestId(
      pageElements.heresQuoteParagraph
    );
    await expect(heresQuoteParagraph).toHaveText(
      translations[404]['heres-a-quote']
    );
  });

  test('should load a quote component', async ({ page }) => {
    const quoteWrapper = page.getByTestId(pageElements.quoteWrapper);
    const quoteContent = page.getByTestId(pageElements.quoteContent);
    const authorName = page.getByTestId(pageElements.authorName);

    await expect(quoteWrapper).toBeVisible();
    expect(quoteContent).not.toBeNull();
    expect(authorName).not.toBeNull();
  });

  test('should display a random quote', async ({ page }) => {
    const shownQuote = await page
      .getByTestId(pageElements.quoteContent)
      .textContent();

    const shownAuthorText = await page
      .getByTestId(pageElements.authorName)
      .textContent();

    const shownAuthor = shownAuthorText?.replace('- ', '');

    const allMotivationalQuotes = words.motivationalQuotes.map(mq => mq.quote);
    const allAuthors = words.motivationalQuotes.map(mq => mq.author);

    expect(allMotivationalQuotes).toContain(shownQuote);
    expect(allAuthors).toContain(shownAuthor);
  });

  test('should display view curriculum link', async ({ page }) => {
    await expect(
      page.getByRole('link', {
        name: translations.buttons['view-curriculum']
      })
    ).toBeVisible();
  });
});
