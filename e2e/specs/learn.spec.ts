import { test, expect } from '@playwright/test';
import words from '../../client/i18n/locales/english/motivation.json';

test.describe('Learn - Unauthenticated user', () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test('the page should render correctly', async ({ page }) => {
    await page.goto('/learn');

    await expect(page).toHaveTitle(
      'Learn to Code — For Free — Coding Courses for Busy People'
    );

    await expect(
      page.getByRole('heading', {
        level: 1,
        name: "Welcome to freeCodeCamp's curriculum."
      })
    ).toBeVisible();

    // Advice for new learners
    const learnReadThisSection = page.getByTestId('learn-read-this-section');
    await expect(learnReadThisSection).toBeVisible();

    const learnReadThisSectionHeading = page.getByTestId(
      'learn-read-this-heading'
    );
    await expect(learnReadThisSectionHeading).toBeVisible();

    const learnReadThisSectionParagraphs =
      page.getByTestId('learn-read-this-p');
    await expect(learnReadThisSectionParagraphs).toHaveCount(10);

    for (const paragraph of await learnReadThisSectionParagraphs.all()) {
      await expect(paragraph).toBeVisible();
    }

    await expect(
      page.getByRole('link', { name: 'Sign in to save your progress' })
    ).toBeVisible();
  });
});

test.describe('Learn - Authenticated user)', () => {
  test('the page should render correctly', async ({ page }) => {
    await page.goto('/learn');

    await expect(page).toHaveTitle(
      'Learn to Code — For Free — Coding Courses for Busy People'
    );

    await expect(
      page.getByRole('heading', {
        level: 1,
        name: 'Welcome back, Full Stack User.'
      })
    ).toBeVisible();

    const shownQuote = await page.getByTestId('random-quote').textContent();

    const shownAuthorText = await page
      .getByTestId('random-author')
      .textContent();

    const shownAuthor = shownAuthorText?.replace('- ', '');

    const allMotivationalQuotes = words.motivationalQuotes.map(mq => mq.quote);
    const allAuthors = words.motivationalQuotes.map(mq => mq.author);

    expect(allMotivationalQuotes).toContain(shownQuote);
    expect(allAuthors).toContain(shownAuthor);
  });
});
