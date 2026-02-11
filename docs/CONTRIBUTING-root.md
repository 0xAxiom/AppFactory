# Contributing to App Factory

Thank you for your interest in contributing to App Factory! This document provides guidelines and information for contributors.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Pipeline Architecture](#pipeline-architecture)
- [Testing](#testing)
- [Documentation](#documentation)

## Code of Conduct

By participating in this project, you agree to maintain a respectful and inclusive environment. Be kind, constructive, and professional in all interactions.

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm 9 or higher
- Git

### Setup

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/YOUR_USERNAME/AppFactory.git
   cd AppFactory
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Set up pre-commit hooks:
   ```bash
   npm run prepare
   ```

### Repository Structure

```
AppFactory/
├── app-factory/          # Mobile app pipeline (Expo + React Native)
├── dapp-factory/         # dApp/website pipeline (Next.js)
├── agent-factory/        # AI agent pipeline (Node.js + TypeScript)
├── plugin-factory/       # Claude plugin pipeline
├── miniapp-pipeline/     # Base Mini App pipeline (MiniKit + Next.js)
├── CLI/                  # Command-line interface
├── plugins/              # Internal plugins
├── docs/                 # Documentation
├── references/           # Reference implementations
└── vendor/               # Third-party cached documentation
```

## Development Workflow

### Branch Naming

- `feature/description` - New features
- `fix/description` - Bug fixes
- `docs/description` - Documentation updates
- `refactor/description` - Code refactoring
- `ci/description` - CI/CD changes

### Making Changes

1. Create a new branch from `main`:

   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes

3. Install all local dependencies:

   ```bash
   npm run bootstrap
   ```

4. Run linting and formatting:

   ```bash
   npm run lint:fix
   npm run format
   ```

5. Run type checking:

   ```bash
   npm run type-check
   ```

6. Commit your changes (see [Commit Guidelines](#commit-guidelines))

7. Push to your fork:

   ```bash
   git push origin feature/your-feature-name
   ```

8. Open a Pull Request

## Coding Standards

### TypeScript

- Use TypeScript for all new code
- Enable strict mode
- Use explicit types for function parameters and return values
- Avoid `any` type - use `unknown` or proper generics instead

### ESLint Rules

The project uses ESLint with the following key rules:

- No unused variables (prefix with `_` if intentionally unused)
- Consistent import ordering
- No console.log (use console.warn, console.error, or proper logging)
- Prefer const over let
- No var declarations

### Prettier Formatting

- Single quotes for strings
- Semicolons required
- 2-space indentation
- Trailing commas in ES5 contexts

### File Organization

```typescript
// 1. External imports
import { something } from 'external-package';

// 2. Internal imports
import { utils } from '../lib/utils';

// 3. Type imports
import type { SomeType } from './types';

// 4. Constants
const CONSTANT_VALUE = 'value';

// 5. Types/Interfaces
interface Props {
  // ...
}

// 6. Main code
export function myFunction() {
  // ...
}
```

## Commit Guidelines

### Commit Message Format

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, semicolons, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks
- `ci`: CI/CD changes

### Scopes

- `app-factory`: Mobile app pipeline
- `dapp-factory`: dApp/website pipeline
- `agent-factory`: AI agent pipeline
- `plugin-factory`: Claude plugin pipeline
- `miniapp`: Mini app pipeline
- `cli`: Command-line interface
- `docs`: Documentation
- `ci`: CI/CD

### Examples

```
feat(dapp-factory): add Playwright E2E testing support

fix(cli): resolve path resolution on Windows

docs: update contribution guidelines

ci: add security scanning workflow
```

## Security Guidelines

All contributors MUST follow these security practices:

### Never Commit Secrets

- Use `.env.example` for environment variable templates
- Never include real API keys, tokens, or credentials in code
- If you accidentally commit secrets:
  1. Revoke the exposed credentials immediately
  2. Rotate all potentially affected secrets
  3. Remove from git history if possible
  4. Report the incident

### Security Checklist for PRs

Before submitting, verify:

- [ ] No hardcoded secrets or API keys
- [ ] No new `eval()` or `Function()` usage
- [ ] File operations validate paths (prevent traversal)
- [ ] New dependencies reviewed for security
- [ ] `npm audit` shows no critical/high vulnerabilities
- [ ] Input validation added for user-facing inputs
- [ ] Error messages don't expose sensitive information

### Pre-Commit Hooks

The repository uses pre-commit hooks to scan for secrets:

```bash
# Hooks run automatically on commit
# To bypass (not recommended): git commit --no-verify

# To run manually:
node scripts/security/scan-secrets.js
```

### Security Scanning

Run the full security scan:

```bash
# Scan for secrets
node scripts/security/scan-secrets.js

# Run npm audit across all packages
node scripts/security/npm-audit-check.js

# Run Ralph security checks on a build
node scripts/security/ralph-security-checks.js <build-path>
```

### Reporting Vulnerabilities

See [SECURITY.md](./SECURITY.md) for:

- How to report security vulnerabilities
- Responsible disclosure process
- Response timeline

## Pull Request Process

### Before Submitting

1. Ensure all CI checks pass locally:

   ```bash
   npm run ci
   ```

2. Run security checks:

   ```bash
   node scripts/security/scan-secrets.js
   ```

3. Update documentation if needed

4. Add changelog entry if applicable

### PR Template

When opening a PR, include:

- **Description**: What changes does this PR introduce?
- **Motivation**: Why is this change needed?
- **Testing**: How was this tested?
- **Screenshots**: (if applicable)
- **Checklist**:
  - [ ] Lint passes
  - [ ] Type check passes
  - [ ] Tests pass (if applicable)
  - [ ] Documentation updated

### Review Process

1. All PRs require at least one approval
2. CI must pass before merging
3. Squash merge is preferred for clean history
4. Delete branch after merge

## Pipeline Architecture

### CLAUDE.md Constitution

Each pipeline has a `CLAUDE.md` file that acts as its constitution. When modifying a pipeline:

1. Read the existing `CLAUDE.md` thoroughly
2. Maintain the established phase model
3. Respect boundary enforcement rules
4. Update version history if making significant changes

### Phase Model

All pipelines follow a similar phase model:

1. **Phase 0**: Intent Normalization
2. **Phase 1**: Planning/Specification
3. **Phase 2**: Research (if applicable)
4. **Phase 3**: Build/Generate
5. **Phase 4**: Ralph Polish Loop (QA)

### Output Directories

Each pipeline has designated output directories:

| Pipeline         | Output Directory                    |
| ---------------- | ----------------------------------- |
| app-factory      | `app-factory/builds/`               |
| dapp-factory     | `dapp-factory/dapp-builds/`         |
| agent-factory    | `agent-factory/outputs/`            |
| plugin-factory   | `plugin-factory/builds/`            |
| miniapp-pipeline | `miniapp-pipeline/builds/miniapps/` |

## Testing

### Running Tests

```bash
# Install all dependencies (root + subprojects)
npm run bootstrap

# Run linting only
npm run lint

# Run type checking only
npm run type-check

# Run formatting check
npm run format:check

# Run root tests
npm run test

# Run subproject tests
npm run test:cli
npm run test:dapp
```

### Pipeline-Specific Testing

For changes to specific pipelines, test by:

1. Running Claude in the pipeline directory
2. Generating a test project
3. Verifying the output builds and runs correctly

## Documentation

### Updating Documentation

- Keep README.md in sync with feature changes
- Update CLAUDE.md files when modifying pipeline behavior
- Add inline comments for complex logic
- Update CHANGELOG.md for notable changes

### Documentation Style

- Use clear, concise language
- Include code examples where helpful
- Use tables for structured information
- Keep line length reasonable (~120 chars for prose)

## Questions?

If you have questions about contributing:

1. Check existing issues and discussions
2. Open a new issue with the `question` label
3. Be specific about what you're trying to accomplish

Thank you for contributing to App Factory!
