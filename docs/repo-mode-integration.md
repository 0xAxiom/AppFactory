# Repo Mode Integration Guide

This document describes the "one flow" integration between AppFactory and Factory Launchpad for Repo Mode token launches.

## Overview

Repo Mode allows users to launch tokens backed by GitHub repositories. The flow is:

1. User clicks "Open in Claude" on Launchpad
2. Claude + MCP Server orchestrates intent creation
3. User creates `launch/*` branch with `launch.intent.json`
4. User returns to Launchpad via authorization link
5. Launchpad reads intent, prefills form
6. User signs attestation + single launch transaction
7. Token deployed on Bags.fm bonding curve

## Architecture

### Component Map

| Component                 | Location                                                       | Purpose                             |
| ------------------------- | -------------------------------------------------------------- | ----------------------------------- |
| **MCP Server**            | `AppFactory/plugins/repo-mode-launch/`                         | Orchestrates launch intent creation |
| **Launch Intent Schema**  | `AppFactory/schemas/launch.intent.json.schema`                 | Validates intent structure          |
| **Launch Package Schema** | `AppFactory/schemas/launch.package.json.schema`                | Validates artifact manifest         |
| **Stage API**             | `factory-launchpad/apps/web/app/api/launch/repo-mode/stage/`   | Receives intents from MCP           |
| **Approve API**           | `factory-launchpad/apps/web/app/api/launch/repo-mode/approve/` | User approval endpoint              |
| **Confirm API**           | `factory-launchpad/apps/web/app/api/launch/repo-mode/confirm/` | Transaction confirmation            |
| **From Claude Page**      | `factory-launchpad/apps/web/app/repo-mode/from-claude/`        | Handoff receiver UI                 |
| **Success Page**          | `factory-launchpad/apps/web/app/repo-mode/success/`            | Post-launch success screen          |

## MCP Server Tools

The repo-mode-launch MCP server provides 5 tools:

### 1. `validate-repo`

Validates a GitHub repository URL and checks access.

**Input:**

- `repoUrl` (required): GitHub repository URL
- `branch` (optional): Branch name to validate

**Output:**

- `valid`: boolean
- `owner`: GitHub username/org
- `repo`: Repository name
- `commitSha`: Latest commit
- `isPublic`: Whether repo is public

### 2. `generate-launch-intent`

Creates a deterministic `launch.intent.json`.

**Input:**

- `repoUrl` (required): GitHub repository URL
- `commitSha` (required): 40-character commit SHA
- `walletAddress` (required): Solana wallet address
- `launchBrand` (required): Token name (1-32 chars)
- `tokenSymbol` (optional): Token symbol (auto-generated if not provided)
- `tokenDescription`, `imageUrl`, `twitter`, `telegram`, `website` (optional)

**Output:**

- `launchIntent`: Complete intent object
- `launchIntentJson`: JSON string for file writing
- `branchName`: Deterministic branch name
- `tokenSymbol`: Generated or provided symbol

### 3. `prepare-attestation`

Prepares the attestation message for wallet signing.

**Input:**

- `launchIntentJson` (required): Complete intent as string
- `walletAddress` (required): Wallet that will sign

**Output:**

- `payloadForSignature`: Message to sign
- `payloadHash`: SHA256 of message
- `instructions`: Human-readable instructions

### 4. `confirm-attestation`

Confirms signed attestation with Launchpad.

**Input:**

- `launchIntentJson` (required): Complete intent as string
- `walletSignature` (required): Base58-encoded signature

**Output:**

- `success`: boolean
- `tokenMint`: Token mint address
- `launchpadUrl`: URL to complete launch
- `nextSteps`: Array of instructions

### 5. `setup-pipeline-hooks`

Returns configuration for AppFactory pipeline hooks (does not write files).

**Input:**

- `launchBrand` (required): Token name
- `branchName` (required): Launch branch name

**Output:**

- `hookConfig`: JSON configuration
- `hooksPath`: Where to save config
- `instructions`: Setup instructions

## Data Schemas

### launch.intent.json

```json
{
  "version": "1.0.0",
  "id": "<sha256_of_core_fields>",
  "timestamp": "2026-01-26T10:30:00Z",
  "repo": {
    "url": "https://github.com/owner/repo",
    "owner": "owner",
    "name": "repo",
    "provider": "github",
    "commitSha": "abc123def456789abc123def456789abc123def4"
  },
  "launch": {
    "brand": "My Token",
    "symbol": "MYT",
    "description": "A token for my project"
  },
  "wallet": {
    "address": "7xKXtg2CW87d9KYoqnds5FiPo75VJqxMx6F7PJ5m1234",
    "network": "solana"
  },
  "branch": {
    "name": "launch/my-token-f3a8c291",
    "strategy": "deterministic-hash"
  },
  "hashes": {
    "intentHash": "<sha256_of_intent>",
    "configHash": "<sha256_of_launch_config>",
    "repoStateHash": "<sha256_of_repo_state>"
  }
}
```

### launch.package.json (Artifact Manifest)

```json
{
  "version": "1.0",
  "timestamp": "2026-01-26T10:35:00Z",
  "pipeline": {
    "name": "dapp-factory",
    "version": "1.0.0",
    "phaseCompleted": 4
  },
  "artifacts": {
    "build": {
      "directory": "./dist",
      "hash": "sha256:abc123...",
      "size": 1024000
    }
  },
  "verification": {
    "buildVerified": true,
    "buildCertificate": { "status": "PASS" }
  },
  "deploymentReady": {
    "canDeploy": true,
    "launchReadinessScore": 0.97
  },
  "integrity": {
    "manifestHash": "sha256:def456...",
    "signedBy": "appfactory-v1",
    "timestamp": "2026-01-26T10:35:00Z"
  }
}
```

## API Endpoints

### POST /api/launch/repo-mode/stage

Receives launch.intent.json from AppFactory MCP server.

**Authentication:** HMAC-SHA256 signature via `X-AppFactory-Signature` header

**Request:**

```json
{
  "launchIntent": "<launch.intent.json as string>"
}
```

**Response:**

```json
{
  "stagingId": "cuid123",
  "approvalUrl": "https://appfactory.fun/repo-mode/from-claude?staging=cuid123",
  "expiresAt": "2026-01-27T10:30:00Z"
}
```

### GET /api/launch/repo-mode/staging/[stagingId]

Retrieves staging details for UI prefill.

**Response:**

```json
{
  "status": "PENDING",
  "tokenPreview": {
    "name": "My Token",
    "symbol": "MYT",
    "description": "..."
  },
  "repoInfo": {
    "url": "https://github.com/owner/repo",
    "commitSha": "abc123..."
  },
  "wallet": "7xKXtg...",
  "expiresAt": "2026-01-27T10:30:00Z"
}
```

### POST /api/launch/repo-mode/approve

User approves staged launch.

**Authentication:** NextAuth session required

**Request:**

```json
{
  "stagingId": "cuid123"
}
```

**Response:**

```json
{
  "approved": true,
  "stagingId": "cuid123",
  "launchData": { ... },
  "transactionUrl": "/api/launch/transaction",
  "confirmUrl": "/api/launch/repo-mode/confirm"
}
```

### POST /api/launch/repo-mode/confirm

Confirms transaction after signing.

**Request:**

```json
{
  "stagingId": "cuid123",
  "txSignature": "...",
  "tokenMint": "...",
  "projectId": "..."
}
```

**Response:**

```json
{
  "success": true,
  "slug": "my-token",
  "projectUrl": "https://appfactory.fun/p/my-token",
  "buildCertificate": { ... }
}
```

## Database Models

### RepoModeStaging (Prisma)

```prisma
model RepoModeStaging {
  id                String     @id @default(cuid())
  appId             String
  status            RepoModeStagingStatus @default(PENDING)
  launchIntentJson  String     @db.Text
  repoUrl           String
  repoOwner         String
  repoName          String
  repoCommitSha     String
  tokenName         String
  tokenSymbol       String
  walletAddress     String
  branchName        String
  intentHash        String     @unique
  tokenMint         String?
  projectId         BigInt?
  launchTxSig       String?
  expiresAt         DateTime
  createdAt         DateTime   @default(now())
  updatedAt         DateTime   @updatedAt
  approvedAt        DateTime?
  confirmedAt       DateTime?
}

enum RepoModeStagingStatus {
  PENDING
  APPROVED
  EXPIRED
  CONFIRMED
  CANCELLED
}
```

## Security

### Invariants

1. MCP server NEVER handles private keys
2. All signing happens in user's wallet
3. Fee is enforced on-chain (not off-chain)
4. launch.intent.json is the canonical source of truth
5. Attestations have 24-hour TTL
6. All hashes use SHA256

### Authentication

- **MCP → Launchpad:** HMAC-SHA256 webhook signature
- **User → Launchpad:** NextAuth session + wallet verification
- **Wallet verification:** Ed25519 signature of attestation message

## Environment Variables

### AppFactory

```
LAUNCHPAD_API_URL=https://appfactory.fun
APP_FACTORY_WEBHOOK_SECRET=<shared-secret>
```

### Factory Launchpad

```
APP_FACTORY_WEBHOOK_SECRET=<shared-secret>
REPO_MODE_STAGING_TTL_HOURS=24
```

## User Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER JOURNEY                             │
└─────────────────────────────────────────────────────────────────┘

1. User visits appfactory.fun/launch
   └─> Clicks "Open in Claude"

2. Claude Code opens with AppFactory MCP server
   └─> User describes their project and token

3. Claude uses MCP tools to:
   ├─> validate-repo (verify GitHub access)
   ├─> generate-launch-intent (create deterministic intent)
   └─> prepare-attestation (get signing payload)

4. User creates launch branch in their repo:
   └─> git checkout -b launch/mytoken-f3a8c291
   └─> commits launch.intent.json
   └─> git push

5. Claude uses confirm-attestation
   └─> Stages launch on Launchpad
   └─> Returns approval URL

6. User visits approval URL (from-claude page):
   ├─> Reviews token details
   ├─> Connects wallet
   └─> Clicks "Approve & Continue"

7. User completes launch on /launch page:
   ├─> Signs launch transaction
   └─> Token mints on Bags.fm bonding curve

8. Success! User redirected to token page
```

## Related Documents

- [UNIFIED_ARCHITECTURE.md](../UNIFIED_ARCHITECTURE.md) - Detailed architecture from subagent audits
- [ADR-0005](../docs/adr/0005-core-library-adoption-decision.md) - Core library decision
- [plugins/repo-mode-launch/README.md](../plugins/repo-mode-launch/README.md) - MCP server documentation
