import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['src/**/*.test.ts', 'tests/**/*.test.ts'],
    exclude: ['node_modules', 'dist'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/**/*.ts'],
      exclude: ['src/**/*.test.ts', 'src/index.ts'],
      // Note: These are aspirational thresholds. Current tests cover core utilities.
      // Command modules and UI modules need additional testing.
      thresholds: {
        lines: 10,
        functions: 50,
        branches: 70,
        statements: 10,
      },
    },
    testTimeout: 10000,
    hookTimeout: 10000,
  },
});
