import { execSync } from 'child_process';
import { test, expect, Page } from '@playwright/test';
import { SuperBlocks } from '../../shared/config/curriculum';
import translations from '../../client/i18n/locales/english/translations.json';
import tributePageHtml from '../fixtures/tribute-page-html.json';
import tributePageCss from '../fixtures/tribute-page-css.json';
import curriculum from '../fixtures/js-ads-projects.json';
import { authedRequest } from '../utils/request';

import { focusEditor, getEditors, clearEditor } from '../utils/editor';
import { isMacOS } from '../utils/user-agent';
import { alertToBeVisible } from '../utils/alerts';

interface Meta {
  challengeOrder: { id: string; title: string }[];
}

interface File {
  contents: unknown;
  fileKey: string;
}

type Solution = File[];

interface Challenge {
  title: string;
  block: string;
  superBlock: string;
  dashedName: string;
  solutions: Solution[];
  isPrivate?: boolean;
}

interface block {
  [key: string]: {
    meta: Meta;
    challenges: Challenge[];
  };
}

const pythonProjects = {
  superBlock: SuperBlocks.MachineLearningPy,
  block: 'machine-learning-with-python-projects',
  challenges: [
    {
      slug: 'book-recommendation-engine-using-knn',
      nextChallengeText: 'Linear Regression Health Costs Calculator'
    },
    {
      slug: 'cat-and-dog-image-classifier',
      nextChallengeText: 'Book Recommendation Engine using KNN'
    },
    {
      slug: 'linear-regression-health-costs-calculator',
      nextChallengeText: 'Neural Network SMS Text Classifier'
    },
    {
      slug: 'neural-network-sms-text-classifier',
      nextChallengeText: 'Find the Symmetric Difference'
    },
    {
      slug: 'rock-paper-scissors',
      nextChallengeText: 'Cat and Dog Image Classifier'
    }
  ]
};

const pasteContent = async (page: Page) => {
  if (isMacOS) {
    await page.keyboard.press('Meta+v');
  } else {
    await page.keyboard.press('Control+v');
  }
};

test.use({ storageState: 'e2e/playwright/.auth/development-user.json' });

test.beforeAll(() => {
  execSync('node ./tools/scripts/seed/seed-demo-user');
});

test.afterAll(() => {
  execSync('node ./tools/scripts/seed/seed-demo-user --certified-user');
});

test.describe('Projects', () => {
  test('Should be possible to submit Python projects', async ({ page }) => {
    const { superBlock, block, challenges } = pythonProjects; // Ensure these are defined or imported

    for (const { slug } of challenges) {
      const url = `/learn/${superBlock}/${block}/${slug}`;
      await page.goto(url);
      await page
        .getByLabel('Solution Link')
        .fill('https://replit.com/@camperbot/python-project#main.py');

      await page
        .getByRole('button', { name: "I've completed this challenge" })
        .click();
      await expect(
        page.getByRole('button', { name: 'Go to next challenge' })
      ).toBeVisible();
    }
  });
});

test.describe('JavaScript projects can be submitted and then viewed in /settings and on the certifications', () => {
  test.skip(
    ({ browserName }) => browserName !== 'chromium',
    'Only chromium allows us to use the clipboard API.'
  );

  test('projects are submitted and viewed correctly', async ({
    page,
    browserName,
    isMobile,
    request,
    context
  }) => {
    test.setTimeout(40000);
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);

    const block: block = curriculum;
    const targetBlock = 'javascript-algorithms-and-data-structures-projects';
    const javaScriptSuperBlock = block[targetBlock];

    const { challenges, meta } = javaScriptSuperBlock || {
      challenges: [],
      meta: {}
    };

    const projectTitles =
      meta.challengeOrder?.map(({ title }: { title: string }) => title) ?? [];

    const projectsInOrder = projectTitles.map(title =>
      challenges.find(challenge => challenge.title === title)
    ) as Challenge[];

    const projectIdsInOrder = [
      'aaa48de84e1ecc7c742e1124',
      'a7f4d8f2483413a6ce226cac',
      '56533eb9ac21ba0edf2244e2',
      'aff0395860f5d3034dc0bfc9',
      'aa2e6f85cab2ab736c9a9b24'
    ];

    const contents = projectsInOrder[0].solutions[0][0].contents as string;

    await page.goto(
      '/learn/javascript-algorithms-and-data-structures/javascript-algorithms-and-data-structures-projects/palindrome-checker'
    );

    await focusEditor({ page, isMobile });
    await clearEditor({ page, browserName });

    await page.evaluate(
      async contents => await navigator.clipboard.writeText(contents),
      contents
    );

    await pasteContent(page);

    await page.getByRole('button', { name: 'Run' }).click();

    await page
      .getByRole('button', { name: 'Go to next challenge', exact: false })
      .click();

    // Submit the rest with the API.
    const submissionPromises = [];

    for (let i = 1; i < projectsInOrder.length; i++) {
      submissionPromises.push(
        authedRequest({
          request,
          method: 'post',
          endpoint: '/modern-challenge-completed',
          data: {
            id: projectIdsInOrder[i],
            challengeType: 5,
            files: projectsInOrder[i].solutions[0].map(({ contents }) => ({
              contents: contents,
              key: 'scriptjs',
              ext: 'js',
              name: 'script',
              history: ['script.js']
            }))
          }
        })
      );
    }

    await Promise.all(submissionPromises);

    await page.goto('/settings');

    for (const projectTitle of projectTitles) {
      await page
        .getByRole('button', { name: `View Solution for ${projectTitle}` })
        .click();
      const solutionModal = page.getByRole('dialog', {
        name: `Solution for ${projectTitle}`
      });
      await expect(solutionModal).toBeVisible();
      await solutionModal
        .getByRole('button', { name: translations.buttons['close'] })
        .first()
        .click();
      // Wait for the modal to disappear before continue
      await expect(solutionModal).toBeHidden();
    }

    await page
      .getByRole('button', {
        name: translations.buttons['agree-honesty']
      })
      .click();

    await alertToBeVisible(page, translations.buttons['accepted-honesty']);

    await page
      .getByRole('button', {
        name: 'Claim Certification Legacy JavaScript Algorithms and Data Structures'
      })
      .click();

    await alertToBeVisible(
      page,
      '@developmentuser, you have successfully claimed the Legacy JavaScript Algorithms and Data Structures Certification! Congratulations on behalf of the freeCodeCamp.org team!'
    );

    const showCertLink = page.getByRole('link', {
      name: 'Show Certification Legacy JavaScript Algorithms and Data Structures'
    });
    await expect(showCertLink).toBeVisible();
    await expect(showCertLink).toHaveAttribute(
      'href',
      '/certification/developmentuser/javascript-algorithms-and-data-structures'
    );
  });
});

test.describe('Completion modal should be shown after submitting a project', () => {
  test.skip(
    ({ browserName }) => browserName !== 'chromium',
    'Only chromium allows us to use the clipboard API.'
  );

  test('Ctrl + enter triggers the completion modal on multifile projects', async ({
    page,
    context,
    isMobile
  }) => {
    test.skip(isMobile);
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);

    const tributeContent = [
      tributePageHtml['tribute-page-html'].contents,
      tributePageCss['tribute-page-css'].contents
    ];

    await page.goto(
      '/learn/2022/responsive-web-design/build-a-tribute-page-project/build-a-tribute-page'
    );
    const editors = getEditors(page);
    await page.getByRole('button', { name: 'styles.css' }).click();

    for (let i = 0; i < 2; i++) {
      await page.evaluate(
        async contents => await navigator.clipboard.writeText(contents),
        tributeContent[i]
      );

      await editors.nth(i).focus();
      await pasteContent(page);
    }

    await page.keyboard.press('Control+Enter');
    await page
      .getByRole('button', { name: 'Go to next challenge', exact: false })
      .click();
  });
});

test.describe('Should not be able to submit in quick succesion', () => {
  test('should not be possible to submit twice in quick succession', async ({
    page
  }) => {
    const { superBlock, block, challenges } = pythonProjects;
    const { slug } = challenges[0];

    const url = `/learn/${superBlock}/${block}/${slug}`;
    await page.goto(url);

    await page
      .getByLabel('Solution Link')
      .fill('https://replit.com/@camperbot/python-project#main.py');

    const completedButton = page.getByRole('button', {
      name: "I've completed this challenge"
    });

    await completedButton.click();

    await expect(page.getByRole('dialog')).toBeVisible();

    const submitChallenge = page.getByRole('button', {
      name: 'Go to next challenge',
      exact: false
    });
    await submitChallenge.click();

    await expect(completedButton).toBeDisabled();

    await expect(page.getByRole('dialog')).not.toBeVisible();
  });
});
