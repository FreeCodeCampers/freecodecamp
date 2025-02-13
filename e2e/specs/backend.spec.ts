import { test, expect } from '@playwright/test';

const locations = {
  index:
    'learn/back-end-development-and-apis/managing-packages-with-npm/' +
    'how-to-use-package-json-the-core-of-any-node-js-project-or-npm-package'
};

const unhandledErrorMessage = 'Something is not quite right';
const runningOutput = '// running tests';
const finishedOutput = '// tests completed';

test.describe('Backend challenge', () => {
  test('renders', async ({ page }) => {
    await page.goto(locations.index);
    await expect(page).toHaveTitle(
      'Managing Packages with NPM - How to Use package.json, the Core of Any Node.js Project or npm Package | Learn | freeCodeCamp.org'
    );
  });

  test('does not generate unhandled errors on submission', async ({ page }) => {
    await page.goto(locations.index);
    await page.fill('input[name="solution"]', 'https://example.com');
    await page.keyboard.press('Enter');

    await expect(page.getByText(runningOutput)).toContainText(finishedOutput);

    await expect(page.getByText(unhandledErrorMessage)).not.toBeVisible();
  });
});
