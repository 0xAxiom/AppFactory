# Deprecated Templates and Scripts

**Created**: January 9, 2026  
**Purpose**: Quarantine duplicate and conflicting pipeline components

## Files Moved to Deprecated

### Stage 10 Template Duplicates
- `stage10_builder.md` → **REPLACED BY** `templates/agents/10_app_builder.md`
- `stage10_runtime_validation.md` → **MERGED INTO** `templates/agents/10_app_builder.md`
- `stage10_validation_procedure.md` → **MERGED INTO** `templates/agents/10_app_builder.md`

## Canonical Replacement Mapping

| Deprecated File | Canonical Replacement |
|-----------------|----------------------|
| `stage10_builder.md` | `templates/agents/10_app_builder.md` |
| `stage10_runtime_validation.md` | `templates/agents/10_app_builder.md` |
| `stage10_validation_procedure.md` | `templates/agents/10_app_builder.md` |

## Why These Were Deprecated

1. **Duplicate Stage 10 Templates**: Multiple competing sources of truth for Stage 10 execution
2. **Pipeline Canonicalization**: Enforce single template per stage in `templates/agents/`
3. **Deterministic Resolution**: Remove ambiguity in stage template lookup

## Do Not Use These Files

The pipeline has been hardened to use only `templates/agents/` as the canonical stage template directory. These deprecated files are kept for reference only.