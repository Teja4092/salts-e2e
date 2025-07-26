import { test, expect } from '@playwright/test';

const viewports = [
  { name: 'mobile', width: 375, height: 667 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1280, height: 720 },
];

test.describe('Salt Application - Responsive Design', () => {
  viewports.forEach(({ name, width, height }) => {
    test(`should display correctly on ${name} viewport`, async ({ page }: { page: import('@playwright/test').Page }) => {
      await page.setViewportSize({ width, height });
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      // Check that content is visible
      await expect(page.locator('body')).toBeVisible();
      
      // Take screenshot for visual verification
      await page.screenshot({ 
        path: `test-results/${name}-viewport.png`,
        fullPage: true 
      });
    });
  });
});
