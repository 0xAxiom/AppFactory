#!/usr/bin/env python3
"""
Export Tour Guide thumbnail render.

Usage (headless):
    blender --background \
        references/blender/assets/tour-guide/source/tour-guide.blend \
        --python references/blender/scripts/export_thumb.py

Output:
    artifacts/tour-guide/thumbnail.png

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
        print("Usage: blender --background <file.blend> --python export_thumb.py")
        sys.exit(1)

    # Determine output path relative to Blender file
    blend_dir = os.path.dirname(bpy.data.filepath)
    repo_root = os.path.abspath(os.path.join(blend_dir, "..", "..", "..", ".."))
    output_dir = os.path.join(repo_root, "artifacts", "tour-guide")
    output_file = os.path.join(output_dir, "thumbnail.png")

    # Create output directory if needed
    os.makedirs(output_dir, exist_ok=True)

    print(f"Rendering thumbnail to: {output_file}")

    # Configure render settings for thumbnail
    scene = bpy.context.scene
    scene.render.resolution_x = 512
    scene.render.resolution_y = 512
    scene.render.resolution_percentage = 100
    scene.render.image_settings.file_format = 'PNG'
    scene.render.image_settings.color_mode = 'RGBA'
    scene.render.image_settings.compression = 15
    scene.render.filepath = output_file

    # Use Eevee for fast rendering (fallback to Workbench if not available)
    try:
        scene.render.engine = 'BLENDER_EEVEE_NEXT'
    except:
        try:
            scene.render.engine = 'BLENDER_EEVEE'
        except:
            scene.render.engine = 'BLENDER_WORKBENCH'

    # Ensure there's a camera, create one if not
    camera = None
    for obj in bpy.data.objects:
        if obj.type == 'CAMERA':
            camera = obj
            break

    if camera is None:
        print("No camera found, creating default camera...")
        bpy.ops.object.camera_add(location=(3, -3, 2))
        camera = bpy.context.active_object
        camera.rotation_euler = (1.1, 0, 0.8)

    scene.camera = camera

    # Set transparent background
    scene.render.film_transparent = True

    # Render
    try:
        bpy.ops.render.render(write_still=True)
        print(f"SUCCESS: Rendered to {output_file}")
        print(f"File size: {os.path.getsize(output_file):,} bytes")
    except Exception as e:
        print(f"ERROR: Render failed - {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()
