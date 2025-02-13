import { test, expect } from '@playwright/test';

test.describe('Editor scrollbar width', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/settings');
  });

  test('Default editor scrollbar width should be 5px', async ({ page }) => {
    await expect(page.locator('#scrollbar-width-slider')).toHaveValue('5');
    await page.goto(
      '/learn/2022/responsive-web-design/learn-html-by-building-a-cat-photo-app/step-2'
    );

    const upperJawElement = page.locator('.editor-upper-jaw');
    const upperJawWidth = await upperJawElement.evaluate(
      (node: HTMLElement) => node.offsetWidth
    );

    const lowerJawElement = page.locator('#editor-lower-jaw');
    expect(
      await lowerJawElement.evaluate((node: HTMLElement) => node.offsetWidth)
    ).toEqual(upperJawWidth);

    const scrollableElement = page.locator('.monaco-scrollable-element');
    expect(
      await scrollableElement.evaluate(
        (node: HTMLElement) => node.offsetWidth - 5
      )
    ).toEqual(upperJawWidth);
  });

  test('Should allow you to change editor scrollbar width to 25px', async ({
    page
  }) => {
    await page.locator('.scrollbar-width-numbers > [data-value="25"]').click();
    await expect(page.locator('#scrollbar-width-slider')).toHaveValue('25');
    await page.goto(
      '/learn/2022/responsive-web-design/learn-html-by-building-a-cat-photo-app/step-2'
    );

    const upperJawElement = page.locator('.editor-upper-jaw');
    const upperJawWidth = await upperJawElement.evaluate(
      (node: HTMLElement) => node.offsetWidth
    );

    const lowerJawElement = page.locator('#editor-lower-jaw');
    expect(
      await lowerJawElement.evaluate((node: HTMLElement) => node.offsetWidth)
    ).toEqual(upperJawWidth);

    const scrollableElement = page.locator('.monaco-scrollable-element');
    expect(
      await scrollableElement.evaluate(
        (node: HTMLElement) => node.offsetWidth - 25
      )
    ).toEqual(upperJawWidth);
  });
});
