import { execSync } from 'child_process';
import { test, expect } from '@playwright/test';

test.describe('Before completing the project', () => {
  test.use({ storageState: 'e2e/playwright/.auth/development-user.json' });

  test.beforeEach(() => {
    execSync('node ./tools/scripts/seed/seed-demo-user --set-true isDonating');
  });

  test('should not allow you to submit a URL', async ({ page }) => {
    await page.goto(
      '/learn/relational-database/build-a-celestial-bodies-database-project/build-a-celestial-bodies-database'
    );
    await page
      .getByRole('textbox', { name: 'solution' })
      .fill('https://example.com');
    await page.getByRole('textbox', { name: 'solution' }).press('Enter');
    await expect(page.getByTestId('flash-message')).toContainText(
      /You must complete the project first./
    );
  });
});

test.describe('After completing the project', () => {
  test.beforeAll(() => {
    execSync('node ./tools/scripts/seed/seed-demo-user --certified-user');
  });

  test('should allow you to submit a URL', async ({ page }) => {
    await page.goto(
      '/learn/relational-database/build-a-celestial-bodies-database-project/build-a-celestial-bodies-database'
    );
    await page
      .getByRole('textbox', { name: 'solution' })
      .fill('https://example.com');
    await page.getByRole('textbox', { name: 'solution' }).press('Enter');

    await expect(page.getByRole('dialog')).toBeVisible();
    await expect(page.getByRole('dialog')).toContainText(
      'Submit and go to next challenge'
    );
  });
});
