# Essential MCP Servers for AppFactory

## Tier 1: Must-Have

### Supabase MCP

- **Repository:** https://github.com/supabase-community/supabase-mcp
- **Documentation:** https://supabase.com/docs/guides/getting-started/mcp
- **NPM:** `@supabase/mcp-server`

**Purpose:**

- Database schema management
- SQL migrations
- TypeScript type generation
- Real-time subscriptions setup

**Pipelines:** dapp-factory, agent-factory, miniapp-pipeline, website-pipeline

**Configuration:**

```json
{
  "supabase": {
    "command": "npx",
    "args": ["-y", "@supabase/mcp-server"],
    "env": {
      "SUPABASE_URL": "<YOUR_SUPABASE_URL>",
      "SUPABASE_SERVICE_ROLE_KEY": "<YOUR_SERVICE_KEY>"
    }
  }
}
```

**Security Notes:**

- Use project scoping for multi-project setups
- Enable read-only mode for production databases
- Never expose service role key in client code

---

### Playwright MCP (Microsoft)

- **Repository:** https://github.com/microsoft/playwright-mcp
- **NPM:** `@playwright/mcp`

**Purpose:**

- Browser automation via accessibility tree
- E2E testing without screenshots
- Form interaction and validation
- Performance auditing

**Pipelines:** dapp-factory, website-pipeline, miniapp-pipeline

**Key Features:**

- 10x faster than screenshot-based approaches
- Works with any LLM (no vision required)
- Structured accessibility data
- Perfect for UX Polish Loop

**Configuration:**

```json
{
  "playwright": {
    "command": "npx",
    "args": ["-y", "@playwright/mcp@latest"]
  }
}
```

---

### GitHub MCP

- **Repository:** https://github.com/modelcontextprotocol/servers
- **NPM:** `@modelcontextprotocol/server-github`

**Purpose:**

- Repository management
- Issue and PR operations
- CI/CD workflow management
- Code search across repos

**Pipelines:** All

**Configuration:**

```json
{
  "github": {
    "command": "npx",
    "args": ["-y", "@modelcontextprotocol/server-github"],
    "env": {
      "GITHUB_PERSONAL_ACCESS_TOKEN": "<YOUR_TOKEN>"
    }
  }
}
```

**Required Permissions:**

- `repo` - Full repository access
- `workflow` - CI/CD workflow access (optional)
- `read:org` - Organization access (optional)

---

## Tier 2: Highly Recommended

### Figma MCP

- **NPM:** `figma-developer-mcp`
- **Documentation:** https://www.figma.com/developers/api

**Purpose:**

- Access live Figma designs
- Extract layer hierarchy
- Get design tokens and styles
- Generate code from real designs

**Pipelines:** dapp-factory, website-pipeline, app-factory

**Configuration:**

```json
{
  "figma": {
    "command": "npx",
    "args": ["-y", "figma-developer-mcp", "--stdio"],
    "env": {
      "FIGMA_ACCESS_TOKEN": "<YOUR_TOKEN>"
    }
  }
}
```

**Key Features:**

- Auto-layout extraction
- Variant handling
- Text style mapping
- Component detection

---

### Context7 MCP

- **Repository:** https://github.com/upstash/context7
- **NPM:** `@upstash/context7-mcp`

**Purpose:**

- Real-time documentation lookup
- Version-specific API information
- Reduce hallucination on library usage
- Always up-to-date references

**Pipelines:** All

**Configuration:**

```json
{
  "context7": {
    "command": "npx",
    "args": ["-y", "@upstash/context7-mcp"]
  }
}
```

**Supported Libraries:**

- React, Next.js, Expo
- Tailwind CSS, shadcn/ui
- Anthropic SDK, OpenAI SDK
- And 100+ more

---

### Semgrep MCP

- **NPM:** `@semgrep/mcp-server`
- **Documentation:** https://semgrep.dev/docs/

**Purpose:**

- Security vulnerability scanning
- Supply chain analysis
- Secrets detection
- Code quality rules

**Pipelines:** All (integrate with Ralph QA)

**Configuration:**

```json
{
  "semgrep": {
    "command": "npx",
    "args": ["-y", "@semgrep/mcp-server"]
  }
}
```

**Key Features:**

- OWASP Top 10 coverage
- Dependency vulnerability scanning
- Custom rule support
- CI/CD integration

---

## Tier 3: Situational

### E2B MCP

- **NPM:** `@e2b/mcp-server`
- **Documentation:** https://e2b.dev/docs

**Purpose:**

- Secure code execution sandbox
- Test generated code before commit
- Isolated container environment

**When to use:** Agent development, plugin testing

**Configuration:**

```json
{
  "e2b": {
    "command": "npx",
    "args": ["-y", "@e2b/mcp-server"],
    "env": {
      "E2B_API_KEY": "<YOUR_KEY>"
    }
  }
}
```

---

### Linear MCP

- **Documentation:** https://linear.app/docs/mcp

**Purpose:**

- Issue tracking integration
- Sprint management
- Team workload visibility

**When to use:** Teams using Linear for project management

---

### Notion MCP

- **Documentation:** https://developers.notion.com/docs/mcp
- **NPM:** `@notionhq/notion-mcp-server`

**Purpose:**

- Documentation sync
- Page creation and updates
- Database queries

**When to use:** Teams using Notion for documentation

---

### Magic UI MCP

- **NPM:** `magic-ui-mcp`

**Purpose:**

- Component library access
- Animated, polished components
- Request components by description

**When to use:** Rapid UI development, dapp-factory, website-pipeline

---

## Quick Setup

Copy the example configuration:

```bash
cp /path/to/AppFactory/mcp-config.example.json ~/.config/claude-code/mcp-config.json
```

Edit with your tokens and restart Claude Code.

## Resources

- [MCP Specification](https://modelcontextprotocol.io/)
- [Official MCP Servers](https://github.com/modelcontextprotocol/servers)
- [Awesome MCP Servers](https://mcp-awesome.com/)
