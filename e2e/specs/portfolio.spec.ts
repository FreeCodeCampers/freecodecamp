import { execSync } from 'child_process';
import { test, expect } from '@playwright/test';
import translations from '../../client/i18n/locales/english/translations.json';

test.use({ storageState: 'e2e/playwright/.auth/development-user.json' });

test.beforeAll(() => {
  execSync('node ./tools/scripts/seed/seed-demo-user');
});

test.afterAll(() => {
  execSync('node ./tools/scripts/seed/seed-demo-user --certified-user');
});

test.describe('Add Portfolio Item', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/developmentuser');

    if (!process.env.CI) {
      await page
        .getByRole('button', { name: 'Preview custom 404 page' })
        .click();
    }

    await page.getByRole('button', { name: 'Edit my profile' }).click();

    // Will check if the portfolio button is hydrated correctly with different intervals.
    await expect(async () => {
      const addPortfolioItemButton = page.getByRole('button', {
        name: 'Add a new portfolio Item'
      });
      await addPortfolioItemButton.click();

      await expect(addPortfolioItemButton).toBeDisabled({ timeout: 1 });
    }).toPass();
  });

  test('The title has validation', async ({ page }) => {
    await page.getByLabel(translations.settings.labels.title).fill('T');
    await expect(page.getByTestId('title-validation')).toContainText(
      'Title is too short'
    );

    await page
      .getByLabel(translations.settings.labels.title)
      .fill(
        'This is the longest title you will ever see in your entire life, you will never see such a long title again. This is the longest title in existen'
      );
    await expect(page.getByTestId('title-validation')).toContainText(
      'Title is too long'
    );
    await page
      .getByLabel(translations.settings.labels.title)
      .fill('My portfolio');
    await expect(page.getByTestId('title-validation')).toBeHidden();
  });

  test('The url has validation', async ({ page }) => {
    await page.getByLabel(translations.settings.labels.url).fill('T');
    await expect(page.getByTestId('url-validation')).toContainText(
      'Please use a valid URL'
    );
    await page
      .getByLabel(translations.settings.labels.url)
      .fill('http://helloworld.com');
    await expect(page.getByTestId('url-validation')).toBeHidden();
  });

  test('The image has validation', async ({ page }) => {
    await page.getByLabel(translations.settings.labels.image).fill('T');
    await expect(page.getByTestId('image-validation')).toContainText(
      'Please use a valid URL'
    );
    await page
      .getByLabel(translations.settings.labels.image)
      .fill(
        'https://cdn.freecodecamp.org/universal/favicons/favicon-32x32.png'
      );
    await expect(page.getByTestId('image-validation')).toBeHidden();

    await page
      .getByLabel(translations.settings.labels.image)
      .fill('https://cdn.freecodecamp.org/universal/favicons/favicon-32x32.pn');
    await expect(page.getByTestId('image-validation')).toContainText(
      'URL must link directly to an image file'
    );
  });

  test('The description has validation', async ({ page }) => {
    await page
      .getByLabel(translations.settings.labels.description)
      .fill(
        'This is the longest description you will ever see in your entire life, you will never see such a long description again. This is the longest description in existence. Nothing will ever come close to be being so long again in the entire history of the world. I only have 30 characters left.'
      );
    await expect(page.getByTestId('description-validation')).toContainText(
      'There is a maximum limit of 288 characters, you have 0 left'
    );
    await page
      .getByLabel(translations.settings.labels.description)
      .fill('My description');
    await expect(page.getByTestId('description-validation')).toBeHidden();
  });

  test('It should be possible to delete a portfolio item', async ({ page }) => {
    await page
      .getByLabel(translations.settings.labels.title)
      .fill('My portfolio');
    await page
      .getByLabel(translations.settings.labels.url)
      .fill('https://my-portfolio.com');
    await page
      .getByLabel(translations.settings.labels.image)
      .fill('https://my-portfolio.com/image.png');
    await page
      .getByLabel(translations.settings.labels.description)
      .fill('My description');

    await page
      .getByRole('button', { name: 'Remove this portfolio item' })
      .click();

    await expect(page.getByTestId('portfolio-items')).toBeHidden();
  });

  test('It should be possible to add a portfolio item', async ({ page }) => {
    await expect(
      page.getByRole('button', { name: 'Add a new portfolio Item' })
    ).toBeDisabled();

    await page
      .getByLabel(translations.settings.labels.title)
      .fill('My portfolio');
    await page
      .getByLabel(translations.settings.labels.url)
      .fill('https://my-portfolio.com');
    await page
      .getByLabel(translations.settings.labels.image)
      .fill('https://my-portfolio.com/image.png');
    await page
      .getByLabel(translations.settings.labels.description)
      .fill('My description');

    await page
      .getByRole('button', { name: 'Save this portfolio item' })
      .click();
    await expect(page.getByRole('alert').first()).toContainText(
      /We have updated your portfolio/
    );
  });

  // TODO: Add test for viewing portfolio item
});
