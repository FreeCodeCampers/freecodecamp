import { test, expect } from '@playwright/test';
import translations from '../../client/i18n/locales/english/translations.json';

test.describe('Test form with only solution link', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(
      'learn/front-end-development-libraries/front-end-development-libraries-projects/build-a-random-quote-machine'
    );
  });

  test('The form is visible and has only solution link input', async ({
    page
  }) => {
    // The solution form should be present and visible
    const solutionForm = page.getByTestId('form-helper-form');
    await expect(solutionForm).toBeVisible();

    // The form submit button should be disabled as the form is not filled
    const solutionFormButton = solutionForm.getByRole('button', {
      name: `${translations.learn['i-completed']}`
    });
    await expect(solutionFormButton).toBeVisible();
    await expect(solutionFormButton).toBeDisabled();

    const solutionLinkInputLabel = solutionForm.getByTestId(
      'solution-control-label'
    );
    await expect(solutionLinkInputLabel).toBeVisible();
    await expect(solutionLinkInputLabel).toHaveText(
      translations.learn['solution-link']
    );

    const solutionLinkInput = solutionForm.getByTestId('solution-form-control');
    await expect(solutionLinkInput).toBeVisible();

    const githubLinkInputLabel = solutionForm.getByTestId(
      'githubLink-control-label'
    );
    await expect(githubLinkInputLabel).not.toBeVisible();

    // The form submit button should be enabled as the form is now filled
    await solutionLinkInput.fill('test-input');
    await expect(solutionFormButton).toBeEnabled();
  });
});

test.describe('Test form with solution link and github link', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(
      'learn/quality-assurance/quality-assurance-projects/personal-library'
    );
  });

  test('The form is visible and has solution link and github link input', async ({
    page
  }) => {
    // The solution form should be present and visible
    const solutionForm = page.getByTestId('form-helper-form');
    await expect(solutionForm).toBeVisible();

    // The form submit button should be disabled as the form is not filled
    const solutionFormButton = solutionForm.getByRole('button', {
      name: `${translations.learn['i-completed']}`
    });
    await expect(solutionFormButton).toBeVisible();
    await expect(solutionFormButton).toBeDisabled();

    const solutionLinkInputLabel = solutionForm.getByTestId(
      'solution-control-label'
    );
    await expect(solutionLinkInputLabel).toBeVisible();
    await expect(solutionLinkInputLabel).toHaveText(
      translations.learn['solution-link']
    );

    const solutionLinkInput = solutionForm.getByTestId('solution-form-control');
    await expect(solutionLinkInput).toBeVisible();

    const githubLinkInputLabel = solutionForm.getByTestId(
      'githubLink-control-label'
    );
    await expect(githubLinkInputLabel).toBeVisible();
    await expect(githubLinkInputLabel).toHaveText(
      translations.learn['source-code-link']
    );

    const githubLinkInput = solutionForm.getByTestId('githubLink-form-control');
    await expect(githubLinkInput).toBeVisible();

    // The form submit button should be enabled as the form is now filled
    await solutionLinkInput.fill('test-input');
    await expect(solutionFormButton).toBeEnabled();

    // The form submit button should be enabled as the GitHub link is now filled
    await solutionLinkInput.fill('');
    await expect(solutionFormButton).toBeDisabled();
    await githubLinkInput.fill('test-input');
    await expect(solutionFormButton).toBeEnabled();
  });
});
