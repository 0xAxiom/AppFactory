# Bags SDK Implementation Guide

## Overview

This document provides the authoritative technical implementation guide for Bags SDK integration within Web3 Factory. All implementation details are based on official Bags documentation and SDK patterns.

## Bags SDK Capabilities

Based on the official Bags SDK (`@bagsfm/bags-sdk`):

### Core Services
- **`bagsApiClient`**: HTTP API client for direct API communication
- **`tokenLaunch`**: Token launch management and creation
- **`state`**: Token and transaction state management  
- **`config`**: SDK configuration service
- **`fee`**: Fee management and routing

### Requirements
- Node.js >= 18.0.0
- Bags API key from https://dev.bags.fm
- Solana RPC provider (Helius recommended)
- `@solana/web3.js` for blockchain interaction

### Installation
```bash
npm install @bagsfm/bags-sdk @solana/web3.js
```

## Token Creation Flow

### Step-by-Step Process

1. **SDK Initialization**
```typescript
import { BagsSDK } from '@bagsfm/bags-sdk';
import { Connection } from '@solana/web3.js';

const connection = new Connection(process.env.SOLANA_RPC_URL);
const sdk = new BagsSDK(
  process.env.BAGS_API_KEY,
  connection,
  'processed' // commitment level
);
```

2. **Token Metadata Preparation**
```typescript
const tokenConfig = {
  name: "Token Name",
  symbol: "SYMBOL",
  description: "Token description",
  // Additional metadata fields from W2 token model
};
```

3. **Token Launch Execution**
```typescript
// TODO: Exact method signature from official SDK docs
const launchResult = await sdk.tokenLaunch.createToken({
  ...tokenConfig,
  // Fee routing configuration
  // Partner key integration
});
```

4. **Transaction Processing**
```typescript
// TODO: Transaction confirmation and receipt handling
// Based on official SDK response structure
```

## Fee Routing Configuration

### Required Setup
- **Creator Share**: 75% of protocol fees
- **App Factory Partner Share**: 25% of protocol fees
- **Partner Key**: `FDYcVLxHkekUFz4M29hCuBH3vbf1aLm62GEFZxLFdGE7`

### Implementation Pattern
```typescript
const feeConfig = {
  partnerKey: 'FDYcVLxHkekUFz4M29hCuBH3vbf1aLm62GEFZxLFdGE7',
  creatorAddress: process.env.CREATOR_WALLET_ADDRESS,
  feeSharing: {
    creator: 75, // 75% to creator
    partner: 25  // 25% to App Factory partner
  }
};

// TODO: Exact integration point in SDK
// Based on official fee configuration methods
```

## Required Environment Variables

### Production Environment
```bash
# Bags API Configuration
BAGS_API_KEY=your_bags_api_key_here
BAGS_ENVIRONMENT=mainnet

# Solana Configuration  
SOLANA_RPC_URL=https://mainnet.helius-rpc.com/?api-key=your_helius_key
SOLANA_NETWORK=mainnet-beta

# Creator Configuration
CREATOR_WALLET_ADDRESS=creator_public_key_here

# App Factory Partner (Fixed)
APP_FACTORY_PARTNER_KEY=FDYcVLxHkekUFz4M29hCuBH3vbf1aLm62GEFZxLFdGE7
```

### Development Environment
```bash
# Bags API Configuration
BAGS_API_KEY=your_dev_bags_api_key
BAGS_ENVIRONMENT=devnet

# Solana Configuration
SOLANA_RPC_URL=https://api.devnet.solana.com
SOLANA_NETWORK=devnet

# Creator Configuration (Development)
CREATOR_WALLET_ADDRESS=dev_wallet_public_key

# App Factory Partner (Fixed)
APP_FACTORY_PARTNER_KEY=FDYcVLxHkekUFz4M29hCuBH3vbf1aLm62GEFZxLFdGE7
```

## Idempotency Strategy

### Build ID Generation
```typescript
import { createHash } from 'crypto';

function generateBuildId(tokenConfig: any): string {
  const configString = JSON.stringify(tokenConfig, Object.keys(tokenConfig).sort());
  return createHash('sha256').update(configString).digest('hex').substring(0, 16);
}
```

### Receipt Management
```typescript
interface TokenReceipt {
  buildId: string;
  tokenAddress: string;
  transactionId: string;
  createdAt: string;
  inputHash: string;
  feeRouting: {
    creator: { address: string; percentage: number };
    partner: { address: string; percentage: number };
  };
}

function writeTokenReceipt(receipt: TokenReceipt, outputPath: string) {
  const fs = require('fs');
  fs.writeFileSync(outputPath, JSON.stringify(receipt, null, 2));
}

function loadTokenReceipt(receiptPath: string): TokenReceipt | null {
  try {
    const fs = require('fs');
    return JSON.parse(fs.readFileSync(receiptPath, 'utf8'));
  } catch {
    return null;
  }
}
```

### Re-run Safety
```typescript
function isTokenCreationComplete(receiptPath: string, inputHash: string): boolean {
  const existingReceipt = loadTokenReceipt(receiptPath);
  return existingReceipt !== null && existingReceipt.inputHash === inputHash;
}

// Usage in W5 Build & Ship
if (isTokenCreationComplete(receiptPath, inputHash)) {
  console.log('Token already created, skipping creation');
  return loadTokenReceipt(receiptPath);
}
```

## Failure Modes & Handling

### API Rate Limiting (1,000 requests/hour)
```typescript
async function withRetry<T>(operation: () => Promise<T>, maxRetries = 3): Promise<T> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      if (error.status === 429 && attempt < maxRetries) {
        // Rate limit hit, exponential backoff
        const delay = Math.pow(2, attempt) * 1000;
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
      throw error;
    }
  }
  throw new Error('Max retries exceeded');
}
```

### Network & RPC Issues
```typescript
async function createTokenWithFallback(config: TokenConfig): Promise<TokenReceipt> {
  try {
    return await createTokenPrimary(config);
  } catch (error) {
    console.error('Primary token creation failed:', error);
    
    // Log detailed error for debugging
    writeErrorLog(error, config);
    
    // Check if partial success occurred
    const partialReceipt = checkPartialCreation(config.buildId);
    if (partialReceipt) {
      throw new Error(`Partial token creation detected: ${partialReceipt.tokenAddress}`);
    }
    
    throw error;
  }
}
```

### Partial Success Handling
```typescript
function checkPartialCreation(buildId: string): TokenReceipt | null {
  // TODO: Query Bags API for existing token with matching metadata
  // Based on SDK state management capabilities
  return null;
}
```

## Security Model

### Secret Management
- **Environment Variables Only**: All secrets via `process.env`
- **No Disk Storage**: API keys never written to files
- **Build-time Injection**: Secrets injected during deployment only

### Disk Artifacts (Safe for Git)
```typescript
interface SafeDiskArtifact {
  // Public information only
  tokenAddress: string;
  transactionId: string;
  metadata: {
    name: string;
    symbol: string;
    description: string;
  };
  feeRouting: {
    creator: { percentage: number }; // No actual address
    partner: { percentage: number };
  };
  timestamps: {
    createdAt: string;
    network: string;
  };
}
```

## Minimal SDK Usage Examples

### Basic Token Creation
```typescript
import { BagsSDK } from '@bagsfm/bags-sdk';

async function createToken(config: TokenConfig): Promise<TokenReceipt> {
  const sdk = new BagsSDK(
    process.env.BAGS_API_KEY!,
    connection,
    'processed'
  );

  // TODO: Replace with actual SDK method from official docs
  const result = await sdk.tokenLaunch.createToken({
    name: config.name,
    symbol: config.symbol,
    description: config.description,
    // Partner configuration
    partnerKey: process.env.APP_FACTORY_PARTNER_KEY,
    // Fee routing based on official SDK patterns
  });

  return {
    buildId: config.buildId,
    tokenAddress: result.tokenMint.toString(),
    transactionId: result.signature,
    createdAt: new Date().toISOString(),
    inputHash: config.inputHash,
    feeRouting: {
      creator: { address: config.creatorAddress, percentage: 75 },
      partner: { address: process.env.APP_FACTORY_PARTNER_KEY!, percentage: 25 }
    }
  };
}
```

### Fee Configuration
```typescript
// TODO: Exact fee configuration based on SDK documentation
async function configureFeeRouting(sdk: BagsSDK, tokenMint: string) {
  await sdk.fee.configureFeeSharing({
    tokenMint,
    partnerKey: process.env.APP_FACTORY_PARTNER_KEY,
    feeDistribution: {
      creator: 75,
      partner: 25
    }
  });
}
```

## Integration Points

### W4 Stage Integration
- **Purpose**: Configuration only, no token creation
- **Output**: `bags_config.json` with validated parameters
- **Environment**: Validate required env vars without exposing secrets

### W5 Stage Integration
- **Purpose**: Execute token creation via SDK
- **Input**: `bags_config.json` from W4
- **Output**: Complete token receipt and web app integration
- **Idempotency**: Safe re-runs via receipt checking

## TODO Items (Unknown from Documentation)

The following items require clarification from official Bags documentation:

1. **Exact token creation method signature** in `sdk.tokenLaunch`
2. **Fee routing configuration API** - exact parameters and methods
3. **Partner key integration points** - how partner attribution works
4. **State management methods** for checking existing tokens
5. **Error response structure** from API for proper error handling
6. **Rate limiting headers** and proper backoff strategies

These items must be researched from the authoritative sources before implementation.