import { test, expect } from '@playwright/test';

test.describe('Certification intro page', () => {
  test('Should render and toggle correctly', async ({ page }) => {
    const title = page.getByRole('button', {
      name: 'Learn HTML by Building a Cat Photo App'
    });

    await page.goto('/learn/2022/responsive-web-design');

    await expect(page).toHaveTitle(
      'Responsive Web Design Certification | freeCodeCamp.org'
    );

    await expect(
      page.getByText(
        "this Responsive Web Design Certification, you'll learn the languages that developers use to build webpages"
      )
    ).toBeVisible();

    await expect(
      page.getByText(
        'HTML tags give a webpage its structure. You can use HTML tags to add photos, buttons, and other elements to your webpage.'
      )
    ).toBeVisible();

    await expect(
      page.getByText(
        'CSS tells the browser how to display your webpage. You can use CSS to set the color, font, size, and other aspects of HTML elements.'
      )
    ).not.toBeVisible();

    await title.click();
    await expect(
      page.getByText(
        'HTML tags give a webpage its structure. You can use HTML tags to add photos, buttons, and other elements to your webpage.'
      )
    ).not.toBeVisible();

    await title.click();
    await expect(
      page.getByText(
        'HTML tags give a webpage its structure. You can use HTML tags to add photos, buttons, and other elements to your webpage.'
      )
    ).toBeVisible();
  });
});
