import { test, expect } from '@playwright/test';
import translations from '../../client/i18n/locales/english/translations.json';

test.beforeEach(async ({ page }) => {
  await page.goto(
    '/learn/foundational-c-sharp-with-microsoft/write-your-first-code-using-c-sharp/write-your-first-c-sharp-code'
  );
});

test.describe('Help Modal component', () => {
  test('renders the modal correctly', async ({ page }) => {
    await page
      .getByRole('button', { name: translations.buttons['ask-for-help'] })
      .click();

    await expect(
      page.getByRole('dialog', { name: translations.buttons['ask-for-help'] })
    ).toBeVisible();
    await expect(
      page.getByText(
        `If you've already tried the Read-Search-Ask method, then you can ask for help on the freeCodeCamp forum.`
      )
    ).toBeVisible();
    await expect(
      page.getByText(
        `Before making a new post please check if your question has already been answered on the forum.`
      )
    ).toBeVisible();

    await expect(
      page.getByRole('button', { name: translations.buttons['create-post'] })
    ).toBeVisible();
    await expect(
      page.getByRole('button', { name: translations.buttons.cancel })
    ).toBeVisible();
    await expect(
      page.getByRole('button', { name: translations.buttons.close })
    ).toBeVisible();
  });

  test('should disable the submit button if the checkboxes are not checked', async ({
    page
  }) => {
    await page
      .getByRole('button', { name: translations.buttons['ask-for-help'] })
      .click();

    await page
      .getByRole('button', {
        name: translations.buttons['create-post']
      })
      .click();

    await expect(
      page.getByRole('dialog', { name: translations.buttons['ask-for-help'] })
    ).toBeVisible();

    const rsaCheckbox = page.getByRole('checkbox', {
      name: 'I have tried the Read-Search-Ask method'
    });

    const similarQuestionsCheckbox = page.getByRole('checkbox', {
      name: 'I have searched for similar questions that have already been answered on the forum'
    });

    const descriptionInput = page.getByRole('textbox', {
      name: translations['forum-help']['whats-happening']
    });

    const submitButton = page.getByRole('button', {
      name: translations.buttons['submit']
    });

    await descriptionInput.fill(
      'Example text with a 100 characters to validate if the rules applied to block users from spamming help forum are working.'
    );

    await expect(submitButton).toBeDisabled();

    await rsaCheckbox.check();
    await similarQuestionsCheckbox.uncheck();

    await expect(submitButton).toBeDisabled();

    await rsaCheckbox.uncheck();
    await similarQuestionsCheckbox.check();

    await expect(submitButton).toBeDisabled();
  });

  test('should disable the submit button if the description contains less than 50 characters', async ({
    page
  }) => {
    await page
      .getByRole('button', { name: translations.buttons['ask-for-help'] })
      .click();

    await page
      .getByRole('button', {
        name: translations.buttons['create-post']
      })
      .click();

    await expect(
      page.getByRole('dialog', { name: translations.buttons['ask-for-help'] })
    ).toBeVisible();

    const rsaCheckbox = page.getByRole('checkbox', {
      name: 'I have tried the Read-Search-Ask method'
    });

    const similarQuestionsCheckbox = page.getByRole('checkbox', {
      name: 'I have searched for similar questions that have already been answered on the forum'
    });

    const descriptionInput = page.getByRole('textbox', {
      name: translations['forum-help']['whats-happening']
    });

    const submitButton = page.getByRole('button', {
      name: translations.buttons['submit']
    });

    await rsaCheckbox.check();
    await similarQuestionsCheckbox.check();
    await descriptionInput.fill('Example text');

    await expect(submitButton).toBeDisabled();
  });

  test('should ask the user to fill in the help form and create a forum page', async ({
    context,
    page
  }) => {
    await page
      .getByRole('button', { name: translations.buttons['ask-for-help'] })
      .click();

    await page
      .getByRole('button', {
        name: translations.buttons['create-post']
      })
      .click();

    await expect(
      page.getByRole('dialog', { name: translations.buttons['ask-for-help'] })
    ).toBeVisible();

    const rsaCheckbox = page.getByRole('checkbox', {
      name: 'I have tried the Read-Search-Ask method'
    });

    const similarQuestionsCheckbox = page.getByRole('checkbox', {
      name: 'I have searched for similar questions that have already been answered on the forum'
    });

    const descriptionInput = page.getByRole('textbox', {
      name: translations['forum-help']['whats-happening']
    });

    const submitButton = page.getByRole('button', {
      name: translations.buttons['submit']
    });

    await expect(rsaCheckbox).toBeVisible();
    await expect(similarQuestionsCheckbox).toBeVisible();
    await expect(descriptionInput).toBeVisible();

    await rsaCheckbox.check();
    await similarQuestionsCheckbox.check();
    await descriptionInput.fill(
      'Example text with a 100 characters to validate if the rules applied to block users from spamming help forum are working.'
    );

    await expect(submitButton).toBeEnabled();
    await submitButton.click();

    const newPagePromise = context.waitForEvent('page');

    const newPage = await newPagePromise;
    await newPage.waitForLoadState();

    await expect(newPage).toHaveURL(/.*forum\.freecodecamp.org.*/);
  });

  test('Cancel button closes the modal', async ({ page }) => {
    await page
      .getByRole('button', { name: translations.buttons['ask-for-help'] })
      .click();

    const dialog = page.getByRole('dialog', {
      name: translations.buttons['ask-for-help']
    });

    await expect(dialog).toBeVisible();

    await page
      .getByRole('button', { name: translations.buttons.cancel })
      .click();

    await expect(dialog).not.toBeVisible();
  });

  test('Close button closes the modal', async ({ page }) => {
    await page
      .getByRole('button', { name: translations.buttons['ask-for-help'] })
      .click();

    const dialog = page.getByRole('dialog', {
      name: translations.buttons['ask-for-help']
    });

    await expect(dialog).toBeVisible();

    await page
      .getByRole('button', { name: translations.buttons.close })
      .click();

    await expect(dialog).not.toBeVisible();
  });

  test('Read-Search-Ask link', async ({ page }) => {
    await page
      .getByRole('button', { name: translations.buttons['ask-for-help'] })
      .click();
    const link = page.getByRole('link', { name: 'Read-Search-Ask' });
    await expect(link).toHaveAttribute(
      'href',
      'https://forum.freecodecamp.org/t/19514'
    );
    await expect(link).toHaveAttribute('target', '_blank');
    await expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  test('Already been answered link', async ({ page }) => {
    await page
      .getByRole('button', { name: translations.buttons['ask-for-help'] })
      .click();
    const link = page.getByRole('link', {
      name: 'already been answered on the forum'
    });
    await expect(link).toHaveAttribute(
      'href',
      'https://forum.freecodecamp.org/search?q=Write%20Your%20First%20C%23%20Code'
    );
    await expect(link).toHaveAttribute('target', '_blank');
    await expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });
});
