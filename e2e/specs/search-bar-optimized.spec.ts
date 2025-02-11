import { test, expect, type Page } from '@playwright/test';
import translations from '../../client/i18n/locales/english/translations.json';

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

  return page.getByLabel('Search');
};

test.describe('Search bar optimized', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display correct placeholder', async ({ page, isMobile }) => {
    const searchInput = await getSearchInput({ page, isMobile });

    await expect(searchInput).toBeVisible();
    // Because we're mocking Algolia requests, the placeholder
    // should be the default one.
    await expect(searchInput).toHaveAttribute(
      'placeholder',
      translations.search.placeholder.default
    );
  });

  test('should return the search results when the user presses Enter', async ({
    context,
    page,
    isMobile
  }) => {
    const searchInput = await getSearchInput({ page, isMobile });
    await expect(searchInput).toBeVisible();

    await searchInput.fill('test');
    await page.keyboard.press('Enter');

    // Wait for the new page to load.
    const newPage = await context.waitForEvent('page');
    await newPage.waitForLoadState();

    expect(newPage.url()).toBe(
      'https://www.freecodecamp.org/news/search/?query=test'
    );
  });

  test('should return the search results when the user clicks the search button', async ({
    context,
    page,
    isMobile
  }) => {
    const searchInput = await getSearchInput({ page, isMobile });
    await expect(searchInput).toBeVisible();

    await searchInput.fill('test');
    await page
      .getByRole('button', { name: translations.icons.magnifier })
      .click();

    // Wait for the new page to load.
    const newPage = await context.waitForEvent('page');
    await newPage.waitForLoadState();

    expect(newPage.url()).toBe(
      'https://www.freecodecamp.org/news/search/?query=test'
    );
  });

  test('should clear the search input when the user clicks the clear button', async ({
    page,
    isMobile
  }) => {
    const searchInput = await getSearchInput({ page, isMobile });
    await expect(searchInput).toBeVisible();

    await searchInput.fill('test');
    await page
      .getByRole('button', { name: translations.icons['input-reset'] })
      .click();

    await expect(searchInput).toHaveValue('');
  });

  test('The optimized searchbar component should not render when not on the landing page', async ({
    page,
    isMobile
  }) => {
    // This means that the default search bar should be rendered ^.
    await page.getByTestId('curriculum-map-button').nth(0).click();

    if (isMobile) {
      const menuButton = page.getByTestId('header-menu-button');
      await expect(menuButton).toBeVisible();
      await menuButton.click();
    }

    await expect(page.getByTestId('header-search')).toBeVisible();
  });
});
