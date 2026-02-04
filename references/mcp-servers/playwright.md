# Playwright MCP Reference

## Overview

The Playwright MCP server (by Microsoft) enables browser automation through accessibility trees rather than screenshots. This approach is 10x faster and works with any LLM without vision capabilities.

## Installation

```bash
npx -y @playwright/mcp@latest
```

## Configuration

```json
{
  "playwright": {
    "command": "npx",
    "args": ["-y", "@playwright/mcp@latest"]
  }
}
```

## Key Concept: Accessibility Trees

Instead of taking screenshots and using vision models, Playwright MCP uses the browser's accessibility tree - a structured representation of the page that screen readers use.

**Benefits:**

- 10x faster than screenshot-based approaches
- Works with any LLM (no vision required)
- More precise element targeting
- Smaller token footprint

## Available Tools

### Navigation

| Tool       | Description                |
| ---------- | -------------------------- |
| `navigate` | Navigate to a URL          |
| `back`     | Go back in browser history |
| `forward`  | Go forward                 |
| `reload`   | Reload current page        |

### Page Interaction

| Tool     | Description            |
| -------- | ---------------------- |
| `click`  | Click an element       |
| `fill`   | Fill a form field      |
| `select` | Select dropdown option |
| `check`  | Check/uncheck checkbox |
| `hover`  | Hover over element     |
| `press`  | Press keyboard key     |

### Information Gathering

| Tool       | Description                |
| ---------- | -------------------------- |
| `snapshot` | Get accessibility snapshot |
| `text`     | Get text content           |
| `title`    | Get page title             |
| `url`      | Get current URL            |

### Screenshots (Optional)

| Tool         | Description          |
| ------------ | -------------------- |
| `screenshot` | Take page screenshot |

## Usage Examples

### Navigate and Get Snapshot

```
Navigate to http://localhost:3000 and get the accessibility snapshot
```

Returns structured data like:

```json
{
  "role": "WebArea",
  "name": "My App",
  "children": [
    {
      "role": "navigation",
      "name": "Main navigation",
      "children": [
        { "role": "link", "name": "Home" },
        { "role": "link", "name": "About" }
      ]
    },
    {
      "role": "main",
      "children": [
        { "role": "heading", "name": "Welcome", "level": 1 },
        { "role": "button", "name": "Get Started" }
      ]
    }
  ]
}
```

### Fill a Form

```
Fill the email field with "test@example.com" and click the Submit button
```

### Test Accessibility

```
Check if all interactive elements have accessible labels
```

## Integration with Ralph QA

Playwright MCP is essential for the UX Polish Loop:

### Automated Checks

1. **Navigation works** - All links functional
2. **Forms submit** - Input validation works
3. **Accessibility** - All elements have labels
4. **Responsive** - Works at different viewports

### Example Ralph Session

```
Ralph: Running UI validation with Playwright MCP...

[navigate] http://localhost:3000
[snapshot] Captured accessibility tree (47 elements)

Checking interactive elements:
✓ Button "Get Started" - has accessible label
✓ Link "Home" - has accessible label
✓ Input "Email" - has accessible label
✗ Button with icon - missing accessible label

[click] "Get Started" button
[snapshot] New page loaded

Navigation check: PASS
Accessibility check: 1 issue found
```

## Viewport Testing

Test responsive designs:

```json
{
  "playwright": {
    "command": "npx",
    "args": ["-y", "@playwright/mcp@latest", "--viewport=375,667"]
  }
}
```

Common viewports:

- Mobile: `375,667` (iPhone SE)
- Tablet: `768,1024` (iPad)
- Desktop: `1920,1080`

## Headless vs Headed

Default is headless. For debugging, use headed mode:

```json
{
  "playwright": {
    "command": "npx",
    "args": ["-y", "@playwright/mcp@latest", "--headed"]
  }
}
```

## Browser Selection

Default is Chromium. Options:

```json
{
  "playwright": {
    "args": ["-y", "@playwright/mcp@latest", "--browser=firefox"]
  }
}
```

Browsers: `chromium`, `firefox`, `webkit`

## Troubleshooting

### "Browser not installed"

Run Playwright install:

```bash
npx playwright install
```

### "Element not found"

- Check the accessibility snapshot for correct element names
- Elements may not be visible (check viewport)
- Dynamic content may not be loaded yet

### "Timeout"

Increase timeout for slow-loading pages:

```json
{
  "playwright": {
    "args": ["-y", "@playwright/mcp@latest", "--timeout=60000"]
  }
}
```

## Resources

- [Playwright Documentation](https://playwright.dev/docs/intro)
- [Playwright MCP GitHub](https://github.com/microsoft/playwright-mcp)
- [Accessibility Tree Guide](https://playwright.dev/docs/accessibility-testing)
