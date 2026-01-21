/**
 * Unit tests for CLI/src/core/logging.ts
 * Tests logging module functionality
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { logger } from './logging.js';

describe('logging module', () => {
  let consoleLogSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    // Reset logger state
    logger.setJsonMode(false);
    logger.setDebugMode(false);
  });

  afterEach(() => {
    consoleLogSpy.mockRestore();
  });

  describe('basic logging', () => {
    it('should log info messages', () => {
      logger.info('Test info message');

      expect(consoleLogSpy).toHaveBeenCalledTimes(1);
      expect(String(consoleLogSpy.mock.calls[0][0])).toContain(
        'Test info message'
      );
    });

    it('should log warning messages', () => {
      logger.warn('Test warning');

      expect(consoleLogSpy).toHaveBeenCalledTimes(1);
      expect(String(consoleLogSpy.mock.calls[0][0])).toContain('Test warning');
    });

    it('should log error messages', () => {
      logger.error('Test error');

      expect(consoleLogSpy).toHaveBeenCalledTimes(1);
      expect(String(consoleLogSpy.mock.calls[0][0])).toContain('Test error');
    });

    it('should log success messages', () => {
      logger.success('Test success');

      expect(consoleLogSpy).toHaveBeenCalledTimes(1);
      expect(String(consoleLogSpy.mock.calls[0][0])).toContain('Test success');
    });
  });

  describe('debug mode', () => {
    it('should not log debug messages when debug mode is off', () => {
      logger.setDebugMode(false);
      logger.debug('Debug message');

      expect(consoleLogSpy).not.toHaveBeenCalled();
    });

    it('should log debug messages when debug mode is on', () => {
      logger.setDebugMode(true);
      logger.debug('Debug message');

      expect(consoleLogSpy).toHaveBeenCalledTimes(1);
      expect(consoleLogSpy.mock.calls[0][0]).toContain('Debug message');
    });

    it('should include data in debug output when provided', () => {
      logger.setDebugMode(true);
      logger.debug('With data', { key: 'value' });

      expect(consoleLogSpy).toHaveBeenCalled();
    });
  });

  describe('JSON mode', () => {
    it('should output JSON when JSON mode is enabled', () => {
      logger.setJsonMode(true);
      logger.info('JSON message');

      expect(consoleLogSpy).toHaveBeenCalledTimes(1);
      const output = String(consoleLogSpy.mock.calls[0][0]);
      const parsed = JSON.parse(output);

      expect(parsed.level).toBe('info');
      expect(parsed.message).toBe('JSON message');
      expect(parsed.timestamp).toBeDefined();
    });

    it('should include data in JSON output', () => {
      logger.setJsonMode(true);
      logger.info('Message with data', { key: 'value' });

      const output = String(consoleLogSpy.mock.calls[0][0]);
      const parsed = JSON.parse(output);

      expect(parsed.data).toEqual({ key: 'value' });
    });
  });

  describe('redaction', () => {
    it('should redact API keys in messages', () => {
      logger.info('Key: sk-ant-api03-abcdef123456');

      expect(consoleLogSpy).toHaveBeenCalledTimes(1);
      const output = String(consoleLogSpy.mock.calls[0][0]);
      expect(output).not.toContain('sk-ant-api03');
      expect(output).toContain('[REDACTED]');
    });

    it('should redact ANTHROPIC_API_KEY env format', () => {
      logger.info('ANTHROPIC_API_KEY=sk-ant-secret-key');

      const output = String(consoleLogSpy.mock.calls[0][0]);
      expect(output).not.toContain('sk-ant-secret-key');
      expect(output).toContain('[REDACTED]');
    });

    it('should redact in JSON mode as well', () => {
      logger.setJsonMode(true);
      logger.info('Key: sk-ant-api03-secret');

      const output = String(consoleLogSpy.mock.calls[0][0]);
      const parsed = JSON.parse(output);
      expect(parsed.message).toContain('[REDACTED]');
    });
  });

  describe('stage logging', () => {
    it('should log stage start', () => {
      logger.stageStart('01');

      expect(consoleLogSpy.mock.calls[0][0]).toContain('Starting stage 01');
    });

    it('should log stage complete with duration', () => {
      logger.stageComplete('01', 5000);

      expect(consoleLogSpy.mock.calls[0][0]).toContain('Stage 01 completed');
      expect(consoleLogSpy.mock.calls[0][0]).toContain('5.0s');
    });

    it('should log stage complete without duration', () => {
      logger.stageComplete('01');

      expect(consoleLogSpy.mock.calls[0][0]).toContain('Stage 01 completed');
    });

    it('should log stage failed', () => {
      logger.stageFailed('01', 'Something went wrong');

      expect(consoleLogSpy.mock.calls[0][0]).toContain('Stage 01 failed');
      expect(consoleLogSpy.mock.calls[0][0]).toContain('Something went wrong');
    });
  });

  describe('pipeline logging', () => {
    it('should log pipeline start', () => {
      logger.pipelineStart('build');

      expect(consoleLogSpy.mock.calls[0][0]).toContain('Starting pipeline');
      expect(consoleLogSpy.mock.calls[0][0]).toContain('build');
    });

    it('should log pipeline complete', () => {
      logger.pipelineComplete(10000);

      expect(consoleLogSpy.mock.calls[0][0]).toContain('Pipeline completed');
      expect(consoleLogSpy.mock.calls[0][0]).toContain('10.0s');
    });

    it('should log pipeline failed', () => {
      logger.pipelineFailed('Build error');

      expect(consoleLogSpy.mock.calls[0][0]).toContain('Pipeline failed');
      expect(consoleLogSpy.mock.calls[0][0]).toContain('Build error');
    });
  });

  describe('validation logging', () => {
    it('should log validation start in debug mode', () => {
      logger.setDebugMode(true);
      logger.validationStart('schema.json');

      expect(consoleLogSpy.mock.calls[0][0]).toContain('schema.json');
    });

    it('should log validation success', () => {
      logger.validationSuccess('schema.json');

      expect(consoleLogSpy.mock.calls[0][0]).toContain(
        'Schema validation passed'
      );
    });

    it('should log validation failed with errors', () => {
      logger.validationFailed('schema.json', ['Error 1', 'Error 2']);

      expect(consoleLogSpy).toHaveBeenCalledTimes(3);
      expect(consoleLogSpy.mock.calls[0][0]).toContain(
        'Schema validation failed'
      );
      expect(consoleLogSpy.mock.calls[1][0]).toContain('Error 1');
      expect(consoleLogSpy.mock.calls[2][0]).toContain('Error 2');
    });
  });

  describe('API logging', () => {
    it('should log API call in debug mode', () => {
      logger.setDebugMode(true);
      logger.apiCall('claude-3-opus');

      expect(consoleLogSpy.mock.calls[0][0]).toContain('API call');
      expect(consoleLogSpy.mock.calls[0][0]).toContain('claude-3-opus');
    });

    it('should log API success in debug mode', () => {
      logger.setDebugMode(true);
      logger.apiSuccess(500);

      expect(consoleLogSpy.mock.calls[0][0]).toContain('500 tokens');
    });

    it('should log API error', () => {
      logger.apiError('Rate limited');

      expect(consoleLogSpy.mock.calls[0][0]).toContain('API error');
      expect(consoleLogSpy.mock.calls[0][0]).toContain('Rate limited');
    });
  });

  describe('script logging', () => {
    it('should log script start in debug mode', () => {
      logger.setDebugMode(true);
      logger.scriptStart('test.sh');

      expect(consoleLogSpy.mock.calls[0][0]).toContain('test.sh');
    });

    it('should log script success', () => {
      logger.scriptSuccess('test.sh');

      expect(consoleLogSpy.mock.calls[0][0]).toContain('Script passed');
    });

    it('should log script failed with exit code', () => {
      logger.scriptFailed('test.sh', 1);

      expect(consoleLogSpy.mock.calls[0][0]).toContain('Script failed');
      expect(consoleLogSpy.mock.calls[0][0]).toContain('exit code 1');
    });
  });
});
