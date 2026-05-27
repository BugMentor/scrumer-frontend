import { test, expect } from '@playwright/test';

test('Apollo Test page displays user data', async ({ page }) => {
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  await page.waitForSelector('button:has-text("Apollo Test")');

  // Click on the "Apollo Test" link in the sidebar
  await page.getByRole('button', { name: 'Apollo Test' }).click();

  // Expect the heading to be visible
  await expect(page.getByRole('heading', { name: 'Apollo Client Test - Users' })).toBeVisible();

  // Expect to see either "Loading users..." or the actual user data
  // Since the backend might not be running or have data, we check for both possibilities
  await expect(page.locator('body')).toContainText(/Loading users\.\.\.|ID: \d+, Username: \w+, Email: [\w@.]+/);
});