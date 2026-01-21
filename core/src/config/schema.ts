/**
 * Pipeline Configuration Schema
 *
 * JSON Schema and Zod schemas for pipeline configuration validation.
 *
 * @module @appfactory/core/config
 */

import { z } from 'zod';

/**
 * Severity level schema
 */
export const SeveritySchema = z.enum(['critical', 'high', 'medium', 'low']);

/**
 * Phase definition schema
 */
export const PhaseDefinitionSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  description: z.string(),
  mandatory: z.boolean(),
  requiresUserAction: z.boolean().optional(),
  outputs: z.array(z.string()),
  dependencies: z.array(z.string()).optional(),
});

/**
 * Technology stack configuration schema
 */
export const TechStackConfigSchema = z.object({
  framework: z.string(),
  frameworkVersion: z.string(),
  language: z.enum(['TypeScript', 'JavaScript']),
  requiredDependencies: z.array(z.string()),
  forbiddenDependencies: z.array(z.string()).optional(),
});

/**
 * Quality gate configuration schema
 */
export const QualityGateConfigSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  threshold: z.number().min(0).max(100),
  blocking: z.boolean(),
  maxRetries: z.number().min(1).optional(),
});

/**
 * Pipeline configuration schema
 */
export const PipelineConfigSchema = z.object({
  id: z.enum([
    'app-factory',
    'dapp-factory',
    'agent-factory',
    'plugin-factory',
    'miniapp-pipeline',
    'website-pipeline',
  ]),
  name: z.string().min(1),
  version: z.string().regex(/^\d+\.\d+\.\d+$/),
  outputDir: z.string().min(1),
  runsDir: z.string().min(1),
  phases: z.array(PhaseDefinitionSchema).min(1),
  techStack: TechStackConfigSchema.optional(),
  qualityGates: z.array(QualityGateConfigSchema).optional(),
});

/**
 * Ralph configuration schema
 */
export const RalphConfigSchema = z.object({
  passingThreshold: z.number().min(0).max(100).default(97),
  maxIterations: z.number().min(1).max(100).default(20),
  checks: z.array(
    z.object({
      id: z.string().min(1),
      name: z.string().min(1),
      category: z.enum([
        'build',
        'runtime',
        'ui',
        'ux',
        'accessibility',
        'performance',
        'security',
        'documentation',
        'research',
        'code-quality',
        'seo',
      ]),
      description: z.string(),
      mandatory: z.boolean(),
      points: z.number().min(0),
    })
  ),
  skills: z
    .array(
      z.object({
        name: z.string().min(1),
        threshold: z.number().min(0).max(100),
        blocking: z.boolean(),
      })
    )
    .optional(),
  runE2ETests: z.boolean().default(false),
  e2eConfig: z
    .object({
      framework: z.enum(['playwright', 'cypress']),
      testDir: z.string(),
      baseUrl: z.string().url(),
      timeout: z.number().min(1000),
      browser: z.enum(['chromium', 'firefox', 'webkit']),
    })
    .optional(),
});

/**
 * Validation configuration schema
 */
export const ValidationConfigSchema = z.object({
  requiredFiles: z.array(z.string()),
  forbiddenFiles: z.array(z.string()),
  forbiddenPatterns: z.array(
    z.object({
      pattern: z.string(),
      description: z.string(),
      severity: SeveritySchema,
    })
  ),
  sizeLimits: z.object({
    totalSize: z.number().min(0),
    singleFile: z.number().min(0),
    maxFiles: z.number().min(1),
  }),
  requiredDependencies: z.array(z.string()),
  forbiddenDependencies: z.array(z.string()),
  requiredScripts: z.array(z.string()),
  allowedDotfiles: z.array(z.string()),
});

/**
 * Complete pipeline.config.ts schema
 */
export const PipelineConfigFileSchema = z.object({
  pipeline: PipelineConfigSchema,
  ralph: RalphConfigSchema.optional(),
  validation: ValidationConfigSchema.optional(),
});

/**
 * Type inference from schemas
 */
export type PipelineConfigFromSchema = z.infer<typeof PipelineConfigSchema>;
export type RalphConfigFromSchema = z.infer<typeof RalphConfigSchema>;
export type ValidationConfigFromSchema = z.infer<typeof ValidationConfigSchema>;
export type PipelineConfigFileFromSchema = z.infer<
  typeof PipelineConfigFileSchema
>;
