import { test, expect } from '@playwright/test';

test.describe('Blocked Page', () => {
  test('should render correctly', async ({ page }) => {
    await page.goto('/blocked');
    await expect(page).toHaveTitle('Access Denied | freeCodeCamp.org');

    const mainHeading = page.getByTestId('main-heading');
    await expect(mainHeading).toHaveText("We can't log you in.");

    const blockedBodyText = page.getByTestId('blocked-body-text');
    await expect(blockedBodyText).toHaveText(
      "United States export control and economic sanctions rules don't allow us to log in visitors from your region. " +
        'Sorry about this. The situation may change in the future.If you want, you can learn more about these restrictions.'
    );

    const learnMoreLink = page.getByTestId('learn-more-link');
    await expect(learnMoreLink).toHaveAttribute(
      'href',
      'https://www.okta.com/blocked'
    );
  });
});
