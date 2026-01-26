#!/usr/bin/env node

/**
 * Repo Mode Launch MCP Server
 * Provides tools for orchestrating token launches via Factory Launchpad
 *
 * Tools:
 * 1. validate-repo - Validate GitHub repository URL
 * 2. generate-launch-intent - Create deterministic launch.intent.json
 * 3. prepare-attestation - Get payload for wallet signing
 * 4. confirm-attestation - Confirm signed attestation with Launchpad
 * 5. setup-pipeline-hooks - Configure AppFactory pipeline hooks (optional)
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { createHash, createHmac } from 'crypto';

// ============================================================================
// Configuration
// ============================================================================

const DEFAULT_LAUNCHPAD_URL = process.env.LAUNCHPAD_API_URL || 'https://appfactory.fun';
const WEBHOOK_SECRET = process.env.APP_FACTORY_WEBHOOK_SECRET;

// ============================================================================
// Utility Functions (inline to avoid TS compilation requirement)
// ============================================================================

function sha256(input) {
  return createHash('sha256').update(input, 'utf8').digest('hex');
}

function canonicalJsonStringify(obj) {
  return JSON.stringify(obj, (_, value) => {
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      return Object.keys(value)
        .sort()
        .reduce((sorted, key) => {
          sorted[key] = value[key];
          return sorted;
        }, {});
    }
    return value;
  });
}

function validateRepoUrl(url) {
  const pattern = /^https:\/\/github\.com\/([a-zA-Z0-9_-]+)\/([a-zA-Z0-9_.-]+)\/?$/;
  const match = url.match(pattern);
  if (!match) {
    return { valid: false, error: 'Invalid GitHub URL. Must be https://github.com/{owner}/{repo}' };
  }
  return { valid: true, owner: match[1], repo: match[2].replace(/\.git$/, '') };
}

function validateWalletAddress(address) {
  const pattern = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;
  if (!pattern.test(address)) {
    return { valid: false, error: 'Invalid Solana wallet address' };
  }
  return { valid: true };
}

function validateCommitSha(sha) {
  const pattern = /^[a-f0-9]{40}$/;
  if (!pattern.test(sha.toLowerCase())) {
    return { valid: false, error: 'Invalid commit SHA. Must be 40 hex characters.' };
  }
  return { valid: true, sha: sha.toLowerCase() };
}

function validateTokenSymbol(symbol) {
  const pattern = /^[A-Z0-9]{1,10}$/;
  if (!pattern.test(symbol)) {
    return { valid: false, error: 'Invalid token symbol. Must be 1-10 uppercase alphanumeric.' };
  }
  return { valid: true };
}

function generateSlug(brand) {
  return brand
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function generateBranchName(brand, walletAddress, commitSha) {
  const slug = generateSlug(brand);
  const hashInput = `${walletAddress}:${commitSha}`;
  const fullHash = sha256(hashInput);
  return `launch/${slug}-${fullHash.substring(0, 8)}`;
}

function generateTokenSymbolFromBrand(brand) {
  const words = brand.split(/[\s-_]+/).filter(w => w.length > 0);
  if (words.length === 1) {
    return words[0].substring(0, 5).toUpperCase();
  }
  return words.map(w => w[0]).join('').substring(0, 5).toUpperCase();
}

function generateLaunchId(repoUrl, commitSha, walletAddress, brand, symbol) {
  const canonical = canonicalJsonStringify({
    brand,
    commitSha: commitSha.toLowerCase(),
    repoUrl: repoUrl.toLowerCase(),
    symbol: symbol.toUpperCase(),
    walletAddress
  });
  return sha256(canonical);
}

function generateWebhookSignature(payload, secret) {
  return createHmac('sha256', secret).update(payload).digest('hex');
}

// ============================================================================
// Tool Implementations
// ============================================================================

/**
 * Tool 1: validate-repo
 * Validates a GitHub repository URL and optionally fetches commit info
 */
async function validateRepo(args, launchpadUrl) {
  const { repoUrl, branch } = args;

  // Local validation first
  const localValidation = validateRepoUrl(repoUrl);
  if (!localValidation.valid) {
    return {
      valid: false,
      error: localValidation.error
    };
  }

  // If launchpad URL is provided, verify with the API
  try {
    const url = new URL('/api/repo/validate', launchpadUrl);
    url.searchParams.set('url', repoUrl);
    if (branch) url.searchParams.set('branch', branch);

    const response = await fetch(url.toString(), {
      headers: { 'Accept': 'application/json', 'User-Agent': 'AppFactory-RepoMode/1.0' }
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      return {
        valid: false,
        owner: localValidation.owner,
        repo: localValidation.repo,
        error: error.error || `Launchpad returned HTTP ${response.status}`
      };
    }

    const data = await response.json();
    return {
      valid: true,
      owner: data.owner || localValidation.owner,
      repo: data.repo || localValidation.repo,
      commitSha: data.commitSha,
      isPublic: data.isPublic ?? true
    };
  } catch (error) {
    // Network error - return local validation with warning
    return {
      valid: true,
      owner: localValidation.owner,
      repo: localValidation.repo,
      commitSha: null,
      isPublic: null,
      warning: 'Could not verify with Launchpad. Proceed with caution.'
    };
  }
}

/**
 * Tool 2: generate-launch-intent
 * Creates a deterministic launch.intent.json
 */
async function generateLaunchIntent(args) {
  const {
    repoUrl,
    commitSha,
    walletAddress,
    launchBrand,
    tokenSymbol,
    tokenDescription,
    imageUrl,
    twitter,
    telegram,
    website
  } = args;

  // Validate inputs
  const repoValidation = validateRepoUrl(repoUrl);
  if (!repoValidation.valid) {
    throw new Error(repoValidation.error);
  }

  const shaValidation = validateCommitSha(commitSha);
  if (!shaValidation.valid) {
    throw new Error(shaValidation.error);
  }

  const walletValidation = validateWalletAddress(walletAddress);
  if (!walletValidation.valid) {
    throw new Error(walletValidation.error);
  }

  // Generate or validate symbol
  const symbol = tokenSymbol || generateTokenSymbolFromBrand(launchBrand);
  if (tokenSymbol) {
    const symbolValidation = validateTokenSymbol(tokenSymbol);
    if (!symbolValidation.valid) {
      throw new Error(symbolValidation.error);
    }
  }

  // Generate deterministic values
  const branchName = generateBranchName(launchBrand, walletAddress, shaValidation.sha);
  const launchId = generateLaunchId(repoUrl, shaValidation.sha, walletAddress, launchBrand, symbol);
  const timestamp = new Date().toISOString();

  // Build launch config
  const launchConfig = { brand: launchBrand, symbol };
  if (tokenDescription) launchConfig.description = tokenDescription;
  if (imageUrl) launchConfig.imageUrl = imageUrl;
  if (twitter) launchConfig.twitter = twitter;
  if (telegram) launchConfig.telegram = telegram;
  if (website) launchConfig.website = website;

  // Build intent without hashes
  const intentWithoutHashes = {
    version: '1.0.0',
    id: launchId,
    timestamp,
    repo: {
      url: repoUrl,
      owner: repoValidation.owner,
      name: repoValidation.repo,
      provider: 'github',
      commitSha: shaValidation.sha
    },
    launch: launchConfig,
    wallet: {
      address: walletAddress,
      network: 'solana'
    },
    branch: {
      name: branchName,
      strategy: 'deterministic-hash'
    }
  };

  // Generate hashes
  const intentHash = sha256(canonicalJsonStringify(intentWithoutHashes));
  const configHash = sha256(canonicalJsonStringify(launchConfig));
  const repoStateHash = sha256(canonicalJsonStringify(intentWithoutHashes.repo));

  // Complete intent
  const intent = {
    ...intentWithoutHashes,
    hashes: {
      intentHash,
      configHash,
      repoStateHash
    }
  };

  return {
    launchIntent: intent,
    launchIntentJson: JSON.stringify(intent, null, 2),
    branchName,
    tokenSymbol: symbol
  };
}

/**
 * Tool 3: prepare-attestation
 * Gets the payload the user needs to sign with their wallet
 */
async function prepareAttestation(args, launchpadUrl) {
  const { launchIntentJson, walletAddress } = args;

  // Parse and validate intent
  let intent;
  try {
    intent = JSON.parse(launchIntentJson);
  } catch {
    throw new Error('Invalid JSON in launchIntentJson');
  }

  // Verify wallet matches
  if (intent.wallet?.address !== walletAddress) {
    throw new Error('Wallet address does not match intent');
  }

  // Create attestation message
  const attestationMessage = [
    'AppFactory Repo Mode Launch Attestation',
    '',
    `I am launching token "${intent.launch.symbol}" backed by:`,
    `Repository: ${intent.repo.url}`,
    `Commit: ${intent.repo.commitSha}`,
    `Launch ID: ${intent.id}`,
    '',
    'By signing this message, I attest that:',
    '1. I have authority to launch a token for this repository',
    '2. I understand this is an irreversible on-chain action',
    '3. I accept the terms of the Factory Launchpad protocol',
    '',
    `Timestamp: ${intent.timestamp}`,
    `Intent Hash: ${intent.hashes.intentHash}`
  ].join('\n');

  const payloadHash = sha256(attestationMessage);

  // Optionally call Launchpad to prepare
  try {
    const url = new URL('/api/repo-attestations/prepare', launchpadUrl);
    const response = await fetch(url.toString(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'User-Agent': 'AppFactory-RepoMode/1.0'
      },
      body: JSON.stringify({ launchIntent: launchIntentJson, walletAddress })
    });

    if (response.ok) {
      const data = await response.json();
      return {
        payloadForSignature: attestationMessage,
        payloadHash,
        instructions: data.instructions || 'Sign this message with your Solana wallet',
        expiresAt: data.expiresAt
      };
    }
  } catch {
    // Continue with local-only response
  }

  return {
    payloadForSignature: attestationMessage,
    payloadHash,
    instructions: `Sign the message above with your Solana wallet (${walletAddress}). After signing, use confirm-attestation with the signature.`
  };
}

/**
 * Tool 4: confirm-attestation
 * Confirms the signed attestation with Launchpad
 */
async function confirmAttestation(args, launchpadUrl) {
  const { launchIntentJson, walletSignature } = args;

  // Parse intent
  let intent;
  try {
    intent = JSON.parse(launchIntentJson);
  } catch {
    throw new Error('Invalid JSON in launchIntentJson');
  }

  // Submit to Launchpad
  const url = new URL('/api/repo-attestations/confirm', launchpadUrl);
  const response = await fetch(url.toString(), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'User-Agent': 'AppFactory-RepoMode/1.0'
    },
    body: JSON.stringify({
      launchIntent: launchIntentJson,
      signature: walletSignature
    })
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || `Launchpad returned HTTP ${response.status}`);
  }

  const data = await response.json();

  return {
    success: true,
    tokenMint: data.tokenMint,
    launchpadUrl: data.launchpadUrl || `${launchpadUrl}/launch/${intent.launch.symbol.toLowerCase()}`,
    projectId: data.projectId,
    nextSteps: data.nextSteps || [
      'Token has been staged on Launchpad',
      'Visit the Launchpad URL to complete the launch',
      'You will need to sign a transaction to mint the token'
    ]
  };
}

/**
 * Tool 5: setup-pipeline-hooks
 * Returns configuration for AppFactory pipeline hooks (does not write files)
 */
async function setupPipelineHooks(args) {
  const { launchBrand, branchName, appFactoryPath, enableAutoRun } = args;

  const hookConfig = {
    name: 'repo-mode-launch',
    trigger: 'post-build',
    condition: {
      branchPattern: '^launch/.*$',
      requireCertificate: true
    },
    actions: [
      {
        type: 'generate-manifest',
        output: 'launch.package.json'
      }
    ]
  };

  if (enableAutoRun) {
    hookConfig.actions.push({
      type: 'notify',
      message: `Build complete for ${launchBrand}. Ready for launch.`
    });
  }

  const hooksPath = appFactoryPath
    ? `${appFactoryPath}/.appfactory/hooks/post-build-launch.json`
    : '.appfactory/hooks/post-build-launch.json';

  return {
    configured: false, // Does not write files
    hookConfig,
    hooksPath,
    instructions: [
      `To enable launch hooks, create ${hooksPath} with the config above.`,
      'The hook will generate launch.package.json after successful builds.',
      `Branch pattern matches: ${branchName}`
    ].join('\n')
  };
}

// ============================================================================
// MCP Server Setup
// ============================================================================

const server = new Server(
  {
    name: 'repo-mode-launch',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'validate-repo',
        description: 'Validate a GitHub repository URL and check if it exists on Launchpad',
        inputSchema: {
          type: 'object',
          properties: {
            repoUrl: {
              type: 'string',
              description: 'GitHub repository URL (https://github.com/owner/repo)'
            },
            branch: {
              type: 'string',
              description: 'Optional branch name to validate'
            },
            launchpadApiUrl: {
              type: 'string',
              description: 'Optional Launchpad API URL (defaults to https://appfactory.fun)'
            }
          },
          required: ['repoUrl']
        }
      },
      {
        name: 'generate-launch-intent',
        description: 'Generate a deterministic launch.intent.json for Repo Mode token launch',
        inputSchema: {
          type: 'object',
          properties: {
            repoUrl: {
              type: 'string',
              description: 'GitHub repository URL'
            },
            commitSha: {
              type: 'string',
              description: 'Full 40-character commit SHA'
            },
            walletAddress: {
              type: 'string',
              description: 'Solana wallet address (base58)'
            },
            launchBrand: {
              type: 'string',
              description: 'Token/project name (1-32 characters)'
            },
            tokenSymbol: {
              type: 'string',
              description: 'Optional token symbol (1-10 uppercase). Auto-generated if not provided.'
            },
            tokenDescription: {
              type: 'string',
              description: 'Optional token description (max 500 characters)'
            },
            imageUrl: {
              type: 'string',
              description: 'Optional token image URL'
            },
            twitter: {
              type: 'string',
              description: 'Optional Twitter handle (without @)'
            },
            telegram: {
              type: 'string',
              description: 'Optional Telegram group/channel'
            },
            website: {
              type: 'string',
              description: 'Optional project website URL'
            }
          },
          required: ['repoUrl', 'commitSha', 'walletAddress', 'launchBrand']
        }
      },
      {
        name: 'prepare-attestation',
        description: 'Prepare the attestation payload for wallet signing',
        inputSchema: {
          type: 'object',
          properties: {
            launchIntentJson: {
              type: 'string',
              description: 'The complete launch.intent.json as a string'
            },
            walletAddress: {
              type: 'string',
              description: 'Solana wallet address that will sign'
            },
            launchpadApiUrl: {
              type: 'string',
              description: 'Optional Launchpad API URL'
            }
          },
          required: ['launchIntentJson', 'walletAddress']
        }
      },
      {
        name: 'confirm-attestation',
        description: 'Confirm the signed attestation with Launchpad to stage the launch',
        inputSchema: {
          type: 'object',
          properties: {
            launchIntentJson: {
              type: 'string',
              description: 'The complete launch.intent.json as a string'
            },
            walletSignature: {
              type: 'string',
              description: 'Base58-encoded signature from wallet'
            },
            launchpadApiUrl: {
              type: 'string',
              description: 'Optional Launchpad API URL'
            }
          },
          required: ['launchIntentJson', 'walletSignature']
        }
      },
      {
        name: 'setup-pipeline-hooks',
        description: 'Get configuration for AppFactory pipeline hooks (does not write files)',
        inputSchema: {
          type: 'object',
          properties: {
            launchBrand: {
              type: 'string',
              description: 'Token/project name'
            },
            branchName: {
              type: 'string',
              description: 'Launch branch name (launch/slug-hash)'
            },
            appFactoryPath: {
              type: 'string',
              description: 'Optional path to AppFactory root'
            },
            enableAutoRun: {
              type: 'boolean',
              description: 'Whether to enable auto-run on build success'
            }
          },
          required: ['launchBrand', 'branchName']
        }
      }
    ]
  };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  const launchpadUrl = args?.launchpadApiUrl || DEFAULT_LAUNCHPAD_URL;

  try {
    let result;

    switch (name) {
      case 'validate-repo':
        result = await validateRepo(args, launchpadUrl);
        break;

      case 'generate-launch-intent':
        result = await generateLaunchIntent(args);
        break;

      case 'prepare-attestation':
        result = await prepareAttestation(args, launchpadUrl);
        break;

      case 'confirm-attestation':
        result = await confirmAttestation(args, launchpadUrl);
        break;

      case 'setup-pipeline-hooks':
        result = await setupPipelineHooks(args);
        break;

      default:
        throw new Error(`Unknown tool: ${name}`);
    }

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(result, null, 2)
        }
      ]
    };
  } catch (error) {
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            error: true,
            message: error.message,
            tool: name
          }, null, 2)
        }
      ],
      isError: true
    };
  }
});

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Repo Mode Launch MCP server running on stdio');
}

main().catch(console.error);
