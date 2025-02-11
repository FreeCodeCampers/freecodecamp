import { test, expect } from '@playwright/test';

const locations = {
  index: '/learn/responsive-web-design/#basic-css'
};

const lessonNames = [
  'Change the Color of Text',
  'Use CSS Selectors to Style Elements',
  'Use a CSS Class to Style an Element',
  'Style Multiple Elements with a CSS Class',
  'Change the Font Size of an Element',
  'Set the Font Family of an Element',
  'Import a Google Font',
  'Specify How Fonts Should Degrade',
  'Size Your Images',
  'Add Borders Around Your Elements',
  'Add Rounded Corners with border-radius',
  'Make Circular Images with a border-radius',
  'Give a Background Color to a div Element',
  'Set the id of an Element',
  'Use an id Attribute to Style an Element',
  'Adjust the Padding of an Element',
  'Adjust the Margin of an Element',
  'Add a Negative Margin to an Element',
  'Add Different Padding to Each Side of an Element',
  'Add Different Margins to Each Side of an Element',
  'Use Clockwise Notation to Specify the Padding of an Element',
  'Use Clockwise Notation to Specify the Margin of an Element',
  'Use Attribute Selectors to Style Elements',
  'Understand Absolute versus Relative Units',
  'Style the HTML Body Element',
  'Inherit Styles from the Body Element',
  'Prioritize One Style Over Another',
  'Override Styles in Subsequent CSS',
  'Override Class Declarations by Styling ID Attributes',
  'Override Class Declarations with Inline Styles',
  'Override All Other Styles by using Important',
  'Use Hex Code for Specific Colors',
  'Use Hex Code to Mix Colors',
  'Use Abbreviated Hex Code',
  'Use RGB values to Color Elements',
  'Use RGB to Mix Colors',
  'Use CSS Variables to change several elements at once',
  'Create a custom CSS Variable',
  'Use a custom CSS Variable',
  'Attach a Fallback value to a CSS Variable',
  'Improve Compatibility with Browser Fallbacks',
  'Inherit CSS Variables',
  'Change a variable for a specific area',
  'Use a media query to change a variable'
];

const warningMessage =
  'Note: Some browser extensions, such as ad-blockers and dark mode extensions can interfere with the tests. If you face issues, we recommend disabling extensions that modify the content or layout of pages, while taking the course.';

test.describe('Responsive Web Design Projects - Basic CSS', () => {
  test('renders', async ({ page }) => {
    await page.goto(locations.index);

    await expect(page.getByText(warningMessage)).toBeVisible();

    for (const lessonName of lessonNames) {
      await expect(
        page.getByRole('link', { name: lessonName, exact: false })
      ).toBeVisible();
    }
  });
});
