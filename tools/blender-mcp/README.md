# Blender MCP (Vendored)

**Status**: OPTIONAL TOOLING
**Source**: [github.com/ahujasid/blender-mcp](https://github.com/ahujasid/blender-mcp)
**Version**: Vendored from upstream (see `upstream/.git` for commit)

---

## Purpose

This directory contains a vendored copy of Blender MCP for **optional** local 3D development workflows. It enables Claude Code to interact with Blender for 3D asset iteration.

## Directory Structure

```
tools/blender-mcp/
├── README.md          # This file
└── upstream/          # Unmodified upstream clone
    ├── addon.py       # Blender add-on (install this in Blender)
    ├── src/           # MCP server source
    └── ...
```

## Important Notes

1. **OPTIONAL**: No pipeline in AppFactory requires Blender MCP. All pipelines function without it.

2. **DO NOT MODIFY**: The `upstream/` directory contains unmodified upstream code. Do not edit files in that directory.

3. **Security**: Blender MCP executes Python code inside Blender. Only use with trusted inputs.

4. **Updates**: To update, delete `upstream/` and re-clone from the source repository.

## Quick Start

See `references/blender/README.md` for full installation and usage instructions.

## License

Upstream code is licensed under MIT. See `upstream/LICENSE` for details.
