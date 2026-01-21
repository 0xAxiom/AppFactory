# ADR-0003: Pipeline Configuration Schema

## Status

Accepted

## Context

Each AppFactory pipeline has its own configuration scattered across:

- CLAUDE.md (constitution)
- Various JSON files
- Hardcoded values in scripts

This made it difficult to:

- Validate pipeline configuration
- Generate documentation from config
- Add new pipelines consistently
- Understand what configuration is required

## Decision

Define a standardized `pipeline.config.json` schema that all pipelines can use:

```json
{
  "pipeline": {
    "id": "app-factory",
    "name": "App Factory",
    "version": "8.0.0",
    "outputDir": "builds",
    "runsDir": "runs",
    "phases": [...],
    "techStack": {...},
    "qualityGates": [...]
  },
  "ralph": {
    "passingThreshold": 97,
    "maxIterations": 20,
    "checks": [...],
    "skills": [...],
    "runE2ETests": false
  },
  "validation": {
    "requiredFiles": [...],
    "forbiddenFiles": [...],
    "forbiddenPatterns": [...],
    "sizeLimits": {...},
    "requiredDependencies": [...],
    "requiredScripts": [...]
  }
}
```

Provide:

1. **Zod Schemas** for runtime validation
2. **TypeScript Types** for type safety
3. **Configuration Loaders** for JSON and TypeScript configs
4. **Default Values** for optional fields
5. **Template** for new pipelines

## Consequences

### Positive

- **Validation**: Catch configuration errors early
- **Documentation**: Schema is self-documenting
- **Consistency**: All pipelines follow same structure
- **Tooling**: Can generate documentation, validate on CI

### Negative

- **Verbosity**: Configuration files are larger
- **Migration**: Existing pipelines need conversion

### Neutral

- **Format**: Support both JSON and TypeScript configs
- **Schema Evolution**: Need versioning strategy

## Implementation Notes

Schemas are defined using Zod in `@appfactory/core/config/schema.ts`:

```typescript
import { z } from 'zod';

export const PipelineConfigSchema = z.object({
  id: z.enum([
    'app-factory',
    'dapp-factory',
    'agent-factory',
    'plugin-factory',
    'miniapp-pipeline',
    'website-pipeline',
  ]),
  name: z.string().min(1),
  version: z.string().regex(/^\d+\.\d+\.\d+$/),
  outputDir: z.string().min(1),
  runsDir: z.string().min(1),
  phases: z.array(PhaseDefinitionSchema).min(1),
  techStack: TechStackConfigSchema.optional(),
  qualityGates: z.array(QualityGateConfigSchema).optional(),
});
```

Configuration can be loaded with:

```typescript
import { loadPipelineConfigFile } from '@appfactory/core';

const result = loadPipelineConfigFile('./pipeline.config.json');
if (result.success) {
  console.log(result.config);
} else {
  console.error(result.errors);
}
```

## Related ADRs

- ADR-0001: Shared Core Library
- ADR-0002: Ralph QA Engine
