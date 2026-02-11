# Solana Wallet Adapter Reference

## Overview

Solana Wallet Adapter provides React components and hooks for connecting Solana wallets to web applications.

## Installation

```bash
npm install @solana/wallet-adapter-base \
  @solana/wallet-adapter-react \
  @solana/wallet-adapter-react-ui \
  @solana/wallet-adapter-wallets \
  @solana/web3.js
```

## Setup

### Provider Setup

```typescript
// app/providers.tsx
"use client";

import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets";
import { clusterApiUrl } from "@solana/web3.js";
import { useMemo } from "react";

// Import wallet adapter styles
import "@solana/wallet-adapter-react-ui/styles.css";

export function SolanaProvider({ children }: { children: React.ReactNode }) {
  const endpoint = useMemo(() => clusterApiUrl("mainnet-beta"), []);

  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      // Add more wallets as needed
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

### Root Layout

```typescript
// app/layout.tsx
import { SolanaProvider } from "./providers";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <SolanaProvider>{children}</SolanaProvider>
      </body>
    </html>
  );
}
```

## Wallet Connection

### Multi-Button (Recommended)

```typescript
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

export function Header() {
  return (
    <header className="flex justify-between items-center p-4">
      <h1>My dApp</h1>
      <WalletMultiButton />
    </header>
  );
}
```

### Custom Button

```typescript
"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";

export function CustomWalletButton() {
  const { publicKey, disconnect, connected } = useWallet();
  const { setVisible } = useWalletModal();

  if (connected && publicKey) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm">
          {publicKey.toBase58().slice(0, 4)}...{publicKey.toBase58().slice(-4)}
        </span>
        <button
          onClick={disconnect}
          className="px-3 py-1 bg-red-500 text-white rounded"
        >
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setVisible(true)}
      className="px-4 py-2 bg-purple-500 text-white rounded"
    >
      Connect Wallet
    </button>
  );
}
```

## Hooks

### useWallet

```typescript
import { useWallet } from "@solana/wallet-adapter-react";

function WalletInfo() {
  const {
    publicKey, // PublicKey | null
    connected, // boolean
    connecting, // boolean
    disconnecting, // boolean
    wallet, // Wallet | null
    wallets, // Wallet[]
    select, // (walletName) => void
    connect, // () => Promise<void>
    disconnect, // () => Promise<void>
    sendTransaction, // (tx, connection, options?) => Promise<string>
    signTransaction, // (tx) => Promise<Transaction>
    signAllTransactions, // (txs) => Promise<Transaction[]>
    signMessage, // (message) => Promise<Uint8Array>
  } = useWallet();

  if (!connected) return <p>Not connected</p>;

  return (
    <div>
      <p>Address: {publicKey?.toBase58()}</p>
      <p>Wallet: {wallet?.adapter.name}</p>
    </div>
  );
}
```

### useConnection

```typescript
import { useConnection } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";

function Balance() {
  const { connection } = useConnection();
  const { publicKey } = useWallet();
  const [balance, setBalance] = useState<number | null>(null);

  useEffect(() => {
    if (!publicKey) return;

    connection.getBalance(publicKey).then((lamports) => {
      setBalance(lamports / LAMPORTS_PER_SOL);
    });
  }, [connection, publicKey]);

  return <p>Balance: {balance?.toFixed(4)} SOL</p>;
}
```

## Transactions

### Send SOL

```typescript
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import {
  Transaction,
  SystemProgram,
  PublicKey,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";

async function sendSol(to: string, amount: number) {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();

  if (!publicKey) throw new Error("Wallet not connected");

  const transaction = new Transaction().add(
    SystemProgram.transfer({
      fromPubkey: publicKey,
      toPubkey: new PublicKey(to),
      lamports: amount * LAMPORTS_PER_SOL,
    })
  );

  const signature = await sendTransaction(transaction, connection);

  // Wait for confirmation
  await connection.confirmTransaction(signature, "confirmed");

  return signature;
}
```

### Sign Message

```typescript
import { useWallet } from "@solana/wallet-adapter-react";

async function signMessage(message: string) {
  const { signMessage, publicKey } = useWallet();

  if (!publicKey || !signMessage) {
    throw new Error("Wallet not connected or signing not supported");
  }

  const encodedMessage = new TextEncoder().encode(message);
  const signature = await signMessage(encodedMessage);

  return {
    signature: Buffer.from(signature).toString("base64"),
    publicKey: publicKey.toBase58(),
  };
}
```

## Supported Wallets

| Wallet          | Adapter                    |
| --------------- | -------------------------- |
| Phantom         | PhantomWalletAdapter       |
| Solflare        | SolflareWalletAdapter      |
| Backpack        | BackpackWalletAdapter      |
| Coinbase Wallet | CoinbaseWalletAdapter      |
| Ledger          | LedgerWalletAdapter        |
| Torus           | TorusWalletAdapter         |

## UI Customization

### Custom Styles

```css
/* Override wallet adapter styles */
.wallet-adapter-button {
  background-color: #6366f1 !important;
  border-radius: 12px !important;
}

.wallet-adapter-modal-wrapper {
  background-color: #1f2937 !important;
}
```

### Dark Mode

The wallet adapter automatically respects `prefers-color-scheme`. For manual control:

```typescript
<WalletModalProvider className="dark">{children}</WalletModalProvider>
```

## Best Practices

### 1. Don't Make Wallet Connection Dominant

```typescript
// Good - subtle wallet button
<header className="flex justify-between">
  <Logo />
  <nav>{/* Main navigation */}</nav>
  <WalletMultiButton className="!bg-transparent !text-sm" />
</header>

// Bad - wallet as primary CTA
<main>
  <h1>Welcome!</h1>
  <WalletMultiButton className="!text-2xl !py-6" />
</main>
```

### 2. Handle Loading States

```typescript
function WalletActions() {
  const { connected, connecting, publicKey } = useWallet();

  if (connecting) {
    return <Spinner />;
  }

  if (!connected) {
    return <ConnectPrompt />;
  }

  return <UserDashboard address={publicKey!.toBase58()} />;
}
```

### 3. Error Handling

```typescript
import { WalletError } from "@solana/wallet-adapter-base";

const onError = useCallback((error: WalletError) => {
  console.error(error);
  toast.error(error.message);
}, []);

<WalletProvider wallets={wallets} onError={onError}>
  {children}
</WalletProvider>;
```

## Resources

- [Wallet Adapter GitHub](https://github.com/solana-labs/wallet-adapter)
- [Solana Web3.js](https://solana-labs.github.io/solana-web3.js/)
- [Solana Cookbook](https://solanacookbook.com/)
