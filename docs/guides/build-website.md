# How to Build a Website

This guide walks through building a static website using the website-pipeline.

---

## Prerequisites

- Node.js 18+
- Claude Code installed
- AppFactory repository cloned

---

## Step 1: Navigate to the Pipeline

```bash
cd /path/to/AppFactory/website-pipeline
```

Verify you're in the right directory:

```bash
pwd
# Should show: .../AppFactory/website-pipeline
```

---

## Step 2: Start Claude

```bash
claude
```

---

## Step 3: Describe Your Website

Tell Claude what you want. Be as detailed or as brief as you like.

### Minimal Description

```
Build me a portfolio website
```

### Detailed Description

```
Build me a portfolio website for a photographer. Include:
- A gallery page with lightbox
- An about page with bio
- A contact form
- Dark mode support
- Mobile-responsive design
```

Both work. The system fills in details for minimal descriptions.

---

## Step 4: Review the Plan

Claude will normalize your intent and show a plan:

```
[PHASE 0: INTENT NORMALIZATION]

Upgrading "portfolio website" to:
"A professional portfolio website for creative work with:
- Hero section with featured projects
- Gallery with category filtering and lightbox
- About page with bio, skills, and timeline
- Contact form with validation
- Dark/light mode toggle
- Mobile-first responsive design
- SEO optimization
- Performance optimization"

[PHASE 1: PLANNING]

Milestones:
- M1: Scaffold Next.js project
- M2: Create page layouts
- M3: Implement gallery features
- M4: Add contact functionality
- M5: Polish and accessibility
- M6: Generate documentation

Proceed? (yes/no)
```

Type `yes` to proceed or request changes.

---

## Step 5: Wait for Generation

The system generates your website through multiple phases:

```
[BUILDING]
M1: Scaffold ✓
M2: Pages ✓
M3: Features ✓
M4: Contact ✓
M5: Polish ✓
M6: Documentation ✓

[RALPH QA]
Pass 1: 92% (fixing accessibility issues)
Pass 2: 97% - PASS

BUILD COMPLETE
```

---

## Step 6: Find Your Output

Your website appears in:

```
website-pipeline/website-builds/<site-name>/
```

---

## Step 7: Run the Website

```bash
cd website-pipeline/website-builds/<site-name>
npm install
npm run dev
```

Open http://localhost:3000 in your browser.

---

## Using the Preview System

Instead of running commands manually, use VS Code tasks:

1. Open Command Palette: `Cmd+Shift+P` / `Ctrl+Shift+P`
2. Type: `Tasks: Run Task`
3. Select: `Factory: Preview (Auto)`

The preview system:

- Detects your project type
- Runs the dev server
- Discovers the URL
- Writes it to `.vscode/.preview/PREVIEW.json`

Then use `Factory: Preview (Open Browser)` to open in your browser.

---

## Project Structure

Your generated website:

```
website-builds/<site-name>/
├── package.json
├── next.config.js
├── tailwind.config.js
├── src/
│   ├── app/
│   │   ├── layout.tsx       ← Root layout
│   │   ├── page.tsx         ← Home page
│   │   ├── about/page.tsx   ← About page
│   │   ├── gallery/page.tsx ← Gallery page
│   │   └── contact/page.tsx ← Contact page
│   ├── components/
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── Gallery.tsx
│   │   └── ...
│   └── lib/
│       └── utils.ts
├── public/
│   └── images/
├── README.md
└── RUNBOOK.md
```

---

## Customizing After Generation

### Change Styles

Edit `tailwind.config.js` or component files:

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: '#your-color',
      },
    },
  },
};
```

### Add Pages

Create new files in `src/app/`:

```
src/app/services/page.tsx  ← Creates /services route
```

### Add Content

Replace placeholder images in `public/images/`.
Edit text content in page components.

---

## Deployment

### Vercel (Recommended)

```bash
cd website-pipeline/website-builds/<site-name>
npx vercel
```

Follow the prompts to deploy.

### Other Platforms

The generated site is standard Next.js. It deploys to:

- Netlify
- AWS Amplify
- Cloudflare Pages
- Any Node.js hosting

---

## Common Issues

### "npm install fails"

```bash
npm install --legacy-peer-deps
```

### "Port already in use"

```bash
PORT=3001 npm run dev
```

### "Build errors"

Check the terminal output. Common causes:

- Missing environment variables
- TypeScript type errors

---

## Next Steps

- [Preview Output](./preview-output.md) - Learn the preview system
- [Build a dApp](./build-dapp.md) - Add dynamic features
- [Troubleshooting](../TROUBLESHOOTING.md) - Problem solving

---

**Back to**: [Index](../index.md)
