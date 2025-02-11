import { test, expect } from '@playwright/test';
import {
  deleteAllEmails,
  getAllEmails,
  getFirstEmail,
  getSubject
} from '../utils/mailhog';

test.beforeEach(async () => {
  await deleteAllEmails();
});

test('should be possible to report a user from their profile page', async ({
  page
}) => {
  await page.goto('/twaha');

  // If you build the client locally, delete the button click below.
  if (!process.env.CI) {
    await page.getByRole('button', { name: 'Preview custom 404 page' }).click();
  }

  await page.getByText("Flag This User's Account for Abuse").click();

  await expect(
    page.getByText("Do you want to report twaha's portfolio for abuse?")
  ).toBeVisible();

  await page
    .getByRole('textbox', { name: 'What would you like to report?' })
    .fill('Some details');
  await page.getByRole('button', { name: 'Submit the report' }).click();
  await expect(page).toHaveURL('/learn');

  await expect(page.getByTestId('flash-message')).toBeVisible();
  await expect(page.getByTestId('flash-message')).toContainText(
    'A report was sent to the team with foo@bar.com in copy'
  );

  await expect(async () => {
    const emails = await getAllEmails();
    expect(emails.items).toHaveLength(1);
    expect(getSubject(getFirstEmail(emails))).toBe(
      "Abuse Report : Reporting twaha's profile."
    );
  }).toPass();
});
