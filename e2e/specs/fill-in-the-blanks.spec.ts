import { test, expect } from '@playwright/test';

test.describe('Fill in the blanks challenge', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(
      '/learn/a2-english-for-developers/learn-greetings-in-your-first-day-at-the-office/task-46'
    );
  });

  test('should display feedback if there is an incorrect answer', async ({
    page
  }) => {
    const blanks = page.getByRole('textbox', { name: 'blank' });

    await blanks.first().fill('this'); // Answer the first blank correctly
    await blanks.last().fill('bar'); // Answer the second blank incorrectly
    await page.getByRole('button', { name: 'Check your answer' }).click();

    await expect(
      page.getByText("Sorry, that's not the right answer. Give it another try?")
    ).toBeVisible();

    // Once a blank is answered correctly, it is no longer rendered as an input field
    await expect(blanks).toHaveCount(1);

    await expect(blanks.last()).toHaveAttribute('aria-invalid', 'true');
  });

  test('should not display feedback if all blanks are answered correctly', async ({
    page
  }) => {
    const blanks = page.getByRole('textbox', { name: 'blank' });

    await blanks.first().fill('this');
    await blanks.last().fill('those');
    await page.getByRole('button', { name: 'Check your answer' }).click();

    // Close the completion modal
    await page
      .getByRole('dialog')
      .getByRole('button', { name: 'Close' })
      .click();

    await expect(
      page.getByText("Sorry, that's not the right answer. Give it another try?")
    ).toBeHidden();

    // There aren't any blanks as all the inputs are rendered as text
    await expect(blanks).toBeHidden();
  });
});
