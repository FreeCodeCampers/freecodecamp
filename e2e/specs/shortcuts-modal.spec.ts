import { APIRequestContext, Page, expect, test } from '@playwright/test';

import translations from '../../client/i18n/locales/english/translations.json';
import { authedRequest } from '../utils/request';
import { getEditors } from '../utils/editor';

const course =
  '/learn/javascript-algorithms-and-data-structures/basic-javascript/comment-your-javascript-code';

const enableKeyboardShortcuts = async (request: APIRequestContext) => {
  const res = await authedRequest({
    request,
    endpoint: '/update-my-keyboard-shortcuts',
    method: 'put',
    data: {
      keyboardShortcuts: true
    }
  });
  expect(await res.json()).toEqual({
    message: 'flash.keyboard-shortcut-updated',
    type: 'success'
  });
};

const openModal = async (page: Page) => {
  // The editor pane is focused by default, so we need to escape or it will
  // capture the keyboard shortcuts
  await getEditors(page).press('Escape');
  await expect(page.getByTestId('hotkeys')).toBeFocused();
  await page.keyboard.press('Shift+?');
};

test.beforeEach(async ({ page, isMobile, request }) => {
  test.skip(
    isMobile,
    'Skipping on mobile as it does not have a physical keyboard'
  );

  await enableKeyboardShortcuts(request);
  await page.goto(course);
});

test('the modal can be opened with SHIFT + ? and closed with ESC', async ({
  page
}) => {
  await openModal(page);
  const dialog = page.getByRole('dialog', {
    name: translations.shortcuts.title
  });
  await expect(dialog).toBeVisible();

  for (const shortcut of Object.values(translations.shortcuts)) {
    if (shortcut === translations.shortcuts.title) continue;
    await expect(page.getByText(shortcut)).toBeVisible();
  }

  await expect(
    page.getByText(translations.settings.labels['keyboard-shortcuts'])
  ).toHaveCount(2);
  await expect(
    page.getByRole('button', { name: translations.buttons.on })
  ).toBeVisible();
  await expect(
    page.getByRole('button', { name: translations.buttons.off })
  ).toBeVisible();

  await expect(
    page.getByRole('button', { name: translations.buttons.close })
  ).toBeVisible();

  await page.keyboard.press('Escape');

  await expect(dialog).not.toBeVisible();
});

test('has a button to disable or enable keyboard shortcuts', async ({
  page
}) => {
  await openModal(page);
  const dialog = page.getByRole('dialog', {
    name: translations.shortcuts.title
  });

  await expect(dialog).toBeVisible();

  await page.getByRole('button', { name: translations.buttons.off }).click();
  await page.getByRole('button', { name: translations.buttons.close }).click();

  await expect(dialog).not.toBeVisible();

  await expect(
    page.getByText(new RegExp(translations.flash['keyboard-shortcut-updated']))
  ).toBeVisible();

  await page.keyboard.press('Shift+?');

  await expect(dialog).not.toBeVisible();
});
