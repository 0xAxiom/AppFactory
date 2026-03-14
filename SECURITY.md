# Security Policy

AppFactory is built with security in mind. Every pipeline enforces strict security controls.

For detailed security information, please see [docs/SECURITY.md](docs/SECURITY.md).

## Reporting Vulnerabilities

If you discover a security vulnerability, please report it responsibly:

1. **Do not** open a public issue
2. Email the details to [security@appfactory.dev] or create a private security advisory on GitHub
3. Include as much information as possible about the vulnerability
4. Allow up to 48 hours for an initial response

We appreciate your responsible disclosure and will acknowledge your contribution in our security acknowledgments.

## Security Features

- **No Hardcoded Secrets**: All credentials use environment variables via `.env` files
- **Secret Scanning**: Pre-commit hooks detect and block potential secrets
- **Path Validation**: File operations validate paths to prevent directory traversal
- **Dependency Auditing**: `npm audit` integration for vulnerability scanning
- **Ralph Security Checks**: QA process includes security verification
- **Confined Writes**: Pipelines can only write to designated output directories

## Security Commands

```bash
# Scan for secrets
node scripts/security/scan-secrets.js

# Run npm audit across packages
node scripts/security/npm-audit-check.js

# Run Ralph security checks on a build
node scripts/security/ralph-security-checks.js <build-path>
```

For complete security documentation, see [docs/SECURITY.md](docs/SECURITY.md).
