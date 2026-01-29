/**
 * Configuration Loader
 *
 * Utilities for loading and validating pipeline configurations.
 *
 * @module @appfactory/core/config
 */
import type { PipelineConfig, RalphConfig, ValidationConfig } from '../types/index.js';
/**
 * Configuration loading result
 */
export interface ConfigLoadResult<T> {
    success: boolean;
    config?: T;
    errors?: string[];
}
/**
 * Load and validate a pipeline configuration from a JSON file
 *
 * @param configPath - Path to the configuration file
 * @returns Configuration load result
 */
export declare function loadPipelineConfig(configPath: string): ConfigLoadResult<PipelineConfig>;
/**
 * Load and validate a Ralph configuration from a JSON file
 *
 * @param configPath - Path to the configuration file
 * @returns Configuration load result
 */
export declare function loadRalphConfig(configPath: string): ConfigLoadResult<RalphConfig>;
/**
 * Load and validate a validation configuration from a JSON file
 *
 * @param configPath - Path to the configuration file
 * @returns Configuration load result
 */
export declare function loadValidationConfig(configPath: string): ConfigLoadResult<ValidationConfig>;
/**
 * Full pipeline configuration file structure
 */
export interface PipelineConfigFile {
    pipeline: PipelineConfig;
    ralph?: RalphConfig;
    validation?: ValidationConfig;
}
/**
 * Load a complete pipeline configuration file (pipeline.config.json)
 *
 * @param configPath - Path to the configuration file
 * @returns Configuration load result
 */
export declare function loadPipelineConfigFile(configPath: string): ConfigLoadResult<PipelineConfigFile>;
/**
 * Discover the pipeline configuration in a directory
 *
 * Looks for:
 * 1. pipeline.config.json
 * 2. pipeline.config.ts (requires dynamic import)
 *
 * @param pipelineDir - Pipeline directory
 * @returns Configuration load result
 */
export declare function discoverPipelineConfig(pipelineDir: string): Promise<ConfigLoadResult<PipelineConfigFile>>;
/**
 * Get default Ralph configuration
 */
export declare function getDefaultRalphConfig(): RalphConfig;
/**
 * Get default validation configuration
 */
export declare function getDefaultValidationConfig(): ValidationConfig;
//# sourceMappingURL=loader.d.ts.map