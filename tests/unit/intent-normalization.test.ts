/**
 * Intent Normalization Tests
 *
 * Tests for transforming vague user input into structured, publishable product specifications.
 * Validates that raw user intent is properly normalized before pipeline execution.
 *
 * @module tests/unit
 */

import { describe, it, expect, beforeEach } from 'vitest';
import {
  createMockNormalizedIntent,
  type MockNormalizedIntent,
} from '../utils/mock-claude-response.js';

describe('Intent Normalization', () => {
  describe('Platform Detection', () => {
    it('should detect mobile platform from "app" keyword', () => {
      const result = createMockNormalizedIntent('make me a todo app');
      expect(result.platform).toBe('mobile');
    });

    it('should detect mobile platform from "iOS" keyword', () => {
      const result = createMockNormalizedIntent(
        'build an iOS meditation timer'
      );
      expect(result.platform).toBe('mobile');
    });

    it('should detect mobile platform from "Android" keyword', () => {
      const result = createMockNormalizedIntent(
        'create android fitness tracker'
      );
      expect(result.platform).toBe('mobile');
    });

    it('should detect web platform from "dapp" keyword', () => {
      const result = createMockNormalizedIntent('build a DeFi dapp dashboard');
      expect(result.platform).toBe('web');
    });

    it('should detect web platform from "website" keyword', () => {
      const result = createMockNormalizedIntent('create a portfolio website');
      expect(result.platform).toBe('web');
    });

    it('should detect agent platform from "agent" keyword', () => {
      const result = createMockNormalizedIntent(
        'build an AI agent for customer support'
      );
      expect(result.platform).toBe('agent');
    });

    it('should detect agent platform from "bot" keyword', () => {
      const result = createMockNormalizedIntent('create a trading bot');
      expect(result.platform).toBe('agent');
    });

    it('should detect plugin platform from "plugin" keyword', () => {
      const result = createMockNormalizedIntent(
        'make a Claude plugin for code review'
      );
      expect(result.platform).toBe('plugin');
    });

    it('should detect miniapp platform from "miniapp" keyword', () => {
      const result = createMockNormalizedIntent('build a miniapp for Base');
      expect(result.platform).toBe('miniapp');
    });

    it('should default to mobile when no platform keyword detected', () => {
      const result = createMockNormalizedIntent('something for productivity');
      expect(result.platform).toBe('mobile');
    });
  });

  describe('Feature Extraction', () => {
    it('should extract timer functionality', () => {
      const result = createMockNormalizedIntent('app with timer features');
      expect(result.features).toContain('Timer functionality');
    });

    it('should extract notification features', () => {
      const result = createMockNormalizedIntent('app with push notifications');
      expect(result.features).toContain('Push notifications');
    });

    it('should extract calendar integration', () => {
      const result = createMockNormalizedIntent('todo app with calendar sync');
      expect(result.features).toContain('Calendar integration');
    });

    it('should extract offline mode', () => {
      const result = createMockNormalizedIntent('app that works offline');
      expect(result.features).toContain('Offline mode');
    });

    it('should extract dark mode', () => {
      const result = createMockNormalizedIntent('app with dark theme support');
      expect(result.features).toContain('Dark mode');
    });

    it('should extract authentication features', () => {
      const result = createMockNormalizedIntent('app with user login');
      expect(result.features).toContain('User authentication');
    });

    it('should extract wallet integration', () => {
      const result = createMockNormalizedIntent('dapp with wallet connection');
      expect(result.features).toContain('Wallet integration');
    });

    it('should extract search functionality', () => {
      const result = createMockNormalizedIntent('app with search feature');
      expect(result.features).toContain('Search functionality');
    });

    it('should provide default features when none detected', () => {
      const result = createMockNormalizedIntent('simple thing');
      expect(result.features).toContain('Core functionality');
      expect(result.features).toContain('User-friendly interface');
      expect(result.features.length).toBeGreaterThanOrEqual(2);
    });

    it('should extract multiple features from complex input', () => {
      const result = createMockNormalizedIntent(
        'todo app with timer, notifications, and calendar sync that works offline'
      );
      expect(result.features).toContain('Timer functionality');
      expect(result.features).toContain('Push notifications');
      expect(result.features).toContain('Calendar integration');
      expect(result.features).toContain('Offline mode');
    });
  });

  describe('Name Generation', () => {
    it('should generate a name from input words', () => {
      const result = createMockNormalizedIntent('meditation timer app');
      expect(result.name).toBeTruthy();
      expect(result.name.length).toBeGreaterThan(0);
    });

    it('should remove special characters from name', () => {
      const result = createMockNormalizedIntent('my-cool_app!@#');
      expect(result.name).toMatch(/^[a-zA-Z0-9]+$/);
    });

    it('should capitalize name parts', () => {
      const result = createMockNormalizedIntent('simple todo list');
      expect(result.name[0]).toMatch(/[A-Z]/);
    });

    it('should allow override of generated name', () => {
      const result = createMockNormalizedIntent('some app', {
        name: 'CustomName',
      });
      expect(result.name).toBe('CustomName');
    });
  });

  describe('Description Enhancement', () => {
    it('should expand short descriptions', () => {
      const result = createMockNormalizedIntent('todo app');
      expect(result.description.length).toBeGreaterThan('todo app'.length);
    });

    it('should include polish mentions in expanded descriptions', () => {
      const result = createMockNormalizedIntent('simple timer');
      expect(result.description.toLowerCase()).toContain('user interface');
    });

    it('should preserve well-formed descriptions', () => {
      const wellFormed =
        'A comprehensive todo application with task management, due dates, priority levels, and category organization. Supports recurring tasks and integrates with calendar.';
      const result = createMockNormalizedIntent(wellFormed);
      expect(result.description).toBe(wellFormed);
    });

    it('should allow override of description', () => {
      const custom = 'My custom description';
      const result = createMockNormalizedIntent('todo app', {
        description: custom,
      });
      expect(result.description).toBe(custom);
    });
  });

  describe('Override Handling', () => {
    it('should allow platform override', () => {
      const result = createMockNormalizedIntent('make me an app', {
        platform: 'web',
      });
      expect(result.platform).toBe('web');
    });

    it('should allow features override', () => {
      const customFeatures = ['Custom Feature 1', 'Custom Feature 2'];
      const result = createMockNormalizedIntent('app', {
        features: customFeatures,
      });
      expect(result.features).toEqual(customFeatures);
    });

    it('should allow metadata addition', () => {
      const metadata = { version: '1.0', author: 'Test' };
      const result = createMockNormalizedIntent('app', { metadata });
      expect(result.metadata).toEqual(metadata);
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty input gracefully', () => {
      const result = createMockNormalizedIntent('');
      expect(result.name).toBeTruthy();
      expect(result.description).toBeTruthy();
      expect(result.features.length).toBeGreaterThan(0);
    });

    it('should handle whitespace-only input', () => {
      const result = createMockNormalizedIntent('   ');
      expect(result.name).toBeTruthy();
      expect(result.platform).toBe('mobile');
    });

    it('should handle very long input', () => {
      const longInput = 'app '.repeat(1000);
      const result = createMockNormalizedIntent(longInput);
      expect(result.name).toBeTruthy();
      expect(result.name.length).toBeLessThan(100);
    });

    it('should handle unicode characters', () => {
      const result = createMockNormalizedIntent('app with emoji');
      expect(result.name).toBeTruthy();
    });

    it('should handle mixed case input', () => {
      const result = createMockNormalizedIntent('MaKe Me An IOS ApP');
      expect(result.platform).toBe('mobile');
    });
  });
});

describe('Intent Normalization Quality', () => {
  describe('Professional Output', () => {
    it('should produce descriptions suitable for product specs', () => {
      const result = createMockNormalizedIntent('meditation app');

      // Description should be professional
      expect(result.description).not.toContain('um');
      expect(result.description).not.toContain('...');
      expect(result.description).not.toMatch(/[!?]{2,}/); // No multiple punctuation
    });

    it('should not include placeholder text in output', () => {
      const result = createMockNormalizedIntent('todo tracker');

      expect(result.description.toLowerCase()).not.toContain('placeholder');
      expect(result.description.toLowerCase()).not.toContain('todo:');
      expect(result.description.toLowerCase()).not.toContain('lorem ipsum');
    });
  });

  describe('Completeness', () => {
    it('should always have all required fields', () => {
      const inputs = [
        'app',
        'todo',
        'a',
        'make something',
        'build a thing for stuff',
      ];

      for (const input of inputs) {
        const result = createMockNormalizedIntent(input);

        expect(result.name).toBeDefined();
        expect(typeof result.name).toBe('string');
        expect(result.name.length).toBeGreaterThan(0);

        expect(result.description).toBeDefined();
        expect(typeof result.description).toBe('string');
        expect(result.description.length).toBeGreaterThan(0);

        expect(result.features).toBeDefined();
        expect(Array.isArray(result.features)).toBe(true);
        expect(result.features.length).toBeGreaterThan(0);

        expect(result.platform).toBeDefined();
        expect(['mobile', 'web', 'agent', 'plugin', 'miniapp']).toContain(
          result.platform
        );
      }
    });
  });
});
