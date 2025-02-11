import { expect, test } from '@playwright/test';

import translations from '../../client/i18n/locales/english/translations.json';

const notesButtonLabel = translations.learn['editor-tabs'].notes;

test('User can see notes', async ({ page, isMobile }) => {
  const noteContent = 'This is a test note';

  await page.route(
    '**/learn/2022/responsive-web-design/learn-html-by-building-a-cat-photo-app/step-30/page-data.json',
    async route => {
      const response = await route.fetch();
      const json = await response.json();

      json.result.data.challengeNode.challenge.notes = noteContent;

      await route.fulfill({ response, json });
    }
  );

  await page.goto(
    'learn/2022/responsive-web-design/learn-html-by-building-a-cat-photo-app/step-30'
  );
  if (isMobile) {
    await page.getByRole('tab', { name: notesButtonLabel }).click();
  } else {
    await page.getByRole('button', { name: notesButtonLabel }).click();
  }
  await expect(page.getByText(noteContent)).toBeVisible();
});
