# Tour Guide - Official App Factory Mascot

The Tour Guide is App Factory's official mascot - a well-traveled robot eyeball assistant who has seen it all. Weathered from countless deployments, it guides users through the factory with personality and charm.

## Assets

| File             | Description                   |
| ---------------- | ----------------------------- |
| `tour-guide.glb` | 3D model (GLB format, ~750KB) |

## Model Specifications

- **Format**: glTF Binary (.glb)
- **Bones**: ARMATURE → BODY → EYE
- **Materials**:
  - Body: "EYE BALL ROBOT BAKED" (weathered metal)
  - Eye Ring: "EMISSION" (glowing cyan ring)
- **Optimized**: Compressed geometry, single draw call

## Emotion States

The Tour Guide expresses 5 emotions through animations and color changes:

| Emotion     | Ring Color | Animation                              |
| ----------- | ---------- | -------------------------------------- |
| **Idle**    | Cyan       | Gentle pulse, random eye movement      |
| **Happy**   | Green      | Fast pulse, full spin                  |
| **Curious** | Orange     | Medium pulse, head tilt, rapid looking |
| **Sad**     | Blue       | Slow dim pulse, droopy posture         |
| **Excited** | Magenta    | Rapid pulse, bouncing                  |

## Usage

### React Three Fiber

```tsx
import { useGLTF } from '@react-three/drei';

function TourGuide() {
  const { scene } = useGLTF('/brand/mascot/tour-guide.glb');
  return <primitive object={scene} />;
}
```

### Reference Implementation

See `tools/sandbox/src/components/Viewer.tsx` for the full implementation including:

- Emotion system with state machine
- Eye glow pulsing animation
- Entrance shake animation
- Optional webcam face tracking
- Random idle eye movement

## Design Philosophy

The Tour Guide embodies App Factory's character:

- **Helpful**: Always looking at you, ready to assist
- **Experienced**: Weathered appearance shows reliability
- **Expressive**: Emotions make interactions feel alive
- **Compact**: Small footprint, big personality

---

_The Tour Guide was created as a friendly face for App Factory - a companion that makes building apps feel less like work and more like an adventure._
