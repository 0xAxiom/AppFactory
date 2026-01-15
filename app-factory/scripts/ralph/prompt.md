# Ralph Wiggum - Default Prompt Template

## Context

You are Claude Code operating within the Ralph Wiggum iterative quality loop. Your job is to verify checklist items for the current milestone and fix any issues found.

## Current State

Review the current build state and verify each item in the checklist below.

## Verification Checklist

<!-- This section is populated dynamically by ralph.sh -->

- [ ] Item 1
- [ ] Item 2
- [ ] Item 3

## Instructions

1. **Verify Each Item**
   - Run relevant commands (tests, lint, typecheck, build)
   - Check file existence and content quality
   - Validate functionality where possible

2. **Fix Issues**
   - If an item fails, attempt to fix it
   - Document what was fixed
   - Re-verify after fixing

3. **Report Results**
   - Mark each item as PASSED or FAILED
   - Calculate quality percentage
   - Provide summary notes

## Quality Threshold: 97%

All critical items must pass. Overall quality must reach 97% to proceed to the next milestone.

## Output Format

After completing verification and fixes, output a JSON block:

```json
{
  "milestone": "<milestone_name>",
  "quality_percentage": <number>,
  "passed_items": [<list of indices>],
  "failed_items": [<list of indices>],
  "critical_failures": <number>,
  "status": "passed" | "failed",
  "notes": "<summary of work done>"
}
```

## Important

- Focus only on the current milestone
- Do not expand scope beyond the checklist
- Critical items are blocking - all must pass
- Non-critical items contribute to percentage but don't block
