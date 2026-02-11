# Claude Plugin Example

A minimal Claude Code plugin demonstrating the Plugin Factory output structure.

## Quick Start

Copy this plugin to your project:

```bash
# Copy to your project
cp -r . /path/to/your/project/.claude/plugins/example-plugin/

# Or create a symlink for development
ln -s $(pwd) /path/to/your/project/.claude/plugins/example-plugin
```

Then restart Claude Code or run `/refresh` to load the plugin.

## Structure

```
plugin/
├── .claude-plugin/
│   └── plugin.json          # Plugin manifest
├── commands/
│   └── greet.md             # /greet command
├── agents/                   # (Optional) Agent definitions
├── skills/                   # (Optional) Skill definitions
├── hooks/                    # (Optional) Event hooks
├── README.md
├── INSTALL.md
└── SECURITY.md
```

## Key Features

This example demonstrates:

1. **Plugin Manifest** - Required `plugin.json` in `.claude-plugin/`
2. **Slash Command** - `/greet` command with YAML frontmatter
3. **Proper Structure** - Commands at root, NOT inside `.claude-plugin/`

## Using the Plugin

After installation, type `/greet` in Claude Code:

```
/greet Alice
```

Claude will respond with a friendly greeting.

## Important Notes

**Directory Structure**: Commands, agents, skills, and hooks directories must be at the plugin ROOT, not inside `.claude-plugin/`. Only `plugin.json` goes inside `.claude-plugin/`.

**Correct:**

```
my-plugin/
├── .claude-plugin/
│   └── plugin.json
├── commands/
│   └── my-command.md
```

**Incorrect:**

```
my-plugin/
├── .claude-plugin/
│   ├── plugin.json
│   └── commands/        <- WRONG!
│       └── my-command.md
```

## Next Steps

This is a minimal example. Full Plugin Factory builds include:

- Multiple commands
- Agent definitions
- Skills with specialized knowledge
- Hooks for event handling
- Security documentation
- Installation guides

Run the full pipeline:

```bash
cd ../../plugin-factory
claude
# Describe your plugin idea
```
