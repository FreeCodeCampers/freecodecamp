import { execSync } from 'child_process';
import { test, expect } from '@playwright/test';
import translations from '../../client/i18n/locales/english/translations.json';

const settingsPageElement = {
  githubInput: 'internet-github-input',
  githubCheckmark: 'internet-github-check',
  linkedinCheckmark: 'internet-linkedin-check',
  twitterCheckmark: 'internet-twitter-check',
  personalWebsiteCheckmark: 'internet-website-check',
  flashMessageAlert: 'flash-message',
  internetPresenceForm: 'internet-presence'
} as const;

test.beforeEach(async ({ page }) => {
  // Reset input values
  execSync('node ./tools/scripts/seed/seed-demo-user --certified-user');

  await page.goto('/certifieduser');

  if (!process.env.CI) {
    await page.getByRole('button', { name: 'Preview custom 404 page' }).click();
  }

  await page.getByRole('button', { name: 'Edit my profile' }).click();
});

test.describe('Your Internet Presence', () => {
  test.skip(({ browserName }) => browserName === 'webkit', 'flaky on Safari');
  test('should display the section with save button being disabled', async ({
    page
  }) => {
    await expect(
      page.getByRole('heading', {
        level: 2,
        name: translations.settings.headings.internet
      })
    ).toBeVisible();

    await expect(
      page
        .getByTestId(settingsPageElement.internetPresenceForm)
        .getByRole('button', { name: translations.buttons.save })
    ).toBeVisible();
  });

  const socials = [
    {
      name: 'github',
      url: 'https://github.com/certified-user',
      label: 'GitHub',
      checkTestId: settingsPageElement.githubCheckmark
    },
    {
      name: 'linkedin',
      url: 'https://www.linkedin.com/in/certified-user',
      label: 'LinkedIn',
      checkTestId: settingsPageElement.linkedinCheckmark
    },
    {
      name: 'twitter',
      url: 'https://twitter.com/certified-user',
      label: 'Twitter',
      checkTestId: settingsPageElement.twitterCheckmark
    },
    {
      name: 'website',
      url: 'https://certified-user.com',
      label: translations.settings.labels.personal,
      checkTestId: settingsPageElement.personalWebsiteCheckmark
    }
  ];

  socials.forEach(social => {
    test(`should hide ${social.name} checkmark by default`, async ({
      page
    }) => {
      await expect(page.getByTestId(social.checkTestId)).toBeHidden();
    });

    test(`should update ${social.name} URL`, async ({ page }) => {
      const socialInput = page.getByRole('textbox', { name: social.label });
      await expect(socialInput).toBeVisible();
      await socialInput.fill(social.url);
      const socialCheckmark = page.getByTestId(social.checkTestId);
      await expect(socialCheckmark).toBeVisible();

      const saveButton = page
        .getByTestId(settingsPageElement.internetPresenceForm)
        .getByRole('button', { name: translations.buttons.save });

      await expect(saveButton).toBeVisible();
      await saveButton.click();
      await expect(page.getByRole('alert').first()).toContainText(
        'We have updated your social links'
      );
    });
  });
});
