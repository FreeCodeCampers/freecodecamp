import { test, expect } from '@playwright/test';
import { SuperBlocks } from '../../shared/config/curriculum';
import metaTags from '../../client/i18n/locales/english/meta-tags.json';

interface StructuredData {
  '@context': string;
  '@type': string;
  itemListElement: ListItem[];
}

interface ListItem {
  '@type': string;
  position: number;
  item: {
    '@type': string;
    url: string;
    name: string;
    description: string;
    provider: {
      '@type': string;
      name: string;
      sameAs: string;
      nonprofitStatus: string;
    };
  };
}

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test('should set the correct title', async ({ page }) => {
  await expect(page).toHaveTitle(metaTags.title);
});

test('should inject structured data (JSON-LD) into the page', async ({
  page
}) => {
  const structuredData = await page
    .getByTestId('structured-data')
    .textContent();

  expect(structuredData).toBeTruthy();

  const parsedData = JSON.parse(structuredData ?? '') as StructuredData;

  expect(parsedData?.['@context']).toBe('https://schema.org');
  expect(parsedData['@type']).toBe('ItemList');
  expect(parsedData.itemListElement).toBeInstanceOf(Array);

  expect(parsedData.itemListElement.length).toBe(
    Object.values(SuperBlocks).length
  );

  parsedData.itemListElement.forEach((listItem: ListItem, index: number) => {
    expect(listItem['@type']).toBe('ListItem');
    expect(listItem.position).toBe(index + 1);

    const item = listItem.item;
    expect(item['@type']).toBe('Course');
    expect(item.url).toContain(`/learn/${Object.values(SuperBlocks)[index]}`);
    expect(item.name).toBeTruthy();
    expect(item.description).toBeTruthy();

    expect(item.provider['@type']).toBe('Organization');
    expect(item.provider.name).toBe('freeCodeCamp');
    expect(item.provider.sameAs).toBe('https://freecodecamp.org');
    expect(item.provider.nonprofitStatus).toBe('Nonprofit501c3');
  });
});
