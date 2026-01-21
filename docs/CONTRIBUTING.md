# Contributing to App Factory

**Guidelines for contributing to App Factory.**

---

## Table of Contents

1. [Code of Conduct](#code-of-conduct)
2. [How to Contribute](#how-to-contribute)
3. [Development Setup](#development-setup)
4. [Contribution Guidelines](#contribution-guidelines)
5. [Pull Request Process](#pull-request-process)
6. [Documentation Standards](#documentation-standards)
7. [Testing Standards](#testing-standards)

---

## Code of Conduct

### Our Standards

- Be respectful and inclusive
- Focus on constructive feedback
- Accept criticism gracefully
- Prioritize the community's best interests

### Unacceptable Behavior

- Harassment or discrimination
- Personal attacks
- Publishing private information
- Inappropriate content

---

## How to Contribute

### Types of Contributions

| Type             | Description                           |
| ---------------- | ------------------------------------- |
| Bug Reports      | Report issues via GitHub Issues       |
| Feature Requests | Suggest new features or improvements  |
| Documentation    | Improve docs, fix typos, add examples |
| Code             | Fix bugs, implement features          |
| Testing          | Add tests, improve coverage           |

### Good First Issues

Look for issues labeled `good-first-issue` for beginner-friendly tasks.

---

## Development Setup

### Prerequisites

| Requirement | Version |
| ----------- | ------- |
| Node.js     | 18+     |
| npm         | 9+      |
| Git         | Latest  |

### Fork and Clone

```bash
# Fork the repo on GitHub, then:
git clone https://github.com/YOUR-USERNAME/AppFactory.git
cd AppFactory
```

### Create a Branch

```bash
git checkout -b feature/my-feature
# or
git checkout -b fix/bug-description
```

### Branch Naming Convention

| Type     | Format                 | Example                  |
| -------- | ---------------------- | ------------------------ |
| Feature  | `feature/description`  | `feature/add-dark-mode`  |
| Bug Fix  | `fix/description`      | `fix/ralph-timeout`      |
| Docs     | `docs/description`     | `docs/update-readme`     |
| Refactor | `refactor/description` | `refactor/cleanup-types` |

---

## Contribution Guidelines

### Pipeline Contributions

If modifying a pipeline:

1. **Follow the constitution**: Each pipeline has a CLAUDE.md that defines its rules
2. **Maintain phase model**: Don't skip or reorder phases
3. **Preserve invariants**: Never remove safety constraints
4. **Update documentation**: Keep README and CLAUDE.md in sync

### Code Style

| Language   | Style Guide                         |
| ---------- | ----------------------------------- |
| TypeScript | ESLint + Prettier                   |
| Markdown   | Consistent headers, clear structure |
| JSON       | 2-space indentation                 |

### TypeScript Guidelines

```typescript
// Use explicit types
const name: string = 'example';

// Use interfaces for objects
interface User {
  id: string;
  name: string;
}

// Use async/await over promises
async function fetchData(): Promise<Data> {
  const response = await fetch(url);
  return response.json();
}

// Handle errors
try {
  await riskyOperation();
} catch (error) {
  logger.error('Operation failed', { error });
  throw error;
}
```

### File Organization

```
src/
├── index.ts          # Entrypoint
├── types/            # Type definitions
├── lib/              # Shared utilities
├── components/       # UI components (if applicable)
└── __tests__/        # Tests
```

---

## Pull Request Process

### Before Submitting

1. **Test your changes:**

   ```bash
   npm run build
   npm run test
   npm run lint
   ```

2. **Update documentation if needed**

3. **Follow commit message format**

### Commit Message Format

```
type(scope): description

[optional body]

[optional footer]
```

**Types:**

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Formatting
- `refactor`: Code restructuring
- `test`: Adding tests
- `chore`: Maintenance

**Examples:**

```
feat(agent-factory): add support for streaming responses

fix(dapp-factory): resolve hydration mismatch in wallet component

docs(readme): update installation instructions
```

### PR Checklist

- [ ] Code follows style guidelines
- [ ] Tests pass locally
- [ ] Documentation updated
- [ ] Commit messages follow convention
- [ ] No unrelated changes
- [ ] PR description explains changes

### PR Template

```markdown
## Description

[Brief description of changes]

## Type of Change

- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing

[How did you test this?]

## Checklist

- [ ] Code follows style guidelines
- [ ] Tests pass
- [ ] Documentation updated
```

### Review Process

1. **Automated checks** run on PR
2. **Maintainer review** within 48 hours
3. **Address feedback** if requested
4. **Merge** when approved

---

## Documentation Standards

### Structure

Every documentation file should have:

1. **Title** - Clear, descriptive
2. **Table of Contents** - For files > 100 lines
3. **Sections** - Logically organized
4. **Examples** - Code samples where applicable
5. **Related Links** - Cross-references

### Style

| Element | Format                      |
| ------- | --------------------------- |
| Headers | Title Case                  |
| Code    | Fenced blocks with language |
| Tables  | Markdown tables             |
| Lists   | Consistent formatting       |

### Code Examples

Always include:

- Language identifier
- Working code (tested)
- Comments for complex logic

```typescript
// Example: Creating an agent definition
interface AgentDefinition {
  name: string;
  tools: Tool[];
  preamble: string;
}
```

### Pipeline Documentation

Each pipeline must have:

| File        | Purpose                    |
| ----------- | -------------------------- |
| `CLAUDE.md` | Constitution (12 sections) |
| `README.md` | User documentation         |

---

## Testing Standards

### Test Types

| Type        | Location         | Purpose        |
| ----------- | ---------------- | -------------- |
| Unit        | `src/__tests__/` | Function-level |
| Integration | `tests/`         | Module-level   |
| E2E         | `tests/e2e/`     | Full pipeline  |

### Writing Tests

```typescript
import { describe, it, expect } from 'vitest';
import { normalizeIntent } from '../lib/normalize';

describe('normalizeIntent', () => {
  it('should upgrade vague input to professional spec', () => {
    const input = 'make a todo app';
    const result = normalizeIntent(input);

    expect(result).toContain('task management');
    expect(result.length).toBeGreaterThan(input.length);
  });

  it('should preserve explicit requirements', () => {
    const input = 'make a todo app with dark mode';
    const result = normalizeIntent(input);

    expect(result).toContain('dark mode');
  });
});
```

### Test Coverage

Aim for:

- Critical paths: 90%+
- Utilities: 80%+
- Overall: 70%+

### Running Tests

```bash
# All tests
npm test

# Specific file
npm test -- path/to/test.ts

# With coverage
npm test -- --coverage
```

---

## Adding a New Pipeline

If you're adding a new pipeline:

### 1. Create Directory Structure

```
new-pipeline/
├── CLAUDE.md           # Constitution (follow 12-section template)
├── README.md           # User documentation
├── templates/
│   └── system/
├── builds/             # Output directory
└── runs/               # Execution logs
```

### 2. Follow Constitution Template

Use the 12-section structure from existing pipelines:

1. PURPOSE & SCOPE
2. CANONICAL USER FLOW
3. DIRECTORY MAP
4. MODES
5. PHASE MODEL
6. DELEGATION MODEL
7. HARD GUARDRAILS
8. REFUSAL TABLE
9. VERIFICATION & COMPLETION
10. ERROR RECOVERY
11. CROSS-LINKS
12. COMPLETION PROMISE

### 3. Register in Root

Add to root `CLAUDE.md` pipeline table.

### 4. Add Documentation

- Update `/docs/ARCHITECTURE.md`
- Add to pipeline comparison tables
- Add examples to `/docs/EXAMPLES.md`

---

## Questions?

- Open a GitHub Discussion for questions
- Tag maintainers for urgent issues
- Check existing issues before creating new ones

---

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

**Thank you for contributing to App Factory!**
