# Web3 Factory Pipeline Contract

## Overview

Web3 Factory executes a 5-stage pipeline (W1-W5) to transform raw Web3 ideas into production-ready tokenized web applications. This document defines the exact responsibilities and boundaries of each stage.

## Pipeline Architecture

```
Raw Web3 Idea → W1 → W2 → W3 → W4 → W5 → Complete Tokenized Web App
                │     │     │     │     │
                │     │     │     │     └─ Token Creation + Web App
                │     │     │     └─ Bags SDK Configuration
                │     │     └─ Web App Architecture
                │     └─ Token Role Definition
                └─ Web3 Idea Validation
```

## Stage Definitions

### W1: Web3 Idea Validation

**Purpose**: Validate that the raw idea meaningfully benefits from blockchain technology

**Inputs**:

- `web3_intake.md` (raw idea text from user)

**Outputs**:

- `w1/web3_idea.json` (structured Web3 concept)
- `w1/w1_execution.md` (validation analysis)

**Key Responsibilities**:

- Test if idea requires shared, verifiable state
- Validate token utility vs. speculation
- Assess network effects and decentralization benefits
- Reject ideas better suited for traditional app development

**Bags Integration**: None (validation only)

---

### W2: Token Role Definition

**Purpose**: Define exact token role and economics for the validated concept

**Inputs**:

- `w1/web3_idea.json`

**Outputs**:

- `w2/token_model.json` (complete token specification)
- `w2/w2_execution.md` (token design rationale)

**Key Responsibilities**:

- Choose exactly ONE primary token role (access/usage/fee_capture/settlement/governance_lite)
- Define supply model, distribution, and economic incentives
- Configure mandatory 75%/25% fee routing (creator/App Factory)
- Ensure token serves functional purpose in app behavior

**Bags Integration**: None (economic modeling only)

---

### W3: App Architecture (Web)

**Purpose**: Design complete web application architecture with Solana integration

**Inputs**:

- `w1/web3_idea.json`
- `w2/token_model.json`

**Outputs**:

- `w3/web3_architecture.json` (complete technical specification)
- `w3/w3_execution.md` (architecture decisions)

**Key Responsibilities**:

- Select optimal framework (Next.js vs. Vite + React)
- Design wallet integration strategy (Solana Wallet Adapter)
- Plan Solana integration patterns and RPC strategy
- Define failure modes and performance requirements

**Bags Integration**: None (architecture planning only)

---

### W4: Bags Integration (Configuration Only)

**Purpose**: Configure Bags SDK for deterministic token creation

**Inputs**:

- `w1/web3_idea.json`
- `w2/token_model.json`
- `w3/web3_architecture.json`

**Outputs**:

- `w4/bags_config.json` (complete Bags SDK configuration)
- `w4/w4_execution.md` (configuration rationale)

**Key Responsibilities**:

- Map token model to Bags SDK parameters
- Configure environment variables strategy (no secrets)
- Set up deterministic build ID and idempotency strategy
- Prepare App Factory partner key integration (`FDYcVLxHkekUFz4M29hCuBH3vbf1aLm62GEFZxLFdGE7`)
- Validate all required configuration without token creation

**Bags Integration**: Configuration preparation only

- **NO TOKEN CREATION** occurs in W4
- Validate environment requirements exist
- Prepare all parameters for W5 execution

---

### W5: Build & Ship (Token Creation + Web App)

**Purpose**: Create Solana token and generate complete production web application

**Inputs**:

- `w1/web3_idea.json`
- `w2/token_model.json`
- `w3/web3_architecture.json`
- `w4/bags_config.json`

**Outputs**:

- `w5/build_manifest.json` (build execution record)
- `w5/w5_execution.md` (build process log)
- `web3-builds/<app_name>/` (complete web application)
- `web3-builds/<app_name>/token/` (token creation artifacts)

**Key Responsibilities**:

- Execute token creation via Bags SDK (ONLY stage that creates tokens)
- Generate complete Next.js or Vite + React web application
- Integrate token functionality into app behavior
- Wire Solana wallet connection and transaction flows
- Implement production error handling and deployment readiness

**Bags Integration**: Full SDK execution

- Create token using configuration from W4
- Write deterministic receipts for idempotency
- Handle all error conditions and retry logic
- Enforce 75%/25% fee routing with App Factory partner key

## Critical Stage Boundaries

### Bags SDK Usage Restrictions

- **W1-W3**: No Bags SDK usage (validation and planning only)
- **W4**: Bags SDK configuration preparation (no token creation)
- **W5**: Full Bags SDK execution (token creation only)

### Token Creation Rules

- **Only W5 creates tokens** via Bags SDK
- W1-W4 are configuration and planning stages
- Token creation must be idempotent and deterministic
- All token parameters must flow through W4 configuration

### Environment Variable Handling

- **W1-W3**: No environment variable requirements
- **W4**: Validate env var requirements exist (no secret access)
- **W5**: Full environment access for token creation

### Error Handling Strategy

- **W1-W3**: Validation failures stop pipeline with clear guidance
- **W4**: Configuration failures provide remediation steps
- **W5**: Token creation failures include retry logic and partial success detection

## Pipeline Isolation

### Web3 Factory Boundaries

- All stages operate within `/web3-factory/` directory
- No interaction with App Factory pipelines or commands
- Independent command interface: `web3 idea <IDEA_TEXT>`
- Separate run directories: `web3-factory/runs/`

### Output Segregation

- Web3 builds: `web3-factory/builds/` (never `builds/`)
- Token artifacts: `web3-builds/<app_name>/token/`
- No overlap with App Factory mobile app outputs

### Fee Routing Isolation

- Web3 Factory: 75%/25% creator/partner split (partner key: FDYcVLxHkekUFz4M29hCuBH3vbf1aLm62GEFZxLFdGE7)
- App Factory: 90%/10% creator/factory split (completely separate)
- Different monetization models (tokens vs. subscriptions)

## Success Criteria

### Pipeline Completion Requirements

Each stage must complete successfully before the next can begin:

**W1**: Raw idea validated as meaningful Web3 application
**W2**: Token role clearly defined with complete economics  
**W3**: Web application architecture fully specified
**W4**: Bags SDK configuration prepared and validated
**W5**: Token created successfully and web app generated

### Quality Gates

- All JSON outputs validate against schemas
- Environment configuration complete and secure
- Token integration functional in generated web app
- Fee routing enforced and documented
- Deployment documentation complete

## Failure Recovery

### Stage Failure Handling

- **Immediate Stop**: Failed stage stops pipeline execution
- **Detailed Logging**: Write failure analysis to stage execution log
- **Remediation Guidance**: Provide specific steps to resolve issues
- **Clean State**: No partial artifacts left on failure

### Re-execution Safety

- **Idempotent Design**: Safe to re-run any completed stage
- **Receipt Management**: W5 checks for existing token before creation
- **State Preservation**: Completed stage artifacts preserved across runs
