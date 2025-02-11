import { test, expect, type Page } from '@playwright/test';

import translations from '../../client/i18n/locales/english/translations.json';
import { authedRequest } from '../utils/request';
import { getEditors } from '../utils/editor';
import { alertToBeVisible } from '../utils/alerts';

const links = {
  basicJS1:
    '/learn/javascript-algorithms-and-data-structures/basic-javascript/comment-your-javascript-code',
  basicJS2:
    '/learn/javascript-algorithms-and-data-structures/basic-javascript/declare-javascript-variables',
  frontEnd1:
    '/learn/front-end-development-libraries/front-end-development-libraries-projects/build-a-random-quote-machine',
  frontEnd2:
    '/learn/front-end-development-libraries/front-end-development-libraries-projects/build-a-markdown-previewer',
  backEnd1:
    '/learn/back-end-development-and-apis/back-end-development-and-apis-projects/timestamp-microservice',
  backEnd2:
    'learn/back-end-development-and-apis/back-end-development-and-apis-projects/request-header-parser-microservice',
  video1:
    '/learn/python-for-everybody/python-for-everybody/introduction-why-program',
  video2:
    '/learn/python-for-everybody/python-for-everybody/introduction-hardware-architecture'
};

const titles = {
  basicJS1: /Comment Your JavaScript Code/,
  basicJS2: /Declare JavaScript Variables/,
  frontEnd2: /Build a Markdown Previewer/,
  backEnd2: /Request Header Parser Microservice/,
  video2: /Introduction: Hardware Architecture/
};
type PageId = keyof typeof titles;

// The hotkeys are attached to specific elements, so we need to wait for the
// wrapper to be focused before we can test the hotkeys.
const waitUntilListening = async (page: Page) =>
  await expect(page.locator('#editor-layout')).toBeFocused();

// This is a hack to work around the fact that the page isn't always hydrated
// with the new content when the URL changes.
const waitUntilHydrated = async (page: Page, pageId: PageId) => {
  await page.waitForURL(links[pageId]);
  await expect(page).toHaveTitle(titles[pageId]);
  await waitUntilListening(page);
};

test.beforeAll(async ({ request }) => {
  await authedRequest({
    request,
    endpoint: 'update-my-keyboard-shortcuts',
    method: 'put',
    data: {
      keyboardShortcuts: false
    }
  });
});

test.beforeEach(async ({ page }) => {
  await page.goto('/settings');
  const keyboardShortcutGroup = page.getByRole('group', {
    name: translations.settings.labels['keyboard-shortcuts']
  });
  await keyboardShortcutGroup
    .getByRole('button', { name: translations.buttons.on, exact: true })
    .click();
  // wait for the client to register the change:
  await alertToBeVisible(page, translations.flash['keyboard-shortcut-updated']);
});

test.afterEach(
  async ({ request }) =>
    await authedRequest({
      request,
      method: 'put',
      endpoint: 'update-my-keyboard-shortcuts',
      data: {
        keyboardShortcuts: false
      }
    })
);

// TODO: handle keyboard shortcuts on mobile
test.skip(({ isMobile }) => isMobile, 'Only test on desktop');

test('User can use shortcuts in and around the editor', async ({ page }) => {
  await page.goto(links.basicJS1);

  await expect(getEditors(page)).toBeFocused();
  await getEditors(page).press('Escape');
  await expect(getEditors(page)).not.toBeFocused();

  await page.keyboard.press('n');
  await waitUntilHydrated(page, 'basicJS2');

  await page.keyboard.press('p');
  await waitUntilHydrated(page, 'basicJS1');

  await page.keyboard.press('e');
  await expect(getEditors(page)).toBeFocused();

  await getEditors(page).press('Escape');
  await page.keyboard.press('r');
  await expect(page.locator('.instructions-panel')).toBeFocused();
});

test('User can use shortcuts to navigate between frontend projects', async ({
  page
}) => {
  await page.goto(links.frontEnd1);
  await waitUntilListening(page);
  await page.keyboard.press('Escape');

  await page.keyboard.press('n');
  await waitUntilHydrated(page, 'frontEnd2');
  await page.keyboard.press('p');
  await page.waitForURL(links.frontEnd1);
});

test('User can use shortcuts to navigate between backend projects', async ({
  page
}) => {
  await page.goto(links.backEnd1);
  await waitUntilListening(page);
  await page.keyboard.press('Escape');

  await page.keyboard.press('n');
  await waitUntilHydrated(page, 'backEnd2');
  await page.keyboard.press('p');
  await page.waitForURL(links.backEnd1);
});

test('User can use shortcuts to navigate between video-based challenges', async ({
  page
}) => {
  await page.goto(links.video1);
  await waitUntilListening(page);
  await page.keyboard.press('Escape');

  await page.keyboard.press('n');
  await waitUntilHydrated(page, 'video2');
  await page.keyboard.press('p');
  await page.waitForURL(links.video1);
});
