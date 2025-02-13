import { test, expect, type Page } from '@playwright/test';
import translations from '../../client/i18n/locales/english/translations.json';

const pageElements = {
  mainHeading: 'main-head',
  donateText1: 'donate-text-1',
  donateText2: 'donate-text-2',
  donateText3: 'donate-text-3',
  faqHeading: 'faq-head',
  campersImage: 'landing-page-figure'
};

const donationStringReplacements = {
  usdPlaceHolder: '{{usd}}',
  hoursPlaceHolder: '{{hours}}'
};

const donationFormStrings = {
  conformTwentyDollar: translations.donate['confirm-monthly'].replace(
    donationStringReplacements.usdPlaceHolder,
    '20'
  ),
  confirmFiveDollars: translations.donate['confirm-monthly'].replace(
    donationStringReplacements.usdPlaceHolder,
    '5'
  ),
  twentyDollarsLearningContribution: translations.donate['your-donation-2']
    .replace(donationStringReplacements.usdPlaceHolder, '20')
    .replace(donationStringReplacements.hoursPlaceHolder, '1,000'),
  fiveDollarsLearningContribution: translations.donate['your-donation-2']
    .replace(donationStringReplacements.usdPlaceHolder, '5')
    .replace(donationStringReplacements.hoursPlaceHolder, '250'),
  editAmount: translations.donate['edit-amount'],
  donate: translations.buttons.donate
};

let page: Page;
test.beforeAll(async ({ browser }) => {
  page = await browser.newPage();
  await page.goto('/donate');
});

test.describe('Donate Page', () => {
  test('should display the correct title', async () => {
    await expect(page).toHaveTitle(
      `${translations.donate.title} | freeCodeCamp.org`
    );
  });

  test('should select $20 tier by default', async () => {
    await expect(
      page.getByText(donationFormStrings.conformTwentyDollar)
    ).toBeVisible();

    const tabs = await page.$$('[role="tab"]');
    expect(tabs.length).toBe(4);

    for (const tab of tabs) {
      const tabText = await tab.innerText();
      expect(['$5', '$10', '$20', '$40']).toContain(tabText);

      if (tabText === '$20') {
        const isActive = await tab.getAttribute('data-state');
        expect(isActive).toBe('active');
      } else {
        const isActive = await tab.getAttribute('data-state');
        expect(isActive).not.toBe('active');
      }
    }
    await expect(
      page.getByText(donationFormStrings.twentyDollarsLearningContribution)
    ).toBeVisible();
  });

  test('should make $5 tier selectable', async () => {
    await page.click('[role="tab"]:has-text("$5")');

    await expect(
      page.getByText(donationFormStrings.confirmFiveDollars)
    ).toBeVisible();

    await expect(
      page.getByText(donationFormStrings.fiveDollarsLearningContribution)
    ).toBeVisible();
  });

  test('should switch between tier selection and payment options', async () => {
    // Tier selection
    await page.click('[role="tab"]:has-text("$5")');
    await expect(
      page.getByText(donationFormStrings.confirmFiveDollars)
    ).toBeVisible();
    await expect(
      page.getByText(donationFormStrings.fiveDollarsLearningContribution)
    ).toBeVisible();
    await page.click(`button:has-text("${donationFormStrings.donate}")`);

    // Donation form
    const isEditButtonVisible = await page.isVisible(
      `button:has-text("${donationFormStrings.editAmount}")`
    );
    expect(isEditButtonVisible).toBeTruthy();
    await expect(page.getByTestId('donation-form')).toBeVisible();
    await page.click(`button:has-text("${donationFormStrings.editAmount}")`);

    // Tier selection
    await expect(
      page.getByText(donationFormStrings.confirmFiveDollars)
    ).toBeVisible();
    await expect(
      page.getByText(donationFormStrings.fiveDollarsLearningContribution)
    ).toBeVisible();
  });

  test('should display the main heading', async () => {
    const mainHeading = page.getByTestId(pageElements.mainHeading);
    await expect(mainHeading).toHaveText(translations.donate['help-more']);
  });

  test('should display donation page upper text 1', async () => {
    const donateText1 = page.getByTestId(pageElements.donateText1);
    await expect(donateText1).toHaveText(translations.donate.efficiency);
  });

  test('should display donation page benefit 2', async () => {
    const donateText2 = page.getByTestId(pageElements.donateText2);
    await expect(donateText2).toHaveText(translations.donate['why-donate-1']);
  });

  test('should display donation page benefit 3', async () => {
    const donateText3 = page.getByTestId(pageElements.donateText3);
    await expect(donateText3).toHaveText(translations.donate['why-donate-2']);
  });

  test('should display the faq heading', async () => {
    const faqHead = page.getByTestId(pageElements.faqHeading);
    await expect(faqHead).toHaveText(translations.donate.faq);
  });

  test('should display the faq list with buttons', async () => {
    const faq1 = page.getByRole('button', {
      name: translations.donate['get-help']
    });
    await expect(faq1).toBeVisible();
    await faq1.click();
    await expect(
      page.getByText(translations.donate['forward-receipt'])
    ).toBeVisible();
    await faq1.click();

    const faq2 = page.getByRole('button', {
      name: translations.donate['how-transparent']
    });
    await expect(faq2).toBeVisible();
    await faq2.click();
    await expect(
      page.getByText(translations.donate['very-transparent'])
    ).toBeVisible();
    await expect(
      page.getByText('You can download our IRS Determination Letter here.')
    ).toBeVisible();
    await expect(
      page.getByText(
        'You can download our most recent 990 (annual tax report) here.'
      )
    ).toBeVisible();
    await faq2.click();

    const faq3 = page.getByRole('button', {
      name: translations.donate['how-efficient']
    });
    await expect(faq3).toBeVisible();
    await faq3.click();
    await expect(
      page.getByText(translations.donate['fcc-budget'])
    ).toBeVisible();
    await expect(
      page.getByText(translations.donate['help-millions'])
    ).toBeVisible();
    await faq3.click();

    const faq4 = page.getByRole('button', {
      name: translations.donate['how-one-time']
    });
    await expect(faq4).toBeVisible();
    await faq4.click();
    await expect(
      page.getByText(
        "If you'd prefer to make one-time donations, you can support freeCodeCamp's mission whenever you have cash to spare. You can use this link to donate whatever amount feels right through PayPal."
      )
    ).toBeVisible();
    await expect(
      page.getByText(translations.donate['wire-transfer'])
    ).toBeVisible();
    await faq4.click();

    const faq5 = page.getByRole('button', {
      name: translations.donate['does-crypto']
    });
    await expect(faq5).toBeVisible();
    await faq5.click();
    await expect(
      page.getByText(translations.donate['yes-cryptocurrency'])
    ).toBeVisible();
    await faq5.click();

    const faq6 = page.getByRole('button', {
      name: translations.donate['can-check']
    });
    await expect(faq6).toBeVisible();
    await faq6.click();
    await expect(
      page.getByText(translations.donate['yes-check'])
    ).toBeVisible();
    await expect(page.getByText('Free Code Camp, Inc.')).toBeVisible();
    await expect(page.getByText('3905 Hedgcoxe Rd')).toBeVisible();
    await expect(page.getByText('PO Box 250352')).toBeVisible();
    await expect(page.getByText('Plano, TX 75025')).toBeVisible();
    await faq6.click();

    const faq7 = page.getByRole('button', {
      name: translations.donate['how-matching-gift']
    });
    await expect(faq7).toBeVisible();
    await faq7.click();
    await expect(
      page.getByText(translations.donate['employers-vary'])
    ).toBeVisible();
    await expect(
      page.getByText(translations.donate['some-volunteer'])
    ).toBeVisible();
    await expect(
      page.getByText(translations.donate['help-matching-gift'])
    ).toBeVisible();
    await faq7.click();

    const faq8 = page.getByRole('button', {
      name: translations.donate['how-endowment']
    });
    await expect(faq8).toBeVisible();
    await faq8.click();
    await expect(
      page.getByText(translations.donate['endowment'])
    ).toBeVisible();
    await faq8.click();

    const faq9 = page.getByRole('button', {
      name: translations.donate['how-legacy']
    });
    await expect(faq9).toBeVisible();
    await faq9.click();
    await expect(
      page.getByText(translations.donate['we-honored'])
    ).toBeVisible();
    await expect(
      page.getByText(translations.donate['legacy-gift-message'])
    ).toBeVisible();
    await expect(
      page.getByText(translations.donate['thank-wikimedia'])
    ).toBeVisible();
    await expect(
      page.getByText(translations.donate['legacy-gift-questions'])
    ).toBeVisible();
    await faq9.click();

    const faq10 = page.getByRole('button', {
      name: translations.donate['how-stock']
    });
    await expect(faq10).toBeVisible();
    await faq10.click();
    await expect(
      page.getByText(translations.donate['welcome-stock'])
    ).toBeVisible();
    await faq10.click();

    const faq11 = page.getByRole('button', {
      name: translations.donate['how-update']
    });
    await expect(faq11).toBeVisible();
    await faq11.click();
    await expect(
      page.getByText(translations.donate['forward-receipt'])
    ).toBeVisible();
    await faq11.click();

    const faq12 = page.getByRole('button', {
      name: translations.donate['anything-else']
    });
    await expect(faq12).toBeVisible();
    await faq12.click();
    await expect(
      page.getByText(translations.donate['other-support'])
    ).toBeVisible();
    await faq12.click();
  });
});
