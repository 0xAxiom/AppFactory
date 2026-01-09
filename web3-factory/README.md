<img width="1536" height="1024" alt="web3factory" src="https://github.com/user-attachments/assets/86af78ed-fe6a-4953-b8d5-f393e1ca0858" />


# Web3 Factory

> **🚀 PRODUCTION READY** - Prompt-driven pipeline for polished, functional Web3 apps

**Production-grade Solana tokenized web app generator with prompt-driven control plane.**

Web3 Factory is a specialized prompt-driven pipeline that transforms Web3 app concepts into fully functional, polished, domain-authentic tokenized web applications. Every successful build produces a complete production-ready app with meaningful token integration that works end-to-end without fixes.

## 🎯 What Web3 Factory Does

Web3 Factory takes raw Web3 app ideas and builds complete, tokenized web applications that:

- **Validate Web3 necessity**: Prompt-driven validation ensures ideas genuinely benefit from blockchain
- **Create functional tokens**: Generates Solana tokens with real utility, rejecting speculation-based concepts
- **Design domain-authentic UI**: Creates polished interfaces that reflect the app's purpose, not generic Web3 aesthetics
- **Build production-ready apps**: Generates complete Next.js or Vite + React applications that install and run without errors
- **Validate runtime functionality**: Tests wallet integration, token behavior, and complete user flows before deployment
- **Integrate Solana seamlessly**: Handles wallet connection, token operations, and transaction flows with proper error handling
- **Route fees automatically**: Built-in 75%/25% fee split (creator/App Factory) with hardcoded immutable partner attribution
- **Prevent broken builds**: Pipeline fails if any component is non-functional rather than producing incomplete apps

## 🚀 Quick Start

**Prerequisites**: Node.js 18+, Solana wallet, Bags API key from https://dev.bags.fm

```bash
# 1. Open Claude and navigate to web3-factory directory
cd web3-factory

# 2. Generate a complete tokenized web app from any idea
web3 idea Create a decentralized marketplace where users stake tokens to list items and earn rewards for successful sales

# 3. Your tokenized app is ready
cd web3-builds/your-app-name/
npm install
npm run dev
```

**That's it.** Your Web3 app is live with a working Solana token integration.

## 🌊 How It Works

Web3 Factory uses a prompt-driven 7-stage pipeline (W1-W7) to transform ideas into production-ready tokenized apps:

```
Raw Web3 Idea → W1 Reality → W2 Token → W3 UX/UI → W4 Architecture → W5 Bags → W6 Runtime → W7 Ship
                     ↓           ↓         ↓           ↓               ↓         ↓           ↓
                Web3 valid   Token role  Authentic  Web app specs   SDK ready  Validated  Complete app
                                defined     design                              working   + Solana token
```

### Prompt-Driven Pipeline

Each stage uses a dedicated Claude prompt template that serves as the execution contract:

- **Prompt Files**: Stored in `/prompts/` with explicit input/output requirements
- **Integrity Verification**: SHA256 hashes ensure prompt contract enforcement
- **Deterministic Execution**: Same prompt + same inputs = same outputs
- **Failure Prevention**: Pipeline fails if prompt contracts are violated

### W1: Web3 Product Reality Gate
- **Validates** that your idea meaningfully benefits from onchain state
- **Tests** whether token integration serves real utility vs. forced speculation
- **Filters out** ideas better suited for traditional app development
- **Outputs**: Value proposition, onchain analysis, user loop, failure cases

### W2: Token Role & Economic Contract
- **Chooses** exactly ONE primary token role (access/usage/fee capture/settlement/governance-lite)
- **Defines** complete token economics with mandatory 75%/25% fee routing
- **Ensures** partner key `FDYcVLxHkekUFz4M29hCuBH3vbf1aLm62GEFZxLFdGE7` is hardcoded
- **Outputs**: Token role, economics, fee routing configuration

### W3: UI/UX Design Contract
- **Creates** domain-authentic design that avoids generic Web3 aesthetics
- **Specifies** component system and interaction patterns
- **Ensures** Web3 features feel integrated, not bolted-on
- **Outputs**: Design specification, component inventory, interaction semantics

### W4: Web Architecture Lock-in
- **Defines** complete technical architecture for Next.js or Vite + React
- **Plans** wallet integration, data flow, and error handling strategies
- **Specifies** production deployment and performance requirements
- **Outputs**: Web stack specification, wallet strategy, data flow

### W5: Bags SDK Integration
- **Configures** Bags SDK for deterministic token creation (NO creation in this stage)
- **Enforces** mandatory fee routing and partner key integration
- **Validates** environment variable usage for all sensitive data
- **Outputs**: Complete Bags configuration, token creation plan

### W6: Runtime Sanity Harness
- **Verifies** application boots without errors and wallet integration works
- **Tests** token functionality and complete user flow validation
- **Validates** all components work together correctly
- **Outputs**: Runtime test logs, validation results, remediation steps

### W7: Final Build & Ship
- **Creates** Solana token via Bags SDK if token role was selected
- **Generates** complete production-ready web application
- **Integrates** token functionality into app behavior
- **Outputs**: Complete deployable app, token receipt, deployment documentation

## 🏭 Production-Grade Quality Assurance

### Zero-Tolerance Failure Prevention

Web3 Factory enforces **production quality standards** at every stage. Apps are only generated if they meet all criteria:

**✅ Build Quality Requirements**
- Application installs with `npm install` without errors
- Builds successfully with `npm run build` without warnings
- Starts with `npm run dev` and loads in browser
- Zero console errors during normal operation
- All environment variables properly configured

**✅ Wallet Integration Standards**  
- Wallet adapter initializes correctly on app start
- Connection modal appears and functions properly
- Multiple Solana wallets supported (Phantom, Solflare, Backpack)
- Disconnect functionality works reliably
- Wallet state persists across page refreshes
- Network selection functions correctly

**✅ Token Functionality Validation** (if token role selected)
- Token configuration loads and displays correctly
- Token metadata appears properly in UI
- Token balance queries return accurate data
- Token transactions can be initiated and confirmed
- Fee routing works exactly as configured (75% creator / 25% partner)
- Token role behavior functions as designed

**✅ End-to-End User Flow Verification**
- Primary user action completes successfully
- Blockchain state changes reflect properly in UI
- Transaction confirmations display correctly
- Error states handle failures gracefully
- Success states provide appropriate user feedback
- Complete user loop works without requiring fixes

**❌ Guaranteed Failure Conditions**

The pipeline **MUST FAIL AND STOP** if:
- Application fails to build or start
- Console errors appear during normal operation  
- Wallet connection fails or behaves incorrectly
- Token functionality doesn't work as specified
- Core user flow cannot be completed
- Any critical feature is broken or missing

### Domain-Authentic Design Enforcement

**No Generic Web3 Aesthetics**: Apps must reflect their actual purpose, not crypto/DeFi visual tropes
- Design tokens align with app domain and user needs
- UI components serve functionality, not technology showcase  
- Wallet integration feels natural, not prominently featured
- Color palettes and typography match the app's actual use case

**Progressive Web3 Integration**: Blockchain features feel purposeful
- Token interactions align with core app functionality
- Wallet connection doesn't dominate user experience
- Web3 complexity is revealed progressively as needed
- Error handling communicates clearly in user-friendly language

## 🏗️ What You Get

After running `web3 idea <YOUR_IDEA>`:

### 📱 Complete Web App
- **Production-ready**: Next.js or Vite + React application that builds and runs without errors
- **Domain-authentic UI**: Design reflects your app's purpose, not generic Web3 aesthetics
- **Responsive design**: Mobile-friendly layouts for all screen sizes
- **Complete wallet flow**: Phantom, Solflare, Backpack with proper error handling
- **Real-time updates**: Token balances, transaction history, blockchain state changes
- **Professional polish**: Loading states, error boundaries, accessibility features

### 🪙 Functional Solana Token  
- **Custom SPL token**: Created specifically for your app via Bags SDK
- **Real utility**: Token serves meaningful purpose based on your app's functionality
- **Fee routing**: Built-in 75% creator / 25% App Factory split (hardcoded and immutable)
- **Complete metadata**: IPFS-pinned metadata with creation transaction receipts
- **Network ready**: Configured for both mainnet and devnet deployment

### 🔗 Seamless Integration
- **Token behavior**: Operations wired directly into app functionality
- **Error handling**: Graceful failures with user-friendly error messages
- **Transaction flows**: Confirmation patterns with proper loading and success states
- **Environment config**: Production-ready configuration for deployment
- **Runtime validation**: All features tested and verified working before delivery

### 📚 Complete Documentation & Artifacts
- **Deployment guides**: Step-by-step instructions for Vercel, Netlify, AWS
- **Environment setup**: Complete .env.example with all required variables
- **Token receipts**: Detailed creation logs with transaction IDs and verification
- **Stage reports**: Full execution logs showing prompt usage and validation results
- **Architecture docs**: Technical specifications and integration patterns

## 🎮 Token Roles Explained

Web3 Factory supports 5 primary token roles. Your app will use exactly ONE:

### 🗝️ ACCESS Token
**Users spend tokens to unlock features or content**
- Example: Pay 10 tokens to access premium analytics dashboard
- Supply: Usually fixed or deflationary  
- Behavior: Users acquire tokens, spend for access

### ⚡ USAGE Token
**Users consume tokens for each action or transaction**
- Example: Pay 1 token per API call or data query
- Supply: Can be inflationary with burn mechanisms
- Behavior: Users spend tokens for each use

### 💰 FEE CAPTURE Token  
**Token holders receive fees generated by the app**
- Example: Revenue sharing with token holders based on app usage
- Supply: Usually fixed with distribution mechanisms
- Behavior: Users hold tokens to earn fees

### 🏦 SETTLEMENT Token
**All app transactions denominated in the token**
- Example: Marketplace where all trades happen in your token
- Supply: Stable supply with predictable inflation
- Behavior: Users transact using the token

### 🗳️ GOVERNANCE-LITE Token
**Token grants voting rights on simple app parameters**
- Example: Vote on fee rates or feature priorities
- Supply: Usually fixed with delegation mechanisms
- Behavior: Users hold tokens to participate in decisions

## 🎯 Perfect For

### Production-Ready Web3 Apps
Web3 Factory is designed for builders who need **functional, polished apps** that work immediately:

- **Decentralized marketplaces**: Stake tokens to list items, earn rewards for successful sales
- **Token-gated communities**: Access exclusive content with token holdings and participation rewards
- **DeFi analytics tools**: Fee-sharing platforms where token holders receive usage revenue
- **Gaming economies**: In-game tokens for items, upgrades, tournament entry, and rewards
- **Creator platforms**: Token-based monetization for content, courses, or exclusive access
- **DAO tools**: Governance tokens for voting on community parameters and resource allocation

### Ideas That Benefit From Tokens
Web3 Factory validates that your idea **genuinely benefits** from blockchain integration:

- **Shared state**: Apps requiring verifiable, shared data between users
- **Network effects**: Value increases with more onchain participants and token holders
- **Permissionless access**: Apps benefiting from censorship resistance and global access
- **Token incentives**: User behaviors improved by token-based rewards and alignment
- **Composability**: Apps that benefit from integration with other Solana protocols
- **Ownership models**: Digital assets, reputation, or access rights that users should own

## ❌ Not Suitable For

Web3 Factory will **reject** ideas that don't meaningfully benefit from Web3:

- Simple productivity apps better suited for traditional databases
- Consumer apps where tokens add complexity without value
- Ideas where fiat payments would serve the same purpose
- Apps requiring complex smart contracts beyond token functionality

**Web3 Factory is opinionated**: It only builds apps that genuinely benefit from blockchain technology.

## 🛠️ Technical Stack

**Frontend Frameworks**: Next.js 14+ or Vite + React 18+
**Blockchain**: Solana (mainnet/devnet support)  
**Wallet Integration**: Solana Wallet Adapter (Phantom, Solflare, Backpack)
**Token Creation**: Bags SDK integration
**Styling**: Tailwind CSS with responsive design
**Deployment**: Vercel, Netlify, or any static host

## 🚀 Deployment Options

Built apps are ready for deployment on:

- **Vercel**: One-click deployment for Next.js apps
- **Netlify**: Static hosting for Vite apps  
- **AWS/GCP**: Enterprise deployment with custom domains
- **IPFS**: Decentralized hosting for maximum censorship resistance

Complete deployment guides included with every generated app.

## 🔍 Example Ideas

```bash
# DeFi & Finance
web3 idea Create a yield farming aggregator where users stake governance tokens to access premium strategies and earn higher rewards

# Gaming & NFTs  
web3 idea Build a decentralized tournament platform where players stake tokens to join competitions and winners earn from the prize pool

# Social & Community
web3 idea Design a token-gated Discord alternative where community access requires holding tokens and active participation earns more tokens

# Marketplaces & Commerce
web3 idea Create a freelancer marketplace where clients stake tokens for projects and freelancers earn reputation tokens for completed work

# Data & Analytics
web3 idea Build a DeFi analytics dashboard where users pay tokens for real-time data and token holders receive fee sharing from usage
```

## 🔄 Bags Integration (Authoritative)

Web3 Factory uses the official Bags SDK for all Solana token creation operations. This section provides the complete integration specification.

### Required Environment Variables

```bash
# Bags API Configuration
BAGS_API_KEY=your_bags_api_key_here          # From https://dev.bags.fm
BAGS_ENVIRONMENT=mainnet                     # mainnet or devnet

# Solana Configuration  
SOLANA_RPC_URL=https://mainnet.helius-rpc.com/?api-key=key  # Helius recommended
SOLANA_NETWORK=mainnet-beta                  # mainnet-beta or devnet

# Creator Configuration
CREATOR_WALLET_ADDRESS=your_public_key_here  # Receives 75% of protocol fees

# App Factory Partner (Fixed - DO NOT CHANGE)
APP_FACTORY_PARTNER_KEY=FDYcVLxHkekUFz4M29hCuBH3vbf1aLm62GEFZxLFdGE7
```

### High-Level Flow

**W4 Configuration Stage**:
1. Read token model from W2 and architecture from W3
2. Generate deterministic build ID from stage outputs
3. Configure Bags SDK parameters (no token creation)
4. Validate environment requirements without accessing secrets
5. Write `bags_config.json` with all creation parameters

**W5 Build & Ship Stage**:
1. Load `bags_config.json` from W4
2. Check for existing token receipt (idempotency)
3. Initialize Bags SDK with environment variables
4. Create token via SDK with fee routing configuration
5. Write complete token receipt and metadata to disk
6. Generate web app with token integration

### Idempotency System

**Build ID Generation**:
- Deterministic SHA256 hash of W1-W4 stage outputs
- Same inputs always produce the same build ID
- Used for safe re-runs without duplicate tokens

**Receipt-Based Safety**:
```typescript
// Check existing receipt before token creation
const receiptPath = 'web3-builds/app-name/token/token_receipt.json';
const existingReceipt = loadTokenReceipt(receiptPath);

if (existingReceipt && existingReceipt.inputHash === currentInputHash) {
  // Token already exists, skip creation safely
  return existingReceipt;
}
```

### Fee Routing Configuration

**Fixed Fee Split (Non-negotiable)**:
- **75% → App Creator** (your wallet address)  
- **25% → App Factory Partner** (`FDYcVLxHkekUFz4M29hCuBH3vbf1aLm62GEFZxLFdGE7`)

**Implementation**:
```json
{
  "feeRouting": {
    "creator": { "percentage": 75 },
    "partner": { 
      "key": "FDYcVLxHkekUFz4M29hCuBH3vbf1aLm62GEFZxLFdGE7", 
      "percentage": 25 
    }
  }
}
```

Fee routing is enforced via Bags SDK partner configuration and written to all token receipts for transparency.

## 🤖 Prompt-Driven Architecture 

### Revolutionary Control Plane

Web3 Factory uses a **prompt-driven control plane** where each pipeline stage is governed by an explicit Claude prompt template. This ensures deterministic, auditable, and fail-safe execution.

**Key Innovation**: Every stage has a dedicated prompt file that serves as its execution contract
- **Role definitions**: What Claude is responsible for in that stage
- **Hard constraints**: Absolute requirements that cannot be violated
- **Input/output specs**: Exact files consumed and produced
- **Acceptance criteria**: Explicit "must pass" validation checks
- **Failure conditions**: Explicit "must fail" scenarios that stop the pipeline

### Prompt Contract Enforcement

**Integrity Verification**: SHA256 hashes prevent prompt tampering
```bash
# Every prompt file is hashed and tracked
prompts/W1_product_reality_gate.md → fdba3eb571d639f811a502...
prompts/W2_token_role_economic_contract.md → 2a1725d0bc1389788b3b...
prompts/W5_bags_sdk_integration.md → 920330c3701d9da0e769...
```

**Execution Tracking**: Every stage documents its prompt usage
```json
{
  "stage": "W2",
  "prompt_filename": "W2_token_role_economic_contract.md",
  "prompt_sha256": "2a1725d0bc1389788b3b...",
  "execution_timestamp": "2026-01-09T12:00:00.000Z",
  "status": "success"
}
```

**Mandatory Validations**: Partner key and fee routing hardcoded in prompts
- Partner key `FDYcVLxHkekUFz4M29hCuBH3vbf1aLm62GEFZxLFdGE7` cannot be modified
- 75% creator / 25% App Factory split enforced across multiple stages
- Environment variable usage validated to prevent hardcoded secrets

### Production Safety Features

**Zero-Tolerance Failure Prevention**: Pipeline stops if any validation fails
- Prompt file missing or corrupted → FAIL
- Partner key incorrect or missing → FAIL  
- Fee routing percentages modified → FAIL
- Runtime tests don't pass → FAIL
- Build contains errors → FAIL

**Audit Trail**: Complete execution tracking
- Which prompt was used for each stage
- What inputs were consumed and outputs generated
- All validation results and pass/fail status
- Detailed error logs for any failures

## 📋 Prompt-Driven Pipeline Management

Web3 Factory's pipeline is completely prompt-driven, ensuring deterministic and auditable execution.

### Prompt System Overview

**Prompt Contracts**: Each stage (W1-W7) has a dedicated prompt file that defines:
- Role definition and responsibilities
- Hard constraints and limitations  
- Required inputs and outputs
- Acceptance criteria and failure conditions
- Output format rules

**Integrity Verification**: 
- SHA256 hashes for each prompt file prevent tampering
- Pipeline fails if prompt integrity is compromised
- Prompt index tracks all stage prompts and versions

**Execution Tracking**:
- Stage reports document which prompt was used
- Input/output files are logged for each execution
- Pass/fail status with detailed validation results

### Manual Stage Execution

You can run individual stages for testing or debugging:

```bash
# Run specific pipeline stages
npm run web3 stage W1 ./runs/2026-01-09/web3-example/
npm run web3 stage W3 ./runs/2026-01-09/web3-example/  
npm run web3 stage W7 ./runs/2026-01-09/web3-example/
```

### Prompt Management Commands

```bash
# Validate all prompt integrity
npm run web3 validate-prompts

# Update prompt hashes after modifications  
npm run web3 reindex-prompts

# View prompt usage for a run
npm run web3 audit-run ./runs/2026-01-09/web3-example/
```

### Pipeline Safety Features

**Mandatory Partner Key**: Partner key `FDYcVLxHkekUFz4M29hCuBH3vbf1aLm62GEFZxLFdGE7` is hardcoded in prompts and validated at multiple stages.

**Fee Routing Enforcement**: 75% creator / 25% App Factory split is enforced in prompts and cannot be overridden.

**Environment Variable Security**: API keys must be provided via environment variables - hardcoded keys cause pipeline failure.

### Generated Files & Locations

**Token Creation Artifacts** (written to `web3-builds/<app_name>/token/`):
- `token_plan.json` - Token creation plan used for generation
- `bags_config.json` - Exact Bags SDK configuration used  
- `token_receipt.json` - Deterministic creation receipt with all details
- `token_receipt.md` - Human-readable token information

**Example Receipt Structure**:
```json
{
  "buildId": "deterministic_build_id",
  "tokenAddress": "solana_token_mint_address", 
  "transactionId": "solana_transaction_signature",
  "createdAt": "2024-01-08T12:00:00.000Z",
  "feeRouting": {
    "creator": { "address": "creator_wallet", "percentage": 75 },
    "partner": { "address": "FDYcVLxHk...", "percentage": 25 }
  },
  "bagsIntegration": {
    "sdkVersion": "@bagsfm/bags-sdk@1.x.x",
    "partnerKey": "FDYcVLxHkekUFz4M29hCuBH3vbf1aLm62GEFZxLFdGE7"
  }
}
```

### API Keys & Security

**Open-Source Safe**:
- API keys are NEVER committed to git
- All token artifacts safe for public repositories  
- Only public keys and transaction IDs stored on disk
- Environment variables required at runtime only

**Development vs Production**:
- Use devnet for testing with development API keys
- Switch to mainnet for production deployment
- Separate creator wallet addresses for each environment
- Same App Factory partner key across all environments

### Error Handling & Retries

**Automatic Retry Logic**:
- Rate limiting (1,000 requests/hour): Exponential backoff
- Network failures: 3 retries with increasing delays
- Partial failures: Detection and clear error reporting

**Failure Recovery**:
- Complete error logs written to disk for debugging
- Idempotency prevents double-spending on retries  
- Clear remediation steps provided for common issues

**References**:
- **Official Bags SDK**: https://github.com/bagsfm/bags-sdk
- **Bags API Docs**: https://docs.bags.fm/
- **Technical Implementation**: `docs/bags_implementation.md`

## 🆚 Web3 Factory vs. App Factory

**Web3 Factory (this system)**:
- Solana-focused tokenized web applications
- Token-based monetization and user incentives
- Next.js/Vite + React frontend frameworks
- Validates Web3-specific value propositions
- Creates functional tokens via Bags SDK

**App Factory (sibling system)**:
- Consumer mobile applications (React Native/Expo)
- Subscription-based monetization via RevenueCat
- iOS/Android app store deployment
- Market research and user validation focus
- No blockchain or token integration

Both systems are **completely separate** and serve different use cases. Choose the system that matches your app concept.

## 🤝 Contributing

Web3 Factory welcomes contributions:

- **Report issues**: Found a bug or have a feature request?
- **Improve templates**: Enhance the W1-W5 stage templates
- **Add token roles**: Suggest new primary token role patterns
- **Documentation**: Improve setup guides and examples
- **Integration**: Add support for new wallets or frameworks

## 📄 License

MIT License - Web3 Factory is open source and free to use.

---

## 🎉 Ready for Production

**Web3 Factory v2.0 - Production-Grade Pipeline**

✅ **Prompt-driven architecture** with SHA256 integrity verification  
✅ **7-stage pipeline** (W1-W7) with comprehensive validation  
✅ **Domain-authentic UI/UX** enforcement (W3)  
✅ **Runtime functionality testing** (W6)  
✅ **Zero-tolerance failure prevention** - broken builds are rejected  
✅ **Hardcoded partner attribution** with immutable fee routing  
✅ **Complete audit trail** with detailed stage reports  
✅ **Production-ready output** that works end-to-end without fixes  

**Web3 Factory: Transform Web3 ideas into polished, functional tokenized reality.**
