# E2E Test Conventions

**Version:** 1.0

---

## Selector Strategy

### Priority Order

1. **data-testid** - Best for E2E tests, doesn't break with CSS/text changes
2. **Role + Name** - Good for accessibility-focused tests
3. **Label/Placeholder** - Good for form fields
4. **Text content** - Use sparingly, breaks with copy changes
5. **CSS classes** - Avoid, breaks with styling changes

### Using data-testid

Add `data-testid` attributes to key interactive elements:

```tsx
// Good - stable selector
<button data-testid="submit-contact-form">Submit</button>;

// Test
await page.locator('[data-testid="submit-contact-form"]').click();
```

### Naming Convention

Use kebab-case with component context:

```
data-testid="header-nav-link-about"
data-testid="contact-form-email-input"
data-testid="hero-cta-button"
data-testid="footer-social-twitter"
```

Pattern: `{section}-{component}-{element}`

### Role-Based Selectors

Use Playwright's getByRole when possible:

```ts
// Good - accessibility-focused
await page.getByRole('button', { name: 'Submit' }).click();
await page.getByRole('link', { name: 'About' }).click();
await page.getByRole('textbox', { name: 'Email' }).fill('test@example.com');
```

---

## Test Organization

### File Structure

```
tests/e2e/
├── smoke.spec.ts       # Basic app functionality
├── form.spec.ts        # Form interactions
├── navigation.spec.ts  # Page navigation
├── auth.spec.ts        # Authentication (if applicable)
└── [feature].spec.ts   # Feature-specific tests
```

### Test Naming

Use descriptive, action-oriented names:

```ts
// Good
test('user can submit contact form with valid data', async () => {});
test('navigation menu collapses on mobile viewport', async () => {});

// Bad
test('form test', async () => {});
test('nav works', async () => {});
```

### Test Grouping

Use `test.describe` for logical grouping:

```ts
test.describe('Contact Form', () => {
  test.describe('Validation', () => {
    test('shows error for invalid email', async () => {});
    test('shows error for empty required fields', async () => {});
  });

  test.describe('Submission', () => {
    test('submits successfully with valid data', async () => {});
    test('shows success message after submission', async () => {});
  });
});
```

---

## Page Objects (Optional)

For complex pages, use page objects:

```ts
// pages/ContactPage.ts
export class ContactPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/contact');
  }

  async fillForm(data: { name: string; email: string; message: string }) {
    await this.page.getByLabel('Name').fill(data.name);
    await this.page.getByLabel('Email').fill(data.email);
    await this.page.getByLabel('Message').fill(data.message);
  }

  async submit() {
    await this.page.getByRole('button', { name: 'Submit' }).click();
  }

  async getSuccessMessage() {
    return this.page.locator('[data-testid="success-message"]');
  }
}

// Usage in test
test('contact form submission', async ({ page }) => {
  const contactPage = new ContactPage(page);
  await contactPage.goto();
  await contactPage.fillForm({
    name: 'Test User',
    email: 'test@example.com',
    message: 'Hello!',
  });
  await contactPage.submit();
  await expect(contactPage.getSuccessMessage()).toBeVisible();
});
```

---

## Common Patterns

### Waiting for Network

```ts
// Wait for page to fully load
await page.waitForLoadState('networkidle');

// Wait for specific request
await page.waitForResponse('**/api/contact');
```

### Handling Async Data

```ts
// Wait for data to load
await page.waitForSelector('[data-testid="projects-list"]');

// Or wait for loading state to disappear
await page.waitForSelector('[data-testid="loading-spinner"]', { state: 'hidden' });
```

### Testing Responsive Behavior

```ts
test.describe('Responsive', () => {
  test('mobile navigation', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    // Mobile menu should be collapsed
    await expect(page.locator('[data-testid="mobile-menu"]')).toBeVisible();
  });

  test('desktop navigation', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto('/');

    // Desktop nav should be visible
    await expect(page.locator('[data-testid="desktop-nav"]')).toBeVisible();
  });
});
```

### Screenshot Comparison

```ts
// Visual regression test
test('homepage visual', async ({ page }) => {
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  await expect(page).toHaveScreenshot('homepage.png');
});
```

---

## Adding data-testid to Components

### React Components

```tsx
export function ContactForm() {
  return (
    <form data-testid="contact-form">
      <input data-testid="contact-form-name" name="name" aria-label="Name" />
      <input data-testid="contact-form-email" type="email" name="email" aria-label="Email" />
      <textarea data-testid="contact-form-message" name="message" aria-label="Message" />
      <button data-testid="contact-form-submit" type="submit">
        Submit
      </button>
    </form>
  );
}
```

### Key Elements to Tag

- Navigation links
- Form inputs
- Submit buttons
- Modals/dialogs
- Error messages
- Success messages
- Loading indicators
- Feature sections (hero, features, CTA)

---

## Anti-Patterns

### Don't

```ts
// Bad - brittle selector
await page.locator('.MuiButton-root.css-1234').click();

// Bad - implementation detail
await page.locator('#react-root > div > div:nth-child(2) > button').click();

// Bad - magic timeout
await page.waitForTimeout(5000);
```

### Do

```ts
// Good - stable selector
await page.locator('[data-testid="submit-button"]').click();

// Good - semantic selector
await page.getByRole('button', { name: 'Submit' }).click();

// Good - explicit wait
await page.waitForSelector('[data-testid="success-message"]');
```
