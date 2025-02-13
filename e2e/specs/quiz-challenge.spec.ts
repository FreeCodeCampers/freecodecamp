import { test, expect } from '@playwright/test';
import { allowTrailingSlash } from '../utils/url';

test.describe('Quiz challenge', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(
      '/learn/full-stack-developer/quiz-basic-html/quiz-basic-html'
    );
  });

  test('should display a list of unanswered questions if user has not answered all questions', async ({
    page
  }) => {
    // Wait for the page content to render
    await expect(page.getByRole('radiogroup')).toHaveCount(20);

    for (let i = 0; i < 15; i++) {
      const radioGroups = await page.getByRole('radiogroup').all();
      await radioGroups[i].getByRole('radio').first().click();
    }

    await page.getByRole('button', { name: 'Finish the quiz' }).click();

    await expect(
      page.getByText(
        'The following questions are unanswered: 16, 17, 18, 19, 20. You must answer all questions.'
      )
    ).toBeVisible();
  });

  test('should show a confirm finish modal when user clicks the finish button, and disable the quiz once they have confirmed', async ({
    page
  }) => {
    // Wait for the page content to render
    await expect(page.getByRole('radiogroup')).toHaveCount(20);

    const radioGroups = await page.getByRole('radiogroup').all();

    for (const radioGroup of radioGroups) {
      await radioGroup.getByRole('radio').first().click();
    }

    await page.getByRole('button', { name: 'Finish the quiz' }).click();
    await expect(
      page.getByRole('dialog', { name: 'Finish Quiz' })
    ).toBeVisible();

    await page.getByRole('button', { name: 'Yes, I am finished' }).click();
    await expect(
      page.getByRole('dialog', { name: 'Finish Quiz' })
    ).toBeHidden();

    const radios = await page.getByRole('radio').all();

    for (const radio of radios) {
      await expect(radio).toBeDisabled();
    }
  });

  test('should show a confirm exit modal when user clicks on the exit button', async ({
    page
  }) => {
    // Wait for the page content to render
    await expect(page.getByRole('radiogroup')).toHaveCount(20);

    await page.getByRole('button', { name: 'Exit the quiz' }).click();

    // The navigation should be blocked, the user should stay on the same page
    await expect(page).toHaveURL(
      allowTrailingSlash(
        '/learn/full-stack-developer/quiz-basic-html/quiz-basic-html'
      )
    );

    await expect(page.getByRole('dialog')).toBeVisible();
    await expect(page.getByRole('dialog', { name: 'Exit Quiz' })).toBeVisible();

    await page
      .getByRole('button', { name: 'No, I would like to continue the quiz' })
      .click();
    await expect(page.getByRole('dialog', { name: 'Exit Quiz' })).toBeHidden();

    await page.getByRole('button', { name: 'Exit the quiz' }).click();
    await expect(page.getByRole('dialog', { name: 'Exit Quiz' })).toBeVisible();
    await page
      .getByRole('button', { name: 'Yes, I want to leave the quiz' })
      .click();

    await page.waitForURL('/learn/full-stack-developer/#quiz-basic-html');
    await expect(
      page.getByRole('heading', { level: 3, name: 'Basic HTML Quiz' })
    ).toBeVisible();
  });

  test('should show a confirm exit modal when user clicks on a link', async ({
    page
  }) => {
    // Wait for the page content to render
    await expect(page.getByRole('radiogroup')).toHaveCount(20);

    await page.getByRole('link', { name: 'Basic HTML Quiz' }).click();

    await expect(page.getByRole('dialog', { name: 'Exit Quiz' })).toBeVisible();
    await page
      .getByRole('button', { name: 'Yes, I want to leave the quiz' })
      .click();

    await page.waitForURL('/learn/full-stack-developer/#quiz-basic-html');
    await expect(
      page.getByRole('heading', { level: 3, name: 'Basic HTML Quiz' })
    ).toBeVisible();
  });

  test('should show a confirm exit modal when user closes the page', async ({
    page
  }) => {
    // Wait for the page content to render
    await expect(page.getByRole('radiogroup')).toHaveCount(20);

    page.on('dialog', async dialog => {
      expect(dialog.type()).toBe('beforeunload');
      await dialog.dismiss();
    });

    await page.close({ runBeforeUnload: true });
  });
});
