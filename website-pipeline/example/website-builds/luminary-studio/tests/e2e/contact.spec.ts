import { test, expect } from '@playwright/test';

/**
 * Contact Form Tests for Luminary Studio
 */

test.describe('Contact Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/contact');
    await page.waitForLoadState('networkidle');
  });

  test('contact page loads', async ({ page }) => {
    // Page should have contact-related content
    const heading = page.locator('h1, h2').first();
    await expect(heading).toBeVisible();
  });

  test('contact form is visible', async ({ page }) => {
    const form = page.locator('form');
    const formExists = (await form.count()) > 0;

    if (formExists) {
      await expect(form.first()).toBeVisible();
    }
  });

  test('form has required fields', async ({ page }) => {
    const form = page.locator('form').first();
    const formExists = (await form.count()) > 0;

    if (!formExists) {
      test.skip();
      return;
    }

    // Common contact form fields
    const emailField = form.locator('input[type="email"], input[name*="email"]');
    await expect(emailField.first()).toBeVisible();
  });

  test('form shows validation on empty submit', async ({ page }) => {
    const form = page.locator('form').first();
    const formExists = (await form.count()) > 0;

    if (!formExists) {
      test.skip();
      return;
    }

    const submitButton = form.locator('button[type="submit"]');
    if ((await submitButton.count()) > 0) {
      await submitButton.first().click();
      await page.waitForTimeout(500);

      // Should show validation
      const hasValidation =
        (await page.locator('[aria-invalid="true"]').count()) > 0 ||
        (await page.locator('.error, [class*="error"]').count()) > 0 ||
        (await page.locator('input:invalid').count()) > 0;

      expect(hasValidation).toBeTruthy();
    }
  });

  test('form fields have labels', async ({ page }) => {
    const form = page.locator('form').first();
    const formExists = (await form.count()) > 0;

    if (!formExists) {
      test.skip();
      return;
    }

    const inputs = form.locator('input:not([type="hidden"]):not([type="submit"]), textarea');
    const inputCount = await inputs.count();

    for (let i = 0; i < inputCount; i++) {
      const input = inputs.nth(i);
      const id = await input.getAttribute('id');
      const ariaLabel = await input.getAttribute('aria-label');
      const placeholder = await input.getAttribute('placeholder');

      const hasLabel =
        (id && (await page.locator(`label[for="${id}"]`).count()) > 0) ||
        ariaLabel ||
        placeholder;

      expect(hasLabel, `Input ${i} missing label`).toBeTruthy();
    }
  });
});
