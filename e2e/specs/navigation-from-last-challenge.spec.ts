import { test } from '@playwright/test';
import solution from '../fixtures/build-a-personal-portfolio-webpage.json';
import { clearEditor, focusEditor } from '../utils/editor';
import { isMacOS } from '../utils/user-agent';

// middle of block
const challenge1 = {
  url: '/learn/front-end-development-libraries/front-end-development-libraries-projects/build-a-javascript-calculator',
  nextUrl:
    '/learn/front-end-development-libraries/front-end-development-libraries-projects/build-a-25--5-clock'
};

// last in superblock
const challenge2 = {
  url: '/learn/college-algebra-with-python/build-a-data-graph-explorer-project/build-a-data-graph-explorer',
  nextUrl:
    '/learn/college-algebra-with-python/#build-a-data-graph-explorer-project'
};

const rwdChallenge = {
  url: '/learn/2022/responsive-web-design/build-a-personal-portfolio-webpage-project/build-a-personal-portfolio-webpage',
  nextUrl:
    '/learn/2022/responsive-web-design/#build-a-personal-portfolio-webpage-project'
};
test.describe('Navigation from the middle or end (URL solution)', () => {
  test('In the middle of a block should take you to the next challenge', async ({
    page
  }) => {
    await page.goto(challenge1.url);
    await page
      .getByRole('textbox', { name: 'solution' })
      .fill('https://example.com');
    await page.keyboard.press('Enter');
    await page
      .getByRole('button', { name: 'Submit and go to next challenge' })
      .click();
    await page.waitForURL(challenge1.nextUrl);
  });

  test('at the end of a superblock should take you to the superblock page with the current block hash', async ({
    page
  }) => {
    await page.goto(challenge2.url);
    await page
      .getByRole('textbox', { name: 'solution' })
      .fill('https://example.com');
    await page.keyboard.press('Enter');
    await page
      .getByRole('button', { name: 'Submit and go to next challenge' })
      .click();
    await page.waitForURL(challenge2.nextUrl);
  });
});

test.describe('Should take you to the next superblock (with editor solution)', () => {
  test.skip(
    ({ browserName }) => browserName !== 'chromium',
    'Only chromium allows us to use the clipboard API.'
  );
  test('at the end of a superblock should take you to the superblock page with the current block hash', async ({
    page,
    isMobile,
    browserName,
    context
  }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto(rwdChallenge.url);
    await focusEditor({ page, isMobile });
    await clearEditor({ page, browserName });

    await page.evaluate(
      async solution => await navigator.clipboard.writeText(solution.content),
      solution
    );

    if (isMacOS) {
      await page.keyboard.press('Meta+v');
    } else {
      await page.keyboard.press('Control+v');
    }

    await page.keyboard.press('Control+Enter');

    await page
      .getByRole('button', { name: 'Submit and go to next challenge' })
      .click();
    await page.waitForURL(rwdChallenge.nextUrl);
  });
});
