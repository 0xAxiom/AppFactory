# ADR-0002: Ralph QA Engine

## Status

Accepted

## Context

Ralph is the adversarial QA agent used across all AppFactory pipelines. Each pipeline had its own implementation of Ralph with:

- Different check definitions
- Different scoring algorithms
- Different report formats
- Inconsistent iteration behavior

The Ralph concept is consistent:

1. Run checks against a build
2. Calculate a score
3. Iterate until passing threshold or max iterations
4. Generate a verdict and report

But implementations varied, making it difficult to:

- Ensure consistent quality across pipelines
- Add new checks
- Modify the scoring algorithm
- Compare results across pipelines

## Decision

Create a reusable Ralph QA Engine in `@appfactory/core/ralph` with:

1. **RalphEngine Class**
   - Configurable passing threshold (default: 97%)
   - Configurable max iterations (default: 20)
   - Pluggable check definitions
   - Optional skill audit integration
   - Optional E2E test integration

2. **Built-in Checks**
   - Build checks (npm install, build, typecheck)
   - File existence checks
   - Research quality checks
   - Security checks (no hardcoded secrets)
   - UX checks (loading states, error boundaries)

3. **Check Collections**
   - `WEB_BUILD_CHECKS` - Standard web build checks
   - `RESEARCH_CHECKS` - Research artifact checks
   - `SECURITY_CHECKS` - Security-related checks
   - `UX_CHECKS` - User experience checks
   - `STANDARD_CHECKS` - All of the above

4. **Report Generation**
   - `PROGRESS.md` - Detailed iteration log
   - `LOOP.md` - Condensed summary
   - `QA_NOTES.md` - Categorized issues

## Consequences

### Positive

- **Consistency**: Same scoring algorithm across all pipelines
- **Extensibility**: Easy to add custom checks
- **Transparency**: Clear report format for all pipelines
- **Testability**: Engine can be unit tested
- **Hooks**: Callbacks for iteration events

### Negative

- **Flexibility**: Some pipeline-specific behavior may be harder
- **Complexity**: More abstractions to understand

### Neutral

- **Check Verification**: Checks must be async functions
- **Report Format**: Standardized markdown format

## Implementation Notes

```typescript
import { createRalphEngine, STANDARD_CHECKS } from '@appfactory/core';

const ralph = createRalphEngine({
  config: {
    passingThreshold: 97,
    maxIterations: 20,
    checks: STANDARD_CHECKS,
    runE2ETests: true,
    e2eConfig: {
      framework: 'playwright',
      testDir: './tests/e2e',
      baseUrl: 'http://localhost:3000',
      timeout: 30000,
      browser: 'chromium',
    },
  },
  buildPath: './builds/my-app',
  pipeline: 'app-factory',
  onIterationComplete: async (result) => {
    console.log(`Iteration ${result.iteration}: ${result.score}%`);
  },
});

const report = await ralph.run();
```

## Related ADRs

- ADR-0001: Shared Core Library
