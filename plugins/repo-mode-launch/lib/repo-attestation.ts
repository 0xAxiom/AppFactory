/**
 * Repo Attestation utilities for Repo Mode
 * Handles creation of attestation payloads and verification
 */

import {
  sha256,
  canonicalJsonStringify,
  generateLaunchId,
  generateIntentHash,
  generateConfigHash,
  generateRepoStateHash,
} from './hashing.js';
import {
  generateBranchName,
  generateTokenSymbol,
  extractOwner,
  extractRepoName,
} from './naming.js';
import type { LaunchIntent } from '../types/launch-intent.js';

export interface GenerateLaunchIntentParams {
  repoUrl: string;
  commitSha: string;
  walletAddress: string;
  brand: string;
  symbol?: string;
  description?: string;
  imageUrl?: string;
  twitter?: string;
  telegram?: string;
  website?: string;
}

export interface GeneratedLaunchIntent {
  intent: LaunchIntent;
  intentJson: string;
  branchName: string;
}

/**
 * Generate a complete launch.intent.json object
 * All values are deterministic based on inputs
 */
export function generateLaunchIntent(
  params: GenerateLaunchIntentParams
): GeneratedLaunchIntent {
  const owner = extractOwner(params.repoUrl);
  const repoName = extractRepoName(params.repoUrl);

  if (!owner || !repoName) {
    throw new Error('Invalid repository URL');
  }

  // Generate token symbol if not provided
  const symbol = params.symbol || generateTokenSymbol(params.brand);

  // Generate deterministic launch ID
  const id = generateLaunchId({
    repoUrl: params.repoUrl,
    commitSha: params.commitSha,
    walletAddress: params.walletAddress,
    brand: params.brand,
    symbol,
  });

  // Generate deterministic branch name
  const branchName = generateBranchName({
    brand: params.brand,
    walletAddress: params.walletAddress,
    commitSha: params.commitSha,
  });

  // Use commit timestamp for determinism (current time as fallback)
  const timestamp = new Date().toISOString();

  // Build the launch config
  const launchConfig: LaunchIntent['launch'] = {
    brand: params.brand,
    symbol,
  };

  if (params.description) {
    launchConfig.description = params.description;
  }
  if (params.imageUrl) {
    launchConfig.imageUrl = params.imageUrl;
  }
  if (params.twitter) {
    launchConfig.twitter = params.twitter;
  }
  if (params.telegram) {
    launchConfig.telegram = params.telegram;
  }
  if (params.website) {
    launchConfig.website = params.website;
  }

  // Build the intent object (without hashes)
  const intentWithoutHashes: Omit<LaunchIntent, 'hashes'> = {
    version: '1.0.0',
    id,
    timestamp,
    repo: {
      url: params.repoUrl,
      owner,
      name: repoName,
      provider: 'github',
      commitSha: params.commitSha.toLowerCase(),
    },
    launch: launchConfig,
    wallet: {
      address: params.walletAddress,
      network: 'solana',
    },
    branch: {
      name: branchName,
      strategy: 'deterministic-hash',
    },
  };

  // Generate hashes
  const intentHash = generateIntentHash(intentWithoutHashes);
  const configHash = generateConfigHash(launchConfig);
  const repoStateHash = generateRepoStateHash(intentWithoutHashes.repo);

  // Complete intent with hashes
  const intent: LaunchIntent = {
    ...intentWithoutHashes,
    hashes: {
      intentHash,
      configHash,
      repoStateHash,
    },
  };

  // Generate canonical JSON
  const intentJson = JSON.stringify(intent, null, 2);

  return {
    intent,
    intentJson,
    branchName,
  };
}

/**
 * Create attestation message for wallet signing
 * This is what the user signs to prove ownership
 */
export function createAttestationMessage(intent: LaunchIntent): string {
  return [
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
    `Intent Hash: ${intent.hashes.intentHash}`,
  ].join('\n');
}

/**
 * Verify attestation message matches intent
 */
export function verifyAttestationMessage(
  message: string,
  intent: LaunchIntent
): boolean {
  const expected = createAttestationMessage(intent);
  return message === expected;
}

/**
 * Parse launch.intent.json and validate structure
 */
export function parseLaunchIntent(json: string): LaunchIntent {
  const parsed = JSON.parse(json);

  // Validate required fields
  const required = [
    'version',
    'id',
    'timestamp',
    'repo',
    'launch',
    'wallet',
    'branch',
    'hashes',
  ];
  for (const field of required) {
    if (!(field in parsed)) {
      throw new Error(`Missing required field: ${field}`);
    }
  }

  // Validate version
  if (parsed.version !== '1.0.0') {
    throw new Error(`Unsupported version: ${parsed.version}`);
  }

  // Validate repo
  if (!parsed.repo.url || !parsed.repo.commitSha) {
    throw new Error('Invalid repo configuration');
  }

  // Validate launch
  if (!parsed.launch.brand || !parsed.launch.symbol) {
    throw new Error('Invalid launch configuration');
  }

  // Validate wallet
  if (!parsed.wallet.address || parsed.wallet.network !== 'solana') {
    throw new Error('Invalid wallet configuration');
  }

  // Validate hashes exist
  if (!parsed.hashes.intentHash) {
    throw new Error('Missing intentHash');
  }

  return parsed as LaunchIntent;
}

/**
 * Verify intent hash matches content
 */
export function verifyIntentHash(intent: LaunchIntent): boolean {
  const computedHash = generateIntentHash(intent);
  return computedHash === intent.hashes.intentHash;
}
