import { test, expect } from '@playwright/test';

/**
 * Smoke Tests for Luminary Studio
 * Portfolio website for photographer
 */

test.describe('Smoke Tests', () => {
  test('home page loads successfully', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Verify page title
    await expect(page).toHaveTitle(/Luminary|Studio|Portfolio/i);

    // No error states
    await expect(page.locator('text=Something went wrong')).not.toBeVisible();
    await expect(page.locator('text=Application error')).not.toBeVisible();
  });

  test('main content is visible', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Hero section should be visible
    const main = page.locator('main');
    await expect(main).toBeVisible();

    // Content should not be empty
    const content = await main.textContent();
    expect(content?.trim().length).toBeGreaterThan(0);
  });

  test('navigation elements are present', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Header with navigation
    const header = page.locator('header');
    await expect(header).toBeVisible();

    // Look for nav links
    const nav = page.locator('nav, header').first();
    await expect(nav).toBeVisible();
  });

  test('no console errors on page load', async ({ page }) => {
    const errors: string[] = [];

    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const criticalErrors = errors.filter((error) => {
      if (error.includes('Hydration')) return false;
      if (error.includes('favicon')) return false;
      if (error.includes('404')) return false;
      return true;
    });

    expect(criticalErrors).toHaveLength(0);
  });

  test('page is responsive - mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // No horizontal scroll
    const body = page.locator('body');
    const scrollWidth = await body.evaluate((el) => el.scrollWidth);
    const clientWidth = await body.evaluate((el) => el.clientWidth);
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 20);
  });
});

test.describe('Navigation', () => {
  test('can navigate to about page', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Click About link
    const aboutLink = page.locator('a[href="/about"], a:has-text("About")').first();
    if (await aboutLink.isVisible()) {
      await aboutLink.click();
      await page.waitForLoadState('networkidle');
      expect(page.url()).toContain('/about');
    }
  });

  test('can navigate to work/portfolio page', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Click Work/Portfolio link
    const workLink = page.locator('a[href="/work"], a[href="/portfolio"], a:has-text("Work"), a:has-text("Portfolio")').first();
    if (await workLink.isVisible()) {
      await workLink.click();
      await page.waitForLoadState('networkidle');
      expect(page.url()).toMatch(/\/(work|portfolio)/);
    }
  });

  test('can navigate to contact page', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Click Contact link
    const contactLink = page.locator('a[href="/contact"], a:has-text("Contact")').first();
    if (await contactLink.isVisible()) {
      await contactLink.click();
      await page.waitForLoadState('networkidle');
      expect(page.url()).toContain('/contact');
    }
  });
});

test.describe('Accessibility Basics', () => {
  test('page has proper document structure', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // At least one h1
    const h1Count = await page.locator('h1').count();
    expect(h1Count).toBeGreaterThanOrEqual(1);

    // Lang attribute
    const lang = await page.locator('html').getAttribute('lang');
    expect(lang).toBeTruthy();
  });

  test('images have alt text', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const images = page.locator('img');
    const imageCount = await images.count();

    for (let i = 0; i < imageCount; i++) {
      const img = images.nth(i);
      const alt = await img.getAttribute('alt');
      expect(alt !== null, `Image ${i} missing alt`).toBeTruthy();
    }
  });

  test('interactive elements are keyboard accessible', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Tab through first few elements
    for (let i = 0; i < 5; i++) {
      await page.keyboard.press('Tab');
      const focused = await page.evaluate(() => document.activeElement?.tagName);
      expect(focused).toBeTruthy();
    }
  });
});

test.describe('Dark Mode', () => {
  test('dark mode toggle works', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Look for theme toggle button
    const themeToggle = page.locator('button[aria-label*="theme"], button[aria-label*="dark"], button[aria-label*="mode"], [data-testid="theme-toggle"]');

    if (await themeToggle.isVisible()) {
      // Get initial theme
      const initialClass = await page.locator('html').getAttribute('class');

      // Click toggle
      await themeToggle.click();
      await page.waitForTimeout(300); // Wait for transition

      // Theme should change
      const newClass = await page.locator('html').getAttribute('class');
      expect(newClass).not.toBe(initialClass);
    }
  });
});
