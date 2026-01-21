# AppFactory Testing Guide

## Overview

This document describes the testing infrastructure for AppFactory pipelines. Testing ensures code quality, prevents regressions, and provides confidence in pipeline functionality.

## Test Framework

AppFactory uses **Vitest** as the test framework due to its:

- Native ES modules support
- Fast execution with Vite-based architecture
- Jest-compatible API for easy migration
- Built-in TypeScript support
- Native coverage reporting

## Directory Structure

```
AppFactory/
├── CLI/
│   ├── vitest.config.ts          # CLI test configuration
│   ├── src/
│   │   └── core/
│   │       ├── io.test.ts        # File I/O tests
│   │       ├── anthropic.test.ts # API client tests
│   │       ├── logging.test.ts   # Logger tests
│   │       ├── stages.test.ts    # Pipeline stage tests
│   │       └── paths.test.ts     # Path resolution tests
│   └── tests/
│       └── smoke.ts              # CLI smoke tests
│
├── dapp-factory/
│   ├── vitest.config.ts          # dapp-factory test configuration
│   ├── generator/
│   │   └── generator.test.ts     # Prompt generation tests
│   └── validator/
│       └── validator.test.ts     # Build validation tests
│
└── docs/
    └── TESTING.md                # This file
```

## Running Tests

### CLI Tests

```bash
cd CLI

# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run legacy smoke tests
npm run test:smoke
```

### dapp-factory Tests

```bash
cd dapp-factory

# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## Test Categories

### Unit Tests

Unit tests verify individual functions and modules in isolation:

- **io.test.ts**: File reading, writing, directory operations
- **anthropic.test.ts**: API client, JSON extraction, stub mode
- **logging.test.ts**: Log levels, redaction, JSON output
- **stages.test.ts**: Pipeline stages, schema validation
- **paths.test.ts**: Path resolution patterns

### Integration Tests

Integration tests verify component interactions:

- **validator.test.ts**: Full build validation scenarios
- **generator.test.ts**: Template context generation flow

### Smoke Tests

Smoke tests verify CLI commands work end-to-end:

- **smoke.ts**: CLI flags, command execution, module imports

## Writing Tests

### Test File Naming

- Place test files next to source files: `module.ts` -> `module.test.ts`
- Use descriptive test names that explain what is being tested

### Test Structure

```typescript
import { describe, it, expect, beforeEach, afterEach } from 'vitest';

describe('module name', () => {
  // Setup/teardown for each test
  beforeEach(() => {
    // Setup code
  });

  afterEach(() => {
    // Cleanup code
  });

  describe('function or feature', () => {
    it('should do something specific', () => {
      // Arrange
      const input = 'test';

      // Act
      const result = functionUnderTest(input);

      // Assert
      expect(result).toBe('expected');
    });
  });
});
```

### Isolation Best Practices

1. **Use temp directories for file operations**:

   ```typescript
   let testDir: string;

   beforeEach(() => {
     testDir = fs.mkdtempSync(path.join(os.tmpdir(), 'test-'));
   });

   afterEach(() => {
     fs.rmSync(testDir, { recursive: true, force: true });
   });
   ```

2. **Use stub mode for API tests**:

   ```typescript
   beforeEach(() => {
     setStubMode(true);
   });

   afterEach(() => {
     setStubMode(false);
     clearStubResponses();
   });
   ```

3. **Mock environment variables**:

   ```typescript
   const originalEnv = process.env;

   beforeEach(() => {
     process.env = { ...originalEnv };
   });

   afterEach(() => {
     process.env = originalEnv;
   });
   ```

## Coverage

### CLI Core Module Coverage

| Module       | Statements | Branches | Functions | Lines  |
| ------------ | ---------- | -------- | --------- | ------ |
| io.ts        | 97.64%     | 96.55%   | 100%      | 97.64% |
| logging.ts   | 100%       | 97.82%   | 100%      | 100%   |
| anthropic.ts | 46.83%     | 95.23%   | 70%       | 46.83% |
| stages.ts    | 27.31%     | 100%     | 55.55%    | 27.31% |
| paths.ts     | 15.09%     | 100%     | 0%        | 15.09% |

### dapp-factory Tests

The dapp-factory tests verify the validation and generation logic through
pattern-based testing. Since the source files are CLI scripts, tests recreate
the logic to ensure correctness.

### Coverage Notes

- **Core utilities** (io, logging) have excellent coverage (97-100%)
- **API client** (anthropic) has good coverage for testable functions
- **Pipeline stages** test schema validation and stage definitions
- **Path utilities** test patterns rather than actual file paths
- **Commands and UI** are not unit tested (tested via smoke tests)

## CI Integration

Tests run automatically in CI on:

- Pull request creation
- Push to main branch
- Manual workflow trigger

### CI Workflow

```yaml
# Example CI configuration
test:
  runs-on: ubuntu-latest
  steps:
    - uses: actions/checkout@v4
    - uses: actions/setup-node@v4
    - run: cd CLI && npm ci && npm test
    - run: cd dapp-factory && npm ci && npm test
```

## Test Maintenance

### Adding New Tests

1. Create test file next to source: `newmodule.test.ts`
2. Import test utilities from vitest
3. Write tests covering:
   - Happy path scenarios
   - Edge cases
   - Error handling
   - Boundary conditions

### Updating Tests

When modifying existing code:

1. Run existing tests to verify baseline
2. Update tests to reflect new behavior
3. Add tests for new functionality
4. Verify all tests pass before committing

### Debugging Tests

```bash
# Run single test file
npx vitest run path/to/test.ts

# Run tests matching pattern
npx vitest run -t "pattern"

# Run with verbose output
npx vitest run --reporter=verbose

# Debug in browser
npx vitest --ui
```

## Test Philosophy

1. **Test behavior, not implementation**: Focus on what the code does, not how
2. **Fast tests**: Tests should run in milliseconds, not seconds
3. **Deterministic**: Tests should produce the same result every run
4. **Independent**: Tests should not depend on each other
5. **Readable**: Tests serve as documentation for expected behavior

## Current Test Status

| Package      | Tests | Status  |
| ------------ | ----- | ------- |
| CLI          | 116   | Passing |
| dapp-factory | 53    | Passing |

**Total: 169 tests passing**
