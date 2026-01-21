# Installation Guide

## Prerequisites

- Claude Code CLI installed
- A project where you want to use this plugin

## Installation Methods

### Method 1: Copy to Project (Recommended)

Copy the plugin to your project's `.claude/plugins/` directory:

```bash
# Navigate to your project
cd /path/to/your/project

# Create plugins directory if it doesn't exist
mkdir -p .claude/plugins

# Copy the plugin
cp -r /path/to/example-plugin .claude/plugins/example-plugin
```

### Method 2: Symlink (Development)

For development, create a symlink so changes are reflected immediately:

```bash
# Navigate to your project
cd /path/to/your/project

# Create plugins directory if it doesn't exist
mkdir -p .claude/plugins

# Create symlink
ln -s /path/to/example-plugin .claude/plugins/example-plugin
```

## Verification

1. Restart Claude Code or run `/refresh`
2. Type `/greet` and press Enter
3. You should see a friendly greeting

## Troubleshooting

### Plugin not loading

1. Verify the directory structure:

   ```
   .claude/plugins/example-plugin/
   ├── .claude-plugin/
   │   └── plugin.json
   └── commands/
       └── greet.md
   ```

2. Check `plugin.json` is valid JSON

3. Ensure commands are at plugin root, not inside `.claude-plugin/`

### Command not found

1. Run `/refresh` to reload plugins
2. Check the `commands` array in `plugin.json` includes your command

## Uninstallation

Simply remove the plugin directory:

```bash
rm -rf .claude/plugins/example-plugin
```
