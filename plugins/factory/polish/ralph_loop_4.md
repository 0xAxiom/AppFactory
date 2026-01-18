# Ralph Loop 4: UX & Reviewer Experience

**Focus:** First-run experience, help output, README ordering, and whether a reviewer can understand in under 2 minutes.

---

## Critique Report

### 2-Minute Reviewer Test

**Can a reviewer understand this in 2 minutes?**

| Aspect | Time to Understand | Pass? |
|--------|-------------------|-------|
| Plugin purpose | 10 seconds | ✅ |
| Safety model | 20 seconds | ✅ |
| Command surface | 30 seconds | ✅ |
| Privacy stance | 15 seconds | ✅ |
| What it generates | 20 seconds | ✅ |

**Total: ~95 seconds — PASS**

### Issues Found

| # | Location | Issue | Severity |
|---|----------|-------|----------|
| 1 | README:85 | "skills to activate" is internal jargon | LOW |
| 2 | README | No single-sentence summary at very top | LOW |
| 3 | PROOF_GATE.md | References prompt-factory in troubleshooting | MEDIUM |
| 4 | commands/factory.md | Still has extensive prompt-factory references | MEDIUM |

### Detailed Analysis

**README Ordering — GOOD**
1. Title + one-liner ✓
2. What it is ✓
3. Key principle ✓
4. What it does ✓
5. What it doesn't do ✓
6. Privacy ✓
7. Quickstart ✓
8. Commands ✓
9. Pipelines ✓
10. How it works ✓

**Tone — GOOD**
- No hype or marketing language
- Conservative claims
- Explicit limitations

**Issue 1: "skills to activate"**
Line 85 mentions "skills to activate" which is internal terminology. Users don't know what skills are. Should say "steps to run" or similar.

---

## Recommendations

1. **Remove "skills" terminology** from user-facing README
2. **Add plugin summary** badge or one-liner at very top
3. **Simplify PROOF_GATE troubleshooting** to remove internal references

---

## Applied Fixes

### Fix 1: README line 85 — Remove "skills" jargon

### Fix 2: PROOF_GATE.md — Simplify troubleshooting section

---

## Resolution Note

After fixes:
- README is fully user-facing with no internal jargon
- Reviewer can understand the plugin in under 2 minutes
- Troubleshooting doesn't expose internal architecture
- Tone is appropriate for marketplace
