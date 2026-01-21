# Factory ZIP Contract

**Version**: 2.0
**Status**: SOURCE OF TRUTH

This document specifies the exact structure and contents of a valid Factory upload package. The validator and zip creator enforce this contract exactly.

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
        ├── providers.tsx # REQUIRED - app providers
        └── globals.css   # REQUIRED
```

---

## Required Files

These files MUST be present or validation fails:

| File                    | Purpose                                    |
| ----------------------- | ------------------------------------------ |
| `package.json`          | Project configuration and dependencies     |
| `tsconfig.json`         | TypeScript configuration                   |
| `next.config.js`        | Next.js configuration                      |
| `tailwind.config.ts`    | Tailwind CSS configuration                 |
| `postcss.config.js`     | PostCSS configuration                      |
| `.env.example`          | Environment variable template              |
| `src/app/layout.tsx`    | Root layout component                      |
| `src/app/page.tsx`      | Home page component                        |
| `src/app/providers.tsx` | App providers (context, wallet if enabled) |
| `src/app/globals.css`   | Global styles                              |

---

## Dependencies

### Required Dependencies (All Apps)

`package.json` must include these core dependencies:

```json
{
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.0.0",
    "react-dom": "^18.0.0"
  },
  "devDependencies": {
    "typescript": "^5.0.0",
    "tailwindcss": "^3.0.0"
  }
}
```

### Optional Dependencies (Token-Enabled Apps)

If the app includes token integration, these dependencies should be present:

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

**Note:** These are only validated if the app uses wallet integration. Apps without token integration do not need these.

---

## Wallet Provider Requirements (Token-Enabled Apps Only)

If `package.json` includes `@solana/wallet-adapter-react`, then `src/app/providers.tsx` MUST:

1. Import and use `ConnectionProvider` from `@solana/wallet-adapter-react`
2. Import and use `WalletProvider` from `@solana/wallet-adapter-react`
3. Include `PhantomWalletAdapter` in wallet list

`src/app/providers.tsx` MUST NOT:

1. Include `BackpackWalletAdapter` (causes runtime errors)

**If the app does NOT include Solana dependencies, these checks are skipped.**

---

## Forbidden Files

These files MUST NOT be included:

| Pattern           | Reason              |
| ----------------- | ------------------- |
| `node_modules/`   | Installed on deploy |
| `.git/`           | Version control     |
| `.next/`          | Build output        |
| `out/`            | Export output       |
| `dist/`           | Build output        |
| `.env`            | Contains secrets    |
| `.env.local`      | Contains secrets    |
| `.env.production` | Contains secrets    |
| `.env.*.local`    | Contains secrets    |
| `*.zip`           | Nested archives     |
| `.DS_Store`       | macOS metadata      |
| `Thumbs.db`       | Windows metadata    |

---

## Forbidden Code Patterns

Source files MUST NOT contain:

| Pattern                      | Reason        |
| ---------------------------- | ------------- |
| `private_key` / `privateKey` | Security risk |
| `secret_key` / `secretKey`   | Security risk |
| `mnemonic`                   | Security risk |
| `seed_phrase` / `seedPhrase` | Security risk |

Case-insensitive matching applies.

---

## Size Limits

| Constraint      | Limit      |
| --------------- | ---------- |
| Total zip size  | 50 MB max  |
| Individual file | 10 MB max  |
| Total files     | 10,000 max |

---

## Manifest File

The zip creator adds `manifest.json` at the root:

```json
{
  "app_name": "my-app",
  "created_at": "2026-01-13T12:00:00.000Z",
  "generator": "factory",
  "version": "1.0.0",
  "contract_version": "2.0",
  "token_enabled": false
}
```

This is generated automatically. Do not create manually.

---

## Token Integration (Optional)

If the app has token integration enabled, it SHOULD have:

```
src/config/constants.ts
```

With a token mint address placeholder:

```typescript
export const TOKEN_MINT = 'YOUR_TOKEN_MINT_ADDRESS';
// or
export const TOKEN_MINT = process.env.NEXT_PUBLIC_TOKEN_MINT;
```

This is optional during build. The actual token mint is set after launch.

---

## Validation Command

```bash
cd your-build-directory
npm run validate
```

---

## Zip Command

```bash
cd your-build-directory
npm run zip
```

---

## Example Valid Structure (Without Tokens)

```
my-app.zip
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
    │   └── dashboard/
    │       └── page.tsx
    ├── components/
    │   └── Button.tsx
    └── lib/
        └── utils.ts
```

## Example Valid Structure (With Tokens)

```
token-app.zip
├── manifest.json              # Added by zip
├── package.json
├── package-lock.json
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
    │   ├── providers.tsx       # Includes wallet providers
    │   ├── globals.css
    │   └── dashboard/
    │       └── page.tsx
    ├── components/
    │   ├── Button.tsx
    │   └── WalletButton.tsx
    ├── config/
    │   └── constants.ts        # TOKEN_MINT placeholder
    ├── hooks/
    │   └── useTokenBalance.ts
    └── lib/
        └── utils.ts
```

---

## Contract Changelog

### v2.0 (2026-01-13)

- Made Solana/wallet dependencies optional
- Added token_enabled flag to manifest
- Wallet provider validation only runs if Solana deps present
- Updated examples for both token and non-token apps

### v1.0 (2026-01-12)

- Initial contract specification
- Defined required files, dependencies, and forbidden patterns
- Specified manifest format
- Set size limits
