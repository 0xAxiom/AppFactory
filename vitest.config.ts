import { defineConfig } from 'vitest/config';

/**
 * Root Vitest Configuration
 *
 * Workspace configuration for running tests across all AppFactory pipelines.
 * Uses v8 coverage provider with meaningful thresholds.
 */
export default defineConfig({
  test: {
    // Enable globals (describe, it, expect, etc.)
    globals: true,

    // Use Node.js environment for testing
    environment: 'node',

    // Root-level tests location
    include: ['tests/**/*.test.ts'],

    // Exclude build artifacts, node_modules, and pipeline-specific builds
    exclude: [
      'node_modules',
      'dist',
      '**/node_modules/**',
      '**/dist/**',
      '**/builds/**',
      '**/dapp-builds/**',
      '**/outputs/**',
      'CLI/node_modules/**',
      'core/node_modules/**',
      'dapp-factory/node_modules/**',
    ],

    // Coverage configuration
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],

      // Include only test utilities for coverage (root tests are self-contained)
      // Core source coverage is measured by CLI and pipeline-specific tests
      include: ['tests/utils/**/*.ts'],

      // Exclude test files themselves from coverage
      exclude: [
        '**/*.test.ts',
        '**/*.spec.ts',
        '**/node_modules/**',
        '**/dist/**',
      ],

      // Coverage thresholds for test utilities
      // Root tests validate patterns, not source code - thresholds apply to utils only
      thresholds: {
        statements: 50,
        branches: 50,
        functions: 40,
        lines: 50,
      },

      // Generate reports in coverage/ directory
      reportsDirectory: 'coverage',
    },

    // Test timeouts
    testTimeout: 15000,
    hookTimeout: 10000,

    // Reporter configuration
    reporters: ['verbose'],

    // Fail on no tests found
    passWithNoTests: false,

    // Watch mode settings
    watch: false,
  },
});
