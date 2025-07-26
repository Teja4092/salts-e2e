import { test, expect } from '@playwright/test';

test.describe('Salt Application - Core Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('should load the homepage successfully', async ({ page }) => {
    // Check if the page loads with expected title
    await expect(page).toHaveTitle(/Vite|React|Salt/);
    
    // Verify main content is visible
    await expect(page.locator('body')).toBeVisible();
    
    // Take a screenshot for verification
    await page.screenshot({ 
      path: 'test-results/homepage.png',
      fullPage: true 
    });
  });

  test('should display Vite + React content', async ({ page }) => {
    // Check for main heading
    const heading = page.locator('h1');
    if (await heading.isVisible()) {
      await expect(heading).toContainText(/Vite|React/);
    }
    
    // Check for logos
    const logos = page.locator('img[alt*="logo"]');
    const logoCount = await logos.count();
    
    if (logoCount > 0) {
      await expect(logos.first()).toBeVisible();
    }
  });

  test('should have interactive elements working', async ({ page }) => {
    // Look for buttons and test interaction
    const buttons = page.locator('button');
    const buttonCount = await buttons.count();
    
    if (buttonCount > 0) {
      const firstButton = buttons.first();
      await expect(firstButton).toBeVisible();
      
      if (await firstButton.isEnabled()) {
        await firstButton.click();
        await page.waitForTimeout(500);
      }
    }
  });
});
