/**
 * Configuration Loader
 *
 * Utilities for loading and validating pipeline configurations.
 *
 * @module @appfactory/core/config
 */
import * as path from 'node:path';
import { pathToFileURL } from 'node:url';
import { exists, readJsonSafe } from '../utils/fs.js';
import { PipelineConfigSchema, RalphConfigSchema, ValidationConfigSchema, PipelineConfigFileSchema, } from './schema.js';
/**
 * Load and validate a pipeline configuration from a JSON file
 *
 * @param configPath - Path to the configuration file
 * @returns Configuration load result
 */
export function loadPipelineConfig(configPath) {
    if (!exists(configPath)) {
        return {
            success: false,
            errors: [`Configuration file not found: ${configPath}`],
        };
    }
    const rawConfig = readJsonSafe(configPath);
    if (!rawConfig) {
        return {
            success: false,
            errors: [`Failed to parse configuration file: ${configPath}`],
        };
    }
    const result = PipelineConfigSchema.safeParse(rawConfig);
    if (!result.success) {
        return {
            success: false,
            errors: result.error.errors.map((e) => `${e.path.join('.')}: ${e.message}`),
        };
    }
    return {
        success: true,
        config: result.data,
    };
}
/**
 * Load and validate a Ralph configuration from a JSON file
 *
 * @param configPath - Path to the configuration file
 * @returns Configuration load result
 */
export function loadRalphConfig(configPath) {
    if (!exists(configPath)) {
        return {
            success: false,
            errors: [`Configuration file not found: ${configPath}`],
        };
    }
    const rawConfig = readJsonSafe(configPath);
    if (!rawConfig) {
        return {
            success: false,
            errors: [`Failed to parse configuration file: ${configPath}`],
        };
    }
    const result = RalphConfigSchema.safeParse(rawConfig);
    if (!result.success) {
        return {
            success: false,
            errors: result.error.errors.map((e) => `${e.path.join('.')}: ${e.message}`),
        };
    }
    return {
        success: true,
        config: result.data,
    };
}
/**
 * Load and validate a validation configuration from a JSON file
 *
 * @param configPath - Path to the configuration file
 * @returns Configuration load result
 */
export function loadValidationConfig(configPath) {
    if (!exists(configPath)) {
        return {
            success: false,
            errors: [`Configuration file not found: ${configPath}`],
        };
    }
    const rawConfig = readJsonSafe(configPath);
    if (!rawConfig) {
        return {
            success: false,
            errors: [`Failed to parse configuration file: ${configPath}`],
        };
    }
    const result = ValidationConfigSchema.safeParse(rawConfig);
    if (!result.success) {
        return {
            success: false,
            errors: result.error.errors.map((e) => `${e.path.join('.')}: ${e.message}`),
        };
    }
    return {
        success: true,
        config: result.data,
    };
}
/**
 * Load a complete pipeline configuration file (pipeline.config.json)
 *
 * @param configPath - Path to the configuration file
 * @returns Configuration load result
 */
export function loadPipelineConfigFile(configPath) {
    if (!exists(configPath)) {
        return {
            success: false,
            errors: [`Configuration file not found: ${configPath}`],
        };
    }
    const rawConfig = readJsonSafe(configPath);
    if (!rawConfig) {
        return {
            success: false,
            errors: [`Failed to parse configuration file: ${configPath}`],
        };
    }
    const result = PipelineConfigFileSchema.safeParse(rawConfig);
    if (!result.success) {
        return {
            success: false,
            errors: result.error.errors.map((e) => `${e.path.join('.')}: ${e.message}`),
        };
    }
    return {
        success: true,
        config: result.data,
    };
}
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
export async function discoverPipelineConfig(pipelineDir) {
    // Try JSON first
    const jsonConfigPath = path.join(pipelineDir, 'pipeline.config.json');
    if (exists(jsonConfigPath)) {
        return loadPipelineConfigFile(jsonConfigPath);
    }
    // Try TypeScript config
    const tsConfigPath = path.join(pipelineDir, 'pipeline.config.ts');
    if (exists(tsConfigPath)) {
        try {
            // Dynamic import for TypeScript config
            const configUrl = pathToFileURL(tsConfigPath).href;
            const module = await import(configUrl);
            const config = module.default || module;
            const result = PipelineConfigFileSchema.safeParse(config);
            if (!result.success) {
                return {
                    success: false,
                    errors: result.error.errors.map((e) => `${e.path.join('.')}: ${e.message}`),
                };
            }
            return {
                success: true,
                config: result.data,
            };
        }
        catch (error) {
            return {
                success: false,
                errors: [
                    `Failed to load TypeScript config: ${error instanceof Error ? error.message : String(error)}`,
                ],
            };
        }
    }
    return {
        success: false,
        errors: [
            `No configuration file found in ${pipelineDir}. Expected pipeline.config.json or pipeline.config.ts`,
        ],
    };
}
/**
 * Get default Ralph configuration
 */
export function getDefaultRalphConfig() {
    return {
        passingThreshold: 97,
        maxIterations: 20,
        checks: [],
        runE2ETests: false,
    };
}
/**
 * Get default validation configuration
 */
export function getDefaultValidationConfig() {
    return {
        requiredFiles: ['package.json', 'tsconfig.json', 'README.md'],
        forbiddenFiles: ['node_modules', '.git', '.next', 'dist', '.env'],
        forbiddenPatterns: [
            {
                pattern: /privateKey/i,
                description: 'private key reference',
                severity: 'critical',
            },
            {
                pattern: /secretKey/i,
                description: 'secret key reference',
                severity: 'critical',
            },
        ],
        sizeLimits: {
            totalSize: 50 * 1024 * 1024, // 50 MB
            singleFile: 10 * 1024 * 1024, // 10 MB
            maxFiles: 10000,
        },
        requiredDependencies: [],
        forbiddenDependencies: [],
        requiredScripts: ['dev', 'build'],
        allowedDotfiles: ['.env.example', '.nvmrc', '.npmrc'],
    };
}
//# sourceMappingURL=loader.js.map