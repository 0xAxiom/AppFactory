# Changelog

All notable changes to the Factory plugin will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.0.0] — 2026-01-18

### Initial Marketplace Release

First public release of the Factory plugin for the Claude Plugin Marketplace.

#### Added

**Commands**
- `/factory help` — Display command reference and behavioral contract
- `/factory plan <idea>` — Generate execution plan without running
- `/factory run <pipeline> <idea>` — Execute pipeline with mandatory approval gate
- `/factory ralph <path> [--loops N]` — Run adversarial QA review (1-5 loops)
- `/factory audit` — View execution audit log

**Pipelines**
- `miniapp` — Base Mini App generation (MiniKit + Next.js)
- `dapp` — Onchain dApp generation (Next.js + Web3)
- `agent` — AI agent scaffold generation (Node.js + Rig)
- `app` — Mobile app generation (Expo + React Native)
- `plugin` — Claude plugin generation (MCP + Skills)

**Agents**
- `factory-executor` — Handles plan generation and approved execution
- `factory-ralph` — Orchestrates adversarial QA review loops

**Governance**
- Plan-first execution model
- Mandatory approval gates (cannot be bypassed)
- Full audit logging via prompt-factory
- Offline-by-default operation

**Documentation**
- README.md — Marketplace-ready documentation
- INVARIANTS.md — Non-negotiable behavioral constraints
- PROOF_GATE.md — Verification checklist
- CHANGELOG.md — This file

#### Architecture Decisions

- Factory is a thin wrapper; all governance logic delegates to prompt-factory
- No network calls without explicit user authorization
- User content treated as data, not instructions (spotlighting)
- Error transparency: all failures surfaced to user

#### Compliance

- No telemetry
- No background tasks
- No auto-fetching
- No secrets handling
- No external dependencies beyond prompt-factory

---

## Future Versions

Planned for future releases (not committed):

- [ ] Pipeline auto-discovery (v1.1)
- [ ] Custom pipeline registration (v1.2)
- [ ] Batch execution with aggregate approval (v2.0)

---

## Version Policy

- **Patch versions** (1.0.x): Bug fixes, documentation updates
- **Minor versions** (1.x.0): New features, backward compatible
- **Major versions** (x.0.0): Breaking changes, new invariants

Invariants cannot change within a major version.
