/**
 * Unit tests for CLI/src/core/stages.ts
 * Tests pipeline stage definitions and execution utilities
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'fs';
import path from 'path';
import os from 'os';
import {
  PIPELINE_STAGES,
  getStage,
  getRunStages,
  getBuildStages,
  getDreamStages,
  validateAgainstSchema,
} from './stages.js';

describe('stages module', () => {
  describe('PIPELINE_STAGES', () => {
    it('should have all expected stages defined', () => {
      expect(PIPELINE_STAGES.length).toBeGreaterThan(10);

      // Check for key stages
      const stageIds = PIPELINE_STAGES.map((s) => s.id);
      expect(stageIds).toContain('01');
      expect(stageIds).toContain('02');
      expect(stageIds).toContain('10');
    });

    it('should have unique stage IDs', () => {
      const ids = PIPELINE_STAGES.map((s) => s.id);
      const uniqueIds = [...new Set(ids)];
      expect(ids.length).toBe(uniqueIds.length);
    });

    it('should have valid order numbers', () => {
      for (const stage of PIPELINE_STAGES) {
        expect(stage.order).toBeGreaterThan(0);
        expect(typeof stage.order).toBe('number');
      }
    });

    it('should have valid template files', () => {
      for (const stage of PIPELINE_STAGES) {
        expect(stage.templateFile).toBeDefined();
        expect(stage.templateFile.endsWith('.md')).toBe(true);
      }
    });
  });

  describe('getStage', () => {
    it('should return stage by ID', () => {
      const stage = getStage('01');

      expect(stage).toBeDefined();
      expect(stage?.id).toBe('01');
      expect(stage?.name).toBe('Market Research');
    });

    it('should return undefined for non-existent stage', () => {
      const stage = getStage('99');

      expect(stage).toBeUndefined();
    });

    it('should handle fractional stage IDs', () => {
      const stage = getStage('02.5');

      expect(stage).toBeDefined();
      expect(stage?.id).toBe('02.5');
    });
  });

  describe('getRunStages', () => {
    it('should return only Stage 01', () => {
      const stages = getRunStages();

      expect(stages.length).toBe(1);
      expect(stages[0].id).toBe('01');
    });
  });

  describe('getBuildStages', () => {
    it('should exclude Stage 01 and 01_dream', () => {
      const stages = getBuildStages();
      const ids = stages.map((s) => s.id);

      expect(ids).not.toContain('01');
      expect(ids).not.toContain('01_dream');
    });

    it('should be sorted by order', () => {
      const stages = getBuildStages();

      for (let i = 1; i < stages.length; i++) {
        expect(stages[i].order).toBeGreaterThanOrEqual(stages[i - 1].order);
      }
    });

    it('should include Stage 10 (App Builder)', () => {
      const stages = getBuildStages();
      const ids = stages.map((s) => s.id);

      expect(ids).toContain('10');
    });
  });

  describe('getDreamStages', () => {
    it('should start with 01_dream', () => {
      const stages = getDreamStages();

      expect(stages[0].id).toBe('01_dream');
    });

    it('should include build stages after dream', () => {
      const stages = getDreamStages();
      const ids = stages.map((s) => s.id);

      expect(ids).toContain('02');
      expect(ids).toContain('10');
    });
  });

  describe('validateAgainstSchema', () => {
    let testDir: string;

    beforeEach(() => {
      testDir = fs.mkdtempSync(path.join(os.tmpdir(), 'schema-test-'));
    });

    afterEach(() => {
      if (fs.existsSync(testDir)) {
        fs.rmSync(testDir, { recursive: true, force: true });
      }
    });

    it('should validate valid data against schema', () => {
      const schemaPath = path.join(testDir, 'schema.json');
      const schema = {
        type: 'object',
        properties: {
          name: { type: 'string' },
          value: { type: 'number' },
        },
        required: ['name', 'value'],
      };
      fs.writeFileSync(schemaPath, JSON.stringify(schema), 'utf-8');

      const data = { name: 'test', value: 42 };
      const result = validateAgainstSchema(data, schemaPath);

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject invalid data', () => {
      const schemaPath = path.join(testDir, 'schema.json');
      const schema = {
        type: 'object',
        properties: {
          name: { type: 'string' },
          value: { type: 'number' },
        },
        required: ['name', 'value'],
      };
      fs.writeFileSync(schemaPath, JSON.stringify(schema), 'utf-8');

      const data = { name: 'test', value: 'not a number' };
      const result = validateAgainstSchema(data, schemaPath);

      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should handle missing required fields', () => {
      const schemaPath = path.join(testDir, 'schema.json');
      const schema = {
        type: 'object',
        properties: {
          name: { type: 'string' },
          value: { type: 'number' },
        },
        required: ['name', 'value'],
      };
      fs.writeFileSync(schemaPath, JSON.stringify(schema), 'utf-8');

      const data = { name: 'test' }; // missing 'value'
      const result = validateAgainstSchema(data, schemaPath);

      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.includes('value'))).toBe(true);
    });

    it('should handle invalid schema file', () => {
      const schemaPath = path.join(testDir, 'invalid.json');
      fs.writeFileSync(schemaPath, 'not json', 'utf-8');

      const result = validateAgainstSchema({}, schemaPath);

      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should handle non-existent schema file', () => {
      const schemaPath = path.join(testDir, 'nonexistent.json');

      const result = validateAgainstSchema({}, schemaPath);

      expect(result.valid).toBe(false);
    });

    it('should validate arrays', () => {
      const schemaPath = path.join(testDir, 'array-schema.json');
      const schema = {
        type: 'array',
        items: { type: 'number' },
      };
      fs.writeFileSync(schemaPath, JSON.stringify(schema), 'utf-8');

      const validData = [1, 2, 3];
      const invalidData = [1, 'two', 3];

      expect(validateAgainstSchema(validData, schemaPath).valid).toBe(true);
      expect(validateAgainstSchema(invalidData, schemaPath).valid).toBe(false);
    });

    it('should handle nested objects', () => {
      const schemaPath = path.join(testDir, 'nested-schema.json');
      const schema = {
        type: 'object',
        properties: {
          outer: {
            type: 'object',
            properties: {
              inner: { type: 'string' },
            },
            required: ['inner'],
          },
        },
        required: ['outer'],
      };
      fs.writeFileSync(schemaPath, JSON.stringify(schema), 'utf-8');

      const validData = { outer: { inner: 'value' } };
      const invalidData = { outer: {} }; // missing inner

      expect(validateAgainstSchema(validData, schemaPath).valid).toBe(true);
      expect(validateAgainstSchema(invalidData, schemaPath).valid).toBe(false);
    });
  });

  describe('stage definitions integrity', () => {
    it('all stages should have name property', () => {
      for (const stage of PIPELINE_STAGES) {
        expect(stage.name).toBeDefined();
        expect(typeof stage.name).toBe('string');
        expect(stage.name.length).toBeGreaterThan(0);
      }
    });

    it('all stages should have requiresWebResearch boolean', () => {
      for (const stage of PIPELINE_STAGES) {
        expect(typeof stage.requiresWebResearch).toBe('boolean');
      }
    });

    it('schemaFile should be string or undefined', () => {
      for (const stage of PIPELINE_STAGES) {
        if (stage.schemaFile !== undefined) {
          expect(typeof stage.schemaFile).toBe('string');
          expect(stage.schemaFile.endsWith('.json')).toBe(true);
        }
      }
    });
  });
});
