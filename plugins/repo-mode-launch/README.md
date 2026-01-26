# Repo Mode Launch MCP Server

MCP server for orchestrating Repo Mode token launches via Factory Launchpad.

## Overview

This plugin provides tools for Claude to help users launch tokens backed by GitHub repositories. It implements the AppFactory side of the "one flow" Repo Mode integration.

**Key Principles:**
- Never handles private keys - all signing happens in user's wallet
- Deterministic outputs - same inputs produce same launch.intent.json
- Minimal trust - verifies with Launchpad but works offline when needed

## Tools

### 1. `validate-repo`

Validates a GitHub repository URL and optionally verifies it with Launchpad.

**Input:**
- `repoUrl` (required): GitHub repository URL
- `branch` (optional): Branch name to validate
- `launchpadApiUrl` (optional): Custom Launchpad API URL

**Output:**
- `valid`: boolean
- `owner`: GitHub username/org
- `repo`: Repository name
- `commitSha`: Latest commit (if verified with Launchpad)
- `isPublic`: Whether repo is public

### 2. `generate-launch-intent`

Creates a deterministic `launch.intent.json` for a token launch.

**Input:**
- `repoUrl` (required): GitHub repository URL
- `commitSha` (required): Full 40-character commit SHA
- `walletAddress` (required): Solana wallet address (base58)
- `launchBrand` (required): Token/project name (1-32 chars)
- `tokenSymbol` (optional): Token symbol (1-10 uppercase alphanumeric)
- `tokenDescription` (optional): Description (max 500 chars)
- `imageUrl`, `twitter`, `telegram`, `website` (optional): Social links

**Output:**
- `launchIntent`: The complete intent object
- `launchIntentJson`: JSON string for file writing
- `branchName`: Deterministic branch name (e.g., `launch/mytoken-f3a8c291`)
- `tokenSymbol`: Generated or provided symbol

### 3. `prepare-attestation`

Prepares the attestation message for wallet signing.

**Input:**
- `launchIntentJson` (required): Complete launch.intent.json as string
- `walletAddress` (required): Wallet that will sign
- `launchpadApiUrl` (optional): Custom API URL

**Output:**
- `payloadForSignature`: Message to sign with wallet
- `payloadHash`: SHA256 of the message
- `instructions`: Human-readable signing instructions
- `expiresAt`: When attestation expires (if from Launchpad)

### 4. `confirm-attestation`

Confirms the signed attestation with Launchpad to stage the launch.

**Input:**
- `launchIntentJson` (required): Complete launch.intent.json as string
- `walletSignature` (required): Base58-encoded wallet signature
- `launchpadApiUrl` (optional): Custom API URL

**Output:**
- `success`: boolean
- `tokenMint`: Token mint address (if available)
- `launchpadUrl`: URL to complete launch
- `projectId`: Launchpad project ID
- `nextSteps`: Array of instructions

### 5. `setup-pipeline-hooks`

Returns configuration for AppFactory pipeline hooks (does not write files).

**Input:**
- `launchBrand` (required): Token/project name
- `branchName` (required): Launch branch name
- `appFactoryPath` (optional): Path to AppFactory root
- `enableAutoRun` (optional): Enable auto-run on build success

**Output:**
- `configured`: Always false (informational only)
- `hookConfig`: JSON configuration object
- `hooksPath`: Where to save the config
- `instructions`: Setup instructions

## Usage Flow

1. User provides repository URL and wallet address
2. Claude calls `validate-repo` to verify the repository
3. Claude calls `generate-launch-intent` to create the intent
4. User reviews the intent and creates the launch branch
5. Claude calls `prepare-attestation` to get the signing payload
6. User signs with their Solana wallet
7. Claude calls `confirm-attestation` to stage on Launchpad
8. User visits Launchpad to complete the launch

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `LAUNCHPAD_API_URL` | Factory Launchpad API URL | `https://appfactory.fun` |
| `APP_FACTORY_WEBHOOK_SECRET` | HMAC webhook secret | (none) |

## Security Considerations

1. **No Private Keys**: The MCP server never sees or handles private keys
2. **Deterministic**: Same inputs always produce the same launch.intent.json
3. **Verifiable**: All hashes use SHA256, all content can be verified
4. **Time-Limited**: Attestations expire after 24 hours
5. **Wallet Binding**: Intent is bound to a specific wallet address

## Schema References

- [launch.intent.json.schema](../../schemas/launch.intent.json.schema) - Launch intent schema
- [launch.package.json.schema](../../schemas/launch.package.json.schema) - Artifact manifest schema

## Development

```bash
# Install dependencies
cd plugins/repo-mode-launch
npm install

# Run server directly
node server.mjs

# Run with watch mode
npm run dev

# Type check (requires building .ts files first)
npm run typecheck
```

## License

MIT
