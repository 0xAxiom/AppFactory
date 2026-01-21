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
export * from './types/index.js';
export * from './ralph/index.js';
export * from './utils/index.js';
export * from './config/index.js';
//# sourceMappingURL=index.d.ts.map
