# Tailwind CSS v4 Reference for AppFactory

## Version: 4.0+ (January 2026)

## Key Changes from v3

### CSS-First Configuration

No more `tailwind.config.js`. Configure in CSS with `@theme`:

```css
@import 'tailwindcss';

@theme {
  --color-primary: #3b82f6;
  --color-secondary: #10b981;
  --font-display: 'Inter', sans-serif;
  --radius-lg: 12px;
}
```

### Single Import

Replace multiple imports with one:

```css
/* Before (v3) */
@tailwind base;
@tailwind components;
@tailwind utilities;

/* After (v4) */
@import 'tailwindcss';
```

### No Extra PostCSS Plugins

These are now built-in:

- `postcss-import` - Import handling
- `autoprefixer` - Vendor prefixes

```javascript
// postcss.config.js (simplified)
module.exports = {
  plugins: {
    '@tailwindcss/postcss': {},
  },
};
```

## New Features

### Container Queries (Built-in)

Respond to container size, not viewport:

```html
<div class="@container">
  <div class="@lg:grid-cols-2 @md:flex-row">
    <!-- Responds to container, not viewport -->
  </div>
</div>
```

### 3D Transforms

```html
<div class="rotate-x-45 rotate-y-12 perspective-500 transform-3d">3D transformed element</div>
```

| Class           | CSS Property                   |
| --------------- | ------------------------------ |
| `rotate-x-*`    | `transform: rotateX(*deg)`     |
| `rotate-y-*`    | `transform: rotateY(*deg)`     |
| `perspective-*` | `perspective: *px`             |
| `transform-3d`  | `transform-style: preserve-3d` |

### Field Sizing

Auto-grow textareas:

```html
<textarea class="field-sizing-content">
  This textarea grows with content
</textarea>
```

### Color Mixing

```css
@theme {
  --color-primary-light: color-mix(in oklch, var(--color-primary), white 20%);
}
```

## Performance

- **5x faster** full builds
- **100x faster** incremental builds
- Built on Rust engine (Oxide)

## Theme Configuration

### Colors

```css
@theme {
  /* Color palette */
  --color-brand: #6366f1;
  --color-brand-light: #818cf8;
  --color-brand-dark: #4f46e5;

  /* Semantic colors */
  --color-success: #22c55e;
  --color-warning: #f59e0b;
  --color-error: #ef4444;
}
```

Usage:

```html
<button class="bg-brand hover:bg-brand-dark">Click me</button>
```

### Typography

```css
@theme {
  --font-sans: 'Inter', system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', monospace;

  --font-size-xs: 0.75rem;
  --font-size-sm: 0.875rem;
  --font-size-base: 1rem;
  --font-size-lg: 1.125rem;
  --font-size-xl: 1.25rem;
}
```

### Spacing

```css
@theme {
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;
}
```

### Border Radius

```css
@theme {
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;
  --radius-full: 9999px;
}
```

## Migration from v3

### Config File

**Before (v3):**

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        brand: '#6366f1',
      },
    },
  },
};
```

**After (v4):**

```css
/* globals.css */
@import 'tailwindcss';

@theme {
  --color-brand: #6366f1;
}
```

### Arbitrary Values

Same syntax, now more powerful:

```html
<div class="bg-[#1a1a1a] p-[17px] grid-cols-[1fr_2fr_1fr]">Content</div>
```

### Plugins

Plugins are now CSS-based:

```css
@import 'tailwindcss';
@import '@tailwindcss/typography';
@import '@tailwindcss/forms';
```

## Dark Mode

```css
@theme {
  --color-bg: #ffffff;
  --color-text: #1f2937;
}

@media (prefers-color-scheme: dark) {
  @theme {
    --color-bg: #0f172a;
    --color-text: #f8fafc;
  }
}
```

Or use class-based:

```html
<html class="dark">
  <body class="bg-white dark:bg-slate-900">
    Content
  </body>
</html>
```

## Common Patterns

### Card Component

```html
<div class="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg ring-1 ring-slate-900/5">
  <h3 class="text-lg font-semibold text-slate-900 dark:text-white">Title</h3>
  <p class="mt-2 text-slate-600 dark:text-slate-300">Description</p>
</div>
```

### Button

```html
<button
  class="inline-flex items-center px-4 py-2 bg-brand text-white rounded-lg font-medium hover:bg-brand-dark focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2 transition-colors"
>
  Click me
</button>
```

### Input

```html
<input
  class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:border-brand focus:ring-1 focus:ring-brand outline-none transition-colors"
  placeholder="Enter text"
/>
```

## Integration with shadcn/ui

shadcn/ui v2 uses Tailwind v4:

```bash
npx shadcn@latest init
```

Components are copied into your project and use Tailwind classes directly.

## Resources

- [Tailwind CSS v4 Announcement](https://tailwindcss.com/blog/tailwindcss-v4)
- [Migration Guide](https://tailwindcss.com/docs/upgrade-guide)
- [CSS Variables](https://tailwindcss.com/docs/customizing-your-theme)
