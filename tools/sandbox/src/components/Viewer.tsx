/**
 * Tour Guide Companion Viewer
 *
 * This is the development sandbox for the Tour Guide mascot.
 * The canonical shared component lives at: shared/tour-guide/
 * The canonical model lives at: brand/mascot/tour-guide.glb
 */
import { Suspense, useState, useEffect, useRef, useCallback } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment } from '@react-three/drei';
import * as THREE from 'three';
import './Viewer.css';

// ============================================
// EMOTION SYSTEM
// ============================================
export type EmotionState = 'idle' | 'happy' | 'curious' | 'sad' | 'excited';

interface EmotionConfig {
  ringColor: THREE.Color;
  pulseSpeed: number;
  pulseIntensity: number;
  bobSpeed: number;
  bobAmount: number;
  lookSpeed: number;
}

const EMOTION_CONFIGS: Record<EmotionState, EmotionConfig> = {
  idle: {
    ringColor: new THREE.Color().setHSL(0.55, 1, 0.5), // Cyan
    pulseSpeed: 2.5,
    pulseIntensity: 1.0,
    bobSpeed: 0,
    bobAmount: 0,
    lookSpeed: 1.0,
  },
  happy: {
    ringColor: new THREE.Color().setHSL(0.33, 1, 0.45), // Green
    pulseSpeed: 4.0,
    pulseIntensity: 1.5,
    bobSpeed: 0,
    bobAmount: 0,
    lookSpeed: 0.5,
  },
  curious: {
    ringColor: new THREE.Color().setHSL(0.12, 1, 0.5), // Orange/Yellow
    pulseSpeed: 3.5,
    pulseIntensity: 1.2,
    bobSpeed: 0,
    bobAmount: 0,
    lookSpeed: 2.0,
  },
  sad: {
    ringColor: new THREE.Color().setHSL(0.6, 0.8, 0.4), // Blue
    pulseSpeed: 1.5,
    pulseIntensity: 0.6,
    bobSpeed: 0.5,
    bobAmount: -0.1,
    lookSpeed: 0.3,
  },
  excited: {
    ringColor: new THREE.Color().setHSL(0.85, 1, 0.55), // Magenta/Pink
    pulseSpeed: 6.0,
    pulseIntensity: 2.0,
    bobSpeed: 8.0,
    bobAmount: 0.15,
    lookSpeed: 1.5,
  },
};

// Shared state for emotion system
const currentEmotionRef = { current: 'idle' as EmotionState };
const emotionStartTimeRef = { current: 0 };
const emotionDurationRef = { current: 0 };

// Eye tracking context - shared between React and Three.js
interface EyeTarget {
  x: number; // -1 to 1 (left to right)
  y: number; // -1 to 1 (down to up)
}

const eyeTargetRef = { current: { x: 0, y: 0 } as EyeTarget };
const webcamEnabledRef = { current: false };

// Asset paths - check local first, then brand directory (canonical location)
const ASSET_PATHS = {
  glb: [
    '/assets/tour-guide.glb',
    '../../brand/mascot/tour-guide.glb',
    '/source-assets/tour-guide.glb',
  ],
};

// Trigger an emotion (exported for external use)
export function triggerEmotion(emotion: EmotionState, duration: number = 3.0) {
  currentEmotionRef.current = emotion;
  emotionStartTimeRef.current = -1; // Will be set on next frame
  emotionDurationRef.current = duration;
}

// ============================================
// TOUR GUIDE MODEL COMPONENT
// ============================================
function TourGuideModel({
  url,
  onLoaded,
  onError,
}: {
  url: string;
  onLoaded: (bounds: THREE.Box3) => void;
  onError: (error: Error) => void;
}) {
  const { scene } = useGLTF(url);
  const { camera } = useThree();
  const hasFramed = useRef(false);

  // Animation refs
  const emissionMaterialRef = useRef<THREE.MeshStandardMaterial | null>(null);
  const bodyMaterialRef = useRef<THREE.MeshStandardMaterial | null>(null);
  const sceneRef = useRef<THREE.Group | null>(null);
  const shakeStartTime = useRef<number | null>(null);
  const originalRotation = useRef<THREE.Euler | null>(null);
  const originalPosition = useRef<THREE.Vector3 | null>(null);

  // Eye tracking refs
  const eyeBoneRef = useRef<THREE.Bone | null>(null);
  const bodyBoneRef = useRef<THREE.Bone | null>(null);
  const eyeOriginalRotation = useRef<THREE.Quaternion | null>(null);
  const bodyOriginalRotation = useRef<THREE.Quaternion | null>(null);
  const currentEyeTarget = useRef<EyeTarget>({ x: 0, y: 0 });
  const randomLookTarget = useRef<EyeTarget>({ x: 0, y: 0 });
  const nextRandomLookTime = useRef<number>(0);

  // Emotion animation refs
  const happySpinProgress = useRef<number>(0);
  const currentRingColor = useRef<THREE.Color>(
    EMOTION_CONFIGS.idle.ringColor.clone()
  );

  // Find materials and bones, setup animations on load
  useEffect(() => {
    if (scene && !hasFramed.current) {
      try {
        // Compute bounding box
        const box = new THREE.Box3().setFromObject(scene);
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());

        // Auto-frame: position camera DIRECTLY in front (facing forward)
        const maxDim = Math.max(size.x, size.y, size.z);
        const fov = (camera as THREE.PerspectiveCamera).fov * (Math.PI / 180);
        const cameraDistance = (maxDim / (2 * Math.tan(fov / 2))) * 1.8;

        // Position camera directly in front, slightly above center
        camera.position.set(
          center.x,
          center.y + cameraDistance * 0.1,
          center.z + cameraDistance
        );
        camera.lookAt(center);
        camera.updateProjectionMatrix();

        // Store scene ref for animations
        sceneRef.current = scene;
        originalRotation.current = scene.rotation.clone();
        originalPosition.current = scene.position.clone();

        // Traverse scene to find materials and bones
        scene.traverse((child) => {
          // Find and modify materials for weathered look
          if (child instanceof THREE.Mesh) {
            const materials = Array.isArray(child.material)
              ? child.material
              : [child.material];
            for (const mat of materials) {
              if (mat instanceof THREE.MeshStandardMaterial) {
                // Check if this is the emission material (eye glow) - don't modify it
                if (mat.emissive && mat.emissiveIntensity > 0) {
                  emissionMaterialRef.current = mat;
                }
                // Check if this is the eye/lens material (shiny black) - keep it pristine
                else if (
                  mat.name?.toLowerCase().includes('eye') ||
                  mat.color?.getHex() < 0x333333
                ) {
                  // Eye lens stays shiny - don't modify
                }
                // Body material - add visible weathering for well-traveled look
                else {
                  bodyMaterialRef.current = mat;
                  // Strong roughness for matte, worn appearance
                  mat.roughness = 0.7;
                  // Reduce metalness significantly
                  mat.metalness = 0.1;
                  // Reduce environment map reflections for weathered look
                  mat.envMapIntensity = 0.25;
                  // Slight warm tint to suggest age/use (cream instead of pure white)
                  if (mat.color) {
                    mat.color.offsetHSL(0.02, -0.05, -0.08); // Slightly warm, desaturated, darker
                  }
                  // Needs update flag
                  mat.needsUpdate = true;
                }
              }
            }
          }

          // Find bones
          if (child instanceof THREE.Bone) {
            const boneName = child.name.toUpperCase();
            if (boneName === 'EYE') {
              eyeBoneRef.current = child;
              eyeOriginalRotation.current = child.quaternion.clone();
            } else if (boneName === 'BODY') {
              bodyBoneRef.current = child;
              bodyOriginalRotation.current = child.quaternion.clone();
            }
          }
        });

        hasFramed.current = true;
        onLoaded(box);
      } catch (err) {
        onError(
          err instanceof Error ? err : new Error('Failed to process model')
        );
      }
    }
  }, [scene, camera, onLoaded, onError]);

  // Animation loop for all behaviors
  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();

    // Initialize shake start time on first frame
    if (shakeStartTime.current === null && hasFramed.current) {
      shakeStartTime.current = time;
    }

    // Initialize emotion start time
    if (emotionStartTimeRef.current === -1) {
      emotionStartTimeRef.current = time;
      happySpinProgress.current = 0;
    }

    // Get current emotion config
    const emotion = currentEmotionRef.current;
    const config = EMOTION_CONFIGS[emotion];
    const emotionElapsed = time - emotionStartTimeRef.current;

    // Check if emotion should expire back to idle
    if (
      emotion !== 'idle' &&
      emotionDurationRef.current > 0 &&
      emotionElapsed > emotionDurationRef.current
    ) {
      currentEmotionRef.current = 'idle';
      emotionStartTimeRef.current = time;
    }

    // === ENTRANCE SHAKE ANIMATION ===
    if (
      sceneRef.current &&
      originalRotation.current &&
      shakeStartTime.current !== null
    ) {
      const shakeElapsed = time - shakeStartTime.current;
      const shakeDuration = 0.8;

      if (shakeElapsed < shakeDuration) {
        const progress = shakeElapsed / shakeDuration;
        const damping = Math.pow(1 - progress, 2);
        const angle = Math.sin(progress * Math.PI * 6) * 0.12 * damping;

        sceneRef.current.rotation.z = originalRotation.current.z + angle;
        sceneRef.current.rotation.x = originalRotation.current.x + angle * 0.3;
      } else {
        // Apply emotion-specific animations after entrance shake
        let emotionRotZ = 0;
        let emotionRotX = 0;
        let emotionPosY = 0;

        // HAPPY: Spin around in a circle like a happy dog
        if (emotion === 'happy') {
          const spinDuration = 1.0;
          if (happySpinProgress.current < 1) {
            happySpinProgress.current = Math.min(
              emotionElapsed / spinDuration,
              1
            );
            const spinEase = 1 - Math.pow(1 - happySpinProgress.current, 3); // Ease out
            // Spin around Y axis (like chasing tail)
            sceneRef.current.rotation.y =
              originalRotation.current.y + spinEase * Math.PI * 2;
          }
        }

        // SAD: Droop down
        if (emotion === 'sad') {
          emotionRotX = Math.sin(time * config.bobSpeed) * 0.05 - 0.15; // Slight droop
          emotionPosY = config.bobAmount;
        }

        // CURIOUS: Tilt head
        if (emotion === 'curious') {
          emotionRotZ = Math.sin(time * 1.5) * 0.1; // Gentle head tilt
          emotionRotX = Math.sin(time * 2) * 0.05;
        }

        // EXCITED: Bounce up and down
        if (emotion === 'excited') {
          emotionPosY =
            Math.abs(Math.sin(time * config.bobSpeed)) * config.bobAmount;
        }

        sceneRef.current.rotation.z = originalRotation.current.z + emotionRotZ;
        sceneRef.current.rotation.x = originalRotation.current.x + emotionRotX;
        if (originalPosition.current) {
          sceneRef.current.position.y =
            originalPosition.current.y + emotionPosY;
        }
      }
    }

    // === EYE GLOW PULSING ANIMATION ===
    if (emissionMaterialRef.current) {
      const pulse =
        Math.sin(time * config.pulseSpeed) * config.pulseIntensity + 2.0;
      emissionMaterialRef.current.emissiveIntensity = pulse;

      // Smoothly transition ring color
      currentRingColor.current.lerp(config.ringColor, 0.08);
      emissionMaterialRef.current.emissive.copy(currentRingColor.current);
    }

    // === EYE TRACKING / RANDOM LOOK ===
    if (eyeBoneRef.current && eyeOriginalRotation.current) {
      let targetX: number;
      let targetY: number;

      if (webcamEnabledRef.current) {
        // Use webcam tracking target
        targetX = eyeTargetRef.current.x;
        targetY = eyeTargetRef.current.y;
      } else {
        // Random looking behavior (speed varies by emotion)
        const lookInterval = (2 + Math.random() * 2) / config.lookSpeed;
        if (time > nextRandomLookTime.current) {
          // SAD: Look down more
          if (emotion === 'sad') {
            randomLookTarget.current = {
              x: (Math.random() - 0.5) * 0.8,
              y: -0.3 - Math.random() * 0.3,
            };
          }
          // CURIOUS: Look around more widely
          else if (emotion === 'curious') {
            randomLookTarget.current = {
              x: (Math.random() - 0.5) * 1.5,
              y: (Math.random() - 0.5) * 1.2,
            };
          }
          // Default random look
          else {
            randomLookTarget.current = {
              x: (Math.random() - 0.5) * 1.2,
              y: (Math.random() - 0.5) * 0.8,
            };
          }
          nextRandomLookTime.current = time + lookInterval;
        }
        targetX = randomLookTarget.current.x;
        targetY = randomLookTarget.current.y;
      }

      // Smoothly interpolate current eye position toward target
      const smoothing = 0.08;
      currentEyeTarget.current.x +=
        (targetX - currentEyeTarget.current.x) * smoothing;
      currentEyeTarget.current.y +=
        (targetY - currentEyeTarget.current.y) * smoothing;

      // Apply rotation to eye bone (limited range)
      const maxAngle = 0.4;
      const rotX = -currentEyeTarget.current.y * maxAngle;
      const rotY = currentEyeTarget.current.x * maxAngle;

      // Create rotation quaternion and apply
      const lookRotation = new THREE.Quaternion();
      lookRotation.setFromEuler(new THREE.Euler(rotX, rotY, 0, 'XYZ'));
      eyeBoneRef.current.quaternion
        .copy(eyeOriginalRotation.current)
        .multiply(lookRotation);
    }
  });

  return <primitive object={scene} />;
}

// ============================================
// LIGHTING (moved way back, much softer to reduce eye glare)
// ============================================
function SceneLighting() {
  return (
    <>
      {/* Soft ambient - main source of light */}
      <ambientLight intensity={0.6} color="#ffffff" />
      {/* Key light - far back and to the side, very soft */}
      <directionalLight
        position={[15, 12, 20]}
        intensity={0.4}
        color="#ffffff"
      />
      {/* Fill light - opposite side, even softer */}
      <directionalLight
        position={[-12, 6, -8]}
        intensity={0.2}
        color="#e0e8f0"
      />
      {/* Subtle rim light from behind */}
      <directionalLight
        position={[0, 8, -15]}
        intensity={0.25}
        color="#ffffff"
      />
      {/* Hemisphere for natural ambient fill */}
      <hemisphereLight args={['#a0c4e8', '#404040', 0.35]} />
    </>
  );
}

// ============================================
// ORBIT CONTROLS
// ============================================
function CameraControls({ target }: { target: THREE.Vector3 }) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const controlsRef = useRef<any>(null);

  useFrame(() => {
    if (controlsRef.current) {
      controlsRef.current.update();
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      target={target}
      enablePan={false}
      minDistance={1}
      maxDistance={20}
      enableDamping
      dampingFactor={0.05}
    />
  );
}

// ============================================
// LOADING SPINNER
// ============================================
function LoadingSpinner() {
  return (
    <div className="companion-loading">
      <div className="spinner"></div>
    </div>
  );
}

// ============================================
// WEBCAM TRACKER
// ============================================
function WebcamTracker({
  enabled,
  onDisable,
}: {
  enabled: boolean;
  onDisable: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);

  useEffect(() => {
    if (!enabled) return;

    let stream: MediaStream | null = null;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let faceDetector: any = null;

    async function startTracking() {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 320, height: 240, facingMode: 'user' },
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }

        if ('FaceDetector' in window) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          faceDetector = new (window as any).FaceDetector({ fastMode: true });
        }

        webcamEnabledRef.current = true;

        const track = async () => {
          if (!videoRef.current || !enabled) return;

          const video = videoRef.current;

          if (faceDetector && video.readyState === 4) {
            try {
              const faces = await faceDetector.detect(video);
              if (faces.length > 0) {
                const face = faces[0].boundingBox;
                const centerX = face.x + face.width / 2;
                const centerY = face.y + face.height / 2;
                eyeTargetRef.current = {
                  x: -((centerX / video.videoWidth) * 2 - 1),
                  y: -((centerY / video.videoHeight) * 2 - 1),
                };
              }
            } catch {
              // FaceDetector failed
            }
          } else if (video.readyState === 4 && canvasRef.current) {
            const ctx = canvasRef.current.getContext('2d');
            if (ctx) {
              canvasRef.current.width = 80;
              canvasRef.current.height = 60;
              ctx.drawImage(video, 0, 0, 80, 60);
              const imageData = ctx.getImageData(0, 0, 80, 60);
              const data = imageData.data;

              let maxBrightness = 0;
              let brightX = 40;
              let brightY = 30;

              for (let y = 10; y < 50; y += 5) {
                for (let x = 10; x < 70; x += 5) {
                  const i = (y * 80 + x) * 4;
                  const brightness = (data[i] + data[i + 1] + data[i + 2]) / 3;
                  if (brightness > maxBrightness) {
                    maxBrightness = brightness;
                    brightX = x;
                    brightY = y;
                  }
                }
              }

              eyeTargetRef.current = {
                x: -((brightX / 80) * 2 - 1),
                y: -((brightY / 60) * 2 - 1),
              };
            }
          }

          animationRef.current = requestAnimationFrame(track);
        };

        track();
      } catch (err) {
        console.error('Failed to start webcam:', err);
        onDisable();
      }
    }

    startTracking();

    return () => {
      webcamEnabledRef.current = false;
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [enabled, onDisable]);

  if (!enabled) return null;

  return (
    <>
      <video
        ref={videoRef}
        style={{ position: 'absolute', opacity: 0, pointerEvents: 'none' }}
        playsInline
        muted
      />
      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </>
  );
}

// ============================================
// EMOTION BUTTONS
// ============================================
function EmotionButtons() {
  const emotions: { emotion: EmotionState; label: string; color: string }[] = [
    { emotion: 'happy', label: '😊', color: '#4ade80' },
    { emotion: 'curious', label: '🤔', color: '#fbbf24' },
    { emotion: 'sad', label: '😢', color: '#60a5fa' },
    { emotion: 'excited', label: '🤩', color: '#f472b6' },
  ];

  return (
    <div className="emotion-buttons">
      {emotions.map(({ emotion, label, color }) => (
        <button
          key={emotion}
          className="emotion-btn"
          onClick={() => triggerEmotion(emotion, 3.0)}
          title={`Trigger ${emotion}`}
          style={{ '--emotion-color': color } as React.CSSProperties}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

// ============================================
// MAIN VIEWER COMPONENT
// ============================================
function Viewer() {
  const [isLoading, setIsLoading] = useState(true);
  const [glbUrl, setGlbUrl] = useState<string | null>(null);
  const [orbitTarget, setOrbitTarget] = useState(new THREE.Vector3(0, 0, 0));
  const [hasError, setHasError] = useState(false);
  const [webcamEnabled, setWebcamEnabled] = useState(false);

  useEffect(() => {
    async function checkAssets() {
      for (const path of ASSET_PATHS.glb) {
        try {
          const response = await fetch(path, { method: 'HEAD' });
          if (response.ok) {
            setGlbUrl(path);
            return;
          }
        } catch {
          // Continue to next path
        }
      }
      setHasError(true);
      setIsLoading(false);
    }

    checkAssets();
  }, []);

  const handleModelLoaded = useCallback((bounds: THREE.Box3) => {
    const center = bounds.getCenter(new THREE.Vector3());
    setOrbitTarget(center);
    setIsLoading(false);
  }, []);

  const handleModelError = useCallback(() => {
    setHasError(true);
    setIsLoading(false);
  }, []);

  const handleDisableWebcam = useCallback(() => {
    setWebcamEnabled(false);
  }, []);

  const toggleWebcam = useCallback(() => {
    setWebcamEnabled((prev) => !prev);
  }, []);

  if (hasError) {
    return null;
  }

  if (!glbUrl) {
    return <LoadingSpinner />;
  }

  return (
    <div className="companion-container">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <SceneLighting />

        <Suspense fallback={null}>
          <TourGuideModel
            url={glbUrl}
            onLoaded={handleModelLoaded}
            onError={handleModelError}
          />
          <Environment
            preset="warehouse"
            background={false}
            environmentIntensity={0.4}
          />
        </Suspense>

        <CameraControls target={orbitTarget} />
      </Canvas>

      {isLoading && (
        <div className="companion-loading-overlay">
          <div className="spinner"></div>
        </div>
      )}

      {/* Emotion trigger buttons */}
      <EmotionButtons />

      {/* Webcam tracking toggle */}
      <button
        className={`webcam-toggle ${webcamEnabled ? 'active' : ''}`}
        onClick={toggleWebcam}
        title={
          webcamEnabled
            ? 'Disable eye tracking'
            : 'Enable eye tracking (uses webcam)'
        }
      >
        {webcamEnabled ? '👁️' : '👁️‍🗨️'}
      </button>

      <WebcamTracker enabled={webcamEnabled} onDisable={handleDisableWebcam} />
    </div>
  );
}

export default Viewer;
