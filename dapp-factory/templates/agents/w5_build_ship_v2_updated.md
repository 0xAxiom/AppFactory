# W5: Build & Ship (Token Launch v2 Compliant)

## AGENT-NATIVE EXECUTION
You are Claude executing W5 for Web3 Factory. Generate complete production-ready web application and create token via Bags SDK using Token Launch v2 3-step process (if token required).

## TOKEN LAUNCH V2 CRITICAL IMPLEMENTATION

**MANDATORY CHANGES**:
- Support both token-powered and token-free Web3 apps
- Use Token Launch v2 3-step process with explicit fee share config
- Implement social provider resolution for GitHub/Twitter/Kick
- Handle custom LUT creation for >15 fee claimers
- Distinguish partner attribution vs partner payout addresses
- Full error handling and retry logic per Bags principles

**BREAKING CHANGE**: W5 must handle apps that don't require token creation.

## EXECUTION MODES

### Mode 1: Token-Powered App
1. Execute Token Launch v2 3-step process
2. Generate web app with token integration
3. Wire token functionality into app behavior
4. Create complete token receipt and documentation

### Mode 2: Token-Free Web3 App
1. Generate web app with wallet authentication only
2. Implement SOL/USDC payment flows (if applicable)
3. Focus on onchain data and wallet-based features
4. Skip token creation entirely

**Mode Determination**: Based on W4 `app_configuration.requires_token_creation`.

## INPUTS
- Read: `web3-factory/runs/.../w1/web3_idea.json`
- Read: `web3-factory/runs/.../w2/token_model.json`
- Read: `web3-factory/runs/.../w3/web3_architecture.json`
- Read: `web3-factory/runs/.../w4/bags_config.json`

## OUTPUTS

### Token-Powered App Outputs
- Write: `web3-factory/builds/<app_name>/` - Complete web application
- Write: `web3-factory/builds/<app_name>/token/token_receipt.json` - Token creation receipt
- Write: `web3-factory/builds/<app_name>/token/token_receipt.md` - Human-readable token info
- Write: `web3-factory/builds/<app_name>/README.md` - Setup and deployment guide
- Write: `web3-factory/runs/.../w5/w5_execution.md` - Execution log
- Write: `web3-factory/runs/.../w5/build_manifest.json` - Build metadata

### Token-Free App Outputs
- Write: `web3-factory/builds/<app_name>/` - Complete web application  
- Write: `web3-factory/builds/<app_name>/README.md` - Setup guide (no token info)
- Write: `web3-factory/runs/.../w5/w5_execution.md` - Execution log
- Write: `web3-factory/runs/.../w5/build_manifest.json` - Build metadata

## TOKEN LAUNCH V2 IMPLEMENTATION (TOKEN-POWERED APPS)

### Step 1: Environment Validation

```typescript
function validateTokenLaunchEnvironment(): void {
  const requiredVars = [
    'BAGS_API_KEY',
    'SOLANA_RPC_URL', 
    'SOLANA_NETWORK',
    'CREATOR_WALLET_ADDRESS',
    'PRIVATE_KEY'
  ];
  
  for (const varName of requiredVars) {
    if (!process.env[varName]) {
      throw new Error(`Missing required environment variable: ${varName}`);
    }
  }
}
```

### Step 2: Social Provider Resolution

```typescript
import { 
  resolveSocialFeeClaimer, 
  resolveAllFeeClaimers,
  validateFeeClaimersBPS 
} from '../utils/fee_share_config.js';

async function resolveFeeClaimers(w4Config: BagsConfig): Promise<WalletFeeClaimer[]> {
  const feeClaimers = w4Config.fee_share_config_v2.fee_claimers;
  
  // Validate BPS total before resolution
  validateFeeClaimersBPS(feeClaimers);
  
  // Resolve all social claimers to wallet addresses
  const resolved = await resolveAllFeeClaimers(feeClaimers);
  
  console.log(`Resolved ${feeClaimers.length} fee claimers (${resolved.length} wallet addresses)`);
  return resolved;
}
```

### Step 3: Token Launch v2 3-Step Process

```typescript
import { BagsSDK } from '@bagsfm/bags-sdk';

async function executeTokenLaunchV2(w4Config: BagsConfig): Promise<TokenReceipt> {
  const sdk = new BagsSDK({
    apiKey: process.env.BAGS_API_KEY,
    network: process.env.SOLANA_NETWORK,
    rpcUrl: process.env.SOLANA_RPC_URL
  });
  
  // Step 1: Create token info and metadata
  const tokenInfo = await sdk.createTokenInfoAndMetadata({
    name: w4Config.token_metadata.name,
    symbol: w4Config.token_metadata.symbol,
    description: w4Config.token_metadata.description,
    image: w4Config.token_metadata.image, // From file upload
    website: w4Config.token_metadata.website,
    twitter: w4Config.token_metadata.twitter
  });
  
  console.log(`Token metadata created: ${tokenInfo.mint}`);
  
  // Step 2: Create fee share configuration (MANDATORY in v2)
  const resolvedClaimers = await resolveFeeClaimers(w4Config);
  
  const feeShareConfig = await sdk.createBagsFeeShareConfig({
    partnerKey: w4Config.fee_share_config_v2.partner_attribution.partner_key,
    totalBPS: w4Config.fee_share_config_v2.total_bps, // Always 10000
    feeClaimers: resolvedClaimers
  });
  
  console.log(`Fee share config created with ${resolvedClaimers.length} claimers`);
  
  // Step 3: Create launch transaction
  const launchTx = await sdk.createLaunchTransaction({
    ipfs: tokenInfo.ipfsHash,
    tokenMint: tokenInfo.mint,
    initialBuyAmount: w4Config.token_launch_params.initialBuyAmount,
    feeShareConfig: feeShareConfig, // MANDATORY in v2
    // Optional tipping
    tipWallet: w4Config.tipping_config?.tip_wallet,
    tipLamports: w4Config.tipping_config?.tip_lamports
  });
  
  // Sign and send transaction
  const creatorKeypair = loadCreatorKeypair(); // From PRIVATE_KEY env var
  launchTx.sign(creatorKeypair);
  
  const connection = new Connection(process.env.SOLANA_RPC_URL);
  const signature = await connection.sendAndConfirmTransaction(launchTx);
  
  console.log(`Token launched successfully: ${signature}`);
  
  return {
    buildId: w4Config.idempotency_config.build_id,
    tokenAddress: tokenInfo.mint,
    transactionId: signature,
    createdAt: new Date().toISOString(),
    feeRouting: {
      creator: { 
        bps: w4Config.fee_share_config_v2.creator_bps,
        percentage: w4Config.fee_share_config_v2.creator_bps / 100
      },
      social_claimers: w4Config.fee_share_config_v2.social_fee_claimers?.map(claimer => ({
        provider: claimer.provider,
        username: claimer.username,
        bps: claimer.bps,
        percentage: claimer.bps / 100
      })) || [],
      partner: {
        bps: w4Config.fee_share_config_v2.partner_bps,
        percentage: w4Config.fee_share_config_v2.partner_bps / 100
      }
    },
    bagsIntegration: {
      sdkVersion: '@bagsfm/bags-sdk',
      partnerKey: w4Config.fee_share_config_v2.partner_attribution.partner_key,
      tokenLaunchVersion: 'v2'
    }
  };
}
```

### Step 4: Custom LUT Creation (If Required)

```typescript
async function createCustomLUTIfRequired(w4Config: BagsConfig): Promise<string | null> {
  if (!w4Config.lookup_table_config.custom_lut_required) {
    return null;
  }
  
  const connection = new Connection(process.env.SOLANA_RPC_URL);
  const payerKeypair = loadCreatorKeypair();
  
  // Extract all wallet addresses from fee claimers
  const resolvedClaimers = await resolveFeeClaimers(w4Config);
  const addresses = resolvedClaimers.map(claimer => claimer.wallet);
  
  // Create custom LUT for >15 fee claimers
  const customLUT = await createLookupTableTransactions(
    connection,
    payerKeypair.publicKey,
    addresses
  );
  
  console.log(`Custom LUT created for ${addresses.length} fee claimers: ${customLUT.address}`);
  return customLUT.address.toBase58();
}
```

## WEB APPLICATION GENERATION

### Framework Selection
Based on W3 architecture choice:
- **Next.js 14+**: For server-side rendering and complex apps
- **Vite + React 18+**: For static apps and simpler deployments

### Token Integration (Token-Powered Apps)

```typescript
// Generated components for token-powered apps

// src/hooks/useToken.ts
export function useToken() {
  const { connection } = useConnection();
  const { publicKey } = useWallet();
  
  const [tokenBalance, setTokenBalance] = useState<number>(0);
  const [tokenAddress] = useState<string>('TOKEN_ADDRESS_FROM_RECEIPT');
  
  const getTokenBalance = useCallback(async () => {
    if (!publicKey || !connection) return;
    
    const tokenAccount = await getAssociatedTokenAddress(
      new PublicKey(tokenAddress),
      publicKey
    );
    
    try {
      const balance = await connection.getTokenAccountBalance(tokenAccount);
      setTokenBalance(balance.value.uiAmount || 0);
    } catch (error) {
      setTokenBalance(0);
    }
  }, [publicKey, connection, tokenAddress]);
  
  return { tokenBalance, tokenAddress, getTokenBalance };
}

// src/components/TokenDisplay.tsx
export function TokenDisplay() {
  const { tokenBalance, tokenAddress } = useToken();
  
  return (
    <div className="token-display">
      <h3>Your Token Balance</h3>
      <p>{tokenBalance} TOKENS</p>
      <a 
        href={`https://solscan.io/token/${tokenAddress}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        View on Solscan
      </a>
    </div>
  );
}
```

### Wallet Authentication (All Apps)

```typescript
// src/components/WalletConnection.tsx  
export function WalletConnection() {
  const { connected, connect, disconnect, publicKey } = useWallet();
  
  if (connected && publicKey) {
    return (
      <div className="wallet-connected">
        <span>{publicKey.toBase58().slice(0, 8)}...</span>
        <button onClick={disconnect}>Disconnect</button>
      </div>
    );
  }
  
  return (
    <button onClick={connect} className="wallet-connect-button">
      Connect Wallet
    </button>
  );
}
```

### Token-Free App Components

```typescript
// src/hooks/useWalletAuth.ts (token-free apps)
export function useWalletAuth() {
  const { publicKey, connected } = useWallet();
  
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  useEffect(() => {
    setIsAuthenticated(connected && !!publicKey);
  }, [connected, publicKey]);
  
  return { isAuthenticated, userAddress: publicKey?.toBase58() };
}

// src/components/SOLPayments.tsx (token-free apps with payments)
export function SOLPayments({ amount }: { amount: number }) {
  const { publicKey, sendTransaction } = useWallet();
  const { connection } = useConnection();
  
  const handlePayment = async () => {
    if (!publicKey) return;
    
    const transaction = new Transaction();
    transaction.add(
      SystemProgram.transfer({
        fromPubkey: publicKey,
        toPubkey: new PublicKey('RECIPIENT_ADDRESS'),
        lamports: amount * LAMPORTS_PER_SOL
      })
    );
    
    await sendTransaction(transaction, connection);
  };
  
  return (
    <button onClick={handlePayment}>
      Pay {amount} SOL
    </button>
  );
}
```

## ERROR HANDLING AND RETRY LOGIC

### Token Creation Error Recovery

```typescript
async function createTokenWithRetry(w4Config: BagsConfig): Promise<TokenReceipt> {
  const maxRetries = w4Config.idempotency_config.max_retries;
  let lastError: Error;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      // Check for existing token receipt (idempotency)
      const existingReceipt = checkExistingTokenReceipt(w4Config.idempotency_config.build_id);
      if (existingReceipt) {
        console.log('Token already exists, skipping creation');
        return existingReceipt;
      }
      
      // Attempt token creation
      const receipt = await executeTokenLaunchV2(w4Config);
      
      // Write receipt to disk immediately
      await writeTokenReceipt(receipt);
      
      return receipt;
    } catch (error) {
      lastError = error;
      
      if (isRetryableError(error)) {
        const delay = Math.pow(2, attempt) * 1000; // Exponential backoff
        console.log(`Token creation attempt ${attempt} failed, retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      } else {
        // Non-retryable error, fail immediately
        throw error;
      }
    }
  }
  
  throw new Error(`Token creation failed after ${maxRetries} attempts: ${lastError.message}`);
}

function isRetryableError(error: Error): boolean {
  // Based on Bags error handling principles
  const retryablePatterns = [
    'rate limit',
    'network error',
    'timeout',
    'server error',
    '429',
    '500',
    '502', 
    '503'
  ];
  
  return retryablePatterns.some(pattern => 
    error.message.toLowerCase().includes(pattern)
  );
}
```

### Social Provider Resolution Error Handling

```typescript
async function handleSocialProviderErrors(w4Config: BagsConfig): Promise<WalletFeeClaimer[]> {
  const feeClaimers = w4Config.fee_share_config_v2.fee_claimers;
  const resolved: WalletFeeClaimer[] = [];
  const failures: Array<{ claimer: any, error: string }> = [];
  
  for (const claimer of feeClaimers) {
    if ('provider' in claimer) {
      try {
        const walletClaimer = await resolveSocialFeeClaimer(claimer);
        resolved.push(walletClaimer);
      } catch (error) {
        failures.push({ claimer, error: error.message });
        
        if (w4Config.social_provider_config.social_resolution_strategy === 'fail_fast') {
          throw new Error(`Social resolution failed for ${claimer.provider}:${claimer.username}: ${error.message}`);
        }
        // else skip and continue
      }
    } else {
      resolved.push(claimer);
    }
  }
  
  if (failures.length > 0) {
    console.warn(`Skipped ${failures.length} unresolved social claimers:`, failures);
    // TODO: Redistribute BPS if using skip_unresolved strategy
  }
  
  return resolved;
}
```

## BUILD OUTPUT STRUCTURE

### Token-Powered App Structure
```
builds/<app_name>/
├── package.json                    # Complete dependencies
├── next.config.js                  # Framework configuration
├── .env.example                    # Environment template
├── README.md                       # Setup instructions with token info
├── src/
│   ├── components/
│   │   ├── WalletConnection.tsx    # Solana wallet adapter
│   │   ├── TokenDisplay.tsx        # Token balance/info
│   │   ├── TokenActions.tsx        # Token spend/earn actions
│   │   └── AppFeatures.tsx         # Main app functionality
│   ├── hooks/
│   │   ├── useToken.ts            # Token operations
│   │   ├── useTransactions.ts     # Transaction handling
│   │   └── useWallet.ts           # Wallet connection
│   ├── utils/
│   │   └── constants.ts           # Token address & config
│   └── pages/ (or app/)           # Application pages
├── token/
│   ├── token_receipt.json         # Token creation receipt
│   ├── token_receipt.md           # Human-readable info
│   └── social_fee_claimers.json   # Resolved social claimers
└── deployment_guide.md            # Production deployment
```

### Token-Free App Structure
```
builds/<app_name>/
├── package.json                    # Dependencies (no token libraries)
├── next.config.js                  # Framework configuration  
├── .env.example                    # Environment template
├── README.md                       # Setup instructions (no token info)
├── src/
│   ├── components/
│   │   ├── WalletConnection.tsx    # Wallet auth only
│   │   ├── SOLPayments.tsx         # SOL/USDC payments (if needed)
│   │   └── AppFeatures.tsx         # Main app functionality
│   ├── hooks/
│   │   ├── useWalletAuth.ts       # Wallet authentication
│   │   ├── useSOLTransactions.ts  # SOL transactions (if needed)
│   │   └── useOnchainData.ts      # Onchain data access
│   ├── utils/
│   │   └── constants.ts           # App configuration
│   └── pages/ (or app/)           # Application pages
└── deployment_guide.md            # Production deployment
```

## SUCCESS CRITERIA

W5 is successful when:

### Universal Success Criteria
- [ ] Complete web application generated with production-ready code
- [ ] Framework selection matches W3 architecture decision
- [ ] Wallet connection functionality properly implemented
- [ ] All UI components respond correctly to wallet connection state
- [ ] Environment variables properly configured in .env.example
- [ ] README.md contains accurate setup and deployment instructions
- [ ] Build manifest JSON written with correct metadata

### Token-Powered App Additional Success Criteria
- [ ] Token successfully created via Token Launch v2 3-step process
- [ ] Fee share configuration properly implemented with explicit BPS
- [ ] Social fee claimers resolved to wallet addresses (if applicable)
- [ ] Custom LUT created for >15 fee claimers (if required)
- [ ] Token receipt written to disk with complete metadata
- [ ] Token integration wired into app functionality
- [ ] Token display and transaction components working
- [ ] App behavior properly handles zero token balance scenarios

### Token-Free App Additional Success Criteria
- [ ] App functionality works entirely with wallet authentication
- [ ] SOL/USDC payment flows implemented (if applicable)
- [ ] No token-related dependencies or components included
- [ ] Onchain data access properly configured
- [ ] User experience optimized for wallet-based interactions

## FAILURE CONDITIONS

STOP execution if:
- Cannot determine app type from W4 configuration
- Environment validation fails for required variables
- Token creation fails after all retry attempts (token-powered apps)
- Social provider resolution fails in fail_fast mode (token-powered apps)
- Fee share configuration BPS validation fails (token-powered apps)
- Web application generation encounters framework errors
- Token integration fails to connect to created token (token-powered apps)
- Wallet authentication components fail to compile
- Build output validation fails

Write detailed failure analysis with:
- Exact error messages and stack traces
- Environment variable status
- Network connectivity status (if token creation)
- Social resolution results (if applicable)
- Framework compilation errors
- Remediation steps for common issues

**DO NOT OUTPUT JSON IN CHAT**. Write all artifacts to disk only.