# MCP Servers Reference

Documentation for Model Context Protocol servers used with AppFactory.

## What is MCP?

The Model Context Protocol (MCP) is an open standard for connecting AI assistants to external tools and data sources. Think of it as "USB-C for AI tools" - a universal interface that works across different AI systems.

## Key Concepts

### Tools

Tools are functions that the AI can call to perform actions:

- Database queries
- File operations
- API calls
- Browser automation

### Resources

Resources provide read-only data access:

- Documentation
- Configuration files
- Database schemas

### Prompts

Pre-built prompt templates for common tasks.

## Server Categories

### Tier 1: Essential

These MCP servers provide the most value for AppFactory:

- **Supabase** - Database management
- **Playwright** - Browser testing
- **GitHub** - Repository management

### Tier 2: Recommended

High-value servers for specific use cases:

- **Figma** - Design-to-code
- **Context7** - Documentation lookup
- **Semgrep** - Security scanning

### Tier 3: Situational

Useful for specific workflows:

- **E2B** - Code sandboxing
- **Linear** - Issue tracking
- **Notion** - Documentation
- **Magic UI** - Component library

## Configuration

All servers are configured in `~/.config/claude-code/mcp-config.json`.

See `/mcp-config.example.json` in the repository root for a complete example.

## Resources

- [MCP Specification](https://modelcontextprotocol.io/)
- [Official Servers](https://github.com/modelcontextprotocol/servers)
- [MCP Directory](https://mcp-awesome.com/)
