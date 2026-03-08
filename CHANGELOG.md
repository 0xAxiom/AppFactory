# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Comprehensive contributing guidelines in CONTRIBUTING.md
- Security policy and vulnerability reporting in SECURITY.md
- Automated dependency auditing in CI pipeline

### Changed

- Fixed repository URL consistency in package.json
- Enhanced .gitignore with additional coverage entries

### Fixed

- Resolved critical security vulnerabilities (ajv, minimatch, rollup)
- Repository URL mismatch between 0xAxiom and MeltedMindz

### Security

- Updated packages to resolve 3 vulnerabilities (2 high, 1 moderate)
- Added dependency audit to CI pipeline
- Established security reporting procedures

## [12.0.1] - 2024-XX-XX

### Added

- Multi-pipeline application factory supporting 7 different app types
- Mobile app generation (app-factory)
- Web3 dApp creation (dapp-factory)
- AI agent development (agent-factory)
- Claude plugin tools (plugin-factory)
- Base Mini Apps (miniapp-pipeline)
- Static website generation (website-pipeline)
- OpenClaw assistant creation (claw-pipeline)

### Changed

- Comprehensive project restructure with monorepo architecture
- Improved TypeScript configuration across all modules
- Enhanced testing framework with Vitest
- Updated build system with modern tooling

### Fixed

- Cross-platform compatibility issues
- Template generation edge cases
- Dependency resolution conflicts

## [12.0.0] - 2024-XX-XX

### Added

- Initial release of unified App Factory
- Support for 7 different application types
- CLI interface for all factory operations
- Comprehensive documentation
- Examples and templates for each factory type

### Breaking Changes

- Complete rewrite from previous versions
- New CLI interface replaces old individual tools
- Updated configuration format
- Changed project structure

---

## Release Types

### Major Version (X.0.0)

- Breaking changes that require user action
- New factory types or major architectural changes
- Removal of deprecated features

### Minor Version (X.Y.0)

- New features that are backward compatible
- New templates or examples
- Enhancements to existing factories

### Patch Version (X.Y.Z)

- Bug fixes and security updates
- Documentation improvements
- Dependency updates without breaking changes

---

## Migration Guides

### From 11.x to 12.x

Major restructure - see [Migration Guide](./docs/migration/11-to-12.md)

### From 10.x to 11.x

See [Migration Guide](./docs/migration/10-to-11.md)

---

## Contributing to the Changelog

When submitting a PR, please add an entry to the `[Unreleased]` section following this format:

```markdown
### Added/Changed/Deprecated/Removed/Fixed/Security

- Brief description of the change
```

Categories:

- **Added**: New features
- **Changed**: Changes in existing functionality
- **Deprecated**: Soon-to-be removed features
- **Removed**: Removed features
- **Fixed**: Bug fixes
- **Security**: Vulnerability fixes
