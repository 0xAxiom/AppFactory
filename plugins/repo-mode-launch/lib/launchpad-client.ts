/**
 * HTTP client for Factory Launchpad API
 * Handles all communication with the Launchpad backend
 */

import { createHmac, timingSafeEqual } from 'crypto';

export interface LaunchpadConfig {
  apiUrl: string;
  webhookSecret?: string;
}

export interface RepoValidationResult {
  valid: boolean;
  owner: string;
  repo: string;
  commitSha: string;
  isPublic: boolean;
  error?: string;
}

export interface PrepareAttestationResult {
  payloadForSignature: string;
  payloadHash: string;
  instructions: string;
  expiresAt: string;
}

export interface ConfirmAttestationResult {
  success: boolean;
  tokenMint?: string;
  launchpadUrl?: string;
  projectId?: string;
  stagingId?: string;
  nextSteps: string[];
}

export interface StageResult {
  stagingId: string;
  approvalUrl: string;
  expiresAt: string;
}

const DEFAULT_API_URL = 'https://appfactory.fun';

/**
 * Generate HMAC-SHA256 signature for webhook authentication
 */
export function generateWebhookSignature(payload: string, secret: string): string {
  return createHmac('sha256', secret).update(payload).digest('hex');
}

/**
 * Verify webhook signature
 */
export function verifyWebhookSignature(
  payload: string,
  signature: string,
  secret: string
): boolean {
  const expected = generateWebhookSignature(payload, secret);
  // Use timing-safe comparison
  if (expected.length !== signature.length) return false;

  const expectedBuf = Buffer.from(expected);
  const signatureBuf = Buffer.from(signature);

  return timingSafeEqual(expectedBuf, signatureBuf);
}

/**
 * Launchpad API client
 */
export class LaunchpadClient {
  private apiUrl: string;
  private webhookSecret?: string;

  constructor(config?: Partial<LaunchpadConfig>) {
    this.apiUrl = config?.apiUrl || process.env.LAUNCHPAD_API_URL || DEFAULT_API_URL;
    this.webhookSecret = config?.webhookSecret || process.env.APP_FACTORY_WEBHOOK_SECRET;
  }

  /**
   * Validate repository with Launchpad
   * Checks if repo exists, is public, and returns current commit SHA
   */
  async validateRepo(repoUrl: string, branch?: string): Promise<RepoValidationResult> {
    const url = new URL('/api/repo/validate', this.apiUrl);
    url.searchParams.set('url', repoUrl);
    if (branch) {
      url.searchParams.set('branch', branch);
    }

    try {
      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'AppFactory-RepoMode/1.0'
        }
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Unknown error' }));
        return {
          valid: false,
          owner: '',
          repo: '',
          commitSha: '',
          isPublic: false,
          error: error.error || `HTTP ${response.status}`
        };
      }

      const data = await response.json();
      return {
        valid: true,
        owner: data.owner,
        repo: data.repo,
        commitSha: data.commitSha,
        isPublic: data.isPublic ?? true
      };
    } catch (error) {
      return {
        valid: false,
        owner: '',
        repo: '',
        commitSha: '',
        isPublic: false,
        error: error instanceof Error ? error.message : 'Network error'
      };
    }
  }

  /**
   * Prepare attestation payload for signing
   * Returns the exact bytes the user should sign
   */
  async prepareAttestation(
    launchIntentJson: string,
    walletAddress: string
  ): Promise<PrepareAttestationResult> {
    const url = new URL('/api/repo-attestations/prepare', this.apiUrl);

    const response = await fetch(url.toString(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'User-Agent': 'AppFactory-RepoMode/1.0'
      },
      body: JSON.stringify({
        launchIntent: launchIntentJson,
        walletAddress
      })
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(error.error || `HTTP ${response.status}`);
    }

    return response.json();
  }

  /**
   * Confirm attestation with signed message
   * After user signs the payload in their wallet
   */
  async confirmAttestation(
    launchIntentJson: string,
    walletSignature: string
  ): Promise<ConfirmAttestationResult> {
    const url = new URL('/api/repo-attestations/confirm', this.apiUrl);

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
      const error = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(error.error || `HTTP ${response.status}`);
    }

    return response.json();
  }

  /**
   * Stage launch intent for user approval on Launchpad
   * Used when coming from "Open in Claude" flow
   */
  async stageLaunch(launchIntentJson: string): Promise<StageResult> {
    const url = new URL('/api/launch/repo-mode/stage', this.apiUrl);
    const payload = JSON.stringify({ launchIntent: launchIntentJson });

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'User-Agent': 'AppFactory-RepoMode/1.0'
    };

    // Add webhook signature if secret is configured
    if (this.webhookSecret) {
      headers['X-AppFactory-Signature'] = generateWebhookSignature(payload, this.webhookSecret);
    }

    const response = await fetch(url.toString(), {
      method: 'POST',
      headers,
      body: payload
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(error.error || `HTTP ${response.status}`);
    }

    return response.json();
  }

  /**
   * Get staging status
   */
  async getStagingStatus(stagingId: string): Promise<{
    status: 'pending' | 'approved' | 'expired' | 'confirmed';
    tokenPreview?: {
      name: string;
      symbol: string;
      description?: string;
    };
    expiresAt: string;
  }> {
    const url = new URL(`/api/launch/repo-mode/staging/${stagingId}`, this.apiUrl);

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'AppFactory-RepoMode/1.0'
      }
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(error.error || `HTTP ${response.status}`);
    }

    return response.json();
  }
}

// Export singleton with default config
export const launchpadClient = new LaunchpadClient();
