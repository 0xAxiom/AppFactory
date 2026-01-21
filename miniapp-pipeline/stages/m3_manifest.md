# Stage M3: Manifest & Metadata Authoring

## Purpose

Configure the manifest with app-specific values and ensure all placeholder assets are properly generated.

## Input

- Stage M2 scaffold in `builds/miniapps/<slug>/app/`
- `artifacts/inputs/normalized_prompt.md` for values

## Process

1. **Populate minikit.config.ts**
   - Fill in all manifest fields from normalized prompt
   - Set appropriate colors
   - Configure tags and category

2. **Generate Placeholder Images**
   - Create proper dimension images
   - Use brand colors where possible
   - Add text overlays for identification

3. **Verify Manifest Route**
   - Start dev server
   - Fetch `/.well-known/farcaster.json`
   - Validate JSON structure

4. **Configure Embed Metadata**
   - Set Open Graph values
   - Configure social sharing

## Output

### Updated minikit.config.ts

```typescript
export const minikitConfig = {
  accountAssociation: {
    header: '', // FILL AFTER SIGNING - Stage M5
    payload: '', // FILL AFTER SIGNING - Stage M5
    signature: '', // FILL AFTER SIGNING - Stage M5
  },
  miniapp: {
    version: '1',
    name: '[From normalized_prompt.name]',
    subtitle: '[From normalized_prompt.tagline]',
    description: '[From normalized_prompt.description]',
    screenshotUrls: ['${URL}/screenshots/1.png'],
    iconUrl: '${URL}/icon.png',
    splashImageUrl: '${URL}/splash.png',
    splashBackgroundColor: '#[brand-color]',
    homeUrl: '${URL}',
    primaryCategory: '[From normalized_prompt.category]',
    tags: [
      /* From normalized_prompt.tags */
    ],
    heroImageUrl: '${URL}/hero.png',
    tagline: '[From normalized_prompt.tagline]',
    ogTitle: '[From normalized_prompt.name]',
    ogDescription: '[From normalized_prompt.description]',
    ogImageUrl: '${URL}/og.png',
  },
} as const;

export type MinikitConfig = typeof minikitConfig;
```

### Placeholder Image Generation

Images should be simple placeholders that:

- Have correct dimensions
- Use a solid brand color background
- Include white text identifying the image type
- Are valid PNG/JPG files

| Image             | Dimensions | Content                      |
| ----------------- | ---------- | ---------------------------- |
| icon.png          | 1024x1024  | "[App Name]" centered        |
| splash.png        | 200x200    | "[App Name]" centered        |
| hero.png          | 1200x630   | "[App Name] - [Tagline]"     |
| og.png            | 1200x630   | "[App Name] - [Description]" |
| screenshots/1.png | 1284x2778  | "Screenshot Placeholder"     |

### Output File

File: `artifacts/stage03/manifest_config.md`

````markdown
# Manifest Configuration

## Generated: [timestamp]

## Slug: [slug]

## Values Applied

### Identity

| Field       | Value   | Char Count | Max |
| ----------- | ------- | ---------- | --- |
| name        | [value] | [n]        | 32  |
| subtitle    | [value] | [n]        | 30  |
| tagline     | [value] | [n]        | 30  |
| description | [value] | [n]        | 170 |

### Discovery

| Field           | Value             |
| --------------- | ----------------- |
| primaryCategory | [category]        |
| tags            | [tag1, tag2, ...] |

### Branding

| Field                 | Value  |
| --------------------- | ------ |
| splashBackgroundColor | #[hex] |

### Assets

| Asset        | Path               | Dimensions |
| ------------ | ------------------ | ---------- |
| Icon         | /icon.png          | 1024x1024  |
| Splash       | /splash.png        | 200x200    |
| Hero         | /hero.png          | 1200x630   |
| OG Image     | /og.png            | 1200x630   |
| Screenshot 1 | /screenshots/1.png | 1284x2778  |

## Manifest Preview

The manifest will be served at `/.well-known/farcaster.json`:

```json
{
  "accountAssociation": {
    "header": "",
    "payload": "",
    "signature": ""
  },
  "frame": {
    "version": "1",
    "name": "[name]",
    "subtitle": "[subtitle]",
    ...
  }
}
```
````

## Validation Checklist

- [ ] All character limits respected
- [ ] Category is valid
- [ ] Tags are properly formatted (lowercase, no spaces)
- [ ] All asset files exist
- [ ] Asset dimensions are correct
- [ ] Manifest route returns valid JSON
- [ ] No empty required fields (except accountAssociation)

## Next Step

Proceed to Stage M4 (Vercel Deployment Plan)

```

## Character Limit Validation

| Field | Max Length |
|-------|-----------|
| name | 32 |
| subtitle | 30 |
| tagline | 30 |
| description | 170 |
| ogTitle | 30 |
| ogDescription | 100 |
| tags (each) | 20 |

## Valid Categories

```

games
social
finance
utility
productivity
health-fitness
news-media
music
shopping
education
developer-tools
entertainment
art-creativity

````

## Tag Rules

- Maximum 5 tags
- Each tag max 20 characters
- Lowercase only
- No spaces (use hyphens if needed)
- No emojis or special characters

## Validation

- [ ] minikit.config.ts is valid TypeScript
- [ ] All required fields are populated
- [ ] Character limits are respected
- [ ] Category is valid
- [ ] Tags follow rules
- [ ] All placeholder images exist
- [ ] Image dimensions are correct
- [ ] Manifest route returns valid JSON

## Testing

```bash
# Start dev server
npm run dev

# Test manifest endpoint
curl http://localhost:3000/.well-known/farcaster.json | jq

# Expected: Valid JSON with all frame fields populated
# Expected: accountAssociation fields are empty strings
````

## Next Stage

Output feeds into Stage M4 (Vercel Deployment Plan).
