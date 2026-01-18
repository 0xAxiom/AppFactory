# Ralph Loop 3: Marketplace Compliance Heuristics

**Focus:** Evaluate against likely reviewer questions about data collection, code execution, URL fetching, and file scope.

---

## Critique Report

### Reviewer Questions Simulated

| Question | Current Answer | Clarity |
|----------|----------------|---------|
| Does this plugin collect data? | Not stated explicitly | UNCLEAR |
| Does it execute code? | Yes, generates code via pipelines | NEEDS DISCLAIMER |
| Does it fetch URLs? | No (offline default), but not prominent | ACCEPTABLE |
| Does it alter files outside its scope? | States ./builds/ only | ACCEPTABLE |
| Does it require additional plugins? | Yes (prompt-factory) | NOT STATED |

### Issues Found

| # | Location | Issue | Severity |
|---|----------|-------|----------|
| 1 | commands/factory.md:139-142 | Dates show 2024, should be 2026 | LOW |
| 2 | factory-executor.md:159,198-205 | Dates show 2024, should be 2026 | LOW |
| 3 | commands/factory.md | Heavy prompt-factory references | MEDIUM |
| 4 | plugin.json | No explicit "no data collection" statement | MEDIUM |
| 5 | README | No explicit statement about code generation/execution | HIGH |
| 6 | Agents | Too much internal implementation detail | MEDIUM |

### Detailed Analysis

**Issue 5: Code Execution Clarity**
The plugin DOES execute code—it generates applications and runs QA loops. A reviewer may be concerned about:
- What code is being executed?
- Where does it come from?
- Can user input cause arbitrary execution?

This needs to be addressed with a clear statement that:
- Code is generated from templates in the local repository
- User input is data, not executable instructions
- All execution requires explicit approval

**Issue 4: Data Collection**
The README now says "Does not collect telemetry or usage data" which is good. But the plugin DOES log to an audit file—is that "data collection"? Clarify that logs are local-only.

---

## Recommendations

1. **Update all dates** from 2024 to 2026
2. **Add privacy/data statement** to plugin.json or README
3. **Clarify code generation** in README—where templates come from
4. **Minimize internal details** in commands and agents files
5. **State explicitly** that audit logs are local-only

---

## Applied Fixes

### Fix 1: Update dates in commands/factory.md

### Fix 2: Update dates in agents/factory-executor.md

### Fix 3: Add data handling statement to README

### Fix 4: Simplify internal references in commands/factory.md

---

## Resolution Note

After fixes:
- Reviewer questions have explicit answers
- Dates are current
- Internal architecture is less prominent
- Data handling is clearly local-only
