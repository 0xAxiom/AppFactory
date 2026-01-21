# AppFactory Maintenance Runbook

This document describes routine maintenance tasks for the AppFactory codebase.

## Quick Reference

| Task               | Command                 | Frequency           |
| ------------------ | ----------------------- | ------------------- |
| Run linting        | `npm run lint`          | Before every commit |
| Check types        | `npm run type-check`    | Before every commit |
| Check dependencies | `npm run deps:check`    | Weekly              |
| Full audit         | `npm run deps:audit`    | Weekly              |
| Full maintenance   | `npm run maintain:full` | Before releases     |

## Daily Development Tasks

### 1. Code Quality Check

```bash
npm run lint
npm run type-check
```

### 2. Run Tests

```bash
npm run test:cli
```

## Weekly Maintenance Tasks

### 1. Dependency Health Check

```bash
npm run deps:check
```

This script checks for:

- Outdated dependencies
- Security vulnerabilities
- Deprecated packages
- Missing lockfiles

### 2. Security Audit

```bash
npm run deps:audit
```

### 3. Check for Updates

```bash
npm run deps:outdated
```

## Before Release Checklist

1. **Run full maintenance check:**

   ```bash
   npm run maintain:full
   ```

2. **Update dependencies if needed:**

   ```bash
   cd CLI && npm update
   cd ../dapp-factory && npm update
   ```

3. **Run full test suite:**

   ```bash
   npm run test
   ```

4. **Check for breaking changes:**
   - Review CHANGELOG.md
   - Test CLI commands manually
   - Test dapp-factory pipeline

5. **Bump version:**
   ```bash
   npm run release:patch   # For bug fixes
   npm run release:minor   # For new features
   npm run release:major   # For breaking changes
   ```

## Dependency Update Process

### Automated Updates (Dependabot)

Dependabot is configured to:

- Check for updates weekly (Mondays)
- Create PRs for outdated dependencies
- Group related dependencies together

**Review Dependabot PRs by:**

1. Checking the changelog/release notes
2. Running tests locally: `npm run test`
3. Testing affected functionality manually

### Manual Updates

For major version updates that require code changes:

1. **Create a branch:**

   ```bash
   git checkout -b deps/update-<package-name>
   ```

2. **Update the package:**

   ```bash
   cd <package-directory>
   npm install <package>@latest
   ```

3. **Run tests and fix any issues:**

   ```bash
   npm run test
   ```

4. **Update code for breaking changes**

5. **Commit and create PR**

## ESLint Configuration

The project uses ESLint flat config (`eslint.config.js`) with:

### Complexity Limits

- `complexity`: max 15 (cyclomatic complexity)
- `max-depth`: max 4 (nesting levels)
- `max-lines-per-function`: max 100
- `max-nested-callbacks`: max 3
- `max-params`: max 5

### When Limits Are Exceeded

If you see warnings about complexity:

1. **Extract helper functions** for repeated logic
2. **Use early returns** to reduce nesting
3. **Split large functions** into smaller units
4. **Consider refactoring** to a more modular design

### Suppressing Warnings

Only suppress warnings when absolutely necessary:

```typescript
// eslint-disable-next-line complexity
function unavoidablyComplexFunction() {
  // Document why this is necessary
}
```

## Code Health Metrics

### Target Metrics

- TypeScript strict mode: **Enabled**
- No `any` types: **Enforced (warnings)**
- Test coverage: **>70%** (target)
- Lint errors: **0**
- Type errors: **0**

### Monitoring

Check code health with:

```bash
npm run maintain
```

## Troubleshooting

### ESLint Not Running

```bash
# Reinstall dependencies
npm install
```

### Type Errors After Update

```bash
# Clear TypeScript cache
cd CLI && rm -rf dist && npm run build
cd ../dapp-factory && rm -rf dist && npm run build
```

### Dependency Conflicts

```bash
# Remove and reinstall
npm run clean
npm install
cd CLI && npm install
cd ../dapp-factory && npm install
```

## Contact

For maintenance issues, create an issue in the repository with the `maintenance` label.
