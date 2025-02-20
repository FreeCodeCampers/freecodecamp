import { execSync } from 'child_process';
import { test, expect, type Page } from '@playwright/test';
import { addGrowthbookCookie } from './utils/add-growthbook-cookie';

import { clearEditor, focusEditor } from './utils/editor';
import { allowTrailingSlash } from './utils/url';

const slowExpect = expect.configure({ timeout: 25000 });

const completeFrontEndCert = async (page: Page, number?: number) => {
  await page.goto(
    `/learn/front-end-development-libraries/front-end-development-libraries-projects/build-a-random-quote-machine`
  );

  const projects = [
    'random-quote-machine',
    'markdown-previewer',
    'drum-machine',
    'javascript-calculator',
    '25--5-clock'
  ];

  const loopNumber = number || projects.length;
  for (let i = 0; i < loopNumber; i++) {
    await page.waitForURL(
      allowTrailingSlash(
        `/learn/front-end-development-libraries/front-end-development-libraries-projects/build-a-${projects[i]}`
      )
    );
    await page
      .getByRole('textbox', { name: 'solution' })
      .fill('https://codepen.io/camperbot/full/oNvPqqo');
    await page
      .getByRole('button', { name: "I've completed this challenge" })
      .click();
    await page
      .getByRole('button', { name: 'Submit and go to next challenge' })
      .click();
  }
};

const challenges = [
  {
    url: '/learn/javascript-algorithms-and-data-structures/basic-javascript/comment-your-javascript-code',
    solution: `// some comment\n/* some comment */`
  },
  {
    url: '/learn/javascript-algorithms-and-data-structures/basic-javascript/declare-javascript-variables',
    solution: 'var myName;'
  },
  {
    url: '/learn/javascript-algorithms-and-data-structures/basic-javascript/storing-values-with-the-assignment-operator',
    solution: `// Setup\nvar a;\n\n// Only change code below this line\na = 7;`
  },
  {
    url: '/learn/javascript-algorithms-and-data-structures/basic-javascript/assigning-the-value-of-one-variable-to-another',
    solution: `// Setup\nvar a;\na = 7;\nvar b;\n\n// Only change code below this line\nb = a;`
  },
  {
    url: '/learn/javascript-algorithms-and-data-structures/basic-javascript/initializing-variables-with-the-assignment-operator',
    solution: 'var a = 9;'
  },
  {
    url: '/learn/javascript-algorithms-and-data-structures/basic-javascript/declare-string-variables',
    solution: `var myFirstName = 'foo';\nvar myLastName = 'bar';`
  },
  {
    url: '/learn/javascript-algorithms-and-data-structures/basic-javascript/understanding-uninitialized-variables',
    solution: `// Only change code below this line\nvar a = 5;\nvar b = 10;\nvar c = 'I am a';\n// Only change code above this line\n\na = a + 1;\nb = b + 5;\nc = c + " String!";`
  },
  {
    url: '/learn/javascript-algorithms-and-data-structures/basic-javascript/understanding-case-sensitivity-in-variables',
    solution: `// Variable declarations\nvar studlyCapVar;\nvar properCamelCase;\nvar titleCaseOver;\n\n// Variable assignments\nstudlyCapVar = 10;\nproperCamelCase = "A String";\ntitleCaseOver = 9000;`
  },
  {
    url: '/learn/javascript-algorithms-and-data-structures/basic-javascript/explore-differences-between-the-var-and-let-keywords',
    solution: `let catName = "Oliver";\nlet catSound = "Meow!";`
  },
  {
    url: '/learn/javascript-algorithms-and-data-structures/basic-javascript/declare-a-read-only-variable-with-the-const-keyword',
    solution: `const FCC = "freeCodeCamp";\n// Change this line\nlet fact = "is cool!";\n// Change this line\nfact = "is awesome!";\nconsole.log(FCC, fact);\n// Change this line`
  }
];

const completeChallenges = async ({
  page,
  browserName,
  isMobile,
  number
}: {
  page: Page;
  browserName: string;
  isMobile: boolean;
  number: number;
}) => {
  await page.goto(challenges[0].url);
  for (const challenge of challenges.slice(0, number)) {
    await page.waitForURL(allowTrailingSlash(challenge.url));
    await focusEditor({ page, isMobile });
    await clearEditor({ page, browserName });
    await page.evaluate(
      async contents => await navigator.clipboard.writeText(contents),
      challenge.solution
    );
    await page.keyboard.press('ControlOrMeta+V');
    await page.getByRole('button', { name: 'Run' }).click();
    await expect(
      page.getByRole('dialog').filter({ hasText: 'Basic Javascript' })
    ).toBeVisible(); // completion dialog
    await page.getByRole('button', { name: 'Submit' }).click();
  }
};

test.skip(
  ({ browserName }) => browserName !== 'chromium',
  'Only chromium allows us to use the clipboard API.'
);

test.describe('Donation modal display', () => {
  test.beforeEach(async ({ context }) => {
    await addGrowthbookCookie({ context, variation: 'A' });
  });

  test('should display the content correctly and disable close when the animation is not complete', async ({
    page,
    browserName,
    isMobile,
    context
  }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    test.setTimeout(40000);

    await completeChallenges({ page, browserName, isMobile, number: 3 });

    const donationModal = page
      .getByRole('dialog')
      .filter({ hasText: 'Become a Supporter' });
    await expect(donationModal).toBeVisible();

    await expect(
      donationModal.getByText(
        'This is a 20 second animated advertisement to encourage campers to become supporters of freeCodeCamp. The animation starts with a teddy bear who becomes a supporter. As a result, distracting pop-ups disappear and the bear gets to complete all of its goals. Then, it graduates and becomes an education super hero helping people around the world.'
      )
    ).toBeVisible();
    await expect(donationModal.getByTestId('donation-animation')).toBeVisible();
    await expect(donationModal.getByText('Become a Supporter')).toBeVisible();
    await expect(donationModal.getByText('Remove distractions')).toBeVisible();
    await expect(
      donationModal.getByText('Reach your goals faster')
    ).toBeVisible();
    await expect(
      donationModal.getByText('Help millions of people learn')
    ).toBeVisible();

    // Ensure that the modal cannot be closed by pressing the Escape key
    await page.keyboard.press('Escape');
    await expect(donationModal).toBeVisible();

    // Second part of the modal.
    // Use `slowExpect` as we need to wait 20s for this part to show up.
    await slowExpect(
      donationModal.getByRole('img', {
        name: 'Illustration of an adorable teddy bear wearing a graduation cap and flying with a Supporter badge.'
      })
    ).toBeVisible();

    await expect(
      donationModal.getByRole('heading', {
        name: 'Support us'
      })
    ).toBeVisible();

    await expect(
      donationModal
        .getByRole('listitem')
        .filter({ hasText: 'Help us build more certifications' })
    ).toBeVisible();

    await expect(
      donationModal
        .getByRole('listitem')
        .filter({ hasText: 'Remove donation popups' })
    ).toBeVisible();

    await expect(
      donationModal
        .getByRole('listitem')
        .filter({ hasText: 'Help millions of people learn' })
    ).toBeVisible();

    await expect(
      donationModal.getByRole('button', { name: 'Become a Supporter' })
    ).toBeVisible();

    await expect(
      donationModal.getByRole('button', { name: 'Ask me later' })
    ).toBeVisible();
  });
});

test.describe('Donation modal appearance logic - New user', () => {
  test.use({ storageState: 'playwright/.auth/development-user.json' });
  test.beforeEach(async ({ context }) => {
    await addGrowthbookCookie({ context, variation: 'B' });
  });

  test.beforeEach(() => {
    execSync('node ./tools/scripts/seed/seed-demo-user');
  });

  test.afterAll(() => {
    execSync('node ./tools/scripts/seed/seed-demo-user --certified-user');
  });

  test('should not appear if the user has less than 10 completed challenges in total and has just completed 3 challenges', async ({
    page,
    browserName,
    isMobile,
    context
  }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);

    // Development user doesn't have any completed challenges, we are completing the first 3.
    await completeChallenges({ page, browserName, isMobile, number: 3 });

    const donationModal = page
      .getByRole('dialog')
      .filter({ hasText: 'Become a Supporter' });
    await expect(donationModal).toBeHidden();
  });

  test('should appear if the user has less than 10 completed challenges in total and has just completed 10 challenges', async ({
    page,
    isMobile,
    browserName,
    context
  }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    test.setTimeout(50000);

    await completeChallenges({ page, isMobile, browserName, number: 10 });

    const donationModal = page
      .getByRole('dialog')
      .filter({ hasText: 'Become a Supporter' });
    await expect(donationModal).toBeVisible();
    await expect(
      donationModal.getByText(
        'This is a 20 second animated advertisement to encourage campers to become supporters of freeCodeCamp. The animation starts with a teddy bear who becomes a supporter. As a result, distracting pop-ups disappear and the bear gets to complete all of its goals. Then, it graduates and becomes an education super hero helping people around the world.'
      )
    ).toBeVisible();

    // Second part of the modal.
    // Use `slowExpect` as we need to wait 20s for this part to show up.
    await slowExpect(
      donationModal.getByRole('heading', { name: 'Support us' })
    ).toBeVisible();
    await donationModal.getByRole('button', { name: 'Ask me later' }).click();
    // Ensure that the close state has been registered before ending the test.
    // The modal will show up on another page/test otherwise.
    await expect(donationModal).toBeHidden();
  });

  test('should not appear if the user has just completed a new block but has less than 10 completed challenges', async ({
    page
  }) => {
    test.setTimeout(40000);

    await completeFrontEndCert(page);

    const donationModal = page
      .getByRole('dialog')
      .filter({ hasText: 'Become a Supporter' });
    await expect(donationModal).toBeHidden();
  });
});

test.describe('Donation modal appearance logic - Certified user claiming a new block', () => {
  test.use({ storageState: 'playwright/.auth/certified-user.json' });
  test.beforeEach(() =>
    execSync('node ./tools/scripts/seed/seed-demo-user --almost-certified-user')
  );

  test('should appear if the user has just completed a new block, and should not appear if the user re-submits the projects of the block', async ({
    page,
    context
  }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    test.setTimeout(40000);

    await completeFrontEndCert(page, 1);

    const donationModal = page
      .getByRole('dialog')
      .filter({ hasText: 'Become a Supporter' });
    await expect(donationModal).toBeVisible();
    await expect(
      donationModal.getByText(
        'This is a 20 second animated advertisement to encourage campers to become supporters of freeCodeCamp. The animation starts with a teddy bear who becomes a supporter. As a result, distracting pop-ups disappear and the bear gets to complete all of its goals. Then, it graduates and becomes an education super hero helping people around the world.'
      )
    ).toBeVisible();

    // Second part of the modal.
    // Use `slowExpect` as we need to wait 20s for this part to show up.
    await slowExpect(
      donationModal.getByText(
        'Nicely done. You just completed Front End Development Libraries Projects.'
      )
    ).toBeVisible();
    await donationModal.getByRole('button', { name: 'Ask me later' }).click();
    await expect(donationModal).toBeHidden();

    await completeFrontEndCert(page, 1);
    await expect(donationModal).toBeHidden();
  });

  test("should not appear if the user has completed a new FSD block, but the block's module is not completed", async ({
    page
  }) => {
    await page.goto(
      '/learn/full-stack-developer/review-basic-html/basic-html-review'
    );

    await page.getByRole('checkbox', { name: /Review/ }).click();
    await page.getByRole('button', { name: 'Submit', exact: true }).click();
    await page.getByRole('button', { name: /Submit and go/ }).click();

    const donationModal = page
      .getByRole('dialog')
      .filter({ hasText: 'Become a Supporter' });
    await expect(donationModal).toBeHidden();
  });
});

test.describe('Donation modal appearance logic - Certified user claiming a new module', () => {
  test.use({ storageState: 'playwright/.auth/certified-user.json' });
  execSync('node ./tools/scripts/seed/seed-demo-user --almost-certified-user');

  test('should appear if the user has just completed a new module', async ({
    page
  }) => {
    test.setTimeout(40000);

    // Go to the last lecture of the Welcome to freeCodeCamp block.
    // This lecture is not added to the seed data, so it is not completed.
    // By completing this lecture, we claim both the block and its module.
    await page.goto(
      '/learn/full-stack-developer/lecture-welcome-to-freecodecamp/how-can-you-build-effective-learning-habits-and-work-smarter'
    );

    // Wait for the page content to render
    // TODO: Change the selector to `getByRole('radiogroup')` when we have migrated the MCQ component to fcc/ui
    await expect(page.locator("div[class='video-quiz-options']")).toHaveCount(
      3
    );

    const radioGroups = await page
      .locator("div[class='video-quiz-options']")
      .all();

    await radioGroups[0].getByRole('radio').nth(2).click({ force: true });
    await radioGroups[1].getByRole('radio').nth(2).click({ force: true });
    await radioGroups[2].getByRole('radio').nth(3).click({ force: true });

    await page.getByRole('button', { name: /Check your answer/ }).click();
    await page.getByRole('button', { name: /Submit and go/ }).click();

    const donationModal = page
      .getByRole('dialog')
      .filter({ hasText: 'Become a Supporter' });
    await expect(donationModal).toBeVisible();
    await expect(
      donationModal.getByText(
        'This is a 20 second animated advertisement to encourage campers to become supporters of freeCodeCamp. The animation starts with a teddy bear who becomes a supporter. As a result, distracting pop-ups disappear and the bear gets to complete all of its goals. Then, it graduates and becomes an education super hero helping people around the world.'
      )
    ).toBeVisible();

    // Second part of the modal.
    // Use `slowExpect` as we need to wait 20s for this part to show up.
    await slowExpect(
      donationModal.getByText(
        'Nicely done. You just completed Getting Started with freeCodeCamp.'
      )
    ).toBeVisible();
  });
});

test.describe('Donation modal appearance logic - Certified user', () => {
  test.beforeEach(async ({ context }) => {
    await addGrowthbookCookie({ context, variation: 'A' });
  });

  test('should appear if the user has completed 3 challenges and has more than 10 completed challenges in total', async ({
    page,
    browserName,
    isMobile,
    context
  }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    test.setTimeout(40000);

    // Certified user already has more than 10 completed challenges, we are just completing 3 more.
    await completeChallenges({ page, isMobile, browserName, number: 3 });

    const donationModal = page
      .getByRole('dialog')
      .filter({ hasText: 'Become a Supporter' });
    await expect(donationModal).toBeVisible();

    await expect(
      donationModal.getByText(
        'This is a 20 second animated advertisement to encourage campers to become supporters of freeCodeCamp. The animation starts with a teddy bear who becomes a supporter. As a result, distracting pop-ups disappear and the bear gets to complete all of its goals. Then, it graduates and becomes an education super hero helping people around the world.'
      )
    ).toBeVisible();

    // Second part of the modal.
    // Use `slowExpect` as we need to wait 20s for this part to show up.
    await slowExpect(
      donationModal.getByRole('heading', { name: 'Support us' })
    ).toBeVisible();
    await donationModal.getByRole('button', { name: 'Ask me later' }).click();
    // Ensure that the close state has been registered before ending the test.
    // The modal will show up on another page/test otherwise.
    await expect(donationModal).toBeHidden();
  });
});

test.describe('Donation modal appearance logic - Donor user', () => {
  test.beforeAll(() => {
    execSync(
      'node ./tools/scripts/seed/seed-demo-user --certified-user --set-true isDonating'
    );
  });

  test.afterAll(() => {
    execSync('node ./tools/scripts/seed/seed-demo-user --certified-user');
  });

  test('should not appear', async ({
    page,
    browserName,
    isMobile,
    context
  }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);

    await completeChallenges({ page, browserName, isMobile, number: 3 });

    const donationModal = page
      .getByRole('dialog')
      .filter({ hasText: 'Become a Supporter' });
    await expect(donationModal).toBeHidden();
  });
});
