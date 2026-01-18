# Build Prompt: Builder Proof Dashboard

**Generated:** 2026-01-13T00:00:00.000Z
**App Slug:** builder-proof-dashboard
**Token Integration:** ENABLED

---

## Your Mission

Build a complete Next.js 14 web application based on this idea:

> Build a web3 dashboard that shows on-chain proof of work, not hype. The app should connect to a wallet (read-only) and display: The user's first on-chain transaction (chain, date, age of wallet), Total number of transactions and active days, Contracts the wallet has interacted with most, A simple "Builder Score" derived from consistency over time (not balance). The UI should feel calm and factual — more like an engineering report than a trading app. No prices, no charts that move fast, no hype language. The goal is to show that time + participation matter more than speculation, and to give builders something they'd be proud to share as a credibility signal.

This app includes Solana wallet integration and token support. Users can connect their wallet and interact with your token after you launch on factoryapp.dev.

---

## Technical Requirements

### Stack (Required)

- **Framework:** Next.js 14 with App Router
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS
- **State:** Zustand for global state
- **Wallet:** @solana/wallet-adapter-react (Phantom, Solflare)
- **Blockchain:** @solana/web3.js

### Project Structure

```
builder-proof-dashboard/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout with providers
│   │   ├── page.tsx            # Homepage
│   │   ├── providers.tsx       # Wallet + context providers
│   │   └── globals.css         # Tailwind globals
│   ├── components/
│   │   ├── ui/                 # Base UI components (Button, Card, etc)
│   │   ├── wallet/             # Wallet components
│   │   └── [feature]/          # Feature-specific components
│   ├── hooks/
│   │   └── useTokenBalance.ts  # Token balance hook
│   ├── lib/
│   │   └── utils.ts            # Utility functions
│   ├── config/
│   │   └── constants.ts        # Token address, API URLs
│   └── types/
│       └── index.ts            # TypeScript types
├── public/                     # Static assets
├── package.json
├── tailwind.config.ts
├── tsconfig.json
├── postcss.config.js
├── .env.example
└── next.config.js
```

---

## Wallet Integration

### providers.tsx

```typescript
"use client";

import { useMemo } from "react";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import { clusterApiUrl } from "@solana/web3.js";

import "@solana/wallet-adapter-react-ui/styles.css";

export function Providers({ children }: { children: React.ReactNode }) {
  const network = process.env.NEXT_PUBLIC_SOLANA_NETWORK as "mainnet-beta" | "devnet" || "mainnet-beta";

  const endpoint = useMemo(() => {
    return process.env.NEXT_PUBLIC_SOLANA_RPC_URL || clusterApiUrl(network);
  }, [network]);

  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
    ],
    []
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
```

---

## Token Integration

### constants.ts

```typescript
import { PublicKey } from "@solana/web3.js";

// Token will be set after launch on factoryapp.dev
export const TOKEN_MINT = new PublicKey(
  process.env.NEXT_PUBLIC_TOKEN_MINT || "11111111111111111111111111111111"
);
export const TOKEN_DECIMALS = 9;
```

### useTokenBalance.ts

```typescript
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useState, useEffect } from "react";
import { TOKEN_MINT, TOKEN_DECIMALS } from "@/config/constants";
import { getAssociatedTokenAddress, getAccount } from "@solana/spl-token";

export function useTokenBalance() {
  const { connection } = useConnection();
  const { publicKey } = useWallet();
  const [balance, setBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!publicKey) {
      setBalance(null);
      return;
    }

    const fetchBalance = async () => {
      setLoading(true);
      try {
        const ata = await getAssociatedTokenAddress(TOKEN_MINT, publicKey);
        const account = await getAccount(connection, ata);
        setBalance(Number(account.amount) / Math.pow(10, TOKEN_DECIMALS));
      } catch {
        setBalance(0);
      } finally {
        setLoading(false);
      }
    };

    fetchBalance();
  }, [publicKey, connection]);

  return { balance, loading };
}
```

---

## Design Guidelines

- **Theme:** Dark mode by default
- **Colors:** Use app-appropriate color palette
- **Typography:** Clean, modern, readable
- **Responsiveness:** Mobile-first, works on all screen sizes
- **Accessibility:** WCAG 2.1 AA compliant

---

## Required Pages

Based on the app idea, create appropriate pages. At minimum:

1. **Homepage** - Main landing/dashboard
2. **Feature pages** - Core app functionality
3. **Profile** - User profile (wallet-based)

---

## Output Checklist

When you're done, verify:

- [ ] All files created in correct structure
- [ ] `npm install` runs without errors
- [ ] `npm run dev` starts the app
- [ ] Wallet connect button works
- [ ] Token balance displays (shows 0 if no tokens)
- [ ] All core features functional
- [ ] Responsive on mobile
- [ ] `.env.example` included with required vars

---

## Notes

- Token address will be set after launching on factoryapp.dev
- Focus on great UX and functional features
- Use mock data for backend-dependent features
- Include clear README instructions for what needs backend setup

---

**Now build this app!**
