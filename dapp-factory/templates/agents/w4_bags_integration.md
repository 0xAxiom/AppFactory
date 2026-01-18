# W4: Bags Integration

## AGENT-NATIVE EXECUTION
You are Claude executing W4 for Web3 Factory. Configure Bags SDK for deterministic token creation based on the app architecture.

## AUTHORITATIVE SOURCES (MANDATORY)

ALL Bags-related implementation MUST reference these sources:

- **Bags SDK**: https://github.com/bagsfm/bags-sdk
- **Bags API Documentation**: https://docs.bags.fm/

**CRITICAL RULES**:
- Do NOT invent SDK methods or API fields
- Do NOT assume defaults not documented
- Follow documented patterns exactly
- Generated code must reflect real SDK and API

## CONFIGURATION ONLY STAGE

**W4 DOES NOT CREATE TOKENS** - Configuration only.

W4 prepares all parameters for token creation in W5. No network calls, no token creation, no API calls to Bags services.

## INPUTS
- Read: `web3-factory/runs/.../w1/web3_idea.json`
- Read: `web3-factory/runs/.../w2/token_model.json`
- Read: `web3-factory/runs/.../w3/web3_architecture.json`

## OUTPUTS
- Write: `web3-factory/runs/.../w4/bags_config.json`
- Write: `web3-factory/runs/.../w4/w4_execution.md`

## JSON SCHEMA
```json
{
  "type": "object",
  "properties": {
    "token_parameters": {
      "type": "object",
      "properties": {
        "name": {"type": "string"},
        "symbol": {"type": "string"},
        "description": {"type": "string"},
        "total_supply": {"type": "string"},
        "decimals": {"type": "number"},
        "metadata_uri": {"type": "string"}
      },
      "required": ["name", "symbol", "description", "total_supply", "decimals"]
    },
    "bags_configuration": {
      "type": "object",
      "properties": {
        "sdk_version": {"type": "string"},
        "api_endpoint": {"type": "string"},
        "network": {"type": "string"},
        "environment_variables": {"type": "array", "items": {"type": "string"}},
        "idempotency_key_strategy": {"type": "string"}
      },
      "required": ["sdk_version", "api_endpoint", "network", "environment_variables", "idempotency_key_strategy"]
    },
    "fee_routing_config": {
      "type": "object",
      "properties": {
        "partner_attribution": {
          "type": "object",
          "properties": {
            "partner_key": {"type": "string", "enum": ["FDYcVLxHkekUFz4M29hCuBH3vbf1aLm62GEFZxLFdGE7"]},
            "partner_program": {"type": "string", "enum": ["app-factory"]}
          },
          "required": ["partner_key", "partner_program"]
        },
        "fee_split": {
          "type": "object", 
          "properties": {
            "creator_percentage": {"type": "number", "enum": [75]},
            "partner_percentage": {"type": "number", "enum": [25]}
          },
          "required": ["creator_percentage", "partner_percentage"]
        },
        "routing_method": {"type": "string"},
        "enforcement_mechanism": {"type": "string"}
      },
      "required": ["partner_attribution", "fee_split", "routing_method", "enforcement_mechanism"]
    },
    "deployment_config": {
      "type": "object",
      "properties": {
        "deterministic_salt": {"type": "string"},
        "build_hash": {"type": "string"},
        "creation_timestamp": {"type": "string"},
        "retry_configuration": {"type": "object"}
      },
      "required": ["deterministic_salt", "build_hash", "creation_timestamp", "retry_configuration"]
    },
    "integration_points": {
      "type": "object",
      "properties": {
        "token_creation_function": {"type": "string"},
        "balance_query_method": {"type": "string"},
        "transfer_method": {"type": "string"},
        "metadata_update_method": {"type": "string"},
        "fee_collection_method": {"type": "string"}
      },
      "required": ["token_creation_function", "balance_query_method", "transfer_method", "metadata_update_method", "fee_collection_method"]
    }
  },
  "required": ["token_parameters", "bags_configuration", "fee_routing_config", "deployment_config", "integration_points"]
}
```

## EXECUTION STEPS

### 1. Research Bags SDK Documentation
Consult authoritative sources:
- Review current Bags SDK version and methods
- Understand token creation parameters and requirements
- Identify fee routing configuration options
- Document idempotency and retry patterns

### 2. Configure Token Parameters
From W2 token model:
- Map token name and symbol
- Set total supply based on supply model
- Determine appropriate decimals (usually 9 for Solana)
- Prepare metadata description
- Plan metadata URI (will be generated in W5)

### 3. Environment Configuration
Set up environment-based configuration:
- NO hardcoded API keys or secrets
- Use environment variables for all sensitive data
- Configure different networks (mainnet/devnet)
- Set up proper API endpoints

**Required Environment Variables**:
```
BAGS_API_KEY=<provided_at_runtime>
BAGS_ENVIRONMENT=<mainnet|devnet>
CREATOR_WALLET_ADDRESS=<provided_at_runtime>
```

**Note**: APP_FACTORY_PARTNER_KEY is now hardcoded as immutable constant FDYcVLxHkekUFz4M29hCuBH3vbf1aLm62GEFZxLFdGE7

### 4. Fee Routing Configuration
Implement mandatory 75%/25% fee split:
- App Creator: 75% of protocol fees
- App Factory Partner: 25% of protocol fees (Partner Key: FDYcVLxHkekUFz4M29hCuBH3vbf1aLm62GEFZxLFdGE7)

Configure routing mechanism:
- Onchain enforcement where possible
- Offchain routing for compatibility
- Clear documentation of fee structure
- Audit trail for fee distribution

### 5. Deterministic Deployment
Ensure consistent token creation:
- Generate deterministic salt from app content
- Use build hash for idempotency
- Configure retry mechanisms for network failures
- Document exact creation parameters

### 6. Integration Point Mapping
Map token operations to app functionality:
- Token creation method for W5
- Balance queries for app UI
- Transfer methods for token spending
- Metadata updates for app changes
- Fee collection for revenue routing

## BAGS SDK INTEGRATION PATTERNS

### Token Creation Configuration
```javascript
// Example configuration structure (adapt to real SDK)
const tokenConfig = {
  name: "App Token Name",
  symbol: "SYMBOL",
  totalSupply: "1000000",
  decimals: 9,
  partner_attribution: {
    partner_key: "FDYcVLxHkekUFz4M29hCuBH3vbf1aLm62GEFZxLFdGE7", // Immutable
    partner_program: "app-factory"
  },
  fee_split: {
    creator_percentage: 75,
    partner_percentage: 25
  },
  metadata: {
    description: "Token description",
    image: "metadata_uri"
  }
};
```

### Environment Safety
```javascript
// All sensitive data from environment
const config = {
  apiKey: process.env.BAGS_API_KEY,
  network: process.env.BAGS_ENVIRONMENT,
  creatorWallet: process.env.CREATOR_WALLET_ADDRESS
};
```

### Idempotency Strategy
```javascript
// Deterministic token creation
const idempotencyKey = generateKey({
  appName: "app_name",
  buildHash: "build_hash", 
  timestamp: "creation_time"
});
```

## SUCCESS CRITERIA

W4 is successful when:
- [ ] All token parameters extracted from W2 and formatted for Bags SDK
- [ ] Complete environment configuration with no hardcoded secrets
- [ ] Fee routing (75%/25%) explicitly configured with immutable partner key FDYcVLxHkekUFz4M29hCuBH3vbf1aLm62GEFZxLFdGE7
- [ ] Deterministic deployment parameters generated
- [ ] All integration points mapped to SDK methods
- [ ] Configuration validates against real Bags SDK patterns
- [ ] Partner key immutability enforced via schema validation

## FAILURE CONDITIONS

STOP execution if:
- Cannot map token model to Bags SDK parameters
- Fee routing configuration is incomplete
- Environment configuration contains hardcoded secrets
- Deterministic deployment strategy is undefined
- Integration points cannot be mapped to SDK methods
- Configuration does not match documented Bags patterns

Write detailed failure analysis explaining configuration issues and SDK compatibility problems.

DO NOT output JSON in chat. Write all artifacts to disk only.