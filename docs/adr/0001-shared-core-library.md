# ADR-0001: Shared Core Library

## Status

Accepted

## Context

AppFactory consists of 6 pipelines (app-factory, dapp-factory, agent-factory, plugin-factory, miniapp-pipeline, website-pipeline) that share common patterns:

1. **Logging**: Each pipeline had its own logging implementation
2. **Validation**: Similar validation code duplicated across validators
3. **Ralph QA**: The adversarial QA engine was conceptually the same but implemented differently
4. **Types**: No shared type definitions for pipeline context, phases, or results
5. **Configuration**: No standardized configuration schema

This duplication led to:

- Inconsistent behavior across pipelines
- Higher maintenance burden
- Difficulty adding new pipelines
- No clear contract for pipeline implementations

## Decision

Create a shared `/core/` library (`@appfactory/core`) that provides:

1. **Common Types** (`/core/src/types/`)
   - `PipelineConfig` - Standardized pipeline configuration
   - `PipelineContext` - Execution context passed between phases
   - `PhaseResult` - Result of phase execution
   - `RalphConfig` - Ralph QA configuration
   - `ValidationConfig` - Build validation configuration

2. **Ralph QA Engine** (`/core/src/ralph/`)
   - Reusable engine with configurable checks
   - Built-in check library
   - Report generation utilities

3. **Utilities** (`/core/src/utils/`)
   - Structured logger with secret redaction
   - File system helpers
   - Hashing utilities for run IDs

4. **Configuration** (`/core/src/config/`)
   - Zod schemas for validation
   - Configuration loaders

## Consequences

### Positive

- **Consistency**: All pipelines use the same types and patterns
- **Maintainability**: Single place to fix bugs and add features
- **Extensibility**: New pipelines can import from core
- **Type Safety**: Shared TypeScript interfaces ensure compatibility
- **Documentation**: JSDoc comments provide inline documentation

### Negative

- **Learning Curve**: Developers need to understand core library
- **Migration**: Existing pipelines need to be updated to use core
- **Dependency**: Pipelines now depend on core package

### Neutral

- **Build Process**: Core must be built before pipelines can use it
- **Versioning**: Need to manage core version across pipelines

## Implementation Notes

The core library is implemented in TypeScript with:

- ES Modules (type: "module")
- Node.js 18+ required
- Dependencies: chalk, ajv, zod
- Barrel exports for clean imports

Directory structure:

```
core/
├── src/
│   ├── types/      # Type definitions
│   ├── ralph/      # Ralph QA engine
│   ├── utils/      # Utilities
│   └── config/     # Configuration
├── templates/      # Pipeline templates
├── package.json
└── tsconfig.json
```

## Related ADRs

- ADR-0002: Ralph QA Engine
- ADR-0003: Pipeline Configuration Schema
- ADR-0004: Standardized Logging
