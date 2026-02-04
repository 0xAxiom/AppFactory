/**
 * TypeScript types for Launch Intent v1.0
 * Mirrors the JSON Schema at schemas/launch.intent.json.schema
 */

export interface LaunchIntent {
  /** Schema version (always "1.0.0") */
  version: '1.0.0';

  /** Deterministic launch ID (SHA256 of core fields) */
  id: string;

  /** ISO 8601 timestamp (UTC) */
  timestamp: string;

  /** Repository configuration */
  repo: LaunchIntentRepo;

  /** Token launch configuration */
  launch: LaunchIntentLaunch;

  /** Wallet configuration */
  wallet: LaunchIntentWallet;

  /** Branch configuration */
  branch: LaunchIntentBranch;

  /** Verification hashes */
  hashes: LaunchIntentHashes;

  /** Launchpad integration (populated after confirmation) */
  launchpadIntegration?: LaunchIntentLaunchpadIntegration;

  /** Lifecycle timestamps */
  timestamps?: LaunchIntentTimestamps;

  /** AppFactory metadata (if built via pipeline) */
  appFactory?: LaunchIntentAppFactory;
}

export interface LaunchIntentRepo {
  /** GitHub repository URL */
  url: string;

  /** Repository owner (user or organization) */
  owner: string;

  /** Repository name */
  name: string;

  /** Git provider (only "github" supported) */
  provider: 'github';

  /** Full 40-character commit SHA */
  commitSha: string;

  /** Branch name (optional, for reference) */
  branch?: string;
}

export interface LaunchIntentLaunch {
  /** Launch brand/token name (1-32 characters) */
  brand: string;

  /** Token symbol (1-10 uppercase alphanumeric) */
  symbol: string;

  /** Token description (max 500 characters) */
  description?: string;

  /** Token image URL */
  imageUrl?: string;

  /** Twitter handle (without @) */
  twitter?: string;

  /** Telegram group/channel */
  telegram?: string;

  /** Project website URL */
  website?: string;
}

export interface LaunchIntentWallet {
  /** Solana wallet address (base58) */
  address: string;

  /** Blockchain network (always "solana") */
  network: 'solana';

  /** When attestation was signed */
  signedAt?: string;
}

export interface LaunchIntentBranch {
  /** Deterministic branch name (launch/{slug}-{hash}) */
  name: string;

  /** Branch naming strategy (always "deterministic-hash") */
  strategy: 'deterministic-hash';

  /** When branch was created */
  createdAt?: string;
}

export interface LaunchIntentHashes {
  /** SHA256 hash of intent (excluding hashes object) */
  intentHash: string;

  /** SHA256 hash of launch config only */
  configHash?: string;

  /** SHA256 hash of repo state metadata */
  repoStateHash?: string;
}

export interface LaunchIntentLaunchpadIntegration {
  /** Launchpad API version */
  apiVersion?: string;

  /** Launchpad project ID */
  projectId?: string;

  /** Token mint address */
  tokenMint?: string;

  /** Attestation record ID */
  attestationId?: string;

  /** Staging record ID (if staged) */
  stagingId?: string;
}

export interface LaunchIntentTimestamps {
  /** When intent was generated */
  intentGenerated?: string;

  /** When attestation was prepared */
  attestationPrepared?: string;

  /** When attestation was confirmed */
  attestationConfirmed?: string;

  /** When launch branch was created */
  branchCreated?: string;

  /** When token was launched on-chain */
  launched?: string;
}

export interface LaunchIntentAppFactory {
  /** Pipeline that built the project */
  pipeline?:
    | 'app-factory'
    | 'website-pipeline'
    | 'dapp-factory'
    | 'agent-factory'
    | 'plugin-factory'
    | 'miniapp-pipeline';

  /** Build output path */
  buildPath?: string;

  /** Build timestamp */
  buildTimestamp?: string;

  /** Hash of RUN_CERTIFICATE.json */
  runCertificateHash?: string;
}

/**
 * Type guard to check if an object is a valid LaunchIntent
 */
export function isLaunchIntent(obj: unknown): obj is LaunchIntent {
  if (typeof obj !== 'object' || obj === null) return false;

  const intent = obj as Record<string, unknown>;

  return (
    intent.version === '1.0.0' &&
    typeof intent.id === 'string' &&
    typeof intent.timestamp === 'string' &&
    typeof intent.repo === 'object' &&
    typeof intent.launch === 'object' &&
    typeof intent.wallet === 'object' &&
    typeof intent.branch === 'object' &&
    typeof intent.hashes === 'object'
  );
}
