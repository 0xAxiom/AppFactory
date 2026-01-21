# App Factory Documentation

**Complete documentation for all App Factory pipelines.**

---

## Quick Links

| Document                                   | Description                          |
| ------------------------------------------ | ------------------------------------ |
| [GETTING_STARTED.md](./GETTING_STARTED.md) | Start here - 5-minute setup guide    |
| [ARCHITECTURE.md](./ARCHITECTURE.md)       | System design, data flow, governance |
| [API.md](./API.md)                         | Complete command reference           |
| [EXAMPLES.md](./EXAMPLES.md)               | Real-world usage examples            |
| [FAQ.md](./FAQ.md)                         | Frequently asked questions           |
| [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) | Problem solving guide                |
| [CONTRIBUTING.md](./CONTRIBUTING.md)       | How to contribute                    |

---

## By Use Case

### I want to build something

1. Read [GETTING_STARTED.md](./GETTING_STARTED.md) for setup
2. Pick a pipeline from the table below
3. See [EXAMPLES.md](./EXAMPLES.md) for inspiration
4. Use [API.md](./API.md) for command reference

### I want to understand how it works

1. Read [ARCHITECTURE.md](./ARCHITECTURE.md) for system design
2. See [FACTORY_READY_STANDARD.md](./FACTORY_READY_STANDARD.md) for quality standards
3. Check pipeline CLAUDE.md files for detailed constitutions

### I need help

1. Check [FAQ.md](./FAQ.md) first
2. Try [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) for specific issues
3. Open a GitHub Issue if still stuck

### I want to contribute

1. Read [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines
2. Check the roadmap in the root README
3. Look for `good-first-issue` labels

---

## Pipeline Documentation

Each pipeline has its own documentation:

| Pipeline             | README                                  | Constitution                               | Output          |
| -------------------- | --------------------------------------- | ------------------------------------------ | --------------- |
| **app-factory**      | [README](../app-factory/README.md)      | [CLAUDE.md](../app-factory/CLAUDE.md)      | Mobile apps     |
| **dapp-factory**     | [README](../dapp-factory/README.md)     | [CLAUDE.md](../dapp-factory/CLAUDE.md)     | dApps/websites  |
| **agent-factory**    | [README](../agent-factory/README.md)    | [CLAUDE.md](../agent-factory/CLAUDE.md)    | AI agents       |
| **plugin-factory**   | [README](../plugin-factory/README.md)   | [CLAUDE.md](../plugin-factory/CLAUDE.md)   | Claude plugins  |
| **miniapp-pipeline** | [README](../miniapp-pipeline/README.md) | [CLAUDE.md](../miniapp-pipeline/CLAUDE.md) | Base Mini Apps  |
| **website-pipeline** | [README](../website-pipeline/README.md) | [CLAUDE.md](../website-pipeline/CLAUDE.md) | Static websites |

---

## Additional Resources

### Architecture Deep Dives

| Document                                                                         | Description                     |
| -------------------------------------------------------------------------------- | ------------------------------- |
| [architecture/ARCHITECTURE_ANALYSIS.md](./architecture/ARCHITECTURE_ANALYSIS.md) | Technical architecture analysis |

### Quality Standards

| Document                                                 | Description                          |
| -------------------------------------------------------- | ------------------------------------ |
| [FACTORY_READY_STANDARD.md](./FACTORY_READY_STANDARD.md) | Production quality requirements      |
| [UX_POLISH_LOOP.md](./UX_POLISH_LOOP.md)                 | Playwright E2E testing documentation |

### Other Resources

| Document                                         | Description                |
| ------------------------------------------------ | -------------------------- |
| [LAUNCHPAD_OVERVIEW.md](./LAUNCHPAD_OVERVIEW.md) | Launchpad feature overview |
| [DEPLOYMENT.md](./DEPLOYMENT.md)                 | Deployment guide           |
| [TESTING.md](./TESTING.md)                       | Testing documentation      |

---

## Document Status

All documentation follows these standards:

- Table of contents for files > 100 lines
- Consistent markdown formatting
- Working internal links
- Code examples tested
- Cross-references to related docs

---

## Contributing to Documentation

Found an issue? Want to improve the docs?

1. See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines
2. Fork the repo and make changes
3. Submit a PR with `docs:` prefix in commit message

---

**Documentation maintained by App Factory contributors.**
