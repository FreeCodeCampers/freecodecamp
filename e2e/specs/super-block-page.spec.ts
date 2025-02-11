import { execSync } from 'child_process';
import { expect, test } from '@playwright/test';

test.describe('Super Block Page - Authenticated User', () => {
  test.use({ storageState: 'e2e/playwright/.auth/development-user.json' });

  test.beforeEach(() => {
    execSync('node ./tools/scripts/seed/seed-demo-user');
  });

  test.afterAll(() => {
    execSync('node ./tools/scripts/seed/seed-demo-user --certified-user');
  });

  test.describe('Super Block in List View', () => {
    test('should expand the correct block when user goes to the page from breadcrumb click', async ({
      page
    }) => {
      await page.goto(
        '/learn/javascript-algorithms-and-data-structures-v8/learn-basic-javascript-by-building-a-role-playing-game/step-2'
      );

      await page
        .getByRole('link', {
          name: 'Learn Basic JavaScript by Building a Role Playing Game'
        })
        .click();

      await page.waitForURL(
        '/learn/javascript-algorithms-and-data-structures-v8/#learn-basic-javascript-by-building-a-role-playing-game'
      );

      await expect(
        page.getByRole('button', {
          name: 'Learn Basic JavaScript by Building a Role Playing Game'
        })
      ).toHaveAttribute('aria-expanded', 'true');
    });

    test('should expand the block of the current challenge if it is saved in local storage', async ({
      page
    }) => {
      await page.addInitScript(() => {
        window.localStorage.setItem(
          'currentChallengeId',
          '660ee6e3a242da6bd579de69' // JS Pyramid Generator step 2
        );
      });

      await page.goto('/learn/javascript-algorithms-and-data-structures-v8');

      await expect(
        page.getByRole('button', {
          name: 'Learn Introductory JavaScript by Building a Pyramid Generator'
        })
      ).toHaveAttribute('aria-expanded', 'true');
    });

    test('should expand the block of the most recently viewed challenge', async ({
      page
    }) => {
      test.setTimeout(20000);

      await page.goto('/learn/javascript-algorithms-and-data-structures-v8');

      // The first block is expanded by default
      await expect(
        page.getByRole('button', {
          name: 'Learn Introductory JavaScript by Building a Pyramid Generator'
        })
      ).toHaveAttribute('aria-expanded', 'true');

      await expect(
        page.getByRole('button', {
          name: 'Learn Basic JavaScript by Building a Role Playing Game'
        })
      ).toHaveAttribute('aria-expanded', 'false');

      await page.goto(
        '/learn/javascript-algorithms-and-data-structures-v8/learn-basic-javascript-by-building-a-role-playing-game/step-2'
      );

      // Wait for the page to finish loading so that the current challenge ID can be registered.
      await expect(
        page.getByRole('heading', { name: 'Step 2', level: 1 })
      ).toBeVisible();

      // Go back to the super block page
      await page.goto('/learn/javascript-algorithms-and-data-structures-v8');

      await expect(
        page.getByRole('button', {
          name: 'Learn Introductory JavaScript by Building a Pyramid Generator'
        })
      ).toHaveAttribute('aria-expanded', 'false');

      await expect(
        page.getByRole('button', {
          name: 'Learn Basic JavaScript by Building a Role Playing Game'
        })
      ).toHaveAttribute('aria-expanded', 'true');
    });
  });

  test.describe('Super Block in Accordion View', () => {
    test('should expand the correct block when user goes to the page from breadcrumb click', async ({
      page
    }) => {
      await page.goto(`/learn/full-stack-developer/workshop-cafe-menu/step-2`);

      await page
        .getByRole('link', {
          name: 'Design a Cafe Menu'
        })
        .click();

      await page.waitForURL('/learn/full-stack-developer/#workshop-cafe-menu');

      // Chapter
      await expect(
        page.getByTestId('chapter-button').filter({ hasText: /CSS/ })
      ).toHaveAttribute('aria-expanded', 'true');

      // Module
      await expect(
        page.getByRole('button', {
          name: /Basic CSS \d+ of \d+ steps complete/
        })
      ).toHaveAttribute('aria-expanded', 'true');

      // Block
      await expect(
        page.getByRole('button', {
          name: /Workshop Design a Cafe Menu/
        })
      ).toHaveAttribute('aria-expanded', 'true');
    });

    test('should expand the block of the current challenge if it is saved in local storage', async ({
      page
    }) => {
      await page.addInitScript(() => {
        window.localStorage.setItem(
          'currentChallengeId',
          '66f6db08d55022680a3cfbc9' // What Is HTML, and What Role Does It Play on the Web?
        );
      });

      await page.goto('/learn/full-stack-developer');

      // HTML chapter
      await expect(
        page.getByTestId('chapter-button').filter({ hasText: /HTML/ })
      ).toHaveAttribute('aria-expanded', 'true');

      // Basic HTML module
      await expect(
        page.getByRole('button', {
          name: /Basic HTML \d+ of \d+ steps complete/
        })
      ).toHaveAttribute('aria-expanded', 'true');

      // What is HTML block
      await expect(
        page.getByRole('button', {
          name: /Lecture What is HTML/
        })
      ).toHaveAttribute('aria-expanded', 'true');
    });

    test('should expand the block of the most recently viewed challenge', async ({
      page
    }) => {
      test.setTimeout(20000);

      await page.goto('/learn/full-stack-developer');

      // First chapter
      await expect(
        page.getByTestId('chapter-button').filter({ hasText: /Welcome/ })
      ).toHaveAttribute('aria-expanded', 'true');

      // First module
      await expect(
        page.getByRole('button', {
          name: /Getting Started with freeCodeCamp/
        })
      ).toHaveAttribute('aria-expanded', 'true');

      // First block
      await expect(
        page.getByRole('button', {
          name: /Lecture Welcome to freeCodeCamp/
        })
      ).toHaveAttribute('aria-expanded', 'true');

      await page.goto('/learn/full-stack-developer/workshop-blog-page/step-2');

      // Wait for the page to finish loading so that the current challenge ID can be registered.
      await expect(
        page.getByRole('heading', { name: 'Step 2', level: 1 })
      ).toBeVisible();

      // Go back to the super block page
      await page.goto('/learn/full-stack-developer');

      // The entire first chapter is collapsed
      await expect(
        page.getByTestId('chapter-button').filter({ hasText: /Welcome/ })
      ).toHaveAttribute('aria-expanded', 'false');

      // HTML chapter
      await expect(
        page.getByTestId('chapter-button').filter({ hasText: /HTML/ })
      ).toHaveAttribute('aria-expanded', 'true');

      // Semantic HTML module
      await expect(
        page.getByRole('button', { name: /^Semantic HTML/ })
      ).toHaveAttribute('aria-expanded', 'true');

      // Cat Blog Page block
      await expect(
        page.getByRole('button', {
          name: 'Workshop Build a Cat Blog Page'
        })
      ).toHaveAttribute('aria-expanded', 'true');
    });
  });
});

test.describe('Super Block Page - Unauthenticated User', () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test.describe('Super Block in List View', () => {
    test('should expand the first block of the super block', async ({
      page
    }) => {
      await page.goto('/learn/javascript-algorithms-and-data-structures-v8/');

      await expect(
        page.getByRole('button', {
          name: 'Learn Introductory JavaScript by Building a Pyramid Generator'
        })
      ).toHaveAttribute('aria-expanded', 'true');

      await page.goto('/learn/a2-english-for-developers/');

      await expect(
        page.getByRole('button', {
          name: 'Learn Greetings in your First Day at the Office'
        })
      ).toHaveAttribute('aria-expanded', 'true');
    });
  });

  test.describe('Super Block in Accordion View', () => {
    test('should expand the first block of the super block', async ({
      page
    }) => {
      await page.goto('/learn/full-stack-developer');

      // First chapter
      await expect(
        page.getByTestId('chapter-button').filter({ hasText: /Welcome/ })
      ).toHaveAttribute('aria-expanded', 'true');

      // First module
      await expect(
        page.getByRole('button', {
          name: 'Getting Started with freeCodeCamp'
        })
      ).toHaveAttribute('aria-expanded', 'true');

      // First block
      await expect(
        page.getByRole('button', {
          name: 'Lecture Welcome to freeCodeCamp'
        })
      ).toHaveAttribute('aria-expanded', 'true');
    });
  });
});
