# Ralph Loop 2: Safety & Permission Model

**Focus:** Does anything imply silent execution? Is offline-by-default clearly stated and enforced? Are permissions clearly gated?

---

## Critique Report

### Issues Found

| #   | Location                        | Issue                                                              | Severity |
| --- | ------------------------------- | ------------------------------------------------------------------ | -------- |
| 1   | config.default.yaml:27          | "Cannot be set to false" is just a comment, not enforcement        | HIGH     |
| 2   | INVARIANTS.md:49-59             | Invariant #4 exposes internal architecture, not user-facing safety | MEDIUM   |
| 3   | config.default.yaml:47,59,67-80 | Exposes prompt-factory dependency in user-facing config            | MEDIUM   |
| 4   | plugin.json                     | permissions.filesystem="write" but scope not explained             | HIGH     |
| 5   | INVARIANTS.md:99-100            | "spotlighting mechanism" is unexplained jargon                     | LOW      |

### Detailed Analysis

**Issue 1: Unenforced Configuration Comments**
The config file has `require_approval: true # Cannot be set to false` but this is purely documentary. If someone edits the config to `false`, what happens? The comment implies enforcement that may not exist.

**Issue 4: Undefined Write Scope**
The plugin declares `filesystem: write` permission but nowhere does it explicitly state WHERE it writes. A reviewer may worry about arbitrary file system access.

**Issue 2: Internal Architecture in User Docs**
Invariant #4 ("Factory Is a Wrapper") explains internal architecture. This is interesting but not a user-facing safety guarantee. It may confuse reviewers about what's actually being promised.

---

## Recommendations

1. **config.default.yaml** — Remove or rephrase the "cannot be set to false" comment; it implies enforcement that doesn't exist at config level
2. **INVARIANTS.md** — Rewrite Invariant #4 as a user-facing guarantee
3. **README or INVARIANTS** — Add explicit statement about WHERE files are written
4. **config.default.yaml** — Remove/minimize prompt-factory references

---

## Applied Fixes

### Fix 1: config.default.yaml — Clarify comments

Remove misleading enforcement claims, add explicit scope statements.

### Fix 2: INVARIANTS.md — Rewrite Invariant #4

Focus on user-facing guarantee: "writes only to designated directories."

### Fix 3: Add write scope to plugin.json or README

Already in README: "Output to `./builds/` directory" — but should be more prominent.

---

## Resolution Note

After fixes:

- Permission scope is explicitly documented
- No false enforcement claims
- Internal architecture details minimized in user-facing docs
- Safety guarantees focus on what users care about, not implementation
