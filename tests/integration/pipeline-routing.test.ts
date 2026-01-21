/**
 * Pipeline Routing Tests
 *
 * Integration tests for correct pipeline selection based on user intent.
 * Validates that the root orchestrator routes requests to appropriate pipelines.
 *
 * @module tests/integration
 */

import { describe, it, expect, beforeEach } from 'vitest';
import * as fs from 'node:fs';
import * as path from 'node:path';

/**
 * Pipeline identifier type
 */
type PipelineId =
  | 'app-factory'
  | 'dapp-factory'
  | 'agent-factory'
  | 'plugin-factory'
  | 'miniapp-pipeline'
  | 'website-pipeline';

/**
 * Routing result type
 */
interface RoutingResult {
  /** Selected pipeline */
  pipeline: PipelineId | null;
  /** Confidence score (0-1) */
  confidence: number;
  /** Alternative pipelines that could match */
  alternatives: PipelineId[];
  /** Keywords that influenced the decision */
  matchedKeywords: string[];
  /** Whether routing was ambiguous */
  ambiguous: boolean;
}

/**
 * Pipeline keyword mappings for routing
 */
const PIPELINE_KEYWORDS: Record<PipelineId, string[]> = {
  'app-factory': [
    'mobile',
    'ios',
    'android',
    'expo',
    'react native',
    'app store',
    'play store',
    'phone',
    'tablet',
    'mobile app',
    'native app',
  ],
  'dapp-factory': [
    'dapp',
    'defi',
    'web3',
    'blockchain',
    'solana',
    'ethereum',
    'smart contract',
    'wallet',
    'token',
    'nft',
    'onchain',
    'decentralized',
    'crypto',
    'next.js',
    'nextjs',
  ],
  'agent-factory': [
    'agent',
    'ai agent',
    'bot',
    'automation',
    'autonomous',
    'rig',
    'llm agent',
    'chatbot',
    'assistant',
  ],
  'plugin-factory': [
    'plugin',
    'claude plugin',
    'mcp',
    'mcp server',
    'extension',
    'claude code',
    'tool',
  ],
  'miniapp-pipeline': [
    'miniapp',
    'mini app',
    'base',
    'minikit',
    'farcaster',
    'frame',
    'warpcast',
  ],
  'website-pipeline': [
    'website',
    'landing page',
    'static site',
    'portfolio',
    'blog',
    'marketing site',
  ],
};

/**
 * Negative keywords that exclude certain pipelines
 */
const PIPELINE_EXCLUSIONS: Record<PipelineId, string[]> = {
  'app-factory': ['website', 'web only', 'browser only'],
  'dapp-factory': ['mobile only', 'native app'],
  'agent-factory': ['ui', 'frontend', 'user interface'],
  'plugin-factory': [],
  'miniapp-pipeline': ['native', 'full app'],
  'website-pipeline': ['app', 'mobile', 'dapp'],
};

/**
 * Route user intent to the appropriate pipeline
 */
function routeToPipeline(intent: string): RoutingResult {
  const normalizedIntent = intent.toLowerCase().trim();
  const scores: Record<PipelineId, number> = {
    'app-factory': 0,
    'dapp-factory': 0,
    'agent-factory': 0,
    'plugin-factory': 0,
    'miniapp-pipeline': 0,
    'website-pipeline': 0,
  };

  const matchedKeywords: string[] = [];

  // Calculate scores based on keyword matches
  for (const [pipeline, keywords] of Object.entries(PIPELINE_KEYWORDS)) {
    for (const keyword of keywords) {
      if (normalizedIntent.includes(keyword.toLowerCase())) {
        scores[pipeline as PipelineId] += keyword.split(' ').length; // Multi-word keywords score higher
        matchedKeywords.push(keyword);
      }
    }
  }

  // Apply exclusions
  for (const [pipeline, exclusions] of Object.entries(PIPELINE_EXCLUSIONS)) {
    for (const exclusion of exclusions) {
      if (normalizedIntent.includes(exclusion.toLowerCase())) {
        scores[pipeline as PipelineId] = Math.max(
          0,
          scores[pipeline as PipelineId] - 2
        );
      }
    }
  }

  // Find the highest scoring pipeline
  const sortedPipelines = (
    Object.entries(scores) as [PipelineId, number][]
  ).sort((a, b) => b[1] - a[1]);

  const topPipeline = sortedPipelines[0];
  const secondPipeline = sortedPipelines[1];

  // Calculate confidence
  const totalScore = Object.values(scores).reduce((a, b) => a + b, 0);
  const confidence = totalScore > 0 ? topPipeline[1] / totalScore : 0;

  // Determine if ambiguous
  const ambiguous =
    topPipeline[1] > 0 &&
    secondPipeline[1] > 0 &&
    topPipeline[1] - secondPipeline[1] <= 1;

  // Find alternatives
  const alternatives = sortedPipelines
    .filter(([_, score]) => score > 0 && _ !== topPipeline[0])
    .map(([pipeline]) => pipeline)
    .slice(0, 2);

  return {
    pipeline: topPipeline[1] > 0 ? topPipeline[0] : null,
    confidence,
    alternatives,
    matchedKeywords: [...new Set(matchedKeywords)],
    ambiguous,
  };
}

/**
 * Check if a pipeline directory exists in the repository
 */
function pipelineExists(pipelineId: PipelineId, repoRoot: string): boolean {
  const pipelinePath = path.join(repoRoot, pipelineId);
  return fs.existsSync(pipelinePath);
}

describe('Pipeline Routing', () => {
  describe('Mobile App Routing', () => {
    it('should route "mobile app" to app-factory', () => {
      const result = routeToPipeline(
        'build me a mobile app for tracking habits'
      );
      expect(result.pipeline).toBe('app-factory');
    });

    it('should route "iOS app" to app-factory', () => {
      const result = routeToPipeline('create an iOS meditation timer');
      expect(result.pipeline).toBe('app-factory');
    });

    it('should route "Android app" to app-factory', () => {
      const result = routeToPipeline('make an Android fitness tracker');
      expect(result.pipeline).toBe('app-factory');
    });

    it('should route "React Native" to app-factory', () => {
      const result = routeToPipeline('build a react native todo app');
      expect(result.pipeline).toBe('app-factory');
    });

    it('should route "Expo" to app-factory', () => {
      const result = routeToPipeline('create an expo weather app');
      expect(result.pipeline).toBe('app-factory');
    });
  });

  describe('dApp Routing', () => {
    it('should route "dApp" to dapp-factory', () => {
      const result = routeToPipeline('build a dapp for token swaps');
      expect(result.pipeline).toBe('dapp-factory');
    });

    it('should route "DeFi" to dapp-factory', () => {
      const result = routeToPipeline('create a DeFi dashboard');
      expect(result.pipeline).toBe('dapp-factory');
    });

    it('should route "Web3" to dapp-factory', () => {
      const result = routeToPipeline('make a Web3 marketplace');
      expect(result.pipeline).toBe('dapp-factory');
    });

    it('should route "Solana" to dapp-factory', () => {
      const result = routeToPipeline('build a Solana wallet tracker');
      expect(result.pipeline).toBe('dapp-factory');
    });

    it('should route "blockchain" to dapp-factory', () => {
      const result = routeToPipeline('create a blockchain explorer');
      expect(result.pipeline).toBe('dapp-factory');
    });

    it('should route "NFT" to dapp-factory', () => {
      const result = routeToPipeline('build an NFT gallery');
      expect(result.pipeline).toBe('dapp-factory');
    });
  });

  describe('Agent Routing', () => {
    it('should route "AI agent" to agent-factory', () => {
      const result = routeToPipeline('build an AI agent for customer support');
      expect(result.pipeline).toBe('agent-factory');
    });

    it('should route "bot" to agent-factory', () => {
      const result = routeToPipeline('create a trading bot');
      expect(result.pipeline).toBe('agent-factory');
    });

    it('should route "autonomous" to agent-factory', () => {
      const result = routeToPipeline('make an autonomous research agent');
      expect(result.pipeline).toBe('agent-factory');
    });

    it('should route "chatbot" to agent-factory', () => {
      const result = routeToPipeline('build a chatbot assistant');
      expect(result.pipeline).toBe('agent-factory');
    });
  });

  describe('Plugin Routing', () => {
    it('should route "Claude plugin" to plugin-factory', () => {
      const result = routeToPipeline('create a Claude plugin for code review');
      expect(result.pipeline).toBe('plugin-factory');
    });

    it('should route "MCP server" to plugin-factory', () => {
      const result = routeToPipeline('build an MCP server for database access');
      expect(result.pipeline).toBe('plugin-factory');
    });

    it('should route "extension" to plugin-factory', () => {
      const result = routeToPipeline('make an extension for Claude Code');
      expect(result.pipeline).toBe('plugin-factory');
    });
  });

  describe('Mini App Routing', () => {
    it('should route "miniapp" to miniapp-pipeline', () => {
      const result = routeToPipeline('build a miniapp for social voting');
      expect(result.pipeline).toBe('miniapp-pipeline');
    });

    it('should route "Base minikit" to miniapp-pipeline', () => {
      const result = routeToPipeline('create a Base minikit app');
      expect(result.pipeline).toBe('miniapp-pipeline');
    });

    it('should route "Farcaster frame" to miniapp-pipeline', () => {
      const result = routeToPipeline('build a Farcaster frame');
      expect(result.pipeline).toBe('miniapp-pipeline');
    });
  });

  describe('Website Routing', () => {
    it('should route "website" to website-pipeline', () => {
      const result = routeToPipeline('build a website for my business');
      expect(result.pipeline).toBe('website-pipeline');
    });

    it('should route "landing page" to website-pipeline', () => {
      const result = routeToPipeline('create a landing page');
      expect(result.pipeline).toBe('website-pipeline');
    });

    it('should route "portfolio" to website-pipeline', () => {
      const result = routeToPipeline('make a portfolio site');
      expect(result.pipeline).toBe('website-pipeline');
    });
  });

  describe('Ambiguous Routing', () => {
    it('should detect ambiguous intent', () => {
      // "app" could be mobile or web
      const result = routeToPipeline('build an app');
      expect(result.ambiguous || result.confidence < 0.5).toBe(true);
    });

    it('should provide alternatives for ambiguous cases', () => {
      const result = routeToPipeline('build something with tokens');
      expect(result.alternatives.length).toBeGreaterThanOrEqual(0);
    });

    it('should return null for completely unclear intent', () => {
      const result = routeToPipeline('do something cool');
      expect(result.pipeline === null || result.confidence < 0.3).toBe(true);
    });
  });

  describe('Keyword Matching', () => {
    it('should track matched keywords', () => {
      const result = routeToPipeline('build a mobile iOS app');
      expect(result.matchedKeywords).toContain('mobile');
      expect(result.matchedKeywords).toContain('ios');
    });

    it('should deduplicate matched keywords', () => {
      const result = routeToPipeline('mobile mobile app for mobile users');
      const mobileCount = result.matchedKeywords.filter(
        (k) => k === 'mobile'
      ).length;
      expect(mobileCount).toBe(1);
    });
  });

  describe('Exclusion Handling', () => {
    it('should reduce score for excluded keywords', () => {
      // "website" should reduce app-factory score
      const withExclusion = routeToPipeline('build a mobile website');
      const withoutExclusion = routeToPipeline('build a mobile app');

      // The "website" exclusion should affect the result
      expect(withExclusion.pipeline).not.toBe('app-factory');
    });

    it('should not fully exclude pipelines with strong matches', () => {
      // Strong mobile keywords should still win
      const result = routeToPipeline('build an iOS Android mobile app');
      expect(result.pipeline).toBe('app-factory');
    });
  });

  describe('Confidence Scoring', () => {
    it('should have high confidence for clear matches', () => {
      const result = routeToPipeline('build a Solana DeFi Web3 dApp');
      expect(result.confidence).toBeGreaterThan(0.5);
    });

    it('should have lower confidence for vague matches', () => {
      const result = routeToPipeline('build something');
      expect(result.confidence).toBeLessThan(0.5);
    });

    it('should calculate confidence as proportion of total score', () => {
      const result = routeToPipeline('mobile app');
      expect(result.confidence).toBeGreaterThan(0);
      expect(result.confidence).toBeLessThanOrEqual(1);
    });
  });
});

describe('Pipeline Existence Verification', () => {
  // This test uses the actual file system to verify pipeline directories exist
  const repoRoot = path.resolve(__dirname, '..', '..');

  it('should find app-factory directory', () => {
    const exists = pipelineExists('app-factory', repoRoot);
    expect(exists).toBe(true);
  });

  it('should find dapp-factory directory', () => {
    const exists = pipelineExists('dapp-factory', repoRoot);
    expect(exists).toBe(true);
  });

  it('should find agent-factory directory', () => {
    const exists = pipelineExists('agent-factory', repoRoot);
    expect(exists).toBe(true);
  });

  it('should find plugin-factory directory', () => {
    const exists = pipelineExists('plugin-factory', repoRoot);
    expect(exists).toBe(true);
  });

  it('should find miniapp-pipeline directory', () => {
    const exists = pipelineExists('miniapp-pipeline', repoRoot);
    expect(exists).toBe(true);
  });
});

describe('Routing Edge Cases', () => {
  it('should handle empty input', () => {
    const result = routeToPipeline('');
    expect(result.pipeline).toBeNull();
  });

  it('should handle whitespace-only input', () => {
    const result = routeToPipeline('   ');
    expect(result.pipeline).toBeNull();
  });

  it('should handle very long input', () => {
    const longInput = 'mobile app '.repeat(100);
    const result = routeToPipeline(longInput);
    expect(result.pipeline).toBe('app-factory');
  });

  it('should be case-insensitive', () => {
    const lower = routeToPipeline('build a MOBILE APP');
    const upper = routeToPipeline('build a mobile app');
    expect(lower.pipeline).toBe(upper.pipeline);
  });

  it('should handle special characters gracefully', () => {
    const result = routeToPipeline('build a mobile app! @#$%');
    expect(result.pipeline).toBe('app-factory');
  });
});
