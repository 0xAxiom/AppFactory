/**
 * @appfactory/core
 *
 * Shared core library for AppFactory pipelines.
 *
 * This package provides:
 * - Common type definitions for pipelines, phases, and results
 * - Ralph QA engine for quality assurance
 * - Utility functions for logging, file operations, and hashing
 * - Configuration loading and validation
 * - Constants for phases, thresholds, and quality standards
 *
 * @example
 * ```typescript
 * import { createRalphEngine, logger, PipelineConfig } from '@appfactory/core';
 *
 * // Use the Ralph QA engine
 * const ralph = createRalphEngine({
 *   config: ralphConfig,
 *   buildPath: './builds/my-app',
 *   pipeline: 'app-factory',
 * });
 *
 * const report = await ralph.run();
 * ```
 *
 * @packageDocumentation
 * @module @appfactory/core
 */
// Types
export * from './types/index.js';
// Ralph QA
export * from './ralph/index.js';
// Utilities
export * from './utils/index.js';
// Configuration
export * from './config/index.js';
// Constants
export * from './constants/index.js';
//# sourceMappingURL=index.js.map