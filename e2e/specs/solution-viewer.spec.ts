import { test, expect } from '@playwright/test';

test.describe('Solution Viewer component', () => {
  test('renders the modal correctly', async ({ page }) => {
    await page.goto(
      '/certification/certifieduser/javascript-algorithms-and-data-structures'
    );

    await page.getByRole('button', { name: /view/i }).first().click();

    const projectSolutionViewerModal = page.getByRole('dialog', {
      name: 'Solution for'
    });
    // The modal should show the solution title...
    await expect(projectSolutionViewerModal).toBeVisible();
    // ...and relevant code file/s
    await expect(page.getByText(/js/i)).toBeVisible();
    await expect(page.locator('pre').first()).toBeVisible();

    const closeButtons = await page
      .getByRole('button', { name: 'Close' })
      .all();

    const topRightCloseButton = closeButtons[0];
    await topRightCloseButton.click();
    await expect(projectSolutionViewerModal).toBeHidden();

    await page.getByRole('button', { name: 'View' }).first().click();
    const bottomRightCloseButton = closeButtons[1];
    await bottomRightCloseButton.click();
    await expect(projectSolutionViewerModal).toBeHidden();
  });

  test('renders external project links correctly', async ({ page }) => {
    await page.goto(
      '/certification/certifieduser/front-end-development-libraries'
    );

    const projectLink = page.getByRole('link', { name: 'View' }).first();
    const browserContext = page.context();

    const [newPage] = await Promise.all([
      browserContext.waitForEvent('page'),
      projectLink.click()
    ]);

    await newPage.waitForLoadState();

    await expect(newPage).toHaveURL(/^https:\/\/codepen\.io/);

    await newPage.close();
  });

  test('render projects with multiple solutions correctly', async ({
    page
  }) => {
    await page.goto('/certification/certifieduser/quality-assurance-v7');

    const dropdownButton = page.getByRole('button', { name: 'View' }).first();
    await dropdownButton.click();

    await expect(page.getByRole('menu')).toBeVisible();

    const sourceLink = page.getByRole('menuitem', { name: /source/i }).first();

    const browserContext = page.context();
    const [newPage] = await Promise.all([
      browserContext.waitForEvent('page'),
      sourceLink.click()
    ]);

    await newPage.waitForLoadState();

    await newPage.close();
  });
});
