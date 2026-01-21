# Base Mini App Example

A minimal Base Mini App demonstrating the MiniApp Pipeline output structure.

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Structure

```
miniapp/
├── app/
│   ├── .well-known/
│   │   └── farcaster.json/
│   │       └── route.ts    # Manifest route
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Home page
│   └── globals.css
├── components/
│   └── MiniAppHeader.tsx
├── public/
│   ├── icon.png            # 1024x1024
│   ├── splash.png          # 200x200
│   └── hero.png            # 1200x630
├── minikit.config.ts       # MiniKit configuration
├── next.config.js
├── package.json
└── tsconfig.json
```

## Key Features

This example demonstrates:

1. **MiniKit Integration** - Manifest configuration and route
2. **Account Association** - Placeholder for domain verification
3. **Responsive UI** - Mobile-first design for Base app
4. **TypeScript** - Type-safe development

## Account Association (Required)

Before deploying, you must complete account association:

1. Deploy to Vercel (or your hosting provider)
2. Go to [base.dev](https://base.dev)
3. Follow the account association flow
4. Copy the `header`, `payload`, and `signature` values
5. Update `minikit.config.ts` with these values

**Important**: The mini app will not appear in Base until account association is complete.

## Manifest Route

The manifest is served from `/.well-known/farcaster.json`:

```bash
curl http://localhost:3000/.well-known/farcaster.json
```

## Preview Tool

Test your mini app with the Base Preview Tool:

1. Start your dev server (`npm run dev`)
2. Use ngrok or similar to get a public URL
3. Enter the URL in the Base Preview Tool
4. Check all three tabs show success

## Next Steps

This is a minimal example. Full MiniApp Pipeline builds include:

- Complete multi-page navigation
- Account association guidance
- Ralph QA verification
- Publication checklist
- Deployment instructions

Run the full pipeline:

```bash
cd ../../miniapp-pipeline
claude
# Describe your mini app idea
```
