# W3: App Architecture (Web)

## AGENT-NATIVE EXECUTION
You are Claude executing W3 for Web3 Factory. Define complete web app architecture with Solana integration for the tokenized concept.

## TARGET FRAMEWORKS (MANDATORY)

Choose EXACTLY ONE primary framework:

### Next.js (Recommended)
- Full-stack React with API routes
- Built-in SSR/SSG for SEO and performance
- Excellent Solana wallet integration
- Production deployment ready

### Vite + React
- Lightweight, fast development
- Client-side only (requires separate backend)
- Great for simple, focused apps
- Easy Vercel/Netlify deployment

**Decision Criteria**: Choose Next.js for apps requiring backend functionality, Vite for pure frontend apps.

## INPUTS
- Read: `web3-factory/runs/.../w1/web3_idea.json`
- Read: `web3-factory/runs/.../w2/token_model.json`

## OUTPUTS
- Write: `web3-factory/runs/.../w3/web3_architecture.json`
- Write: `web3-factory/runs/.../w3/w3_execution.md`

## JSON SCHEMA
```json
{
  "type": "object",
  "properties": {
    "framework_selection": {
      "type": "object",
      "properties": {
        "primary_framework": {"enum": ["nextjs", "vite_react"]},
        "framework_version": {"type": "string"},
        "selection_rationale": {"type": "string"},
        "deployment_target": {"type": "string"}
      },
      "required": ["primary_framework", "framework_version", "selection_rationale", "deployment_target"]
    },
    "wallet_integration": {
      "type": "object",
      "properties": {
        "wallet_adapter": {"type": "string"},
        "supported_wallets": {"type": "array", "items": {"type": "string"}},
        "connection_strategy": {"type": "string"},
        "auto_connect": {"type": "boolean"}
      },
      "required": ["wallet_adapter", "supported_wallets", "connection_strategy", "auto_connect"]
    },
    "solana_integration": {
      "type": "object",
      "properties": {
        "rpc_strategy": {"type": "string"},
        "network": {"enum": ["mainnet", "devnet", "testnet"]},
        "token_program": {"type": "string"},
        "read_methods": {"type": "array", "items": {"type": "string"}},
        "write_methods": {"type": "array", "items": {"type": "string"}}
      },
      "required": ["rpc_strategy", "network", "token_program", "read_methods", "write_methods"]
    },
    "app_structure": {
      "type": "object",
      "properties": {
        "pages_screens": {"type": "array", "items": {"type": "string"}},
        "core_components": {"type": "array", "items": {"type": "string"}},
        "state_management": {"type": "string"},
        "routing_strategy": {"type": "string"}
      },
      "required": ["pages_screens", "core_components", "state_management", "routing_strategy"]
    },
    "failure_modes": {
      "type": "object",
      "properties": {
        "no_wallet_behavior": {"type": "string"},
        "rpc_unavailable_behavior": {"type": "string"},
        "network_mismatch_behavior": {"type": "string"},
        "insufficient_tokens_behavior": {"type": "string"},
        "transaction_failure_behavior": {"type": "string"}
      },
      "required": ["no_wallet_behavior", "rpc_unavailable_behavior", "network_mismatch_behavior", "insufficient_tokens_behavior", "transaction_failure_behavior"]
    },
    "performance_requirements": {
      "type": "object",
      "properties": {
        "initial_load_time": {"type": "string"},
        "wallet_connection_time": {"type": "string"},
        "transaction_confirmation_time": {"type": "string"},
        "offline_capabilities": {"type": "string"}
      },
      "required": ["initial_load_time", "wallet_connection_time", "transaction_confirmation_time", "offline_capabilities"]
    }
  },
  "required": ["framework_selection", "wallet_integration", "solana_integration", "app_structure", "failure_modes", "performance_requirements"]
}
```

## EXECUTION STEPS

### 1. Framework Selection
Based on app requirements from W1 and W2:

**Choose Next.js if**:
- App requires server-side rendering
- Need API routes for backend logic
- Complex token operations requiring server coordination
- SEO is important

**Choose Vite + React if**:
- Pure frontend app with minimal backend needs
- Simple token interactions
- Fast development cycle priority
- Lightweight deployment preferred

### 2. Wallet Integration Design
Configure Solana wallet connectivity:

**Wallet Adapter Setup**:
- Use @solana/wallet-adapter-react
- Support major wallets: Phantom, Solflare, Backpack
- Implement graceful connection handling
- Design for mobile and desktop experiences

**Connection Strategy**:
- Auto-connect for returning users
- Clear connection prompts for new users
- Fallback for unsupported wallets
- Network switching guidance

### 3. Solana Integration Architecture
Define blockchain interaction patterns:

**RPC Strategy**:
- Primary RPC endpoint configuration
- Fallback RPC providers
- Rate limiting considerations
- Connection pooling for performance

**Token Operations**:
- Read operations: Balance checking, transaction history
- Write operations: Token transfers, app-specific transactions
- Transaction signing workflow
- Error handling for failed transactions

### 4. App Structure Definition
Based on token role from W2:

**Pages/Screens**:
- Landing page with wallet connection
- Main app interface
- Token balance/management screen
- Transaction history
- Settings/help

**Core Components**:
- Wallet connection component
- Token balance display
- Transaction confirmation modals
- Error boundary components
- Loading states

**State Management**:
- Wallet connection state
- Token balance tracking
- Transaction status
- App-specific state based on token role

### 5. Failure Mode Design
Handle Web3-specific failure scenarios:

**No Wallet**: Provide clear installation/setup guidance
**RPC Unavailable**: Graceful degradation with cached data
**Network Mismatch**: Clear network switching instructions  
**Insufficient Tokens**: Clear acquisition guidance
**Transaction Failures**: Retry mechanisms and error explanation

### 6. Performance Requirements
Set measurable performance targets:

**Load Times**:
- Initial app load: <3 seconds
- Wallet connection: <5 seconds
- Transaction confirmation: <30 seconds

**Offline Capabilities**:
- Cached token balances
- Read-only mode when offline
- Transaction queuing for later submission

## SOLANA BEST PRACTICES

### Connection Management
- Use connection pooling for efficiency
- Implement proper cleanup on component unmount
- Handle network switching gracefully
- Cache RPC responses appropriately

### Transaction Handling
- Always simulate transactions before sending
- Implement proper fee estimation
- Handle partial failures gracefully
- Provide clear transaction status feedback

### Security Considerations
- Never store private keys client-side
- Validate all transaction parameters
- Implement proper CSRF protection
- Use secure communication for sensitive operations

## SUCCESS CRITERIA

W3 is successful when:
- [ ] Framework selection clearly justified based on app needs
- [ ] Complete wallet integration strategy defined
- [ ] All Solana interaction patterns specified
- [ ] App structure supports token role from W2
- [ ] All failure modes have defined handling strategies
- [ ] Performance requirements are measurable and realistic

## FAILURE CONDITIONS

STOP execution if:
- Framework selection cannot support token requirements
- Wallet integration strategy is incomplete
- Solana integration patterns are undefined
- App structure does not support token economics
- Critical failure modes lack handling strategies

Write detailed failure analysis explaining architectural limitations.

DO NOT output JSON in chat. Write all artifacts to disk only.