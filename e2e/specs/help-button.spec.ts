import { test, expect } from '@playwright/test';

test.describe('help-button tests for a page with three links (hint, help and video)', () => {
  test('should render the button, menu and the three links when video is available', async ({
    page
  }) => {
    // visit the page with the video link
    await page.goto(
      '/learn/responsive-web-design/basic-html-and-html5/say-hello-to-html-elements'
    );
    //The button is visible
    const helpButton = page.getByTestId('get-help-dropdown');
    await expect(helpButton).toBeVisible();
    //The button is clickable
    await helpButton.click();
    //The menu items are visible
    await expect(page.getByTestId('get-hint')).toBeVisible();
    await expect(page.getByTestId('ask-for-help')).toBeVisible();
    await expect(page.getByTestId('watch-a-video')).toBeVisible();
  });
});

test.describe('help-button tests for a page with two links when video is not available', () => {
  test('should render the button, menu and the two links when video is not available', async ({
    page
  }) => {
    // visit the page without the video link
    await page.goto(
      '/learn/front-end-development-libraries/bootstrap/apply-the-default-bootstrap-button-style'
    );
    //The button is visible
    const helpButton = page.getByTestId('get-help-dropdown');
    await expect(helpButton).toBeVisible();
    //The button is clickable
    await helpButton.click();
    //The menu items are visible
    await expect(page.getByTestId('get-hint')).toBeVisible();
    await expect(page.getByTestId('ask-for-help')).toBeVisible();
    //The video link is hidden
    await expect(page.getByTestId('watch-a-video')).toBeHidden();
  });
});

test.describe('help-button tests for a page with a reset and help button', () => {
  test('should not be present before the user checks their code three times', async ({
    page
  }) => {
    await page.goto(
      'learn/2022/responsive-web-design/learn-html-by-building-a-cat-photo-app/step-8'
    );
    await expect(page.getByRole('button', { name: 'Help' })).toBeHidden();
  });

  test('should be present after the user checks their code three times', async ({
    page
  }) => {
    await page.goto(
      'learn/2022/responsive-web-design/learn-html-by-building-a-cat-photo-app/step-3'
    );
    const checkButton = page.getByTestId('lowerJaw-check-button');
    await checkButton.click();
    await checkButton.click();
    await checkButton.click();
    const helpButton = page.getByRole('button', { name: 'Help' });
    await expect(helpButton).toBeVisible();
    const helpIconGroup = helpButton.getByRole('group', {
      includeHidden: false
    });
    await expect(helpIconGroup).toBeHidden();
  });
});
