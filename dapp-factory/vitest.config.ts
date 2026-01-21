import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['**/*.test.ts'],
    exclude: ['node_modules', 'dist', 'dapp-builds', 'generated', 'runs'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['generator/**/*.ts', 'validator/**/*.ts'],
      exclude: ['**/*.test.ts'],
      // Note: dapp-factory tests verify logic patterns since the source files
      // are CLI scripts. Coverage is measured by test thoroughness, not imports.
      thresholds: {
        lines: 0,
        functions: 0,
        branches: 0,
        statements: 0,
      },
    },
    testTimeout: 10000,
    hookTimeout: 10000,
  },
});
