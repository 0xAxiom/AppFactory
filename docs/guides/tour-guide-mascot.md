# Tour Guide - Official App Factory Mascot

The **Tour Guide** is App Factory's official mascot - a well-traveled robot eyeball assistant who has seen it all. Weathered from countless deployments, it guides users through the factory with personality and charm.

## Overview

The Tour Guide is a 3D animated character that can be embedded in any pipeline's output. It features:

- **5 Emotion States** with distinct animations and colors
- **Eye Tracking** via webcam (optional)
- **Random Look Behavior** when idle
- **Entrance Animation** on first appearance
- **Weathered Appearance** suggesting experience and reliability

## Quick Start

### Using the Shared Component

```tsx
import { TourGuide } from '@appfactory/tour-guide';

function MyApp() {
  return (
    <div style={{ width: 400, height: 400 }}>
      <TourGuide backgroundColor="#1a1a1a" showEmotionButtons={true} showWebcamToggle={true} />
    </div>
  );
}
```

### Trigger Emotions Programmatically

```tsx
import { triggerEmotion } from '@appfactory/tour-guide';

// When user accomplishes something
triggerEmotion('happy', 3.0);

// When user asks a question
triggerEmotion('curious', 4.0);

// When something fails
triggerEmotion('sad', 5.0);

// When something exciting happens
triggerEmotion('excited', 3.0);
```

## Emotion Reference

| State       | Ring Color | Animation                         | Use When               |
| ----------- | ---------- | --------------------------------- | ---------------------- |
| **Idle**    | Cyan       | Gentle pulse, random eye movement | Default state          |
| **Happy**   | Green      | Fast pulse, 360° spin             | Success, achievement   |
| **Curious** | Orange     | Head tilt, rapid looking          | Questions, exploration |
| **Sad**     | Blue       | Slow dim pulse, droopy            | Errors, failures       |
| **Excited** | Magenta    | Rapid pulse, bouncing             | Big announcements      |

## File Locations

| Asset         | Path                          | Description              |
| ------------- | ----------------------------- | ------------------------ |
| **3D Model**  | `brand/mascot/tour-guide.glb` | Canonical GLB file       |
| **Component** | `shared/tour-guide/`          | Reusable React component |
| **Sandbox**   | `tools/sandbox/`              | Development playground   |

## Integration Guide

### In Generated Websites

Add the Tour Guide to website-pipeline outputs by including it in the layout:

```tsx
// In layout.tsx or a modal component
import { TourGuide, triggerEmotion } from '@appfactory/tour-guide';

// Show happy Tour Guide when user completes onboarding
useEffect(() => {
  if (onboardingComplete) {
    triggerEmotion('happy', 3.0);
  }
}, [onboardingComplete]);
```

### In Mobile Apps (Expo)

The Tour Guide can be adapted for React Native using `react-three-fiber/native`:

```tsx
import { TourGuide } from '@appfactory/tour-guide/native';
```

### As a Standalone Preview

Run the sandbox to see the Tour Guide in action:

```bash
cd tools/sandbox
npm install
npm run dev
# Visit http://localhost:5173
```

## Technical Details

### Model Structure

- **Format**: glTF Binary (.glb)
- **Size**: ~750KB (optimized)
- **Bones**: ARMATURE → BODY → EYE
- **Materials**:
  - Body: "EYE BALL ROBOT BAKED" (matte metal)
  - Eye Ring: "EMISSION" (glowing, animated)

### Dependencies

```json
{
  "react": ">=18.0.0",
  "@react-three/fiber": ">=8.0.0",
  "@react-three/drei": ">=9.0.0",
  "three": ">=0.150.0"
}
```

### Browser Support

- Modern browsers with WebGL2 support
- FaceDetector API (Chrome) for advanced tracking
- Falls back to brightness-based tracking in other browsers

## Design Philosophy

The Tour Guide embodies App Factory's character:

1. **Helpful** - Always looking at you, ready to assist
2. **Experienced** - Weathered appearance shows reliability
3. **Expressive** - Emotions make interactions feel alive
4. **Compact** - Small footprint, big personality
5. **Universal** - Works across all pipelines

---

_The Tour Guide was created as a friendly face for App Factory - a companion that makes building apps feel less like work and more like an adventure._
