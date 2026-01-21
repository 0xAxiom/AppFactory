# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- CI/CD pipeline with GitHub Actions (lint, format, type-check, security)
- ESLint configuration with TypeScript support
- Prettier configuration for consistent formatting
- Husky pre-commit hooks with lint-staged
- Security scanning workflow (dependency audit, secret scan)
- Release automation workflow with semantic versioning
- CONTRIBUTING.md guide for contributors
- CHANGELOG.md with keep-a-changelog format

### Changed

- Updated package.json with proper scripts and devDependencies

## [11.0.0] - 2026-01-19

### Added

- miniapp-pipeline for Base Mini Apps (MiniKit + Next.js)
- Account association workflow for Base Mini Apps
- Manifest configuration support
- Vercel deployment integration

### Changed

- Updated documentation for all 5 pipelines

## [10.0.0] - 2026-01-18

### Added

- UX Polish Loop with Playwright E2E testing for UI pipelines
- Ralph QA mode with automated testing
- 20-pass polish runner for quality assurance

### Changed

- Enhanced ralph/ artifacts structure
- Added tests/e2e/ to generated projects

## [9.0.0] - 2026-01-17

### Added

- Rig framework integration for agent architecture
- Agent Decision Gate in dapp-factory
- Mode A (Standard) and Mode B (Agent-Backed) dApp generation

### Changed

- Renamed web3-factory to dapp-factory
- Updated agent-factory to use Rig-aligned patterns

## [8.0.0] - 2026-01-14

### Added

- plugin-factory for Claude Code plugins and MCP servers
- MCP catalog (`mcp.catalog.json`) as canonical source
- MCPB packaging support

## [7.0.0] - 2026-01-12

### Added

- Intent Normalization (Phase 0) to all pipelines
- Ralph Quality Mode for adversarial QA
- Dream Spec Author phase

### Changed

- Standardized phase model across all pipelines

## [5.0.0] - 2026-01-08

### Added

- Factory Ready Standard documentation
- Unified documentation format

### Changed

- Consolidated build process

## [4.0.0] - 2026-01-05

### Added

- Single-mode refactor
- Ralph QA process

### Changed

- Simplified pipeline architecture

[Unreleased]: https://github.com/MeltedMindz/AppFactory/compare/v11.0.0...HEAD
[11.0.0]: https://github.com/MeltedMindz/AppFactory/compare/v10.0.0...v11.0.0
[10.0.0]: https://github.com/MeltedMindz/AppFactory/compare/v9.0.0...v10.0.0
[9.0.0]: https://github.com/MeltedMindz/AppFactory/compare/v8.0.0...v9.0.0
[8.0.0]: https://github.com/MeltedMindz/AppFactory/compare/v7.0.0...v8.0.0
[7.0.0]: https://github.com/MeltedMindz/AppFactory/compare/v5.0.0...v7.0.0
[5.0.0]: https://github.com/MeltedMindz/AppFactory/compare/v4.0.0...v5.0.0
[4.0.0]: https://github.com/MeltedMindz/AppFactory/releases/tag/v4.0.0
