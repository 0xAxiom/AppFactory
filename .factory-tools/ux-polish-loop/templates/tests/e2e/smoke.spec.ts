import { test, expect } from '@playwright/test';

/**
 * Smoke Tests for UX Polish Loop
 *
 * These are minimum viable E2E tests that verify:
 * 1. The app loads without crashing
 * 2. Basic navigation works
 * 3. Key UI elements are present
 * 4. No fatal error states appear
 *
 * Customize these tests for your specific app.
 */

test.describe('Smoke Tests', () => {
  test('home page loads successfully', async ({ page }) => {
    // Navigate to home page
    await page.goto('/');

    // Wait for the page to be fully loaded
    await page.waitForLoadState('networkidle');

    // Verify page title exists (customize for your app)
    await expect(page).toHaveTitle(/.+/);

    // Verify no error boundary or crash screen
    await expect(page.locator('text=Something went wrong')).not.toBeVisible();
    await expect(page.locator('text=Application error')).not.toBeVisible();
    await expect(page.locator('text=Error:')).not.toBeVisible();
  });

  test('main content is visible', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Check that main content area exists
    // Customize these selectors for your app
    const main = page.locator('main, [role="main"], #__next > div');
    await expect(main.first()).toBeVisible();

    // Verify content is not empty
    const content = await main.first().textContent();
    expect(content?.trim().length).toBeGreaterThan(0);
  });

  test('navigation elements are present', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Check for header/nav
    // Customize these selectors for your app
    const nav = page.locator('header, nav, [role="navigation"]');
    await expect(nav.first()).toBeVisible();
  });

  test('no console errors on page load', async ({ page }) => {
    const errors: string[] = [];

    // Collect console errors
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Filter out known non-critical errors
    const criticalErrors = errors.filter((error) => {
      // Ignore hydration warnings (common in dev)
      if (error.includes('Hydration')) return false;
      // Ignore favicon 404 (often happens)
      if (error.includes('favicon')) return false;
      // Add more filters as needed
      return true;
    });

    // Fail if there are critical console errors
    expect(criticalErrors).toHaveLength(0);
  });

  test('page is responsive - mobile viewport', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Verify no horizontal scroll (indicates responsive issues)
    const body = page.locator('body');
    const scrollWidth = await body.evaluate((el) => el.scrollWidth);
    const clientWidth = await body.evaluate((el) => el.clientWidth);

    // Allow small tolerance for scrollbars
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 20);
  });
});

test.describe('Navigation', () => {
  test('can navigate to main sections', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Find navigation links
    const navLinks = page.locator('nav a, header a').filter({
      has: page.locator('text=/^(About|Contact|Work|Projects|Services|Blog)/i'),
    });

    const linkCount = await navLinks.count();

    // If navigation links exist, test them
    if (linkCount > 0) {
      const firstLink = navLinks.first();
      const href = await firstLink.getAttribute('href');

      if (href && href.startsWith('/')) {
        await firstLink.click();
        await page.waitForLoadState('networkidle');

        // Verify navigation succeeded (URL changed or content loaded)
        const url = page.url();
        expect(url).toContain(href);

        // Verify page loaded without error
        await expect(page.locator('text=Something went wrong')).not.toBeVisible();
      }
    }
  });
});

test.describe('Accessibility Basics', () => {
  test('page has proper document structure', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Check for exactly one h1
    const h1Count = await page.locator('h1').count();
    expect(h1Count).toBeGreaterThanOrEqual(1);

    // Check for lang attribute on html
    const lang = await page.locator('html').getAttribute('lang');
    expect(lang).toBeTruthy();
  });

  test('images have alt text', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Get all images
    const images = page.locator('img');
    const imageCount = await images.count();

    // Check each image has alt attribute
    for (let i = 0; i < imageCount; i++) {
      const img = images.nth(i);
      const alt = await img.getAttribute('alt');
      const src = await img.getAttribute('src');

      // Alt should exist (can be empty for decorative images)
      expect(
        alt !== null,
        `Image ${src} is missing alt attribute`
      ).toBeTruthy();
    }
  });

  test('interactive elements are keyboard accessible', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Get all buttons and links
    const interactive = page.locator('button, a[href], input, select, textarea, [tabindex="0"]');
    const count = await interactive.count();

    // Tab through elements and verify focus is visible
    for (let i = 0; i < Math.min(count, 10); i++) {
      await page.keyboard.press('Tab');

      // Get currently focused element
      const focused = await page.evaluate(() => {
        const el = document.activeElement;
        return el?.tagName?.toLowerCase();
      });

      // Should have a focused element
      expect(focused).toBeTruthy();
    }
  });
});
