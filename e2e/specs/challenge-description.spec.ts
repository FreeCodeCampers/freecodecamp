import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto(
    '/learn/foundational-c-sharp-with-microsoft/write-your-first-code-using-c-sharp/trophy-write-your-first-code-using-c-sharp'
  );
});

test.describe('Challenge Description Component Tests', () => {
  test('should display the content correctly', async ({ page }) => {
    const challengeDescription = page.getByTestId('challenge-description');
    await expect(challengeDescription).toBeVisible();
    await expect(challengeDescription).toHaveText(/ */);

    const link = page.getByRole('link', { name: 'your achievements page' });
    await expect(link).toHaveAttribute(
      'href',
      'https://learn.microsoft.com/users/me/achievements#trophies-section'
    );
    await expect(link).toHaveAttribute('target', '_blank');
    await expect(link).toHaveAttribute('rel', 'noreferrer');
  });
});
