# RoastPush Wallet Integration Strategy

## Overview

RoastPush uses Solana wallet integration for authentication, token transactions, and prize distribution. The strategy prioritizes user experience while maintaining security.

## Supported Wallets

| Wallet | Priority | Notes |
|--------|----------|-------|
| Phantom | Primary | Most popular Solana wallet |
| Solflare | Secondary | Strong mobile support |
| Backpack | Secondary | Growing user base |
| Ledger | Tertiary | Hardware wallet for power users |

## Connection Architecture

### Wallet Adapter Setup

```typescript
// providers/WalletProvider.tsx
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import {
  ConnectionProvider,
  WalletProvider,
} from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
  BackpackWalletAdapter,
  LedgerWalletAdapter,
} from '@solana/wallet-adapter-wallets';

const network = WalletAdapterNetwork.Mainnet;
const endpoint = process.env.NEXT_PUBLIC_SOLANA_RPC_URL;

const wallets = [
  new PhantomWalletAdapter(),
  new SolflareWalletAdapter(),
  new BackpackWalletAdapter(),
  new LedgerWalletAdapter(),
];
```

### Connection Flow

1. **App Load**: Check for persisted wallet connection
2. **Auto-Connect**: Attempt reconnect to previously connected wallet
3. **First Action**: Prompt connection only when user attempts paid action
4. **Connect Modal**: Show wallet options with clear explanations
5. **Signature**: Request connection approval in wallet app
6. **Success**: Store connection state, show connected UI
7. **Session**: Maintain connection across page navigations

### Connection States

```typescript
type WalletState =
  | { status: 'disconnected' }
  | { status: 'connecting' }
  | { status: 'connected'; address: string; balance: number }
  | { status: 'error'; message: string };
```

### Persistence Strategy

- Use `@solana/wallet-adapter-react` built-in localStorage persistence
- Auto-reconnect on page refresh if wallet still available
- Clear state on explicit disconnect
- Handle wallet extension removal gracefully

## Authentication (Sign In With Solana)

### Challenge-Response Flow

1. **Request Nonce**: Client requests authentication nonce from server
2. **Sign Message**: User signs nonce message with wallet
3. **Verify**: Server verifies signature matches wallet public key
4. **Issue JWT**: Server returns JWT with wallet address claim
5. **Attach Token**: Client includes JWT in subsequent API requests

### Implementation

```typescript
// Sign-in message format
const message = `RoastPush Authentication

Sign this message to verify wallet ownership.
This does not cost any SOL.

Nonce: ${nonce}
Timestamp: ${timestamp}
`;

// Verification on server
import { PublicKey } from '@solana/web3.js';
import nacl from 'tweetnacl';

function verifySignature(
  message: string,
  signature: Uint8Array,
  publicKey: string
): boolean {
  const messageBytes = new TextEncoder().encode(message);
  const publicKeyBytes = new PublicKey(publicKey).toBytes();
  return nacl.sign.detached.verify(messageBytes, signature, publicKeyBytes);
}
```

## Transaction Handling

### Transaction Types

| Type | Description | Confirmation |
|------|-------------|--------------|
| Entry Fee | Transfer ROAST to escrow | Confirmed before matchmaking |
| Prize Claim | Transfer from escrow to winner | Automatic on battle end |
| Tip | Direct transfer between users | Optimistic UI, confirm async |
| Purchase | Transfer to shop account | Confirm before unlocking item |
| Withdraw | Transfer from app to wallet | Confirmed before balance update |

### Transaction Construction

```typescript
// Example: Entry fee transaction
async function createEntryFeeTransaction(
  connection: Connection,
  userPublicKey: PublicKey,
  entryAmount: number
): Promise<Transaction> {
  const transaction = new Transaction();

  // Get token accounts
  const userTokenAccount = await getAssociatedTokenAddress(
    ROAST_MINT,
    userPublicKey
  );
  const escrowTokenAccount = await getAssociatedTokenAddress(
    ROAST_MINT,
    ESCROW_AUTHORITY
  );

  // Add transfer instruction
  transaction.add(
    createTransferInstruction(
      userTokenAccount,
      escrowTokenAccount,
      userPublicKey,
      entryAmount * (10 ** ROAST_DECIMALS)
    )
  );

  // Set recent blockhash and fee payer
  transaction.recentBlockhash = (
    await connection.getLatestBlockhash()
  ).blockhash;
  transaction.feePayer = userPublicKey;

  return transaction;
}
```

### Signing Flow

1. **Construct**: Build transaction with all instructions
2. **Simulate**: Simulate transaction for errors
3. **Present**: Show user what they're signing
4. **Sign**: Request signature via wallet adapter
5. **Send**: Submit signed transaction to network
6. **Confirm**: Wait for confirmation with retry logic

### Error Handling

```typescript
type TransactionError =
  | { code: 'WALLET_NOT_CONNECTED'; message: string }
  | { code: 'USER_REJECTED'; message: string }
  | { code: 'INSUFFICIENT_FUNDS'; message: string; required: number }
  | { code: 'INSUFFICIENT_SOL'; message: string }
  | { code: 'NETWORK_ERROR'; message: string; retry: boolean }
  | { code: 'TRANSACTION_FAILED'; message: string; signature?: string };
```

### Retry Strategy

- Network errors: Exponential backoff (1s, 2s, 4s, 8s, max 3 retries)
- User rejected: No auto-retry, show retry button
- Insufficient funds: No retry, show deposit prompt
- Transaction failed: Check if already processed, then retry once

## RPC Configuration

### Primary RPC

```typescript
const RPC_CONFIG = {
  mainnet: {
    primary: process.env.NEXT_PUBLIC_SOLANA_RPC_URL,
    fallback: 'https://api.mainnet-beta.solana.com',
  },
  devnet: {
    primary: 'https://api.devnet.solana.com',
    fallback: 'https://devnet.helius-rpc.com',
  },
};
```

### Health Checks

- Ping RPC on app load
- Monitor response times
- Auto-failover to fallback on errors
- Display degraded mode notice if both fail

### Rate Limiting

- Batch RPC calls where possible
- Cache account data for 10 seconds
- Debounce balance refreshes
- Queue non-urgent reads

## Security Considerations

### Never Trust Client

- Verify all signatures server-side
- Validate transaction intent matches user action
- Check amounts against expected values
- Verify token accounts are correct

### Protect User Keys

- Never request private keys or seed phrases
- Only use standard wallet adapter signing
- Clear sensitive data from memory
- Use secure contexts (HTTPS only)

### Transaction Safety

- Simulate before sending
- Show clear confirmation UI
- Include cancel option
- Implement timeout for long confirmations

## Testing Strategy

### Devnet Testing

- Use devnet for development
- Airdrop test SOL and tokens
- Test all transaction types
- Verify error handling

### Wallet Mocking

```typescript
// Test utilities
const mockWallet = {
  publicKey: new PublicKey('...'),
  signTransaction: jest.fn(),
  signMessage: jest.fn(),
};
```

### E2E Tests

- Connection flow
- Transaction signing
- Error scenarios
- Network failover
