import { test, expect } from '@playwright/test';

import translations from '../../client/i18n/locales/english/translations.json';

test.describe('When it renders', () => {
  test.beforeEach(async ({ page }) => {
    const urlWithProjectPreview =
      '/learn/2022/responsive-web-design/learn-html-by-building-a-cat-photo-app/step-1';
    await page.goto(urlWithProjectPreview);
  });

  test('it should contain a non-empty preview frame', async ({ page }) => {
    const dialog = page.getByRole('dialog', {
      name: translations.learn['project-preview-title']
    });
    await expect(dialog).toBeVisible();
    const previewFrame = dialog.frameLocator('#fcc-project-preview-frame');
    await expect(
      // This is a part of the Cat Photo App that we expect to see. Essentially,
      // it's a proxy for "not empty"
      previewFrame.getByRole('heading', { name: 'Cat Photos' })
    ).toBeVisible();
  });

  test('it can be closed by the Start Coding! button', async ({ page }) => {
    const dialog = page.getByRole('dialog', {
      name: translations.learn['project-preview-title']
    });
    await expect(dialog).toBeVisible();
    await expect(dialog.getByTitle('CatPhotoApp preview')).toBeVisible();

    await page.getByRole('button', { name: 'Start Coding!' }).click();

    await expect(dialog).not.toBeVisible();
  });

  test('it can be closed by the close button', async ({ page }) => {
    const dialog = page.getByRole('dialog', {
      name: translations.learn['project-preview-title']
    });

    await expect(dialog).toBeVisible();

    await page
      .getByRole('button', { name: translations.buttons.close })
      .click();

    await expect(dialog).not.toBeVisible();
  });
});

test.describe('It should NOT appear', () => {
  test('on the second step of a project', async ({ page }) => {
    await page.goto(
      '/learn/2022/responsive-web-design/learn-html-by-building-a-cat-photo-app/step-2'
    );
    const dialog = page.getByRole('dialog', {
      name: translations.learn['project-preview-title']
    });
    await expect(dialog).not.toBeVisible();
  });

  test('on first step of a project without a preview', async ({ page }) => {
    await page.goto(
      '/learn/javascript-algorithms-and-data-structures-v8/learn-introductory-javascript-by-building-a-pyramid-generator/step-1'
    );
    const dialog = page.getByRole('dialog', {
      name: translations.learn['project-preview-title']
    });
    await expect(dialog).not.toBeVisible();
  });
});
