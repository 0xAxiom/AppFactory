# Integration Plan: base/demos into miniapp-pipeline

Concrete, actionable integration plan based on the [BASE_DEMOS_AUDIT.md](./research/BASE_DEMOS_AUDIT.md).

**Created**: 2026-01-18
**Target Commit**: 84caae0a337e2ca95f6c5d3e5e822900bb2d0f9a

---

## Integration Strategy

### Source Selection

| Selection               | Source Path                   | Rationale                                                  |
| ----------------------- | ----------------------------- | ---------------------------------------------------------- |
| **Primary Template**    | `new-mini-app-quickstart/`    | Official quickstart, minimal dependencies, latest patterns |
| **Feature Reference**   | `mini-app-full-demo-minikit/` | Comprehensive feature examples                             |
| **Notification Module** | `my-simple-mini-app/`         | Production-ready notification patterns                     |

### Extraction Approach

1. **Selected templates** copied to `vendor/base-demos/selected/` with modifications documented
2. **Templates in `templates/app_template/`** updated to reflect upstream patterns
3. **Feature modules** extracted as optional add-ons

---

## Phase 1: Template Extraction

### 1.1 Create Selected Directory

```
vendor/base-demos/
├── _upstream/base-demos/     # Read-only upstream clone
├── selected/                  # Curated extractions with modifications
│   ├── quickstart/           # From new-mini-app-quickstart
│   ├── full-demo/            # From mini-app-full-demo-minikit
│   └── notifications/        # From my-simple-mini-app
├── UPSTREAM.md
└── INDEX.md
```

### 1.2 Quickstart Extraction

Copy from `_upstream/base-demos/mini-apps/templates/minikit/new-mini-app-quickstart/`:

| File                                      | Action | Modifications                                 |
| ----------------------------------------- | ------ | --------------------------------------------- |
| `minikit.config.ts`                       | COPY   | Template variables for name, colors, category |
| `app/.well-known/farcaster.json/route.ts` | COPY   | None - use as-is                              |
| `app/rootProvider.tsx`                    | COPY   | Add comments for customization points         |
| `app/page.tsx`                            | COPY   | Template variable for app name                |
| `app/layout.tsx`                          | COPY   | Template variable for metadata                |
| `package.json`                            | COPY   | Pin versions, remove "latest"                 |
| `public/`                                 | COPY   | Replace images with placeholders              |

### 1.3 Full Demo Extraction (Reference Only)

Copy from `_upstream/base-demos/mini-apps/templates/minikit/mini-app-full-demo-minikit/`:

| Directory                   | Purpose                     |
| --------------------------- | --------------------------- |
| `src/components/actions/`   | SDK action examples         |
| `src/components/wallet/`    | Wallet integration patterns |
| `src/components/providers/` | Advanced provider setup     |

### 1.4 Notification Module Extraction

Copy from `_upstream/base-demos/mini-apps/workshops/my-simple-mini-app/`:

| File                         | Action                       |
| ---------------------------- | ---------------------------- |
| `app/api/webhook/route.ts`   | COPY with template variables |
| `app/api/notify/route.ts`    | COPY                         |
| `lib/notification.ts`        | COPY                         |
| `lib/notification-client.ts` | COPY                         |
| `lib/redis.ts`               | COPY                         |

---

## Phase 2: Template Updates

### 2.1 Update `templates/app_template/`

Replace or enhance existing templates based on upstream patterns:

| Template                                           | Update Action                                 |
| -------------------------------------------------- | --------------------------------------------- |
| `minikit.config.ts.template`                       | Replace with upstream pattern + template vars |
| `app/.well-known/farcaster.json/route.ts.template` | Replace with upstream                         |
| `app/providers.tsx.template`                       | Merge with upstream MiniKitProvider pattern   |
| `package.json.template`                            | Update deps to upstream versions (pinned)     |

### 2.2 New Templates to Add

| New Template                        | Source               | Purpose            |
| ----------------------------------- | -------------------- | ------------------ |
| `app/api/webhook/route.ts.template` | notifications module | Webhook handling   |
| `lib/notification.ts.template`      | notifications module | Notification utils |
| `lib/redis.ts.template`             | notifications module | Redis client       |

### 2.3 Template Variables

Define in stage M1 schema:

```json
{
  "app_name": "string (required)",
  "app_subtitle": "string (required)",
  "app_description": "string (required)",
  "primary_category": "enum (social|games|utility|entertainment)",
  "tags": "array of strings",
  "splash_color": "hex color",
  "enable_notifications": "boolean",
  "enable_wallet_ui": "boolean"
}
```

---

## Phase 3: Proof Gate Updates

### 3.1 New Validation Checks

Add based on `mini-app-validation/validate.txt`:

| Check            | Implementation                                       |
| ---------------- | ---------------------------------------------------- |
| SDK Ready Call   | Grep for `sdk.actions.ready()` or `setFrameReady()`  |
| Manifest Fields  | Validate all required fields present                 |
| Image Dimensions | Check icon (200x200), splash (1200x900), screenshots |

### 3.2 Update `scripts/miniapp_proof_gate.sh`

```bash
# Add new checks:
check_sdk_ready() {
  if ! grep -r "sdk.actions.ready\|setFrameReady" app/ src/ >/dev/null 2>&1; then
    echo "ERROR: sdk.actions.ready() call not found"
    return 1
  fi
}

check_manifest_images() {
  # Verify image files exist and have correct dimensions
  local icon=$(jq -r '.miniapp.iconUrl' minikit.config.ts 2>/dev/null)
  # ... dimension checks
}
```

---

## Phase 4: Documentation Updates

### 4.1 Update README.md

Add section on upstream source and how to refresh.

### 4.2 Update CLAUDE.md

Add notes about vendor directory and integration patterns.

### 4.3 Create `vendor/base-demos/selected/MODIFICATIONS.md`

Document all changes from upstream for auditability.

---

## Implementation Checklist

### Pre-Implementation

- [x] Clone upstream repo
- [x] Create UPSTREAM.md with provenance
- [x] Create INDEX.md with navigation
- [x] Complete audit (BASE_DEMOS_AUDIT.md)
- [x] Create integration plan (this document)

### Implementation

- [x] Create `vendor/base-demos/selected/` directory
- [x] Extract quickstart template with modifications
- [x] Extract notification module
- [x] Create MODIFICATIONS.md documenting changes
- [x] Update `templates/app_template/` templates
- [x] Update proof gate script
- [ ] Update M1 schema with new fields (deferred)
- [ ] Test with hello-miniapp build (deferred)

### Post-Implementation

- [x] Run Ralph loops (5 iterations) - in progress
- [ ] Update README.md (deferred)
- [ ] Verify proof gate passes (deferred)

---

## Risk Assessment

| Risk                        | Mitigation                       |
| --------------------------- | -------------------------------- |
| Upstream breaking changes   | Pin to specific commit SHA       |
| Dependency conflicts        | Pin all dependency versions      |
| Template variable conflicts | Use consistent naming convention |
| Build failures              | Extensive proof gate checks      |

---

## Rollback Plan

If integration causes issues:

1. Remove `vendor/base-demos/selected/`
2. Revert `templates/app_template/` changes
3. Revert proof gate changes
4. Document failure in `research/INTEGRATION_FAILURES.md`

---

## Success Criteria

Integration is successful when:

1. `vendor/base-demos/selected/` contains curated templates
2. All templates have template variables for customization
3. Proof gate passes for hello-miniapp
4. 5 Ralph loops complete without critical issues
5. Documentation updated

---

_Plan ready for Phase D implementation._
