# ADR-0004: Standardized Logging

## Status

Accepted

## Context

Each pipeline had its own approach to logging:

- Some used `console.log` directly
- Some had custom logger implementations
- Some used third-party libraries
- None had consistent secret redaction

Problems:

1. **Inconsistent Format**: Hard to parse logs across pipelines
2. **No Secret Redaction**: Risk of leaking API keys
3. **No JSON Mode**: Difficult to process logs in CI
4. **No Context**: Hard to trace logs to pipelines/phases

## Decision

Create a standardized `Logger` class in `@appfactory/core/utils/logger.ts`:

1. **Log Levels**: debug, info, warn, error, success

2. **Output Modes**:
   - Human-readable (default): Colored output with icons
   - JSON mode: Structured JSON for CI/parsing

3. **Secret Redaction**: Automatic redaction of common secrets:
   - Anthropic API keys (sk-ant-\*)
   - OpenAI API keys (sk-\*)
   - GitHub tokens (ghp*\*, ghs*\*)
   - npm tokens (npm\_\*)
   - Bearer tokens
   - Generic password/secret fields

4. **Semantic Methods**: Purpose-specific logging:
   - `pipelineStart()`, `pipelineComplete()`, `pipelineFailed()`
   - `phaseStart()`, `phaseComplete()`, `phaseFailed()`
   - `ralphIteration()`
   - `fileWrite()`, `fileRead()`
   - `scriptStart()`, `scriptSuccess()`, `scriptFailed()`

## Consequences

### Positive

- **Security**: API keys never appear in logs
- **Consistency**: Same format across all pipelines
- **Parseability**: JSON mode for log analysis
- **Context**: Clear pipeline/phase identification
- **Extensibility**: Custom redaction patterns

### Negative

- **Overhead**: Slight performance cost for redaction
- **Learning**: Developers need to use logger methods

### Neutral

- **No External Dependencies**: Uses chalk only for colors
- **Singleton Available**: Default `logger` export

## Implementation Notes

Basic usage:

```typescript
import { logger } from '@appfactory/core';

// Standard logging
logger.info('Starting build');
logger.warn('Deprecation notice');
logger.error('Build failed');
logger.success('Build complete');

// Semantic logging
logger.pipelineStart('app-factory', 'run-123');
logger.phaseStart('phase-0', 'Intent Normalization');
logger.ralphIteration(1, 95, 'FAIL');
```

Custom logger:

```typescript
import { createLogger } from '@appfactory/core';

const logger = createLogger({
  jsonMode: process.env.CI === 'true',
  debugMode: process.env.DEBUG === 'true',
  context: 'app-factory',
  redactPatterns: [/MY_CUSTOM_KEY=[^\s]+/g],
});
```

Output examples:

```
# Human mode
[INFO] [app-factory] Starting build
[OK] Phase phase-0 completed (1.2s)

# JSON mode
{"level":"info","message":"Starting build","timestamp":"2024-01-20T12:00:00.000Z","context":"app-factory"}
```

## Related ADRs

- ADR-0001: Shared Core Library
