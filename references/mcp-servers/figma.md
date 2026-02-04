# Figma MCP Reference

## Overview

The Figma MCP server provides access to live Figma designs, enabling design-to-code workflows without screenshots. Access real design tokens, layer structures, and component hierarchies.

## Installation

```bash
npx -y figma-developer-mcp --stdio
```

## Configuration

```json
{
  "figma": {
    "command": "npx",
    "args": ["-y", "figma-developer-mcp", "--stdio"],
    "env": {
      "FIGMA_ACCESS_TOKEN": "<YOUR_TOKEN>"
    }
  }
}
```

## Getting a Figma Access Token

1. Go to Figma Settings → Account
2. Scroll to "Personal access tokens"
3. Generate a new token with read access
4. Copy and save securely

## Available Tools

### File Access

| Tool           | Description             |
| -------------- | ----------------------- |
| `get_file`     | Get file structure      |
| `get_node`     | Get specific node by ID |
| `get_images`   | Export nodes as images  |
| `get_comments` | Get file comments       |

### Design Tokens

| Tool             | Description                   |
| ---------------- | ----------------------------- |
| `get_styles`     | Get all styles (colors, text) |
| `get_variables`  | Get design variables          |
| `get_components` | Get component library         |

### Layer Information

| Tool              | Description                |
| ----------------- | -------------------------- |
| `get_layers`      | Get layer hierarchy        |
| `get_auto_layout` | Get auto-layout properties |
| `get_constraints` | Get constraint settings    |

## Usage Examples

### Extract Design Tokens

```
Get the color styles from this Figma file: https://figma.com/file/abc123
```

Returns:

```json
{
  "colors": {
    "primary": "#3B82F6",
    "secondary": "#10B981",
    "background": "#FFFFFF",
    "text": "#1F2937"
  },
  "typography": {
    "heading": {
      "fontFamily": "Inter",
      "fontSize": 32,
      "fontWeight": 700
    },
    "body": {
      "fontFamily": "Inter",
      "fontSize": 16,
      "fontWeight": 400
    }
  }
}
```

### Get Component Structure

```
Get the Button component structure from this file
```

Returns detailed hierarchy:

```json
{
  "name": "Button",
  "type": "COMPONENT",
  "children": [
    {
      "name": "Background",
      "type": "RECTANGLE",
      "fills": [{ "color": "#3B82F6" }],
      "cornerRadius": 8
    },
    {
      "name": "Label",
      "type": "TEXT",
      "characters": "Click me",
      "style": { "fontSize": 14, "fontWeight": 500 }
    }
  ],
  "autoLayout": {
    "direction": "HORIZONTAL",
    "padding": { "top": 12, "right": 24, "bottom": 12, "left": 24 },
    "itemSpacing": 8
  }
}
```

### Generate Tailwind Classes

```
Convert this Figma component to Tailwind CSS classes
```

Output:

```html
<button
  class="flex items-center gap-2 px-6 py-3 bg-blue-500 rounded-lg text-sm font-medium text-white hover:bg-blue-600"
>
  Click me
</button>
```

## Integration with AppFactory

### dapp-factory / website-pipeline

1. **Extract design tokens** → Create `design-tokens.ts`
2. **Get component structure** → Generate React components
3. **Export assets** → Download icons and images
4. **Verify implementation** → Compare with original

### Workflow Example

```
1. User: "Build this page from Figma: https://figma.com/file/xyz"
2. Claude: [get_file] Fetching file structure...
3. Claude: [get_styles] Extracting design tokens...
4. Claude: [get_node] Getting main frame...
5. Claude: Generating React components with Tailwind...
```

## Design-to-Code Best Practices

### Use Auto-Layout

Auto-layout in Figma maps directly to Flexbox:

| Figma Auto-Layout | Tailwind CSS      |
| ----------------- | ----------------- |
| Horizontal        | `flex flex-row`   |
| Vertical          | `flex flex-col`   |
| Space between     | `justify-between` |
| Packed            | `justify-start`   |

### Use Design Variables

Figma variables → CSS custom properties:

```css
:root {
  --color-primary: #3b82f6;
  --spacing-sm: 8px;
  --radius-md: 8px;
}
```

### Name Layers Semantically

Good layer names generate better code:

- ✅ `Header/NavLink` → `<nav><a>`
- ✅ `Card/Title` → `<h3>`
- ❌ `Rectangle 47` → `<div>`

## Troubleshooting

### "Invalid token"

- Verify token hasn't expired
- Check token has file read permissions
- Ensure token is correctly copied (no extra spaces)

### "File not found"

- Verify the file URL is correct
- Check you have access to the file
- File may be in a team you don't belong to

### "Rate limited"

Figma API has rate limits:

- Free: 60 requests/minute
- Paid: Higher limits

Batch requests when possible.

## Resources

- [Figma API Documentation](https://www.figma.com/developers/api)
- [Figma REST API Reference](https://www.figma.com/developers/api#intro)
- [Design Tokens in Figma](https://www.figma.com/best-practices/design-systems-101/design-tokens/)
