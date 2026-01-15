# Normalized Prompt: Aero Map

**Aero Map** - A meditative flying game where players pilot a delicate paper biplane over a photorealistic 3D topographical diorama.

## Core Experience

The scene presents a museum-quality relief map resting on a warm wooden table, illuminated by soft gallery lighting. The terrain features:

- **Layered paper elevation** with visible step-cuts creating the classic topographical effect
- **Matte cardstock textures** with subtle fiber detail and occasional fold creases
- **Hand-drawn ink contour lines** at regular elevation intervals
- **Miniature paper trees and landmarks** adding depth to the diorama

## Gameplay

Players navigate their paper biplane through:
- Gentle thermals that lift the craft
- Collection of floating paper tokens (origami stars, paper clips)
- Discovery of hidden landmarks across varied terrain regions
- Calm, score-optional exploration focused on the joy of flight

## Technical Implementation

- **Three.js / React Three Fiber** for immersive 3D rendering
- **Custom paper material shaders** with subsurface scattering hints
- **Soft ambient occlusion** for that museum diorama depth
- **Depth-of-field camera effects** emphasizing the miniature scale
- **Smooth 60fps flight controls** with momentum and banking

## Polish Requirements

- Skeleton loading states for 3D asset initialization
- Graceful WebGL fallback for unsupported browsers
- Responsive controls: keyboard (WASD/arrows), mouse, and touch
- Framer Motion UI animations for menus and overlays
- Dark/light mode respecting the museum gallery aesthetic

## Solana Integration

- Wallet connection for collectible terrain packs
- Achievement NFTs for exploration milestones
- Optional tip jar for supporting development
- Token-gated premium terrain themes (desert mesa, ocean archipelago, mountain peaks)

## Target Feel

The game should evoke the quiet wonder of leaning over a museum exhibit, watching a tiny paper plane drift across a lovingly crafted miniature world.
