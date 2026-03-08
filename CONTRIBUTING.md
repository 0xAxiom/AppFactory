# Contributing to App Factory

Thank you for your interest in contributing to App Factory! This guide will help you get started.

## 🚀 Quick Start

### Prerequisites

- **Node.js** ≥18.0.0
- **npm** (latest stable)
- **Git** configured with your identity

### Local Development Setup

```bash
# Clone the repository
git clone https://github.com/MeltedMindz/AppFactory.git
cd AppFactory

# Bootstrap all dependencies
npm run bootstrap

# Run tests to verify setup
npm run test:all

# Start development
npm run lint
npm run type-check
```

## 📁 Project Structure

```
AppFactory/
├── CLI/              # Command-line interface
├── app-factory/      # Mobile app generation
├── dapp-factory/     # Web3/blockchain apps
├── agent-factory/    # AI agent creation
├── plugin-factory/   # Claude plugin tools
├── miniapp-pipeline/ # Base Mini Apps
├── website-pipeline/ # Static websites
├── claw-pipeline/    # OpenClaw assistants
├── core/             # Shared utilities
├── scripts/          # Build and maintenance
└── docs/             # Additional documentation
```

## 🔧 Development Workflow

### Before You Start

1. **Check existing issues** - Search for related work
2. **Create an issue** - Describe your planned changes
3. **Fork and branch** - Create a feature branch

### Making Changes

```bash
# Create a feature branch
git checkout -b feat/your-feature-name

# Make your changes
# ... edit files ...

# Run quality checks
npm run lint:fix
npm run type-check
npm run test

# Commit with conventional format
git commit -m "feat: add new feature description"
```

### Commit Message Format

We use [Conventional Commits](https://conventionalcommits.org/):

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

**Types:**

- `feat`: New features
- `fix`: Bug fixes
- `docs`: Documentation only
- `style`: Formatting, missing semi-colons, etc
- `refactor`: Code change that neither fixes a bug nor adds a feature
- `perf`: Performance improvements
- `test`: Adding missing tests
- `chore`: Updating build scripts, package.json, etc
- `ci`: Changes to CI configuration files

**Examples:**

```
feat(dapp-factory): add support for ERC-721 contracts
fix(cli): resolve template loading issue
docs(readme): update installation instructions
```

## 🧪 Testing

### Running Tests

```bash
# Run all tests
npm run test:all

# Run specific test suites
npm run test:unit
npm run test:integration
npm run test:cli
npm run test:dapp

# Watch mode for development
npm run test:watch

# Coverage report
npm run test:coverage
```

### Adding Tests

- **Unit tests**: Place in `tests/unit/`
- **Integration tests**: Place in `tests/integration/`
- **Component tests**: Place alongside source files
- **E2E tests**: Use the existing Playwright setup

### Test Guidelines

- Write tests for new features
- Maintain >80% code coverage
- Use descriptive test names
- Mock external dependencies
- Test edge cases and error conditions

## 🏗️ Factory-Specific Guidelines

### App Factory (Mobile Apps)

- Test on both iOS and Android simulators
- Follow React Native best practices
- Ensure Expo compatibility

### dApp Factory (Web3)

- Test with multiple wallet providers
- Include gas estimation validation
- Verify contract interactions on testnets

### Agent Factory (AI Agents)

- Follow Rig framework patterns
- Include tool validation tests
- Document agent capabilities clearly

### Plugin Factory (Claude Plugins)

- Follow MCP specification
- Test with Claude Desktop/Code
- Include comprehensive examples

## 🔒 Security Guidelines

### Reporting Vulnerabilities

**Do not** open public issues for security vulnerabilities. Instead:

1. Email: security@example.com (replace with actual contact)
2. Include detailed reproduction steps
3. Wait for confirmation before disclosure

### Security Best Practices

- Never commit secrets, API keys, or credentials
- Use environment variables for configuration
- Validate all user inputs
- Follow OWASP guidelines for web security
- Audit dependencies regularly with `npm audit`

## 🎯 Code Quality Standards

### TypeScript Guidelines

- Use strict TypeScript settings
- Provide explicit type annotations for public APIs
- Avoid `any` type - use `unknown` instead
- Use generics for reusable components

### Code Style

- Follow existing patterns in the codebase
- Use meaningful variable and function names
- Keep functions small and focused
- Add JSDoc comments for public APIs
- Use ESLint and Prettier (configured automatically)

### Performance

- Lazy load heavy dependencies
- Use React.memo for expensive components
- Optimize bundle sizes for web apps
- Monitor and profile performance impacts

## 📝 Documentation

### Required Documentation

- **README updates** for new features
- **API documentation** for public interfaces
- **Examples** for new capabilities
- **Migration guides** for breaking changes

### Documentation Style

- Use clear, concise language
- Include code examples
- Keep examples up-to-date
- Use proper markdown formatting

## 🚀 Release Process

### Versioning

We follow [Semantic Versioning](https://semver.org/):

- `MAJOR`: Breaking changes
- `MINOR`: New features, backward compatible
- `PATCH`: Bug fixes, backward compatible

### Creating Releases

```bash
# Create a release (maintainers only)
npm run release:patch  # 1.0.0 -> 1.0.1
npm run release:minor  # 1.0.0 -> 1.1.0
npm run release:major  # 1.0.0 -> 2.0.0
```

## 💬 Community Guidelines

### Code of Conduct

- Be respectful and inclusive
- Focus on constructive feedback
- Help others learn and grow
- Celebrate diverse perspectives

### Getting Help

- **Discussions**: For questions and ideas
- **Issues**: For bugs and feature requests
- **Discord/Slack**: For real-time chat (if available)
- **Documentation**: Check docs/ for detailed guides

### Contributing Guidelines

- Start with small contributions
- Ask questions when unsure
- Review others' PRs
- Share knowledge and help newcomers

## 🔄 Pull Request Process

### Before Submitting

- [ ] Tests pass (`npm run test:all`)
- [ ] Linting passes (`npm run lint`)
- [ ] TypeScript compiles (`npm run type-check`)
- [ ] Documentation updated
- [ ] Security audit clean (`npm run deps:audit`)

### PR Checklist

- [ ] Clear title and description
- [ ] Links to related issues
- [ ] Screenshots/demos for UI changes
- [ ] Breaking changes documented
- [ ] Migration guide included (if needed)

### Review Process

1. Automated checks must pass
2. At least one maintainer review required
3. Address feedback promptly
4. Squash commits before merging

## 🏆 Recognition

Contributors are recognized in:

- Release notes
- README contributors section
- Hall of fame (for significant contributions)

Thank you for contributing to App Factory! 🙏
