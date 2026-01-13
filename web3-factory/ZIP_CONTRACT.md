# Web3 Factory ZIP Contract

**Version**: 1.0
**Status**: SOURCE OF TRUTH

This document specifies the exact structure and contents of a valid Web3 Factory upload package. The validator and zip creator enforce this contract exactly.

---

## Root Layout

The zip MUST have `package.json` at the root level (no wrapper folder).

```
<app-name>.zip
├── package.json          # REQUIRED - at root
├── manifest.json         # REQUIRED - added by zip creator
├── tsconfig.json         # REQUIRED
├── next.config.js        # REQUIRED
├── tailwind.config.ts    # REQUIRED
├── postcss.config.js     # REQUIRED
├── .env.example          # REQUIRED - environment template
├── README.md             # RECOMMENDED
└── src/                  # REQUIRED - source directory
    └── app/              # REQUIRED - Next.js app directory
        ├── layout.tsx    # REQUIRED
        ├── page.tsx      # REQUIRED
        ├── providers.tsx # REQUIRED - wallet providers
        └── globals.css   # REQUIRED
```

---

## Required Files

These files MUST be present or validation fails:

| File | Purpose |
|------|---------|
| `package.json` | Project configuration and dependencies |
| `tsconfig.json` | TypeScript configuration |
| `next.config.js` | Next.js configuration |
| `tailwind.config.ts` | Tailwind CSS configuration |
| `postcss.config.js` | PostCSS configuration |
| `.env.example` | Environment variable template |
| `src/app/layout.tsx` | Root layout component |
| `src/app/page.tsx` | Home page component |
| `src/app/providers.tsx` | Wallet adapter providers |
| `src/app/globals.css` | Global styles |

---

## Required Dependencies

`package.json` must include these dependencies:

```json
{
  "dependencies": {
    "@solana/wallet-adapter-react": "^0.15.0",
    "@solana/wallet-adapter-react-ui": "^0.9.0",
    "@solana/wallet-adapter-wallets": "^0.19.0",
    "@solana/web3.js": "^1.90.0"
  }
}
```

Version constraints are minimum versions. Newer versions are accepted.

---

## Wallet Provider Requirements

`src/app/providers.tsx` MUST:

1. Import and use `ConnectionProvider` from `@solana/wallet-adapter-react`
2. Import and use `WalletProvider` from `@solana/wallet-adapter-react`
3. Include `PhantomWalletAdapter` in wallet list

`src/app/providers.tsx` MUST NOT:

1. Include `BackpackWalletAdapter` (causes runtime errors)

---

## Forbidden Files

These files MUST NOT be included:

| Pattern | Reason |
|---------|--------|
| `node_modules/` | Installed on deploy |
| `.git/` | Version control |
| `.next/` | Build output |
| `out/` | Export output |
| `dist/` | Build output |
| `.env` | Contains secrets |
| `.env.local` | Contains secrets |
| `.env.production` | Contains secrets |
| `.env.*.local` | Contains secrets |
| `*.zip` | Nested archives |
| `.DS_Store` | macOS metadata |
| `Thumbs.db` | Windows metadata |

---

## Forbidden Code Patterns

Source files MUST NOT contain:

| Pattern | Reason |
|---------|--------|
| `private_key` / `privateKey` | Security risk |
| `secret_key` / `secretKey` | Security risk |
| `mnemonic` | Security risk |
| `seed_phrase` / `seedPhrase` | Security risk |

Case-insensitive matching applies.

---

## Size Limits

| Constraint | Limit |
|------------|-------|
| Total zip size | 50 MB max |
| Individual file | 10 MB max |
| Total files | 10,000 max |

---

## Manifest File

The zip creator adds `manifest.json` at the root:

```json
{
  "app_name": "roast-battle",
  "created_at": "2026-01-12T12:00:00.000Z",
  "generator": "web3-factory",
  "version": "1.0.0",
  "contract_version": "1.0"
}
```

This is generated automatically. Do not create manually.

---

## Token Integration (Optional)

If the app has token integration, it SHOULD have:

```
src/config/constants.ts
```

With a token mint address placeholder:

```typescript
export const TOKEN_MINT = "YOUR_TOKEN_MINT_ADDRESS";
// or
export const TOKEN_MINT = process.env.NEXT_PUBLIC_TOKEN_MINT;
```

This is optional during build. The actual token mint is set after launch on factoryapp.dev.

---

## Validation Command

```bash
cd your-build-directory
npx web3-factory validate
```

Or if running from the web3-factory repo:

```bash
npm run validate  # run from build directory
```

---

## Zip Command

```bash
cd your-build-directory
npx web3-factory zip
```

Or if running from the web3-factory repo:

```bash
npm run zip  # run from build directory
```

---

## Example Valid Structure

```
roast-battle.zip
├── manifest.json              # Added by zip
├── package.json
├── package-lock.json          # Optional but allowed
├── tsconfig.json
├── next.config.js
├── tailwind.config.ts
├── postcss.config.js
├── .env.example
├── README.md
├── public/
│   └── favicon.ico
└── src/
    ├── app/
    │   ├── layout.tsx
    │   ├── page.tsx
    │   ├── providers.tsx
    │   ├── globals.css
    │   ├── battle/
    │   │   └── page.tsx
    │   └── leaderboard/
    │       └── page.tsx
    ├── components/
    │   ├── BattleCard.tsx
    │   └── WalletButton.tsx
    ├── config/
    │   └── constants.ts
    └── lib/
        └── utils.ts
```

---

## Contract Changelog

### v1.0 (2026-01-12)
- Initial contract specification
- Defined required files, dependencies, and forbidden patterns
- Specified manifest format
- Set size limits
