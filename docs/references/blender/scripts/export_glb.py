#!/usr/bin/env python3
"""
Export Tour Guide model to GLB format.

Usage (headless):
    blender --background \
        references/blender/assets/tour-guide/source/tour-guide.blend \
        --python references/blender/scripts/export_glb.py

Output:
    artifacts/tour-guide/tour-guide.glb

Note: This script is designed to run inside Blender's Python environment.
      It will fail gracefully if run outside Blender.
"""

import os
import sys

def main():
    # Verify we're running inside Blender
    try:
        import bpy
    except ImportError:
        print("ERROR: This script must be run inside Blender.")
        print("Usage: blender --background <file.blend> --python export_glb.py")
        sys.exit(1)

    # Determine output path relative to Blender file
    blend_dir = os.path.dirname(bpy.data.filepath)
    repo_root = os.path.abspath(os.path.join(blend_dir, "..", "..", "..", ".."))
    output_dir = os.path.join(repo_root, "artifacts", "tour-guide")
    output_file = os.path.join(output_dir, "tour-guide.glb")

    # Create output directory if needed
    os.makedirs(output_dir, exist_ok=True)

    print(f"Exporting GLB to: {output_file}")

    # Ensure all objects are visible and selectable
    for obj in bpy.data.objects:
        obj.hide_set(False)
        obj.hide_viewport = False
        obj.hide_render = False

    # Select all mesh objects for export
    bpy.ops.object.select_all(action='DESELECT')
    for obj in bpy.data.objects:
        if obj.type == 'MESH':
            obj.select_set(True)

    # Export to GLB
    try:
        bpy.ops.export_scene.gltf(
            filepath=output_file,
            export_format='GLB',
            use_selection=False,  # Export entire scene
            export_apply=True,    # Apply modifiers
            export_animations=True,
            export_lights=False,
            export_cameras=False,
        )
        print(f"SUCCESS: Exported to {output_file}")
        print(f"File size: {os.path.getsize(output_file):,} bytes")
    except Exception as e:
        print(f"ERROR: Export failed - {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()
