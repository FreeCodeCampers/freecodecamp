import { test, expect } from '@playwright/test';
import translations from '../../client/i18n/locales/english/translations.json';
import links from '../../client/i18n/locales/english/links.json';

const BOTTOM_LINKS = [
  {
    title: translations.footer.links.about,
    href: links.footer['about-url']
  },
  {
    title: translations.footer.links.alumni,
    href: 'https://www.linkedin.com/school/free-code-camp/people/'
  },
  {
    title: translations.footer.links['open-source'],
    href: 'https://github.com/freeCodeCamp/'
  },
  {
    title: translations.footer.links.shop,
    href: links.footer['shop-url']
  },
  {
    title: translations.footer.links.support,
    href: links.footer['support-url']
  },
  {
    title: translations.footer.links.sponsors,
    href: links.footer['sponsors-url']
  },
  {
    title: translations.footer.links.honesty,
    href: links.footer['honesty-url']
  },
  {
    title: translations.footer.links.coc,
    href: links.footer['coc-url']
  },
  {
    title: translations.footer.links.privacy,
    href: links.footer['privacy-url']
  },
  {
    title: translations.footer.links.tos,
    href: links.footer['tos-url']
  },
  {
    title: translations.footer.links.copyright,
    href: links.footer['copyright-url']
  }
];

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test.describe('Footer component left section', () => {
  test('should render the content properly', async ({ page }) => {
    await expect(
      page.getByText(translations.footer['tax-exempt-status'])
    ).toBeVisible();
    await expect(
      page.getByText(translations.footer['mission-statement'])
    ).toBeVisible();
    await expect(
      page.getByText(translations.footer['donation-initiatives'])
    ).toBeVisible();
    await expect(
      page.getByRole('link', { name: 'make a tax-deductible donation here' })
    ).toHaveAttribute('href', '/donate');
  });
});

test.describe('Footer Trending Guides section', () => {
  test('should render the section with a header and 30 articles', async ({
    page
  }) => {
    await expect(
      page.getByRole('heading', {
        name: translations.footer['trending-guides']
      })
    ).toBeVisible();

    const articles = await page
      .getByRole('list', { name: translations.footer['trending-guides'] })
      .getByRole('link')
      .all();

    expect(articles).toHaveLength(30);

    for (const article of articles) {
      await expect(article).toBeVisible();
    }
  });
});

test.describe('Footer mobile app section', () => {
  test('should render the download links correctly', async ({ page }) => {
    await expect(
      page.getByRole('heading', {
        level: 2,
        name: translations.footer['mobile-app']
      })
    ).toBeVisible();

    const downloadLinks = await page
      .getByRole('list', { name: translations.footer['mobile-app'] })
      .getByRole('listitem')
      .all();

    expect(downloadLinks).toHaveLength(2);

    const appleStoreLink = downloadLinks[0];

    await expect(
      appleStoreLink.getByRole('img', { name: 'Download on the App Store' })
    ).toBeVisible();
    await expect(
      appleStoreLink.getByRole('link', { name: 'Download on the App Store' })
    ).toBeVisible();
    await expect(
      appleStoreLink.getByRole('link', { name: 'Download on the App Store' })
    ).toHaveAttribute(
      'href',
      'https://apps.apple.com/us/app/freecodecamp/id6446908151?itsct=apps_box_link&itscg=30200'
    );

    const googlePlayLink = downloadLinks[1];

    await expect(
      googlePlayLink.getByRole('img', { name: 'Get it on Google Play' })
    ).toBeVisible();
    await expect(
      googlePlayLink.getByRole('link', { name: 'Get it on Google Play' })
    ).toBeVisible();
    await expect(
      googlePlayLink.getByRole('link', { name: 'Get it on Google Play' })
    ).toHaveAttribute(
      'href',
      'https://play.google.com/store/apps/details?id=org.freecodecamp'
    );
  });
});

test.describe('Footer bottom section', () => {
  test('should display the content correctly', async ({ page, isMobile }) => {
    if (isMobile) {
      await expect(
        page.getByRole('heading', {
          name: translations.footer['our-nonprofit']
        })
      ).toBeVisible();
    }

    for (const item of BOTTOM_LINKS) {
      const link = page.getByRole('link', { name: item.title, exact: true });

      await expect(link).toBeVisible();
      await expect(link).toHaveAttribute('href', item.href);
    }
  });
});
