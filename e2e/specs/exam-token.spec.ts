// TO ENABLE THESE TESTS GROWTHBOOK HAS TO BE SET IN THE ENVIRONMENT VARIABLES`
// UNCOMMENT WHEN NEW API IS READY.

// import { test, expect } from '@playwright/test';

// test.beforeEach(async ({ page }) => {
//   await page.goto('/settings');
// });

// test.describe('Exam Token Widget', () => {
//   test('should tell you to not share the token with anyone', async ({
//     page
//   }) => {
//     await expect(
//       page.getByText(
//         'Your exam token is a secret key that allows you to access the exam. Do not share this token with anyone'
//       )
//     ).toBeVisible();
//     await expect(
//       page.getByText(
//         'If you generate a new token, your old token will be invalidated.'
//       )
//     ).toBeVisible();

//     await expect(
//       page.getByRole('button', { name: 'Generate Exam Token' })
//     ).toBeVisible();
//   });

//   test('should be able to generate a token', async ({ page }) => {
//     await page.getByRole('button', { name: 'Generate Exam Token' }).click();
//     await expect(page.getByText('Your Exam Token is:')).toBeVisible();

//     await expect(page.getByRole('button', { name: 'Copy' })).toBeVisible();

//     await expect(
//       page.getByRole('button', { name: 'Close' }).nth(1)
//     ).toBeVisible();
//   });
// });
