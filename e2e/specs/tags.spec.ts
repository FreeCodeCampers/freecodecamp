import { test, expect } from '@playwright/test';

const challenges = {
  responsiveWebDesign:
    '/learn/responsive-web-design/basic-html-and-html5/say-hello-to-html-elements',
  rosettaCode: '/learn/rosetta-code/rosetta-code-challenges/100-doors',
  projectEuler:
    '/learn/project-euler/project-euler-problems-1-to-100/problem-1-multiples-of-3-or-5'
};

const social = {
  description: 'Learn to Code — For Free'
};

const scripts = {
  mathjax: {
    selector: 'script[id="mathjax"]',
    src: 'https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.4/MathJax.js?config=TeX-AMS_HTML'
  }
};

test.describe('The Document Metadata', () => {
  test.describe('landing page', () => {
    test('has correct <meta> tags', async ({ page }) => {
      await page.goto('/');
      await expect(
        page.locator('head meta[name="description"]')
      ).toHaveAttribute('content', 'Learn to Code — For Free');
      await expect(page.locator('head meta[name="og:title"]')).toHaveAttribute(
        'content',
        'freeCodeCamp.org'
      );
      await expect(
        page.locator('head meta[name="og:description"]')
      ).toHaveAttribute('content', social.description);
      await expect(
        page.locator('head meta[name="twitter:title"]')
      ).toHaveAttribute('content', 'freeCodeCamp.org');
      await expect(
        page.locator('head meta[name="twitter:description"]')
      ).toHaveAttribute('content', social.description);
      await expect(page.locator(scripts.mathjax.selector)).not.toBeVisible();
    });
  });

  test.describe('responsive web design challenges', () => {
    test('should not have mathjax body script', async ({ page }) => {
      await page.goto(challenges.responsiveWebDesign);
      await expect(page.locator(scripts.mathjax.selector)).not.toBeVisible();
    });
  });

  test.describe('project euler challenges', () => {
    test('should have mathjax body script', async ({ page }) => {
      await page.goto(challenges.projectEuler);
      await expect(page.locator(scripts.mathjax.selector)).toHaveCount(1);
    });
  });

  test.describe('rosetta code challenges', () => {
    test('should have mathjax body script', async ({ page }) => {
      await page.goto(challenges.rosettaCode);
      await expect(page.locator(scripts.mathjax.selector)).toHaveCount(1);
    });
  });
});
