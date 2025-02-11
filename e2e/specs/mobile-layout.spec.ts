import { test, expect } from '@playwright/test';

import translations from '../../client/i18n/locales/english/translations.json';

test.describe('Classic challenge - 5 tabs mobile layout component', () => {
  test.skip(
    ({ isMobile }) => isMobile === false,
    'Skip testing on desktop as this component is only used for mobile'
  );

  test('The page has mobile layout with "Instruction", "Code", "Console", "Preview", "Portal Preview" tabs', async ({
    page
  }) => {
    await page.goto(
      'learn/2022/responsive-web-design/build-a-survey-form-project/build-a-survey-form'
    );

    const tabs = page.getByRole('tablist');
    await expect(tabs).toBeVisible();

    const instructions = page.getByRole('tab', {
      name: translations.learn['editor-tabs'].instructions
    });
    await expect(instructions).toBeVisible();
    const code = page.getByRole('tab', {
      name: translations.learn['editor-tabs'].code
    });
    await expect(code).toBeVisible();
    const console = page.getByRole('tab', {
      name: translations.learn['editor-tabs'].console
    });
    await expect(console).toBeVisible();
    const preview = page.getByRole('tab', {
      name: translations.learn['editor-tabs'].preview
    });
    await expect(preview).toBeVisible();
    const portalButton = page.getByRole('button', {
      name: translations.aria['move-preview-to-new-window']
    });
    await expect(portalButton).toBeVisible();

    const help = page.getByRole('button', { name: translations.buttons.help });
    await expect(help).toBeVisible();
    const save = page.getByRole('button', { name: translations.buttons.save });
    await expect(save).toBeVisible();
    const run = page.getByRole('button', { name: translations.buttons.run });
    await expect(run).toBeVisible();
  });
});

test.describe('Classic challenge - 3 tabs mobile layout component', () => {
  test.skip(
    ({ isMobile }) => isMobile === false,
    'Skip testing on desktop as this component is only used for mobile'
  );

  test('The page has mobile layout with "Instruction", "Code", "Console" tabs', async ({
    page
  }) => {
    await page.goto(
      'learn/javascript-algorithms-and-data-structures/basic-javascript/use-recursion-to-create-a-range-of-numbers'
    );

    const tabs = page.getByRole('tablist');
    await expect(tabs).toBeVisible();

    const instructions = page.getByRole('tab', {
      name: translations.learn['editor-tabs'].instructions
    });
    await expect(instructions).toBeVisible();
    const code = page.getByRole('tab', {
      name: translations.learn['editor-tabs'].code
    });
    await expect(code).toBeVisible();
    const console = page.getByRole('tab', {
      name: translations.learn['editor-tabs'].console
    });
    await expect(console).toBeVisible();

    const help = page.getByRole('button', { name: translations.buttons.help });
    await expect(help).toBeVisible();
    const reset = page.getByRole('button', {
      name: translations.buttons.reset
    });
    await expect(reset).toBeVisible();
    const run = page.getByRole('button', { name: translations.buttons.run });
    await expect(run).toBeVisible();
  });
});
