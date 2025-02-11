import { execSync } from 'child_process';
import { test, expect } from '@playwright/test';

test.describe('Donate page', () => {
  test.use({ storageState: 'e2e/playwright/.auth/development-user.json' });

  test.beforeEach(async ({ page }) => {
    execSync('node ./tools/scripts/seed/seed-demo-user --set-true isDonating');
    await page.goto('/donate');
  });

  test.afterAll(() => {
    execSync('node ./tools/scripts/seed/seed-demo-user --certified-user');
  });

  test('should render the donate page correctly', async ({ page }) => {
    await expect(
      page.getByText('Thank you for your continued support')
    ).toBeVisible();

    await expect(
      page.getByText(
        'Your contributions are crucial in creating resources that empower millions of people to learn new skills and support their families.'
      )
    ).toBeVisible();

    await expect(
      page.getByText(
        'If you want to support our charity further, please consider making a one-time donation, sending us a check, or learning about other ways you could support our charity.'
      )
    ).toBeVisible();

    await expect(
      page.getByRole('link', { name: 'making a one-time donation' })
    ).toHaveAttribute(
      'href',
      'https://www.freecodecamp.org/news/how-to-donate-to-free-code-camp/#how-can-i-make-a-one-time-donation'
    );
  });

  test('The menu should have a supporters link', async ({ page }) => {
    const menuButton = page.getByTestId('header-menu-button');
    const menu = page.getByTestId('header-menu');

    await expect(menuButton).toBeVisible();
    await menuButton.click();

    await expect(menu).toBeVisible();

    await expect(page.getByRole('link', { name: 'Supporters' })).toBeVisible();
  });

  test('The Avatar should have a special border for donors', async ({
    page
  }) => {
    const container = page.locator('.avatar-container');
    await expect(container).toHaveClass('avatar-container gold-border');
  });
});
