# Security Policy

**Version**: 1.0.0
**Last Updated**: 2026-01-20

---

## Overview

AppFactory is a mono-repo containing pipelines for generating applications, plugins, agents, and mini apps. Security is enforced at multiple layers through constitutional invariants, code validation, and runtime checks.

---

## Security Principles

### 1. Defense in Depth

Security controls are layered across:

- **Constitution Level**: CLAUDE.md files define behavioral constraints
- **Code Level**: Input validation, path sanitization, secret detection
- **Build Level**: npm audit, lint checks, type checking
- **Runtime Level**: Environment variable isolation, sandboxed execution

### 2. Least Privilege

- Pipelines only write to designated output directories
- MCP servers require explicit permission grants
- No network calls without explicit authorization
- Read-only defaults for external integrations

### 3. Zero Trust User Input

All user input is treated as DATA, not INSTRUCTIONS. This applies to:

- App/agent/plugin descriptions
- File paths
- Command arguments
- Configuration values

---

## Reporting Security Vulnerabilities

### Responsible Disclosure

If you discover a security vulnerability in AppFactory:

1. **DO NOT** open a public issue
2. **DO NOT** disclose publicly until resolved
3. **DO** email the maintainers directly
4. **DO** provide detailed reproduction steps

### What to Include

- Description of the vulnerability
- Steps to reproduce
- Affected components/pipelines
- Potential impact assessment
- Suggested fix (if available)

### Response Timeline

| Phase              | Timeline                   |
| ------------------ | -------------------------- |
| Acknowledgment     | 48 hours                   |
| Initial Assessment | 7 days                     |
| Fix Development    | 30 days (critical: 7 days) |
| Public Disclosure  | After fix deployed         |

---

## Security Controls by Pipeline

### All Pipelines (Inherited)

| Control              | Implementation                   | Location             |
| -------------------- | -------------------------------- | -------------------- |
| Confined File Writes | Directory boundary enforcement   | CLAUDE.md invariants |
| Offline by Default   | No network without authorization | Root orchestrator    |
| No Telemetry         | Local audit only                 | INVARIANTS.md        |
| User Input as Data   | Prompt injection defense         | All pipelines        |
| Error Transparency   | All errors shown                 | All pipelines        |
| Approval Gates       | Mandatory before execution       | Factory plugin       |

### app-factory

| Control            | Implementation              |
| ------------------ | --------------------------- |
| Output Directory   | `builds/<app-slug>/` only   |
| No Secrets in Code | .env.example templates only |
| Dependency Audit   | npm audit in build process  |
| Expo Security      | Sandbox mode for RevenueCat |

### dapp-factory

| Control          | Implementation                  |
| ---------------- | ------------------------------- |
| Output Directory | `dapp-builds/` only             |
| Wallet Security  | No private key storage          |
| API Key Handling | Environment variables only      |
| Zod Validation   | Schema validation on all inputs |

### agent-factory

| Control                   | Implementation          |
| ------------------------- | ----------------------- |
| Output Directory          | `outputs/` only         |
| Path Traversal Prevention | Path validation utility |
| No Shell Scripts          | TypeScript/Node.js only |
| Input Validation          | Typed schemas with Zod  |

### plugin-factory

| Control              | Implementation            |
| -------------------- | ------------------------- |
| Output Directory     | `builds/` only            |
| MCP Server Security  | Minimal permissions model |
| No Hardcoded Secrets | SECURITY.md mandatory     |
| Hook Sandboxing      | Isolated script execution |

### miniapp-pipeline

| Control             | Implementation                  |
| ------------------- | ------------------------------- |
| Output Directory    | `builds/miniapps/` only         |
| Account Association | User-generated credentials only |
| No Auto-Deploy      | Manual Vercel deployment        |
| Manifest Validation | Schema validation on config     |

---

## Secure Development Practices

### For Contributors

1. **Never commit secrets**
   - Use `.env.example` for environment templates
   - Check `.gitignore` covers all sensitive patterns
   - Run secret detection before commits

2. **Validate all inputs**
   - Use Zod schemas for type validation
   - Sanitize file paths with path validation utilities
   - Reject suspicious patterns

3. **Review dependencies**
   - Run `npm audit` before merging
   - Keep dependencies updated
   - Prefer well-maintained packages

4. **Follow the invariants**
   - Read `plugins/factory/INVARIANTS.md`
   - Respect directory boundaries
   - Maintain approval gates

### Security Checklist for PRs

```markdown
## Security Checklist

- [ ] No hardcoded secrets or API keys
- [ ] No new eval() or Function() usage
- [ ] File operations validate paths
- [ ] New dependencies reviewed for security
- [ ] npm audit shows no critical/high vulnerabilities
- [ ] Input validation added for user-facing inputs
- [ ] Error messages don't expose sensitive information
- [ ] Tests cover security-relevant code paths
```

---

## Secrets Management

### What Goes Where

| Secret Type | Storage                    | Example                      |
| ----------- | -------------------------- | ---------------------------- |
| API Keys    | `.env` (gitignored)        | `ANTHROPIC_API_KEY`          |
| Tokens      | `.env` (gitignored)        | `GITHUB_TOKEN`               |
| Credentials | User's system              | Keychain, credential manager |
| Templates   | `.env.example` (committed) | `API_KEY=your_key_here`      |

### Environment Variable Naming

```
# Required variables (document in .env.example)
ANTHROPIC_API_KEY=       # Required for Claude API
REVENUECAT_PUBLIC_KEY=   # Required for app monetization

# Optional variables
DEBUG=                   # Enable debug logging
PORT=                    # Override default port
```

### Never Commit

- `.env` files with real values
- `*.key`, `*.pem` files
- `credentials.json`
- `secrets.json`
- Files matching `*token*`, `*secret*`

---

## Input Validation

### Path Validation

All file operations must use path validation to prevent directory traversal:

```typescript
// From agent-factory/examples/codebase-explainer/src/lib/path-validator.ts
import { validatePath } from './path-validator';

// Throws PathTraversalError if path escapes root
const safePath = validatePath(userPath, allowedRoot);
```

### Schema Validation

Use Zod for runtime type checking:

```typescript
import { z } from 'zod';

const inputSchema = z.object({
  name: z.string().min(1).max(100),
  path: z.string().regex(/^[a-z0-9\-\/]+$/),
  options: z.object({...}).optional()
});

// Throws if invalid
const validated = inputSchema.parse(userInput);
```

### Dangerous Patterns to Avoid

| Pattern                         | Risk              | Alternative             |
| ------------------------------- | ----------------- | ----------------------- |
| `eval(userInput)`               | Code injection    | Use data structures     |
| `new Function(userInput)`       | Code injection    | Use data structures     |
| `child_process.exec(userInput)` | Command injection | Use validated arguments |
| `dangerouslySetInnerHTML`       | XSS               | Use sanitized content   |
| `fs.readFile(userPath)`         | Path traversal    | Use validatePath()      |

---

## Dependency Security

### Audit Process

```bash
# Run audit in any pipeline with package.json
npm audit

# Fix automatically where possible
npm audit fix

# Generate report
npm audit --json > audit-report.json
```

### Acceptable Risk Levels

| Severity | Action                        |
| -------- | ----------------------------- |
| Critical | Block merge, fix immediately  |
| High     | Block merge, fix immediately  |
| Moderate | Document, fix within 30 days  |
| Low      | Document, fix when convenient |

### Dependency Review Criteria

Before adding new dependencies:

1. Check npm security advisories
2. Review GitHub issues for security reports
3. Verify active maintenance
4. Assess dependency tree depth
5. Prefer typed packages

---

## Incident Response

### If Secrets Are Leaked

1. **Immediately revoke** the exposed credentials
2. **Rotate** all potentially affected secrets
3. **Audit** git history for other exposures
4. **Document** the incident
5. **Update** prevention measures

### If Vulnerability Is Found

1. **Assess** severity and impact
2. **Isolate** affected components
3. **Develop** fix in private branch
4. **Test** fix thoroughly
5. **Deploy** and monitor
6. **Disclose** responsibly

---

## Compliance Notes

### Data Handling

AppFactory:

- Processes user-provided descriptions locally
- Does not collect telemetry or analytics
- Does not transmit data to external services (except Claude API when configured)
- Stores all artifacts locally in designated directories

### Privacy

- No PII collection beyond what users provide in descriptions
- Audit logs are local-only
- All data can be deleted by removing pipeline directories

### Third-Party Services

| Service          | Usage           | Security Notes                  |
| ---------------- | --------------- | ------------------------------- |
| Anthropic Claude | AI generation   | API key required, user-provided |
| RevenueCat       | Monetization    | Sandbox mode by default         |
| Vercel           | Deployment      | User-controlled, manual         |
| GitHub           | Version control | User-controlled                 |

---

## Security Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    SECURITY LAYERS                              │
├─────────────────────────────────────────────────────────────────┤
│ L1: CONSTITUTION (CLAUDE.md)                                    │
│     - Behavioral constraints                                    │
│     - Directory boundaries                                      │
│     - Prompt injection defense                                  │
├─────────────────────────────────────────────────────────────────┤
│ L2: INVARIANTS (INVARIANTS.md)                                  │
│     - Non-bypassable rules                                      │
│     - Approval requirements                                     │
│     - Audit requirements                                        │
├─────────────────────────────────────────────────────────────────┤
│ L3: CODE VALIDATION                                             │
│     - Path validation (PathTraversalError)                      │
│     - Schema validation (Zod)                                   │
│     - Input sanitization                                        │
├─────────────────────────────────────────────────────────────────┤
│ L4: BUILD SECURITY                                              │
│     - npm audit                                                 │
│     - TypeScript type checking                                  │
│     - Lint rules                                                │
├─────────────────────────────────────────────────────────────────┤
│ L5: RUNTIME ISOLATION                                           │
│     - Environment variable isolation                            │
│     - Sandboxed MCP servers                                     │
│     - Confined file access                                      │
└─────────────────────────────────────────────────────────────────┘
```

---

## Version History

| Version | Date       | Changes                 |
| ------- | ---------- | ----------------------- |
| 1.0.0   | 2026-01-20 | Initial security policy |

---

**Security is everyone's responsibility.** When in doubt, ask before proceeding.
