# Blender Integration (OPTIONAL)

**Status**: OPTIONAL - No pipeline requires Blender
**Purpose**: Local 3D iteration and Tour Guide asset development

---

## Overview

This optional integration enables Claude Code to interact with Blender for 3D asset creation and iteration. It supports the Tour Guide character development workflow but is **not required** for any AppFactory pipeline.

## Requirements

| Requirement | Version | Notes |
|-------------|---------|-------|
| Blender | 3.0+ | Download from [blender.org](https://www.blender.org/download/) |
| Python | 3.10+ | Usually bundled with Blender |
| uv | latest | Install via `curl -LsSf https://astral.sh/uv/install.sh \| sh` |

## Installation

### Step 1: Install the Blender Add-on

1. Open Blender
2. Go to **Edit → Preferences → Add-ons**
3. Click **Install...**
4. Navigate to and select:
   ```
   tools/blender-mcp/upstream/addon.py
   ```
5. Enable the add-on by checking the box next to "Blender MCP"

### Step 2: Start the MCP Server in Blender

1. In Blender, press `N` to open the sidebar
2. Find the "Blender MCP" tab
3. Click **Start MCP Server**
4. Note the port number displayed (default: 9876)

### Step 3: Enable in Claude Code

Run the following command to add Blender MCP to Claude Code:

```bash
claude mcp add blender uvx blender-mcp
```

Or manually add to your `.mcp.json`:

```json
{
  "mcpServers": {
    "blender": {
      "command": "uvx",
      "args": ["blender-mcp"]
    }
  }
}
```

## Usage

Once configured, Claude Code can:

- Create and modify 3D objects in Blender
- Apply materials and textures
- Set up lighting and cameras
- Export to various formats (GLB, GLTF, OBJ)
- Execute Python scripts in Blender

### Example Commands

```
"Create a simple robot head with glowing eyes"
"Export the current scene as GLB to artifacts/tour-guide/"
"Apply a metallic material to the selected mesh"
```

## Tour Guide Assets

### Source Files

```
references/blender/assets/tour-guide/
├── source/
│   └── tour-guide.blend    # Primary Blender file
└── media/
    ├── thumbnail.png       # Preview image
    ├── banner-*.png        # Marketing banners
    └── video-360.mp4       # 360° preview video
```

### Export Scripts

Headless export scripts are provided for CI/CD:

```bash
# Export GLB
blender --background \
  references/blender/assets/tour-guide/source/tour-guide.blend \
  --python references/blender/scripts/export_glb.py

# Export thumbnail
blender --background \
  references/blender/assets/tour-guide/source/tour-guide.blend \
  --python references/blender/scripts/export_thumb.py
```

### Output Directory

Exports go to `artifacts/tour-guide/`:
- `tour-guide.glb` - Web-ready 3D model
- `thumbnail.png` - Preview image

## Security Notice

**Blender MCP executes Python code inside Blender.**

- Only use with trusted inputs
- The MCP server has full access to Blender's Python API
- Scripts can read/write files accessible to Blender
- Review any generated scripts before execution in production

## Telemetry Notice

This repository does not collect telemetry. However, the upstream Blender MCP may have its own telemetry behavior. Review the upstream repository for details:

- Source: [github.com/ahujasid/blender-mcp](https://github.com/ahujasid/blender-mcp)
- Terms: `tools/blender-mcp/upstream/TERMS_AND_CONDITIONS.md`

## Troubleshooting

### "Connection refused" error

1. Ensure Blender is running
2. Verify the MCP server is started (sidebar → Blender MCP → Start)
3. Check the port matches your configuration

### Add-on not appearing

1. Ensure you installed `addon.py` (not the entire folder)
2. Restart Blender after installation
3. Search for "Blender MCP" in the add-ons search bar

### Export fails

1. Verify the output directory exists
2. Check Blender has write permissions
3. Ensure no objects are in edit mode

## Directory Structure

```
AppFactory/
├── tools/blender-mcp/
│   ├── README.md                    # Quick reference
│   └── upstream/                    # Vendored MCP code (DO NOT MODIFY)
├── references/blender/
│   ├── README.md                    # This file
│   ├── assets/tour-guide/           # Tour Guide source assets
│   └── scripts/                     # Headless export scripts
└── artifacts/tour-guide/            # Exported outputs (gitignored)
```

## Version

- Blender MCP: See `tools/blender-mcp/upstream/.git` for commit hash
- This documentation: 2026-01-22
