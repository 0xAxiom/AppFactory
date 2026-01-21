import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import globals from 'globals';
import eslintConfigPrettier from 'eslint-config-prettier';

export default tseslint.config(
  // Ignore patterns - comprehensive list to avoid parsing files not in tsconfig
  {
    ignores: [
      'eslint.config.js',
      '**/node_modules/**',
      '**/dist/**',
      '**/builds/**',
      '**/outputs/**',
      '**/dapp-builds/**',
      '**/web3-builds/**',
      '**/runs/**',
      '**/vendor/**',
      '**/references/**',
      '**/.playwright-mcp/**',
      '**/.factory-tools/**',
      '**/website-pipeline/**',
      '**/deprecated/**',
      '**/coverage/**',
      '**/.next/**',
      '**/.expo/**',
      '**/templates/**',
      '**/*.test.ts',
      '**/*.spec.ts',
      '**/app-factory/**',
      '**/agent-factory/**',
      '**/miniapp-pipeline/**',
      '**/plugin-factory/**',
      '**/ralph/**',
      '**/plugins/**',
      '**/core/**',
      '**/vitest.config.ts',
      '**/dapp-factory/**',
      '**/examples/**',
      '**/scripts/security/**',
      '**/verification/**',
      '**/CLI/tests/**',
    ],
  },

  // Base JavaScript configuration
  js.configs.recommended,

  // TypeScript recommended (non-type-checked)
  ...tseslint.configs.recommended,

  // Prettier compatibility
  eslintConfigPrettier,

  // Global settings for all files
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.es2022,
      },
    },
  },

  // TypeScript-specific rules for CLI source files (with type checking)
  {
    files: ['CLI/src/**/*.ts'],
    languageOptions: {
      parserOptions: {
        project: './CLI/tsconfig.json',
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      // Complexity limits for maintainability
      complexity: ['warn', { max: 15 }],
      'max-depth': ['warn', { max: 4 }],
      'max-lines-per-function': [
        'warn',
        {
          max: 100,
          skipBlankLines: true,
          skipComments: true,
        },
      ],
      'max-nested-callbacks': ['warn', { max: 3 }],
      'max-params': ['warn', { max: 5 }],

      // Code quality
      'no-console': 'off', // CLIs need console
      'no-unused-vars': 'off', // Use TypeScript's version
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/prefer-nullish-coalescing': 'warn',
      '@typescript-eslint/prefer-optional-chain': 'warn',
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/await-thenable': 'error',
      '@typescript-eslint/no-misused-promises': 'error',

      // Maintainability
      'prefer-const': 'error',
      'no-var': 'error',
      eqeqeq: ['error', 'always'],
      curly: ['error', 'all'],
      'no-throw-literal': 'error',

      // Disable some strict rules that are too noisy for this codebase
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-argument': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',
      '@typescript-eslint/restrict-template-expressions': 'off',
      '@typescript-eslint/restrict-plus-operands': 'off',
      '@typescript-eslint/no-require-imports': 'warn',
      '@typescript-eslint/no-non-null-assertion': 'warn',
      '@typescript-eslint/no-unnecessary-condition': 'warn',
      '@typescript-eslint/use-unknown-in-catch-callback-variable': 'off',
      '@typescript-eslint/require-await': 'warn',
    },
  },

  // JavaScript files (scripts, configs) - disable type-checked rules
  {
    files: ['**/*.js', '**/*.mjs', '**/*.cjs'],
    ...tseslint.configs.disableTypeChecked,
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
      'no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
    },
  }
);
