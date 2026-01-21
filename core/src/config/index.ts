/**
 * Configuration Module - Barrel Export
 *
 * Re-exports all configuration utilities from the @appfactory/core package.
 *
 * @module @appfactory/core/config
 */

// Schema definitions
export {
  SeveritySchema,
  PhaseDefinitionSchema,
  TechStackConfigSchema,
  QualityGateConfigSchema,
  PipelineConfigSchema,
  RalphConfigSchema,
  ValidationConfigSchema,
  PipelineConfigFileSchema,
} from './schema.js';

export type {
  PipelineConfigFromSchema,
  RalphConfigFromSchema,
  ValidationConfigFromSchema,
  PipelineConfigFileFromSchema,
} from './schema.js';

// Loader utilities
export {
  loadPipelineConfig,
  loadRalphConfig,
  loadValidationConfig,
  loadPipelineConfigFile,
  discoverPipelineConfig,
  getDefaultRalphConfig,
  getDefaultValidationConfig,
} from './loader.js';

export type { ConfigLoadResult, PipelineConfigFile } from './loader.js';
