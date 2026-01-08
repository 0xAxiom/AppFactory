# Web3 Factory Control Plane

**Version**: 1.0  
**Status**: MANDATORY — CONSTITUTION FOR WEB3 FACTORY OPERATIONS  
**Applies to**: Web3 Factory stages, agents, and Claude interactions

## 🔒 EXECUTION SCOPE & SEPARATION

This document defines Web3 Factory behavior ONLY.  

Web3 Factory is a SEPARATE system from App Factory:
- Lives in `/web3-factory/` directory
- Has its own stages (W1-W5)  
- Has its own schemas and templates
- Generates Solana-integrated web apps
- Uses token-based monetization (not subscriptions)

**ABSOLUTE ISOLATION**: Web3 Factory MUST NOT modify, reference, or interfere with App Factory operations.

## SUPPORTED COMMANDS

Web3 Factory supports these commands when Claude is operating in the web3-factory directory:

### Command: `web3 idea <IDEA_TEXT>`
Validates a Web3 app concept and generates a complete tokenized web app.

**Behavior (MANDATORY)**:
When user runs `web3 idea <IDEA_TEXT>`:

1) **Parse idea and create run**:
   - Create new run directory: `web3-factory/runs/YYYY-MM-DD/web3-<timestamp>-<hash>/`
   - Write `runs/.../inputs/web3_intake.md` containing raw idea text

2) **Execute W1: Web3 Idea Validation**:
   - Transform raw idea into structured Web3 concept
   - Validate that onchain state meaningfully improves the app
   - Determine if a token is justified
   - Write `runs/.../w1/web3_idea.json`

3) **Execute W2: Token Role Definition**:
   - Choose exactly ONE primary token role (access/usage/fee capture/settlement/governance-lite)
   - Define supply model, ownership model, fee routing
   - Write `runs/.../w2/token_model.json`

4) **Execute W3: App Architecture (Web)**:
   - Target Next.js or Vite + React
   - Define wallet adapter strategy and read/write boundaries
   - Write `runs/.../w3/web3_architecture.json`

5) **Execute W4: Bags Integration**:
   - Configure Bags SDK for token creation
   - Prepare deterministic deployment parameters
   - NO token creation here - only configuration
   - Write `runs/.../w4/bags_config.json`

6) **Execute W5: Build & Ship**:
   - Generate complete production-ready web app
   - Create token via Bags SDK
   - Wire app to token with functional behavior
   - Write app to `web3-factory/builds/<app_name>/`

**Single-Shot Execution**:
- Web3 Factory executes W1-W5 end-to-end without pause
- No leaderboard (Web3 apps are individually validated)
- Produces ONE tokenized web app from raw idea text

## TOKEN CREATION & FEE ROUTING (MANDATORY)

Every token created via Web3 Factory MUST include deterministic fee routing:

- **90% of protocol-level fees → app creator**
- **10% of protocol-level fees → App Factory owner**

**Rules**:
- Applies ONLY to tokens created via Web3 Factory
- Fee routing must be:
  - Explicit in token configuration
  - Onchain-enforced where possible
  - Written to disk as part of token metadata
- This does NOT restrict token economics beyond fee routing
- Creators remain free to design any token model

This is infrastructure compensation, not ownership of the app.

## BAGS SDK INTEGRATION (MANDATORY)

**Authoritative Sources**:
- Bags SDK: https://github.com/bagsfm/bags-sdk
- Bags API: https://docs.bags.fm/

**Integration Rules**:
- Use Bags SDK ONLY in W4 (configuration) and W5 (creation)
- Token creation must be:
  - Deterministic (same inputs = same token)
  - Idempotent per build
- NO hardcoded API keys - environment variables only
- Token address must be written to disk
- App must consume token as utility primitive, not decoration

**Implementation Requirements**:
- Do NOT invent SDK methods or API fields
- Do NOT assume defaults
- Follow documented patterns for token creation, fee routing, idempotency
- Generated code must reflect real SDK and API

## WEB3 FACTORY DIRECTORY STRUCTURE

```
web3-factory/
├── CLAUDE.md                          # This control plane
├── README.md                          # Web3 Factory documentation
├── templates/
│   └── agents/
│       ├── w1_idea_validation.md      # Web3 idea validation
│       ├── w2_token_role.md           # Token role definition  
│       ├── w3_architecture.md         # Web app architecture
│       ├── w4_bags_integration.md     # Bags SDK configuration
│       └── w5_build_ship.md           # Build and ship
├── schemas/
│   ├── w1_web3_idea.json             # Web3 idea schema
│   ├── w2_token_model.json           # Token model schema
│   ├── w3_web3_architecture.json     # Web3 architecture schema
│   ├── w4_bags_config.json           # Bags configuration schema
│   └── w5_build_manifest.json        # Build manifest schema
├── runs/                              # Generated outputs (git ignored)
│   └── YYYY-MM-DD/
│       └── web3-<timestamp>-<hash>/
│           ├── inputs/web3_intake.md
│           ├── w1/web3_idea.json
│           ├── w2/token_model.json
│           ├── w3/web3_architecture.json
│           ├── w4/bags_config.json
│           └── w5/build_manifest.json
└── builds/                            # Built web apps (git ignored)
    └── <app_name>/
        ├── src/                       # Complete web app
        ├── package.json
        ├── README.md
        └── token_metadata.json       # Created token details
```

## STAGE EXECUTION CONTRACT

### W1: Web3 Idea Validation
**Purpose**: Validate that the idea meaningfully benefits from onchain state
**Inputs**: Raw idea text
**Outputs**: Structured Web3 concept with token justification
**Key Validation**: Does this need a token, or is it better as a traditional app?

### W2: Token Role Definition  
**Purpose**: Choose exactly ONE primary token role and define economics
**Inputs**: Validated Web3 idea
**Outputs**: Complete token model with supply, ownership, and fee routing
**Key Decision**: access/usage/fee capture/settlement/governance-lite

### W3: App Architecture (Web)
**Purpose**: Define web app technical architecture with Solana integration
**Inputs**: Token model
**Outputs**: Complete technical specification for Next.js/Vite + React app
**Key Focus**: Wallet integration, read/write boundaries, failure modes

### W4: Bags Integration
**Purpose**: Configure Bags SDK for deterministic token creation
**Inputs**: App architecture  
**Outputs**: Complete Bags configuration ready for token creation
**Key Rule**: Configuration only - NO token creation

### W5: Build & Ship
**Purpose**: Generate complete web app and create token
**Inputs**: All previous stages
**Outputs**: Production-ready web app + created Solana token
**Key Action**: ONLY stage that creates token via Bags SDK

## ISOLATION RULES (MANDATORY)

**Web3 Factory MUST NOT**:
- Modify App Factory files, schemas, or templates
- Reference App Factory stages or outputs  
- Use subscription-based monetization
- Create mobile React Native apps
- Interfere with App Factory leaderboards or runs

**Web3 Factory MUST**:
- Operate entirely within `web3-factory/` directory
- Use its own stages, schemas, and templates
- Generate web apps only (Next.js/Vite + React)
- Use token-based monetization only
- Create Solana tokens via Bags SDK

## ERROR HANDLING

Web3 Factory MUST fail and stop execution if:
- Idea does not meaningfully benefit from onchain state
- Token role cannot be justified
- Bags SDK configuration cannot be completed
- Web app cannot be generated
- Token creation via Bags SDK fails

Write detailed failure reports to run directory with remediation steps.

## SUCCESS CRITERIA

Web3 Factory execution is successful when:
- [ ] Raw idea validated as meaningful Web3 application
- [ ] Token role clearly defined and justified
- [ ] Complete web app architecture specified
- [ ] Bags SDK properly configured for token creation
- [ ] Production-ready web app generated
- [ ] Solana token created and integrated into app functionality
- [ ] Fee routing (90%/10%) enforced and documented
- [ ] All artifacts written to disk with validation

**CONSTITUTION END**: This document defines the complete Web3 Factory execution framework. Claude must follow these specifications exactly when operating in Web3 Factory mode.