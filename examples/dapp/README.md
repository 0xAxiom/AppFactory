# dApp Example

A minimal Next.js dApp demonstrating the dApp Factory output structure.

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
dapp/
├── src/
│   ├── app/
│   │   ├── layout.tsx      # Root layout with providers
│   │   ├── page.tsx        # Home page
│   │   └── globals.css     # Global styles
│   ├── components/
│   │   └── WalletButton.tsx
│   └── lib/
│       └── utils.ts
├── public/                  # Static assets
├── next.config.js
├── tailwind.config.ts
├── package.json
└── tsconfig.json
```

## Key Features

This example demonstrates:

1. **Next.js App Router** - Modern React server components
2. **Tailwind CSS** - Utility-first styling
3. **Framer Motion** - Smooth animations
4. **Wallet Connection** - Solana wallet adapter (optional)
5. **TypeScript** - Type-safe development

## Wallet Integration

This example includes a placeholder wallet button. To enable real wallet connections:

1. Uncomment wallet adapter imports in `WalletButton.tsx`
2. Add `@solana/wallet-adapter-react` and related packages
3. Configure wallet providers in `layout.tsx`

For dApps without blockchain features, simply remove the wallet components.

## Next Steps

This is a minimal example. Full dApp Factory builds include:

- Complete multi-page navigation
- Agent integration (Mode B)
- Market research and competitor analysis
- Ralph QA with Playwright E2E tests
- Deployment configuration

Run the full pipeline:

```bash
cd ../../dapp-factory
claude
# Describe your dApp idea
```
