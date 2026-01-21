/**
 * Unit tests for CLI/src/core/anthropic.ts
 * Tests Anthropic API client utilities with stub mode for isolation
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  loadConfig,
  extractJson,
  setStubMode,
  addStubResponse,
  clearStubResponses,
  callClaude,
  callClaudeJson,
} from './anthropic.js';

describe('anthropic module', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    // Reset environment for each test
    vi.resetModules();
    process.env = { ...originalEnv };
    setStubMode(false);
    clearStubResponses();
  });

  afterEach(() => {
    process.env = originalEnv;
    setStubMode(false);
    clearStubResponses();
  });

  describe('loadConfig', () => {
    it('should load config from environment variables', () => {
      process.env.ANTHROPIC_API_KEY = 'sk-ant-test-key-123';
      process.env.ANTHROPIC_MODEL = 'claude-3-opus-20240229';
      process.env.APPFACTORY_MAX_TOKENS = '8000';
      process.env.APPFACTORY_TEMPERATURE = '0.5';

      const config = loadConfig();

      expect(config.apiKey).toBe('sk-ant-test-key-123');
      expect(config.model).toBe('claude-3-opus-20240229');
      expect(config.maxTokens).toBe(8000);
      expect(config.temperature).toBe(0.5);
    });

    it('should use default values when env vars not set', () => {
      process.env.ANTHROPIC_API_KEY = 'sk-ant-test-key';
      delete process.env.ANTHROPIC_MODEL;
      delete process.env.APPFACTORY_MAX_TOKENS;
      delete process.env.APPFACTORY_TEMPERATURE;

      const config = loadConfig();

      expect(config.model).toBe('claude-sonnet-4-20250514');
      expect(config.maxTokens).toBe(16000);
      expect(config.temperature).toBe(0.3);
    });

    it('should throw error when API key is missing and not in stub mode', () => {
      delete process.env.ANTHROPIC_API_KEY;

      expect(() => loadConfig()).toThrow(
        'ANTHROPIC_API_KEY environment variable is required'
      );
    });

    it('should not throw when API key is missing but in stub mode', () => {
      delete process.env.ANTHROPIC_API_KEY;
      setStubMode(true);

      const config = loadConfig();

      expect(config.apiKey).toBe('stub-key');
    });
  });

  describe('extractJson', () => {
    it('should extract JSON from markdown code block', () => {
      const content =
        'Here is the result:\n```json\n{"key": "value"}\n```\nDone.';
      const result = extractJson(content);

      expect(result).toBe('{"key": "value"}');
    });

    it('should extract JSON from code block without language', () => {
      const content = '```\n{"key": "value"}\n```';
      const result = extractJson(content);

      expect(result).toBe('{"key": "value"}');
    });

    it('should extract raw JSON object', () => {
      const content = 'Some text before {"key": "value"} some text after';
      const result = extractJson(content);

      expect(result).toBe('{"key": "value"}');
    });

    it('should extract raw JSON array', () => {
      const content = 'Text [1, 2, 3] more text';
      const result = extractJson(content);

      expect(result).toBe('[1, 2, 3]');
    });

    it('should handle nested JSON objects', () => {
      const content = '```json\n{"outer": {"inner": "value"}}\n```';
      const result = extractJson(content);

      expect(result).toBe('{"outer": {"inner": "value"}}');
    });

    it('should handle multiline JSON', () => {
      const content = `\`\`\`json
{
  "key1": "value1",
  "key2": "value2"
}
\`\`\``;
      const result = extractJson(content);

      expect(JSON.parse(result)).toEqual({ key1: 'value1', key2: 'value2' });
    });

    it('should return trimmed content if no JSON found', () => {
      const content = '  Just plain text  ';
      const result = extractJson(content);

      expect(result).toBe('Just plain text');
    });
  });

  describe('stub mode', () => {
    beforeEach(() => {
      setStubMode(true);
    });

    it('should return stub response when available', async () => {
      const prompt = 'test prompt';
      const stubResponse = '{"result": "stubbed"}';
      addStubResponse(prompt, stubResponse);

      const result = await callClaude(prompt);

      expect(result).toBe(stubResponse);
    });

    it('should return generic stub response when no specific stub', async () => {
      const result = await callClaude('some random prompt');

      expect(result).toContain('stub');
    });

    it('should clear stub responses', () => {
      addStubResponse('prompt1', 'response1');
      clearStubResponses();

      // After clearing, should get generic response
      return callClaude('prompt1').then((result) => {
        expect(result).not.toBe('response1');
      });
    });
  });

  describe('callClaudeJson', () => {
    beforeEach(() => {
      setStubMode(true);
    });

    it('should parse JSON response correctly', async () => {
      const prompt = 'test json prompt';
      addStubResponse(prompt, '{"name": "test", "value": 42}');

      const result = await callClaudeJson<{ name: string; value: number }>(
        prompt
      );

      expect(result).toEqual({ name: 'test', value: 42 });
    });

    it('should extract JSON from code blocks', async () => {
      const prompt = 'code block prompt';
      addStubResponse(prompt, '```json\n{"parsed": true}\n```');

      const result = await callClaudeJson<{ parsed: boolean }>(prompt);

      expect(result).toEqual({ parsed: true });
    });

    it('should throw error for invalid JSON', async () => {
      const prompt = 'invalid json prompt';
      addStubResponse(prompt, 'not valid json {');

      await expect(callClaudeJson(prompt)).rejects.toThrow('Invalid JSON');
    });
  });
});
