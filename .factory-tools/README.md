# Factory Tools (Optional)

This directory contains **optional** tools that enhance App Factory but are not required for core functionality.

## Tools

### agent-browser

Headless browser automation for AI agents.

**Use Case:** Automated competitor screenshots during research phase.

**Install:**
```bash
bash .factory-tools/agent-browser/install.sh
```

**Requirements:**
- Node.js 18+
- ~684MB disk space (Chromium)

**Source:** [anthropics/agent-browser](https://github.com/anthropics/agent-browser)

---

### opensrc

Fetch dependency source code to reduce hallucination.

**Use Case:** Look up exact API signatures during code generation.

**Install:**
```bash
bash .factory-tools/opensrc/setup.sh
# OR use directly: npx opensrc <package>
```

**Requirements:**
- Node.js 18+
- Network access

**Source:** [vercel-labs/opensrc](https://github.com/vercel-labs/opensrc)

---

## Usage in Factories

| Tool | web3-factory | app-factory |
|------|--------------|-------------|
| agent-browser | `scripts/research/competitor_screenshots.sh` | `scripts/research/competitor_screenshots.sh` |
| opensrc | Build phase source lookup | Build phase source lookup |

## Without These Tools

All factories work without these tools installed:

- **agent-browser:** Research proceeds with manual web fetching
- **opensrc:** Claude relies on training knowledge

## License

All tools are Apache-2.0 licensed (permissive, commercial-friendly).
