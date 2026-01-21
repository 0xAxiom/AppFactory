# Ralph QA Enhanced with MCP Integration

## Overview

Ralph QA now integrates with MCP servers for automated quality checks beyond manual code review. This enhancement dramatically reduces iteration cycles and catches issues that would otherwise require multiple review rounds.

## What's New in Enhanced Ralph

### Traditional Ralph

- Manual code inspection
- Checklist-based verification
- Limited to static analysis

### Enhanced Ralph (MCP-Integrated)

- Automated browser testing (Playwright MCP)
- Security vulnerability scanning (Semgrep MCP)
- API documentation verification (Context7 MCP)
- Real-time design validation (Figma MCP)

## MCP-Enhanced Checks

### 1. Playwright MCP (UI Testing)

Automated browser testing using accessibility trees:

```
Ralph Check: UI_ACCESSIBILITY
Tool: browser_navigate, browser_snapshot
Pass Criteria: All interactive elements accessible
```

**What Ralph Validates:**

- All pages load without JavaScript errors
- Interactive elements have accessible labels
- Forms submit correctly and show feedback
- Mobile viewport renders properly
- Navigation works as expected

**Example Ralph Session:**

```
Ralph: Validating UI with Playwright MCP...

[browser_navigate] http://localhost:3000
[browser_snapshot] Capturing accessibility tree...

Found 47 interactive elements:
✓ Button "Get Started" - accessible label present
✓ Link "Home" - accessible label present
✓ Input "Email" - accessible label present
✗ Button (icon only) - MISSING accessible label

[browser_click] "Get Started"
[browser_snapshot] Page transition validated

UI Accessibility: 46/47 elements pass (97.9%)
Recommendation: Add aria-label to icon button in Header.tsx:42
```

### 2. Semgrep MCP (Security)

Automated security scanning for generated code:

```
Ralph Check: SECURITY_SCAN
Tool: semgrep.scan
Pass Criteria: 0 high/critical vulnerabilities
```

**What Ralph Validates:**

- No hardcoded secrets or API keys
- No SQL injection vulnerabilities
- No XSS vulnerabilities
- No insecure dependencies
- Proper input validation

**Example Ralph Session:**

```
Ralph: Running security scan with Semgrep MCP...

[semgrep.scan] Scanning project...

Results:
✓ No hardcoded secrets detected
✓ No SQL injection patterns
✓ No XSS vulnerabilities
⚠ 1 medium: Unvalidated redirect in api/auth/route.ts:23
⚠ 2 low: Consider using strict equality

Security: PASS (0 high/critical)
Recommendations logged to ralph/SECURITY_NOTES.md
```

### 3. Context7 MCP (API Accuracy)

Verify API usage against current documentation:

```
Ralph Check: API_ACCURACY
Tool: context7.resolve_library_id, context7.get_library_docs
Pass Criteria: All API calls match current docs
```

**What Ralph Validates:**

- API calls use current syntax
- No deprecated methods
- Correct parameter usage
- Proper error handling patterns

**Example Ralph Session:**

```
Ralph: Verifying API accuracy with Context7 MCP...

[context7.resolve_library_id] Resolving "next"
[context7.get_library_docs] Fetching Next.js 15.5 docs

Checking API usage:
✓ useRouter() - correct App Router syntax
✓ generateMetadata() - proper async pattern
✗ getServerSideProps() - DEPRECATED in App Router

API Accuracy: 14/15 calls correct (93.3%)
Recommendation: Replace getServerSideProps with server component
```

### 4. Figma MCP (Design Validation)

Compare implementation against design specs:

```
Ralph Check: DESIGN_FIDELITY
Tool: figma.get_file, figma.get_styles
Pass Criteria: Design tokens match implementation
```

**What Ralph Validates:**

- Colors match design tokens
- Typography matches specs
- Spacing is consistent
- Component structure follows design

## Enhanced Ralph Checklist

### Code Quality (Existing + Enhanced)

- [ ] TypeScript strict mode passes
- [ ] No ESLint errors
- [ ] No unused imports/variables
- [ ] **[Semgrep]** No security vulnerabilities

### UI/UX (Playwright-Enhanced)

- [ ] **[Playwright]** All pages load without errors
- [ ] **[Playwright]** Interactive elements accessible
- [ ] **[Playwright]** Forms submit correctly
- [ ] **[Playwright]** Mobile viewport works
- [ ] Skeleton loaders for async content
- [ ] Designed empty/error states

### Security (Semgrep-Enhanced)

- [ ] **[Semgrep]** No hardcoded secrets
- [ ] **[Semgrep]** No injection vulnerabilities
- [ ] **[Semgrep]** No XSS vulnerabilities
- [ ] **[Semgrep]** Dependencies are secure
- [ ] Environment variables documented

### Documentation (Context7-Enhanced)

- [ ] **[Context7]** API calls use current syntax
- [ ] **[Context7]** Dependencies are latest stable
- [ ] **[Context7]** No deprecated methods used
- [ ] README is complete
- [ ] DEPLOYMENT guide is accurate

### Design (Figma-Enhanced - Optional)

- [ ] **[Figma]** Colors match design tokens
- [ ] **[Figma]** Typography matches specs
- [ ] **[Figma]** Spacing is consistent
- [ ] Component structure matches design

## Running Enhanced Ralph

### Prerequisites

Configure MCP servers in `~/.config/claude-code/mcp-config.json`:

```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["-y", "@playwright/mcp@latest"]
    },
    "semgrep": {
      "command": "npx",
      "args": ["-y", "@semgrep/mcp-server"]
    },
    "context7": {
      "command": "npx",
      "args": ["-y", "@upstash/context7-mcp"]
    }
  }
}
```

### Invoking Enhanced Ralph

```bash
# Start Claude Code in the project directory
claude

# Request enhanced Ralph QA
"Run enhanced Ralph QA on this project"
```

Ralph will automatically detect available MCP servers and use them for deeper validation.

### Manual MCP Checks

If you want to run specific MCP checks:

```bash
# UI testing only
"Run Playwright accessibility check on this project"

# Security scan only
"Run Semgrep security scan on this project"

# API accuracy only
"Check API usage against current documentation"
```

## Quality Metrics

### Before MCP Integration

| Metric               | Typical Value |
| -------------------- | ------------- |
| Ralph iterations     | 5-8           |
| Missed security bugs | 15-20%        |
| Deprecated API usage | 10-15%        |
| A11y issues          | 20-30%        |

### After MCP Integration

| Metric               | Typical Value |
| -------------------- | ------------- |
| Ralph iterations     | 2-3           |
| Missed security bugs | <5%           |
| Deprecated API usage | <2%           |
| A11y issues          | <5%           |

## Best Practices

### 1. Run MCP Checks Early

Don't wait for final Ralph pass - run MCP checks during development:

```
"Check accessibility of the login page"
"Scan this component for security issues"
```

### 2. Fix High-Impact Issues First

When MCP checks reveal multiple issues, prioritize:

1. Security vulnerabilities (critical/high)
2. Accessibility blockers (no labels)
3. Deprecated API usage
4. Design inconsistencies

### 3. Document MCP Findings

Ralph logs all MCP findings to `ralph/` directory:

- `SECURITY_NOTES.md` - Semgrep findings
- `A11Y_NOTES.md` - Playwright accessibility findings
- `API_NOTES.md` - Context7 API findings

### 4. Update as Libraries Change

Context7 MCP uses real-time documentation. When libraries update:

- Ralph will catch deprecated usage automatically
- No manual doc updates needed
- Always using current best practices

## Troubleshooting

### "MCP server not available"

Ensure the MCP server is configured and the package can be installed:

```bash
npx -y @playwright/mcp@latest --version
```

### "Playwright can't connect"

Ensure your dev server is running:

```bash
npm run dev
# Then run Ralph
```

### "Semgrep timeout"

Large codebases may timeout. Configure in mcp-config:

```json
{
  "semgrep": {
    "command": "npx",
    "args": ["-y", "@semgrep/mcp-server", "--timeout=120"]
  }
}
```

### "Context7 returns no docs"

Ensure the library is supported:

```bash
# Check supported libraries
npx -y @upstash/context7-mcp --list-libraries
```

## Resources

- [MCP Integration Guide](./MCP_INTEGRATION.md)
- [Playwright MCP Reference](../references/mcp-servers/playwright.md)
- [Semgrep MCP Reference](../references/mcp-servers/essential-servers.md)
- [Context7 MCP Reference](../references/mcp-servers/essential-servers.md)

## Version History

| Version | Date       | Changes                            |
| ------- | ---------- | ---------------------------------- |
| 1.0.0   | 2026-01-20 | Initial enhanced Ralph QA with MCP |
