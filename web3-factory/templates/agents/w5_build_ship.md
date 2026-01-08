# W5: Build & Ship

## AGENT-NATIVE EXECUTION
You are Claude executing W5 for Web3 Factory. Generate complete production-ready web app and create Solana token via Bags SDK.

## CRITICAL: TOKEN CREATION STAGE

W5 is the ONLY stage that creates tokens. All previous stages are configuration only.

**TOKEN CREATION RESPONSIBILITIES**:
1. Execute token creation via Bags SDK
2. Capture and persist token address
3. Wire token into app functionality
4. Generate complete production-ready web app

## INPUTS
- Read: `web3-factory/runs/.../w1/web3_idea.json`
- Read: `web3-factory/runs/.../w2/token_model.json`
- Read: `web3-factory/runs/.../w3/web3_architecture.json`
- Read: `web3-factory/runs/.../w4/bags_config.json`

## OUTPUTS
- Write: `web3-factory/runs/.../w5/build_manifest.json`
- Write: `web3-factory/runs/.../w5/w5_execution.md`
- Create: `web3-factory/builds/<app_name>/` (complete web app)
- Create: `web3-factory/builds/<app_name>/token_metadata.json` (created token details)

## BUILD OUTPUT STRUCTURE (MANDATORY)

Generate complete web app at `web3-factory/builds/<app_name>/`:

```
web3-factory/builds/<app_name>/
├── package.json                    # Complete dependencies
├── next.config.js                  # Next.js config (if Next.js)
├── vite.config.js                  # Vite config (if Vite)
├── tailwind.config.js              # Styling configuration
├── .env.example                    # Environment variables template
├── README.md                       # Setup and deployment instructions
├── public/
│   ├── favicon.ico                 # App favicon
│   └── metadata/                   # Token metadata files
├── src/
│   ├── components/
│   │   ├── WalletConnection.jsx    # Wallet connection component
│   │   ├── TokenBalance.jsx        # Token balance display
│   │   ├── TokenActions.jsx        # Token spending/earning actions
│   │   └── TransactionHistory.jsx  # Transaction history
│   ├── hooks/
│   │   ├── useWallet.js           # Wallet connection hook
│   │   ├── useToken.js            # Token operations hook
│   │   └── useTransactions.js     # Transaction management
│   ├── services/
│   │   ├── bags.js                # Bags SDK integration
│   │   ├── solana.js              # Solana connection management
│   │   └── token.js               # Token operation utilities
│   ├── utils/
│   │   ├── constants.js           # App and token constants
│   │   └── helpers.js             # Utility functions
│   ├── styles/                    # CSS/styling files
│   └── pages/                     # App pages (Next.js) or App.jsx (Vite)
├── token_metadata.json             # Created token details
└── deployment_guide.md             # Deployment instructions
```

## JSON SCHEMA
```json
{
  "type": "object",
  "properties": {
    "build_execution": {
      "type": "object",
      "properties": {
        "app_name": {"type": "string"},
        "build_timestamp": {"type": "string"},
        "framework_used": {"type": "string"},
        "build_path": {"type": "string"}
      },
      "required": ["app_name", "build_timestamp", "framework_used", "build_path"]
    },
    "token_creation": {
      "type": "object",
      "properties": {
        "token_address": {"type": "string"},
        "creation_transaction": {"type": "string"},
        "creation_timestamp": {"type": "string"},
        "creator_wallet": {"type": "string"},
        "network": {"type": "string"}
      },
      "required": ["token_address", "creation_transaction", "creation_timestamp", "creator_wallet", "network"]
    },
    "app_integration": {
      "type": "object",
      "properties": {
        "token_integrated": {"type": "boolean"},
        "wallet_connection_working": {"type": "boolean"},
        "balance_display_working": {"type": "boolean"},
        "token_actions_implemented": {"type": "boolean"},
        "fee_routing_active": {"type": "boolean"}
      },
      "required": ["token_integrated", "wallet_connection_working", "balance_display_working", "token_actions_implemented", "fee_routing_active"]
    },
    "production_readiness": {
      "type": "object",
      "properties": {
        "environment_configured": {"type": "boolean"},
        "error_handling_complete": {"type": "boolean"},
        "responsive_design": {"type": "boolean"},
        "deployment_ready": {"type": "boolean"}
      },
      "required": ["environment_configured", "error_handling_complete", "responsive_design", "deployment_ready"]
    }
  },
  "required": ["build_execution", "token_creation", "app_integration", "production_readiness"]
}
```

## EXECUTION STEPS

### Phase 1: Token Creation
1. **Initialize Bags SDK**:
   - Configure SDK with W4 parameters
   - Set up environment variables
   - Prepare idempotency key

2. **Create Token**:
   - Execute token creation via Bags SDK
   - Implement retry logic for network failures
   - Capture token address and transaction hash
   - Verify token creation on Solana

3. **Document Token**:
   - Write token metadata to disk
   - Generate metadata JSON for app consumption
   - Document fee routing configuration
   - Create audit trail of creation parameters

### Phase 2: Web App Generation
4. **Initialize Framework**:
   - Set up Next.js or Vite project structure
   - Configure build tools and dependencies
   - Set up styling system (Tailwind CSS)

5. **Implement Core Components**:
   - Wallet connection with multiple wallet support
   - Token balance display with real-time updates
   - Token action components based on token role
   - Transaction history and status tracking

6. **Integrate Solana & Token**:
   - Configure wallet adapter for chosen framework
   - Implement token balance querying
   - Wire token actions to app functionality
   - Set up transaction confirmation flow

### Phase 3: App Integration
7. **Implement Token Behavior**:
   - Map token role to app functionality
   - Implement spending/earning mechanisms
   - Configure fee routing in app transactions
   - Handle edge cases (zero balance, network errors)

8. **Add Production Features**:
   - Error boundaries and fallback UI
   - Loading states for all async operations
   - Responsive design for mobile/desktop
   - SEO optimization (Next.js) or performance (Vite)

### Phase 4: Production Hardening
9. **Environment Configuration**:
   - Create .env.example with all required variables
   - Document environment setup process
   - Configure different networks (mainnet/devnet)
   - Set up production deployment variables

10. **Documentation & Deployment**:
    - Generate comprehensive README
    - Create deployment guide for major platforms
    - Document token integration patterns
    - Provide troubleshooting guide

## TOKEN INTEGRATION PATTERNS

### ACCESS Token Integration
```javascript
// Example: Unlock premium features
const hasAccess = tokenBalance >= FEATURE_COST;
const unlockFeature = () => {
  if (hasAccess) {
    // Spend tokens to unlock
    transferTokens(FEATURE_COST);
    // Grant access
  }
};
```

### USAGE Token Integration
```javascript
// Example: Pay per action
const performAction = async () => {
  if (tokenBalance >= ACTION_COST) {
    await transferTokens(ACTION_COST);
    // Perform the action
  } else {
    // Show insufficient balance message
  }
};
```

### FEE CAPTURE Token Integration
```javascript
// Example: Distribute fees to token holders
const distributeFees = async (totalFees) => {
  const creatorShare = totalFees * 0.75; // 75% to creator
  const partnerShare = totalFees * 0.25; // 25% to App Factory partner
  // Route fees according to configuration (partner key: FDYcVLxHkekUFz4M29hCuBH3vbf1aLm62GEFZxLFdGE7)
};
```

## PRODUCTION REQUIREMENTS

### Dependencies (Mandatory)
```json
{
  "dependencies": {
    "react": "^18.0.0",
    "next": "^14.0.0",
    "@solana/web3.js": "^1.87.0",
    "@solana/wallet-adapter-react": "^0.15.0",
    "@solana/wallet-adapter-wallets": "^0.19.0",
    "bags-sdk": "latest",
    "tailwindcss": "^3.0.0"
  }
}
```

### Error Handling (Mandatory)
- Wallet connection failures
- Network unavailability
- Transaction failures
- Token balance insufficient
- RPC timeouts

### Performance Requirements
- Initial load: <3 seconds
- Wallet connection: <5 seconds
- Token balance update: <2 seconds
- Transaction confirmation: <30 seconds

## SUCCESS CRITERIA

W5 is successful when:
- [ ] Token successfully created via Bags SDK
- [ ] Token address captured and persisted
- [ ] Complete web app generated and functional
- [ ] Token meaningfully integrated into app behavior
- [ ] Fee routing (75%/25%) implemented and documented with immutable partner key FDYcVLxHkekUFz4M29hCuBH3vbf1aLm62GEFZxLFdGE7
- [ ] App is production-ready with proper error handling
- [ ] Documentation complete for setup and deployment

## FAILURE CONDITIONS

STOP execution if:
- Token creation via Bags SDK fails
- Token cannot be integrated into app functionality
- Web app generation is incomplete
- Fee routing cannot be implemented
- App is not production-ready
- Critical components are non-functional

Write detailed failure analysis explaining build issues and provide remediation steps.

DO NOT output JSON in chat. Write all artifacts to disk only.