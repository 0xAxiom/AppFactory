# @appfactory/core

Shared core library for AppFactory pipelines.

## Overview

This package provides common functionality shared across all AppFactory pipelines:

- **Types** - Common TypeScript interfaces for pipelines, phases, and results
- **Ralph** - Reusable QA engine for quality assurance
- **Utils** - Logger, file system helpers, and hashing utilities
- **Run Utilities** - Shared helpers for pipeline entrypoints (audit logging, proof gating, template scaffolding)
- **Config** - Configuration loading and validation

## Installation

```bash
cd core
npm install
npm run build
```

## Usage

### Types

```typescript
import type { PipelineConfig, PipelineContext, PhaseResult, RalphReport } from '@appfactory/core';

const config: PipelineConfig = {
  id: 'my-pipeline',
  name: 'My Pipeline',
  version: '1.0.0',
  outputDir: 'builds',
  runsDir: 'runs',
  phases: [
    {
      id: 'phase-0',
      name: 'Intent Normalization',
      description: 'Normalize user intent',
      mandatory: true,
      outputs: ['normalized_prompt.md'],
    },
  ],
};
```

### Ralph QA Engine

```typescript
import { createRalphEngine, STANDARD_CHECKS, generateProgressMarkdown } from '@appfactory/core';

const ralph = createRalphEngine({
  config: {
    passingThreshold: 97,
    maxIterations: 20,
    checks: STANDARD_CHECKS,
    runE2ETests: false,
  },
  buildPath: './builds/my-app',
  pipeline: 'app-factory',
});

const report = await ralph.run();
const markdown = generateProgressMarkdown(report);
```

### Utilities

```typescript
import { logger, readJson, writeJson, ensureDir, generateRunId, slugify } from '@appfactory/core';

// Logging
logger.info('Starting build');
logger.pipelineStart('app-factory', 'run-123');

// File operations
const config = readJson<Config>('./config.json');
writeJson('./output.json', result);
ensureDir('./builds/my-app');

// Hashing and IDs
const runId = generateRunId('app-factory'); // app-factory_20240115_123456
const slug = slugify('My Cool App'); // my-cool-app
```

### Configuration

```typescript
import { loadPipelineConfigFile, discoverPipelineConfig, PipelineConfigSchema } from '@appfactory/core';

// Load from file
const result = loadPipelineConfigFile('./pipeline.config.json');
if (result.success) {
  console.log(result.config);
}

// Discover configuration
const config = await discoverPipelineConfig('./app-factory');

// Validate configuration
const validated = PipelineConfigSchema.parse(rawConfig);
```

## Module Structure

```
@appfactory/core
├── types/           # Type definitions
│   ├── pipeline.ts  # Pipeline, phase, context types
│   ├── ralph.ts     # Ralph QA types
│   └── validation.ts # Validation types
├── ralph/           # Ralph QA engine
│   ├── engine.ts    # Main engine
│   ├── checks.ts    # Built-in checks
│   └── report.ts    # Report generation
├── utils/           # Utilities
│   ├── logger.ts    # Structured logging
│   ├── fs.ts        # File system helpers
│   └── hash.ts      # Hashing utilities
└── config/          # Configuration
    ├── schema.ts    # Zod schemas
    └── loader.ts    # Config loading
```

## Built-in Ralph Checks

The package includes pre-defined checks:

| Check                 | Category      | Description             |
| --------------------- | ------------- | ----------------------- |
| `checkNpmInstall`     | build         | npm install succeeds    |
| `checkNpmBuild`       | build         | npm run build succeeds  |
| `checkTypecheck`      | code-quality  | TypeScript compiles     |
| `checkPackageJson`    | build         | package.json exists     |
| `checkNoSecrets`      | security      | No hardcoded secrets    |
| `checkMarketResearch` | documentation | Research is substantive |

## Check Collections

| Collection         | Checks                                            |
| ------------------ | ------------------------------------------------- |
| `WEB_BUILD_CHECKS` | npm install, build, typecheck, package.json, etc. |
| `RESEARCH_CHECKS`  | market_research, competitor_analysis, positioning |
| `SECURITY_CHECKS`  | No hardcoded secrets                              |
| `UX_CHECKS`        | Loading states, error boundaries                  |
| `STANDARD_CHECKS`  | All of the above                                  |

## License

MIT
