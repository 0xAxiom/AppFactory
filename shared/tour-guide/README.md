# @appfactory/tour-guide

The official App Factory mascot - a well-traveled robot eyeball assistant with personality and emotions.

## Features

- **5 Emotion States**: idle, happy, curious, sad, excited
- **Eye Tracking**: Optional webcam-based face tracking
- **Random Look Behavior**: Natural eye movement when idle
- **Entrance Animation**: Charming shake on first appearance
- **Weathered Appearance**: Matte, traveled look
- **Customizable**: Background, buttons, initial state

## Installation

The component is designed to work within the App Factory monorepo. It has peer dependencies:

```bash
npm install react react-dom @react-three/fiber @react-three/drei three
```

## Usage

### Basic Usage

```tsx
import { TourGuide } from '@appfactory/tour-guide';

function App() {
  return (
    <div style={{ width: 400, height: 400 }}>
      <TourGuide />
    </div>
  );
}
```

### With Options

```tsx
import { TourGuide, triggerEmotion } from '@appfactory/tour-guide';

function App() {
  return (
    <TourGuide
      modelPath="/brand/mascot/tour-guide.glb"
      backgroundColor="#1a1a1a"
      showEmotionButtons={true}
      showWebcamToggle={true}
      initialEmotion="idle"
      onEmotionChange={(emotion) => console.log('Emotion:', emotion)}
    />
  );
}
```

### Trigger Emotions Programmatically

```tsx
import { triggerEmotion } from '@appfactory/tour-guide';

// Trigger happy emotion for 3 seconds
triggerEmotion('happy', 3.0);

// Trigger curious emotion for 5 seconds
triggerEmotion('curious', 5.0);
```

## Props

| Prop                 | Type           | Default                        | Description                  |
| -------------------- | -------------- | ------------------------------ | ---------------------------- |
| `modelPath`          | `string`       | `/brand/mascot/tour-guide.glb` | Path to GLB model            |
| `enableWebcam`       | `boolean`      | `false`                        | Start with webcam tracking   |
| `showEmotionButtons` | `boolean`      | `true`                         | Show emotion trigger buttons |
| `showWebcamToggle`   | `boolean`      | `true`                         | Show webcam toggle button    |
| `backgroundColor`    | `string`       | `transparent`                  | Container background         |
| `initialEmotion`     | `EmotionState` | `idle`                         | Starting emotion             |
| `onEmotionChange`    | `function`     | -                              | Callback on emotion change   |
| `className`          | `string`       | -                              | Container class name         |

## Emotion States

| State     | Ring Color | Behavior                                      |
| --------- | ---------- | --------------------------------------------- |
| `idle`    | Cyan       | Gentle pulse, random eye movement             |
| `happy`   | Green      | Fast pulse, full 360° spin                    |
| `curious` | Orange     | Medium pulse, head tilt, rapid looking        |
| `sad`     | Blue       | Slow dim pulse, droopy posture, downcast eyes |
| `excited` | Magenta    | Rapid pulse, bouncing                         |

## Model Location

The GLB model lives at `/brand/mascot/tour-guide.glb` in the App Factory repository.

## Architecture

```
shared/tour-guide/
├── src/
│   ├── index.ts          # Exports
│   ├── TourGuide.tsx     # Main component
│   └── emotions.ts       # Emotion system
├── package.json
└── README.md
```

## Development

The Tour Guide sandbox at `tools/sandbox/` provides a live testing environment:

```bash
cd tools/sandbox
npm install
npm run dev
```

Visit http://localhost:5173 to see the Tour Guide in action.
