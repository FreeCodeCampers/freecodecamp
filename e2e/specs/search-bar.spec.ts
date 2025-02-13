import { test, expect, type Page } from '@playwright/test';
import translations from '../../client/i18n/locales/english/translations.json';
import algoliaEightHits from '../fixtures/algolia-eight-hits.json';
import algoliaFiveHits from '../fixtures/algolia-five-hits.json';
import algoliaNoHits from '../fixtures/algolia-no-hits.json';

const haveApiKeys =
  process.env.ALGOLIA_APP_ID !== 'app_id_from_algolia_dashboard' &&
  process.env.ALGOLIA_API_KEY !== 'api_key_from_algolia_dashboard';

const getSearchInput = async ({
  page,
  isMobile
}: {
  page: Page;
  isMobile: boolean;
}) => {
  if (isMobile) {
    const menuButton = page.getByRole('button', {
      name: translations.buttons.menu
    });
    await expect(menuButton).toBeVisible();
    await menuButton.click();
  }

  return page.getByLabel('Search', { exact: true });
};

const search = async ({
  page,
  isMobile,
  query
}: {
  page: Page;
  isMobile: boolean;
  query: string;
}) => {
  const searchInput = await getSearchInput({ page, isMobile });
  await searchInput.fill(query);
};

// Mock Algolia requests to prevent hitting Algolia server unnecessarily.
// Comment out the function call if you want to test against the real server.
const mockAlgolia = async ({
  page,
  hitsPerPage
}: {
  page: Page;
  hitsPerPage: number;
}) => {
  if (hitsPerPage === 8) {
    await page.route(/dsn.algolia.net/, async route => {
      await route.fulfill({ json: algoliaEightHits });
    });
  } else if (hitsPerPage === 5) {
    await page.route(/dsn.algolia.net/, async route => {
      await route.fulfill({ json: algoliaFiveHits });
    });
  } else if (hitsPerPage === 0) {
    await page.route(/dsn.algolia.net/, async route => {
      await route.fulfill({ json: algoliaNoHits });
    });
  }
};

test.describe('Search bar', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/learn');
  });

  test('should display correctly', async ({ page, isMobile }) => {
    const searchInput = await getSearchInput({ page, isMobile });

    await expect(searchInput).toBeVisible();

    await expect(searchInput).toHaveAttribute('placeholder', /Search/i);
    await expect(
      page.getByRole('button', { name: 'Submit search terms' })
    ).toBeVisible();
  });

  test('should return the search results when the user presses Enter', async ({
    page,
    isMobile
  }) => {
    test.skip(!haveApiKeys, 'This test requires Algolia API keys');
    await mockAlgolia({ page, hitsPerPage: 8 });
    await search({ page, isMobile, query: 'article' });

    // Wait for the search results to show up
    const resultList = page.getByRole('list', { name: 'Search results' });
    // Initially, the dropdown contains an `li` with the text "No tutorials found",
    // so we need to check the text content to ensure the correct `li` is displayed.
    await expect(resultList.getByRole('listitem').first()).toContainText(
      /article/i
    );

    await page.keyboard.press('Enter');

    await page.waitForURL(
      'https://www.freecodecamp.org/news/search/?query=article'
    );
    const title = await page.title();
    expect(title).toBe('Search - freeCodeCamp.org');
  });

  test('should return the search results when the user clicks the search button', async ({
    page,
    isMobile
  }) => {
    test.skip(!haveApiKeys, 'This test requires Algolia API keys');
    await mockAlgolia({ page, hitsPerPage: 8 });
    await search({ page, isMobile, query: 'article' });

    // Wait for the search results to show up
    const resultList = page.getByRole('list', { name: 'Search results' });
    // Initially, the dropdown contains an `li` with the text "No tutorials found",
    // so we need to check the text content to ensure the correct `li` is displayed.
    await expect(resultList.getByRole('listitem').first()).toContainText(
      /article/i
    );

    await page.getByRole('button', { name: 'Submit search terms' }).click();

    await page.waitForURL(
      'https://www.freecodecamp.org/news/search/?query=article'
    );
    const title = await page.title();
    expect(title).toBe('Search - freeCodeCamp.org');
  });

  test('should show an empty result list if no results found', async ({
    page,
    isMobile
  }) => {
    await mockAlgolia({ page, hitsPerPage: 0 });
    await search({ page, isMobile, query: 'test' });

    const resultList = page.getByRole('list', { name: 'Search results' });
    await expect(resultList.getByRole('listitem')).toHaveCount(1);
    await expect(resultList.getByRole('listitem')).toHaveText(
      'No tutorials found'
    );
  });

  test('should clear the input and hide the result dropdown when the user clicks the clear button', async ({
    page,
    isMobile
  }) => {
    const searchInput = await getSearchInput({ page, isMobile });
    await expect(searchInput).toBeVisible();

    await searchInput.fill('test');
    await page.getByRole('button', { name: 'Clear search terms' }).click();

    await expect(searchInput).toHaveValue('');
    await expect(
      page.getByRole('list', { name: 'Search results' })
    ).toBeHidden();
  });

  test('should close the dropdown when the user clicks outside of the search bar', async ({
    page,
    isMobile
  }) => {
    const searchInput = await getSearchInput({ page, isMobile });
    await expect(searchInput).toBeVisible();

    await searchInput.fill('test');

    // Wait for the search results to show up
    const resultList = page.getByRole('list', { name: 'Search results' });
    await expect(resultList).toBeVisible();

    await page.getByRole('navigation', { name: 'primary' }).click();
    await expect(resultList).toBeHidden();
  });
});

test.describe('Search results when viewport height is greater than 768px', () => {
  test.use({
    viewport: { width: 1600, height: 1200 }
  });

  test.beforeEach(async ({ page }) => {
    await page.goto('/learn');

    // Mock Algolia requests to prevent hitting Algolia server unnecessarily.
    // Comment out this line if you want to test against the real server.
    await mockAlgolia({ page, hitsPerPage: 8 });
  });

  test('should display 8 items', async ({ page, isMobile }) => {
    test.skip(!haveApiKeys, 'This test requires Algolia API keys');

    await search({ page, isMobile, query: 'article' });

    // Wait for the search results to show up
    const results = page.getByRole('list', { name: 'Search results' });
    await expect(results.getByRole('listitem')).toHaveCount(9); // 8 results + the footer
  });
});

test.describe('Search results when viewport height is equal to 768px', () => {
  test.use({
    viewport: { width: 1600, height: 768 }
  });

  test.beforeEach(async ({ page }) => {
    await page.goto('/learn');

    // Mock Algolia requests to prevent hitting Algolia server unnecessarily.
    // Comment out this line if you want to test against the real server.
    await mockAlgolia({ page, hitsPerPage: 8 });
  });

  test('should display 8 items', async ({ page, isMobile }) => {
    test.skip(!haveApiKeys, 'This test requires Algolia API keys');

    await search({ page, isMobile, query: 'article' });

    // Wait for the search results to show up
    const results = page.getByRole('list', { name: 'Search results' });
    await expect(results.getByRole('listitem')).toHaveCount(9); // 8 results + the footer
  });
});

test.describe('Search results when viewport height is less than 768px', () => {
  test.use({
    viewport: { width: 1600, height: 500 }
  });

  test.beforeEach(async ({ page }) => {
    await page.goto('/learn');

    // Mock Algolia requests to prevent hitting Algolia server unnecessarily.
    // Comment out this line if you want to test against the real server.
    await mockAlgolia({ page, hitsPerPage: 5 });
  });

  test('should display 5 items', async ({ page, isMobile }) => {
    test.skip(!haveApiKeys, 'This test requires Algolia API keys');

    await search({ page, isMobile, query: 'article' });

    // Wait for the search results to show up
    const results = page.getByRole('list', { name: 'Search results' });
    await expect(results.getByRole('listitem')).toHaveCount(6); // 5 results + the footer
  });
});
