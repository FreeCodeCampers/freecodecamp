import { test, expect } from '@playwright/test';

test.describe('Exam results modal', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/settings');
  });

  test('should display the content correctly', async ({ page }) => {
    const viewButton = page.getByRole('button', {
      name: 'View Results for Foundational C# with Microsoft Certification Exam'
    });

    await expect(viewButton).toBeVisible();
    await viewButton.click();

    await expect(
      page.getByRole('dialog', {
        name: 'Results for Foundational C# with Microsoft Certification Exam'
      })
    ).toBeVisible();
    await expect(page.getByText('Number of questions: 80')).toBeVisible();
    await expect(page.getByText('Correct answers: 70')).toBeVisible();
    await expect(page.getByText('Percent correct: 87.5%')).toBeVisible();
    await expect(page.getByText('Time: 36:35')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Close' })).toHaveCount(2);
  });

  test('should close when the x button is clicked', async ({ page }) => {
    const viewButton = page.getByRole('button', {
      name: 'View Results for Foundational C# with Microsoft Certification Exam'
    });
    await expect(viewButton).toBeVisible();
    await viewButton.click();

    await expect(
      page.getByRole('dialog', {
        name: 'Results for Foundational C# with Microsoft Certification Exam'
      })
    ).toBeVisible();

    // There are 2 close buttons on the page, and the x button is the first
    const closeButton = page.getByRole('button', { name: 'Close' }).first();
    await closeButton.click();

    await expect(page.getByRole('dialog')).toHaveCount(0);
  });

  test('should close when the close button is clicked', async ({ page }) => {
    const viewButton = page.getByRole('button', {
      name: 'View Results for Foundational C# with Microsoft Certification Exam'
    });
    await expect(viewButton).toBeVisible();
    await viewButton.click();

    await expect(
      page.getByRole('dialog', {
        name: 'Results for Foundational C# with Microsoft Certification Exam'
      })
    ).toBeVisible();

    // There are 2 close buttons on the page, and the close button is the last
    const closeButton = page.getByRole('button', { name: 'Close' }).last();
    await closeButton.click();

    await expect(page.getByRole('dialog')).toHaveCount(0);
  });
});
