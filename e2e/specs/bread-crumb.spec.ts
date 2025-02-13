import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto(
    '/learn/2022/responsive-web-design/learn-html-by-building-a-cat-photo-app/step-2'
  );
});

test.describe('Challenge Breadcrumb Tests', () => {
  test('should display correctly', async ({ page, isMobile }) => {
    const breadcrumbTest = async (testId: string) => {
      const superBlock = page.getByTestId(testId).getByRole('listitem').first();
      await expect(superBlock).toBeVisible();

      const superBlockLink = superBlock.getByRole('link', {
        name: 'Responsive Web Design'
      });
      await expect(superBlockLink).toBeVisible();
      await expect(superBlockLink).toHaveAttribute(
        'href',
        '/learn/2022/responsive-web-design'
      );

      const block = page.getByTestId(testId).getByRole('listitem').last();
      await expect(superBlock).toBeVisible();

      const blockLink = block.getByRole('link', {
        name: 'Learn HTML by Building a Cat Photo App'
      });
      await expect(blockLink).toBeVisible();
      await expect(blockLink).toHaveAttribute(
        'href',
        '/learn/2022/responsive-web-design/#learn-html-by-building-a-cat-photo-app'
      );
    };

    if (!isMobile) {
      await expect(page.getByTestId('breadcrumb-mobile')).toBeHidden();
      await breadcrumbTest('breadcrumb-desktop');

      await page.setViewportSize({
        width: 766,
        height: 1080
      });
    }

    await expect(page.getByTestId('breadcrumb-desktop')).toBeHidden();
    await breadcrumbTest('breadcrumb-mobile');
  });
});
