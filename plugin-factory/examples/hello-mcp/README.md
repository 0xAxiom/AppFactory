# hello-mcp

A minimal MCP server example demonstrating the basic structure.

## Features

- Simple `greet` tool with name and style parameters
- Server information resource at `hello://info`
- Demonstrates Zod schema validation

## Quick Start

```bash
npm install
npm run build
```

Add to Claude Desktop (`claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "hello-mcp": {
      "command": "node",
      "args": ["/path/to/hello-mcp/dist/server/index.js"]
    }
  }
}
```

Restart Claude Desktop, then:

```
Use the greet tool to say hi to Alice with an enthusiastic style
```

## Structure

```
hello-mcp/
├── manifest.json         # MCPB manifest
├── package.json
├── tsconfig.json
├── server/
│   └── index.ts          # Server implementation
└── README.md
```

## Key Points

- Use `@modelcontextprotocol/sdk` for the MCP SDK
- Define tools with Zod schemas for input validation
- Use `StdioServerTransport` for local communication
- Handle SIGTERM/SIGINT for graceful shutdown

## Development

```bash
# Watch mode
npm run dev

# Test with inspector
npm run inspect
```

## License

MIT

---

**Example from Plugin Factory v1.0**
