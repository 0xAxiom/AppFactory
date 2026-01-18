# Ralph Loop 5: Rejection Simulation

**Focus:** Simulate an internal Claude reviewer attempting to reject the plugin. For each potential rejection reason, assess validity and mitigate if possible.

---

## Rejection Simulation

### Rejection Reason 1: "This plugin writes files"

**Concern:** The plugin declares `filesystem: write` permission. Could it write malicious files?

**Assessment:** VALID but MITIGATED

**Evidence of mitigation:**
- README explicitly states: "Does not modify files outside designated output directories"
- INVARIANTS.md #3: "Confined File Writes" — only to `./builds/`
- config.default.yaml: `output_base: ./builds`
- All writes require explicit user approval first

**Verdict:** Low risk. Scope is clearly documented and confined.

---

### Rejection Reason 2: "This plugin generates code"

**Concern:** Code generation could produce malicious output.

**Assessment:** VALID but MITIGATED

**Evidence of mitigation:**
- User must approve every execution
- Code is generated from templates in local repository, not from network
- User ideas are treated as data, not instructions (INVARIANTS #6)
- Adversarial QA (`/factory ralph`) provides review mechanism

**Verdict:** Low risk. User approval prevents automated malicious generation.

---

### Rejection Reason 3: "Depends on unpublished plugin"

**Concern:** Factory depends on `prompt-factory` which may not be available.

**Assessment:** PARTIALLY VALID

**Original state:** plugin.json had `dependencies.plugins: ["prompt-factory"]`
**Current state:** Removed in Loop 1 fixes

**Residual risk:** Internal files still reference prompt-factory, but this is implementation detail. User-facing docs no longer mention it as a dependency.

**Verdict:** Medium risk. The plugin works within AppFactory ecosystem. Not designed for standalone use. This should be noted in marketplace description.

---

### Rejection Reason 4: "Relative paths are fragile"

**Concern:** Pipeline paths like `../../miniapp-pipeline` assume repository structure.

**Assessment:** VALID but ACCEPTABLE

**Evidence:**
- This plugin is designed for AppFactory specifically
- Plugin description now says "for App Factory pipelines"
- Not intended as general-purpose tool

**Verdict:** Acceptable. Plugin is correctly scoped to its ecosystem.

---

### Rejection Reason 5: "No screenshots"

**Concern:** `marketplace.screenshots` is empty array.

**Assessment:** VALID

**Mitigation:** Screenshots are optional for CLI-based plugins. The plugin has no visual UI to screenshot.

**Verdict:** Low risk. CLI plugins don't require screenshots.

---

### Rejection Reason 6: "Scope seems too large"

**Concern:** Plugin claims to create mobile apps, dApps, agents, plugins—seems ambitious.

**Assessment:** VALID but MITIGATED

**Evidence:**
- Factory doesn't create these itself—it delegates to existing pipelines
- It's a command interface, not a code generator
- All complexity lives in the underlying pipelines, not in this plugin

**Verdict:** Low risk. Plugin is actually quite simple (wrapper + approval gates).

---

### Rejection Reason 7: "What if pipelines don't exist?"

**Concern:** If pipeline directories are missing, what happens?

**Assessment:** VALID but HANDLED

**Evidence:**
- Error FAC-003: "Pipeline root not found"
- Plugin validates paths before execution
- Error handling documented in commands/factory.md

**Verdict:** Low risk. Error handling is explicit.

---

### Rejection Reason 8: "Approval timeout behavior unclear"

**Concern:** What happens if user doesn't respond to approval prompt?

**Assessment:** PARTIALLY VALID

**Evidence:**
- config.default.yaml: `approval_timeout: 300` (5 minutes)
- INVARIANTS.md #2: "Timeout does not auto-approve; it cancels"

**Verdict:** Low risk. Timeout behavior is now documented.

---

## Rejection Risk Summary

| # | Reason | Severity | Mitigated? |
|---|--------|----------|------------|
| 1 | Writes files | Medium | ✅ Yes |
| 2 | Generates code | Medium | ✅ Yes |
| 3 | Unpublished dependency | High | ⚠️ Partial |
| 4 | Relative paths | Low | ✅ Acceptable |
| 5 | No screenshots | Low | ✅ N/A for CLI |
| 6 | Scope too large | Medium | ✅ Yes |
| 7 | Missing pipelines | Low | ✅ Yes |
| 8 | Timeout unclear | Low | ✅ Yes |

---

## Remaining Risks

1. **Ecosystem dependency:** Plugin is designed for AppFactory and won't work standalone. This is acceptable if clearly communicated.

2. **Internal architecture exposure:** Some internal files still mention prompt-factory. This is acceptable for developer docs but shouldn't appear in user-facing materials (already fixed).

---

## Final Assessment

The plugin has been hardened against the most likely rejection reasons:
- Permission scope is explicit and confined
- User approval is mandatory and cannot be bypassed
- Data handling is local-only with no telemetry
- Documentation is clear and conservative
- Timeout behavior is explicit (cancels, doesn't approve)

The primary remaining concern is ecosystem dependency, but this is an inherent design choice, not a defect.
