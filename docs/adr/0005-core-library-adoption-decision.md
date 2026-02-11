# ADR-0005: Core Library Adoption Decision

## Status

**Proposed** (Pending Decision)

## Context

The repository currently has two approaches to code sharing:

1. **Core Library** (`/core/`) - Centralized TypeScript library with shared types, utilities, and Ralph QA engine
2. **Vendored Libraries** (`<pipeline>/scripts/lib/`) - Duplicated code copied to each pipeline

This creates architectural inconsistency. The Tier-2/3 audit identified this as TODO-MEDIUM-2: "Resolve core library adoption."

### Current State

**Core Library** (ADR-0001):

- Provides: Types, Ralph QA engine, utilities, configuration schemas
- Status: Implemented, documented, not widely adopted by pipelines
- Dependencies: chalk, ajv, zod
- Size: ~50KB (src/) + dependencies

**Vendored Approach** (Tier-3 fix):

- Provides: local-run-proof, process-manager, visual utilities
- Status: Recently vendored to all 6 pipelines
- Dependencies: None (standalone)
- Size: ~29KB per pipeline (total ~174KB across 6 pipelines)

### Architectural Conflict

The core library creates **coupling** (all pipelines depend on @appfactory/core), while vendoring creates **autonomy** (each pipeline self-contained).

## Options

### Option A: Adopt Core Library (Centralized)

**Approach**: Migrate all pipelines to use `/core/` for shared code.

**Pros**:

- Single source of truth for types and utilities
- Easier to maintain and update shared code
- Type safety across pipeline boundaries
- Better for mono-repo architecture
- Follows ADR-0001 decision

**Cons**:

- Creates cross-pipeline coupling
- Harder to distribute pipelines independently
- Requires build step (TypeScript compilation)
- All pipelines must update when core changes
- Conflicts with recent vendoring decision

**Implementation**:

1. Complete core library implementation
2. Migrate all 6 pipelines to import from core
3. Remove vendored scripts/lib files
4. Document core library usage in each pipeline
5. Add core as dependency in all pipeline package.json

**Effort**: High (1-2 weeks of migration work)

### Option B: Deprecate Core Library (Autonomous)

**Approach**: Continue vendoring approach, deprecate `/core/` library.

**Pros**:

- Each pipeline is autonomous and self-contained
- Pipelines can be distributed independently
- No shared dependencies or coupling
- Aligns with recent vendoring decision
- Simpler deployment model

**Cons**:

- Code duplication (~50KB per pipeline if core is vendored)
- Updates must be propagated manually to all pipelines
- No type safety across pipelines
- Violates DRY principle
- Wastes ADR-0001 implementation effort

**Implementation**:

1. Extract useful utilities from `/core/` to vendorable modules
2. Copy relevant code to each pipeline's scripts/lib/
3. Mark `/core/` as deprecated
4. Document vendoring process for future utilities
5. Update ADR-0001 status to "Superseded by ADR-0005"

**Effort**: Medium (3-5 days to extract and vendor)

### Option C: Hybrid Approach (Pragmatic)

**Approach**: Keep core for types/schemas, vendor for runtime utilities.

**Pros**:

- Type safety benefits without runtime coupling
- Utilities are self-contained per pipeline
- Balances consistency and autonomy
- TypeScript types don't affect deployment

**Cons**:

- Most complex option
- Still requires core as devDependency
- Unclear boundary between core vs vendored
- Maintenance overhead for two systems

**Implementation**:

1. Move runtime utilities from core to vendorable modules
2. Keep types, schemas, interfaces in core as devDependency
3. Pipelines import types for type-checking only
4. Runtime code is vendored

**Effort**: High (1 week to refactor and test)

## Decision

**PENDING** - This ADR documents the options but does not make a decision.

The choice depends on strategic priorities:

- **Choose Option A** if: Maintaining consistency across pipelines is critical, pipelines will always be distributed together, mono-repo model is permanent
- **Choose Option B** if: Pipeline autonomy is critical, independent distribution is needed, deployment simplicity is priority
- **Choose Option C** if: Want benefits of both, willing to accept complexity

## Recommendation

Given:

- Recent Tier-3 fix chose vendoring approach
- AppFactory philosophy emphasizes autonomous pipelines
- CLAUDE.md documents suggest pipeline sovereignty
- Independent distribution is a stated goal

**Recommended: Option B (Deprecate Core Library)**

Rationale:

- Aligns with architectural direction already taken
- Simplifies deployment and distribution
- Reduces coupling as identified in audit
- Each pipeline remains self-contained

However, this should be a **deliberate decision**, not a default. If centralized consistency is more important than autonomy, Option A is valid.

## Implementation if Option B Chosen

1. Create `scripts/extract-core-utils.sh` to vendor useful core utilities
2. Copy relevant code from core/ to each pipeline's scripts/lib/
3. Update documentation to reflect vendoring approach
4. Mark core/ as deprecated with clear notice
5. Update ADR-0001 to reference this superseding ADR
6. Document maintenance process for vendored code

## Related ADRs

- ADR-0001: Shared Core Library (potentially superseded)
- ADR-0002: Ralph QA Engine
- ADR-0003: Pipeline Configuration Schema
- ADR-0004: Standardized Logging

## References

- [Tier 1 Fixes Report](../reports/audits/2026-01-23-tier1-fixes.md) (TODO-MEDIUM-2)
- Tier-3 Vendoring Fix (commit: refactor(tier-3): vendor scripts/lib)

---

**Date**: 2026-01-23
**Authors**: Claude Sonnet 4.5 (Auto-fix Agent)
**Status**: Proposed (awaiting architectural decision)
