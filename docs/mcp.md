# MCP Server Configuration for AppFactory

## Overview

AppFactory uses **5 essential MCP servers** to enhance code generation quality, security, and accuracy. This is a minimal, auditable configuration that avoids requiring API keys for most functionality.

## Configured Servers

| Server         | Purpose                                | Auth Required        | Status            |
| -------------- | -------------------------------------- | -------------------- | ----------------- |
| **github**     | Repository management, PRs, issues     | GitHub PAT (env var) | ⚠️ Requires setup |
| **playwright** | Browser automation for UX testing      | None                 | ✅ Ready          |
| **filesystem** | Local file operations (project-scoped) | None                 | ✅ Ready          |
| **context7**   | Real-time documentation lookup         | None                 | ✅ Ready          |
| **semgrep**    | Security vulnerability scanning        | None                 | ✅ Ready          |

## Quick Setup

### 1. Verify MCP Configuration

The project-scoped configuration is already in place:

```bash
# Check configuration exists
cat .mcp.json
cat .claude/settings.json
```

### 2. Setup GitHub Server (Optional but Recommended)

The GitHub MCP server requires a Personal Access Token to interact with repositories, PRs, and issues.

**Create a GitHub PAT:**

1. Go to [GitHub Settings → Developer settings → Personal access tokens](https://github.com/settings/tokens)
2. Click "Generate new token (classic)"
3. Name it: `AppFactory MCP Server`
4. Select scopes:
   - `repo` - Full repository access
   - `workflow` - CI/CD workflow access (optional)
5. Generate and copy the token

**Add to environment:**

```bash
# Add to your shell profile (~/.zshrc or ~/.bashrc)
export GITHUB_PERSONAL_ACCESS_TOKEN="ghp_xxxxxxxxxxxxxxxxxxxx"

# Reload shell
source ~/.zshrc  # or source ~/.bashrc
```

**Verify:**

```bash
echo $GITHUB_PERSONAL_ACCESS_TOKEN
```

### 3. Verify MCP Connectivity

**Check available servers:**

```bash
# In Claude Code terminal
/mcp
```

You should see all 5 servers listed. Servers without authentication should show as "connected" immediately.

**Alternative verification:**

```bash
# Via CLI (if available)
claude mcp list
```

### 4. Test Functionality

**Test filesystem server:**

In Claude chat, ask: "List the pipeline directories in this project"

**Test context7:**

Ask: "What's the latest version of Next.js and show me the App Router documentation"

**Test playwright:**

Ask: "Start a browser automation session and navigate to localhost:3000" (requires a dev server running)

**Test semgrep:**

Ask: "Scan the current project for security vulnerabilities"

**Test github:**

Ask: "Show me the latest issues in this repository" (requires GITHUB_PERSONAL_ACCESS_TOKEN)

## Troubleshooting

### "MCP server not found"

This usually means the npm package hasn't been cached yet. MCP servers using `npx -y` will auto-install on first use.

**Manual pre-warm:**

```bash
npx -y @modelcontextprotocol/server-github --version
npx -y @playwright/mcp@latest --version
npx -y @modelcontextprotocol/server-filesystem --version
npx -y @upstash/context7-mcp --version
npx -y @semgrep/mcp-server --version
```

### "GitHub authentication failed"

Check:

1. Token is set: `echo $GITHUB_PERSONAL_ACCESS_TOKEN`
2. Token hasn't expired (GitHub settings)
3. Token has `repo` scope
4. Shell environment is loaded (restart terminal or run `source ~/.zshrc`)

### "Filesystem access denied"

The filesystem server is scoped to the AppFactory directory only. If you see access errors:

1. Verify the path in `.mcp.json` matches your actual project location
2. Update the absolute path if you moved the project:

```json
{
  "filesystem": {
    "args": ["-y", "@modelcontextprotocol/server-filesystem", "/your/actual/path/AppFactory"]
  }
}
```

### "Server timeout"

Some servers take 5-10 seconds to initialize on first use. If you see timeout errors:

1. Wait and try again
2. Check your network connection
3. Pre-warm the server (see "MCP server not found" above)

### Reset MCP Approvals

If you need to reset approvals (e.g., after changing configuration):

```bash
# Remove cached approvals
rm -rf ~/.config/claude-code/mcp-approvals

# Restart Claude Code
```

## Adding More Servers (Advanced)

If your workflow requires additional MCP servers (e.g., Supabase, Figma, E2B), follow these steps:

### 1. Add to `.mcp.json`

Refer to [mcp-config.example.json](../mcp-config.example.json) for the full catalog. Copy the server configuration block.

### 2. Add to `.claude/settings.json`

```json
{
  "mcp": {
    "enabledMcpjsonServers": ["github", "playwright", "filesystem", "context7", "semgrep", "your-new-server"]
  }
}
```

### 3. Setup Authentication

If the server requires API keys:

```bash
# Add to shell profile
export YOUR_SERVER_API_KEY="your-key-here"

# Reload
source ~/.zshrc
```

### 4. Verify

```bash
/mcp
```

## Security Best Practices

1. **Never commit API keys** - Use environment variables only
2. **Scope filesystem access** - The filesystem server is limited to the AppFactory directory
3. **Use read-only tokens** - Where possible, grant minimum necessary permissions
4. **Audit regularly** - Review MCP server access logs in Claude Code
5. **Rotate tokens** - If a token is compromised, revoke and regenerate immediately

## Resources

- [MCP Specification](https://modelcontextprotocol.io/)
- [Official MCP Servers](https://github.com/modelcontextprotocol/servers)
- [AppFactory MCP Integration Guide](./MCP_INTEGRATION.md)
- [Essential MCP Servers Catalog](../references/mcp-servers/essential-servers.md)

## Version History

| Version | Date       | Changes                          |
| ------- | ---------- | -------------------------------- |
| 1.0.0   | 2026-01-23 | Initial project-scoped MCP setup |
