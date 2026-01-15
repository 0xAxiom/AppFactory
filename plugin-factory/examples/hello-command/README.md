# hello-command

A minimal Claude Code plugin example demonstrating the basic structure.

## Features

- Simple `/hello` command
- Demonstrates plugin.json manifest
- Shows command markdown format

## Quick Start

1. Copy this directory to your project
2. Reload Claude Code
3. Type `/hello`

## Structure

```
hello-command/
├── .claude-plugin/
│   └── plugin.json      # Plugin manifest
├── commands/
│   └── hello.md         # The hello command
└── README.md
```

## Key Points

- `plugin.json` goes INSIDE `.claude-plugin/`
- Commands go in `commands/` at the ROOT (not inside .claude-plugin/)
- Commands are Markdown files with YAML frontmatter

## License

MIT

---

**Example from Plugin Factory v1.0**
