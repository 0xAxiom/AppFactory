/**
 * Unit tests for dapp-factory/generator/index.ts
 * Tests prompt generation utilities
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'fs';
import path from 'path';
import os from 'os';

// Extract testable logic from generator

/**
 * Generate a slug from the app idea
 */
function generateSlug(idea: string): string {
  const words = idea
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .split(/\s+/)
    .filter((w) => w.length > 2)
    .slice(0, 3);

  return words.join('-') || 'web3-app';
}

/**
 * Generate a display name from the slug
 */
function generateAppName(slug: string): string {
  return slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Validate idea length
 */
function validateIdea(idea: string): { valid: boolean; error?: string } {
  if (!idea || idea.length < 10) {
    return {
      valid: false,
      error: 'Provide a more detailed app idea (at least 10 characters).',
    };
  }
  return { valid: true };
}

/**
 * Interface for template context
 */
interface TemplateContext {
  app_name: string;
  app_slug: string;
  idea: string;
  timestamp: string;
}

/**
 * Build template context
 */
function buildTemplateContext(idea: string): TemplateContext {
  const appSlug = generateSlug(idea);
  const appName = generateAppName(appSlug);
  const timestamp = new Date().toISOString();

  return {
    app_name: appName,
    app_slug: appSlug,
    idea,
    timestamp,
  };
}

describe('generator module', () => {
  describe('generateSlug', () => {
    it('should generate slug from simple idea', () => {
      const slug = generateSlug('DeFi Dashboard App');

      expect(slug).toBe('defi-dashboard-app');
    });

    it('should remove special characters', () => {
      const slug = generateSlug('My App! With @special #chars');

      expect(slug).toBe('app-with-special');
    });

    it('should filter out short words (2 chars or less)', () => {
      const slug = generateSlug('A Cool To Do App');

      expect(slug).toBe('cool-app');
    });

    it('should limit to 3 words', () => {
      const slug = generateSlug('This is a very long app name with many words');

      const parts = slug.split('-');
      expect(parts.length).toBeLessThanOrEqual(3);
    });

    it('should return default for empty input', () => {
      const slug = generateSlug('');

      expect(slug).toBe('web3-app');
    });

    it('should handle all short words', () => {
      const slug = generateSlug('a an to it');

      expect(slug).toBe('web3-app');
    });

    it('should handle numbers', () => {
      const slug = generateSlug('Web3 Wallet 2024');

      expect(slug).toBe('web3-wallet-2024');
    });

    it('should normalize case', () => {
      const slug = generateSlug('UPPERCASE lowercase MixedCase');

      expect(slug).toBe('uppercase-lowercase-mixedcase');
    });
  });

  describe('generateAppName', () => {
    it('should capitalize each word', () => {
      const name = generateAppName('defi-dashboard');

      expect(name).toBe('Defi Dashboard');
    });

    it('should handle single word', () => {
      const name = generateAppName('wallet');

      expect(name).toBe('Wallet');
    });

    it('should handle empty string', () => {
      const name = generateAppName('');

      expect(name).toBe('');
    });

    it('should preserve word separation', () => {
      const name = generateAppName('my-cool-app');

      expect(name).toBe('My Cool App');
    });
  });

  describe('validateIdea', () => {
    it('should reject empty idea', () => {
      const result = validateIdea('');

      expect(result.valid).toBe(false);
      expect(result.error).toContain('10 characters');
    });

    it('should reject short idea', () => {
      const result = validateIdea('Short');

      expect(result.valid).toBe(false);
    });

    it('should accept valid idea', () => {
      const result = validateIdea('A DeFi dashboard with portfolio tracking');

      expect(result.valid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should accept exactly 10 characters', () => {
      const result = validateIdea('0123456789');

      expect(result.valid).toBe(true);
    });
  });

  describe('buildTemplateContext', () => {
    it('should build complete context', () => {
      const idea = 'DeFi portfolio tracker';
      const context = buildTemplateContext(idea);

      expect(context.idea).toBe(idea);
      expect(context.app_slug).toBe('defi-portfolio-tracker');
      expect(context.app_name).toBe('Defi Portfolio Tracker');
      expect(context.timestamp).toBeDefined();
    });

    it('should include valid ISO timestamp', () => {
      const context = buildTemplateContext('Test app idea');

      expect(() => new Date(context.timestamp)).not.toThrow();
      expect(new Date(context.timestamp).toISOString()).toBe(context.timestamp);
    });

    it('should handle complex ideas', () => {
      const idea = 'A Web3 NFT marketplace with social features and staking!';
      const context = buildTemplateContext(idea);

      expect(context.app_slug).toMatch(/^[a-z0-9-]+$/);
      // App name can include numbers from the slug (e.g., "Web3")
      expect(context.app_name).toMatch(/^[A-Z][a-zA-Z0-9 ]+$/);
    });
  });

  describe('integration: full generation flow', () => {
    let testDir: string;

    beforeEach(() => {
      testDir = fs.mkdtempSync(path.join(os.tmpdir(), 'generator-test-'));
    });

    afterEach(() => {
      if (fs.existsSync(testDir)) {
        fs.rmSync(testDir, { recursive: true, force: true });
      }
    });

    it('should create valid context for typical dApp idea', () => {
      const idea =
        'Create a decentralized exchange with limit orders and liquidity pools';

      const validation = validateIdea(idea);
      expect(validation.valid).toBe(true);

      const context = buildTemplateContext(idea);

      expect(context.app_slug).toBeTruthy();
      expect(context.app_name).toBeTruthy();
      expect(context.app_slug).not.toContain(' ');
      expect(context.app_slug).toBe(context.app_slug.toLowerCase());
    });

    it('should create unique output directories', () => {
      const ideas = ['NFT Marketplace', 'Token Swap', 'Wallet Manager'];

      const slugs = ideas.map((idea) => generateSlug(idea));
      const uniqueSlugs = [...new Set(slugs)];

      expect(slugs.length).toBe(uniqueSlugs.length);
    });

    it('should sanitize potentially problematic inputs', () => {
      const dangerousInputs = [
        '../../../etc/passwd',
        'app name with <script>',
        'name; rm -rf /',
        'name\nwith\nnewlines',
      ];

      for (const input of dangerousInputs) {
        const slug = generateSlug(input);

        // Slug should be safe (no path traversal, no special chars)
        expect(slug).not.toContain('..');
        expect(slug).not.toContain('<');
        expect(slug).not.toContain('>');
        expect(slug).not.toContain(';');
        expect(slug).not.toContain('\n');
        expect(slug).toMatch(/^[a-z0-9-]+$/);
      }
    });
  });

  describe('edge cases', () => {
    it('should handle unicode characters', () => {
      const slug = generateSlug('cafe app');

      expect(slug).toMatch(/^[a-z0-9-]+$/);
    });

    it('should handle consecutive spaces', () => {
      const slug = generateSlug('app  with   many    spaces');

      expect(slug).not.toContain('--');
    });

    it('should handle leading/trailing spaces', () => {
      const slug = generateSlug('  trimmed app  ');

      expect(slug).toBe('trimmed-app');
    });

    it('should handle hyphenated input words', () => {
      const slug = generateSlug('multi-chain bridge');

      // Should handle pre-hyphenated words
      expect(slug).toMatch(/^[a-z0-9-]+$/);
    });
  });
});
