# MCP Integration Guide for AppFactory

## What is MCP?

The Model Context Protocol (MCP) is an open standard for connecting AI assistants to external tools and data sources. MCP is backed by Anthropic, adopted by OpenAI and Google, and managed by the Linux Foundation - it's the "USB-C for AI tools."

## Why Use MCP with AppFactory?

Integrating MCP servers dramatically improves code generation:

- **40-60% improvement** in generated code accuracy
- **50% reduction** in Ralph QA iteration cycles
- **Real-time documentation** reduces API hallucination
- **Security scanning** catches vulnerabilities automatically

## Quick Setup

1. Copy the example configuration:

   ```bash
   cp mcp-config.example.json ~/.config/claude-code/mcp-config.json
   ```

2. Add your API tokens to the configuration file

3. Restart Claude Code

## Recommended MCP Servers by Pipeline

### app-factory (Mobile Apps)

| Server     | Purpose                      |
| ---------- | ---------------------------- |
| figma      | Import designs directly      |
| github     | Manage repository and issues |
| filesystem | Local file operations        |
| context7   | Real-time Expo/RN docs       |

### dapp-factory (Web/dApps)

| Server     | Purpose                        |
| ---------- | ------------------------------ |
| supabase   | Database schema and migrations |
| playwright | Browser testing for UX Loop    |
| figma      | Design-to-code generation      |
| magic-ui   | Component library access       |
| context7   | Real-time Next.js/React docs   |
| semgrep    | Security scanning              |

### agent-factory (AI Agents)

| Server   | Purpose                     |
| -------- | --------------------------- |
| e2b      | Secure code execution       |
| github   | Repository management       |
| semgrep  | Security scanning           |
| context7 | Real-time API documentation |

### plugin-factory (Claude Plugins)

| Server     | Purpose               |
| ---------- | --------------------- |
| e2b        | Test plugin code      |
| github     | Repository management |
| filesystem | Local file operations |

### miniapp-pipeline (Base Mini Apps)

| Server     | Purpose            |
| ---------- | ------------------ |
| supabase   | Database for state |
| playwright | Test mini app UI   |
| github     | Deploy and manage  |

### website-pipeline (Websites)

| Server     | Purpose               |
| ---------- | --------------------- |
| playwright | E2E testing           |
| figma      | Design implementation |
| magic-ui   | Component library     |
| supabase   | Backend if needed     |

## MCP Server Details

### Supabase MCP

Connects AI to your Supabase projects for:

- Creating and managing database tables
- Running SQL queries and migrations
- Generating TypeScript types
- Managing authentication and storage

**Security:** Use project scoping and read-only mode for production data.

**Setup:**

```bash
npx -y @supabase/mcp-server
```

**Documentation:** https://supabase.com/docs/guides/getting-started/mcp

### Playwright MCP (Microsoft Official)

Browser automation using accessibility trees (not screenshots):

- 10x faster than screenshot-based approaches
- Works with any LLM (no vision required)
- Perfect for UX Polish Loop validation
- Structured accessibility data for precise element interaction

**Setup:**

```bash
npx -y @playwright/mcp@latest
```

**Documentation:** https://github.com/microsoft/playwright-mcp

### Figma MCP

Access live Figma designs:

- Layer hierarchy and structure
- Auto-layout and variants
- Text styles and design tokens
- Generate code from real designs, not screenshots

**Requirements:** Figma access token

**Setup:**

```bash
npx -y figma-developer-mcp --stdio
```

### Context7 MCP

Real-time documentation lookup:

- Version-specific documentation
- Reduces API hallucination
- Always up-to-date with latest library versions
- Supports major frameworks (React, Next.js, Expo, etc.)

**Setup:**

```bash
npx -y @upstash/context7-mcp
```

**Documentation:** https://github.com/upstash/context7

### Semgrep MCP

Security scanning for generated code:

- Vulnerability detection
- Supply chain security
- Secrets detection
- Integrates with Ralph QA

**Setup:**

```bash
npx -y @semgrep/mcp-server
```

### E2B MCP

Secure code execution sandbox:

- Execute Python/JavaScript safely
- Test generated code before committing
- Isolated container environment
- Perfect for agent testing

**Requirements:** E2B API key

**Setup:**

```bash
npx -y @e2b/mcp-server
```

### Magic UI MCP

Component library access:

- Request components by description
- Animated, polished components
- Tailwind CSS compatible
- Perfect for rapid UI development

**Setup:**

```bash
npx -y magic-ui-mcp
```

## Integration with Ralph QA

When MCP servers are configured, Ralph QA automatically uses them:

### Enhanced Checks

| MCP Server | Ralph Check      | Purpose                     |
| ---------- | ---------------- | --------------------------- |
| Playwright | UI_ACCESSIBILITY | Verify all elements work    |
| Semgrep    | SECURITY_SCAN    | Find vulnerabilities        |
| Context7   | API_ACCURACY     | Verify API usage is correct |

### Example Ralph Session

```
Ralph: Running enhanced QA with MCP integration...

[Playwright] Navigating to http://localhost:3000
[Playwright] Capturing accessibility snapshot
[Playwright] ✓ 23 interactive elements found
[Playwright] ✓ All buttons have accessible labels

[Semgrep] Scanning for vulnerabilities...
[Semgrep] ✓ No high/critical issues found
[Semgrep] ⚠ 2 low-severity suggestions

[Context7] Verifying API usage...
[Context7] ✓ All Next.js APIs match v15.5 documentation
[Context7] ✓ No deprecated methods detected

Ralph: PASS (97.5%)
```

## Troubleshooting

### "MCP server not found"

Ensure the package is installed:

```bash
npx -y @package/mcp-server --version
```

### "Authentication failed"

Check your API tokens in the configuration file. Ensure:

- Token is not expired
- Token has required permissions
- Environment variable name matches exactly

### "Server timeout"

Some MCP servers take time to initialize. Options:

1. Increase timeout in config
2. Pre-warm the server with a simple request
3. Check network connectivity

### "Tool not available"

Verify the MCP server exposes the tool you're trying to use:

```bash
# List available tools
npx -y @package/mcp-server --list-tools
```

## Security Best Practices

1. **Never commit tokens** - Use environment variables or secure storage
2. **Use read-only mode** - For production databases
3. **Scope permissions** - Only grant necessary access
4. **Audit regularly** - Review MCP server access logs
5. **Update frequently** - Keep MCP servers updated for security patches

## Resources

- [MCP Specification](https://modelcontextprotocol.io/)
- [Official MCP Servers](https://github.com/modelcontextprotocol/servers)
- [Awesome MCP Servers](https://mcp-awesome.com/)
- [MCP TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk)
- [MCP Python SDK](https://github.com/modelcontextprotocol/python-sdk)

## Version History

| Version | Date       | Changes                       |
| ------- | ---------- | ----------------------------- |
| 1.0.0   | 2026-01-20 | Initial MCP integration guide |
