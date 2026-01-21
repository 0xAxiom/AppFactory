import { test, expect } from '@playwright/test';

/**
 * Form Tests for UX Polish Loop
 *
 * These tests verify form functionality if your app has forms.
 * Common scenarios:
 * - Contact forms
 * - Search forms
 * - Login/signup forms
 * - Newsletter signup
 *
 * Customize or remove tests based on your app's forms.
 */

test.describe('Form Tests', () => {
  test.describe('Contact Form', () => {
    test.beforeEach(async ({ page }) => {
      // Navigate to contact page (customize URL)
      await page.goto('/contact');
      await page.waitForLoadState('networkidle');
    });

    test('contact form is visible', async ({ page }) => {
      // Check if contact page has a form
      const form = page.locator('form');
      const formExists = (await form.count()) > 0;

      if (formExists) {
        await expect(form.first()).toBeVisible();
      } else {
        // Skip if no form exists
        test.skip();
      }
    });

    test('form has required fields', async ({ page }) => {
      const form = page.locator('form').first();
      const formExists = (await form.count()) > 0;

      if (!formExists) {
        test.skip();
        return;
      }

      // Check for common form fields (customize as needed)
      const nameField = form.locator(
        'input[name*="name"], input[placeholder*="name" i]'
      );
      const emailField = form.locator(
        'input[type="email"], input[name*="email"]'
      );
      const messageField = form.locator('textarea, input[name*="message"]');

      // At least email should exist for contact forms
      const hasEmail = (await emailField.count()) > 0;
      expect(hasEmail).toBeTruthy();
    });

    test('form shows validation errors', async ({ page }) => {
      const form = page.locator('form').first();
      const formExists = (await form.count()) > 0;

      if (!formExists) {
        test.skip();
        return;
      }

      // Try to submit empty form
      const submitButton = form.locator(
        'button[type="submit"], input[type="submit"]'
      );
      if ((await submitButton.count()) > 0) {
        await submitButton.first().click();

        // Wait for validation to appear
        await page.waitForTimeout(500);

        // Check for validation message (browser native or custom)
        const validationVisible =
          (await page.locator('[aria-invalid="true"]').count()) > 0 ||
          (await page.locator('.error, .invalid, [class*="error"]').count()) >
            0 ||
          (await page.locator('input:invalid').count()) > 0;

        // Form should show some validation feedback
        expect(validationVisible).toBeTruthy();
      }
    });

    test('form fields are properly labeled', async ({ page }) => {
      const form = page.locator('form').first();
      const formExists = (await form.count()) > 0;

      if (!formExists) {
        test.skip();
        return;
      }

      // Get all inputs in the form
      const inputs = form.locator('input, textarea, select');
      const inputCount = await inputs.count();

      for (let i = 0; i < inputCount; i++) {
        const input = inputs.nth(i);
        const type = await input.getAttribute('type');

        // Skip hidden and submit inputs
        if (type === 'hidden' || type === 'submit') continue;

        const id = await input.getAttribute('id');
        const ariaLabel = await input.getAttribute('aria-label');
        const ariaLabelledBy = await input.getAttribute('aria-labelledby');
        const placeholder = await input.getAttribute('placeholder');

        // Input should have one of: associated label, aria-label, aria-labelledby
        const hasLabel =
          (id && (await page.locator(`label[for="${id}"]`).count()) > 0) ||
          ariaLabel ||
          ariaLabelledBy;

        expect(
          hasLabel || placeholder,
          `Form field ${i} is missing a label`
        ).toBeTruthy();
      }
    });
  });

  test.describe('Search Form', () => {
    test('search functionality works', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // Look for search input
      const searchInput = page.locator(
        'input[type="search"], input[name*="search"], input[placeholder*="search" i], [role="searchbox"]'
      );

      const hasSearch = (await searchInput.count()) > 0;

      if (!hasSearch) {
        test.skip();
        return;
      }

      // Type a search query
      await searchInput.first().fill('test');

      // Either submit form or check for live results
      await page.keyboard.press('Enter');

      // Wait for response
      await page.waitForTimeout(1000);

      // Verify no error occurred
      await expect(page.locator('text=Something went wrong')).not.toBeVisible();
    });
  });
});
