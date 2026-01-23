import { Suspense, useState, useEffect, useRef, useCallback } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment } from '@react-three/drei';
import * as THREE from 'three';
import { EmotionState, EMOTION_CONFIGS, EMOTION_BUTTONS } from './emotions';

// ============================================
// TYPES
// ============================================
export interface TourGuideProps {
  /** Path to the GLB model file */
  modelPath?: string;
  /** Enable webcam eye tracking */
  enableWebcam?: boolean;
  /** Show emotion trigger buttons */
  showEmotionButtons?: boolean;
  /** Show webcam toggle button */
  showWebcamToggle?: boolean;
  /** Background color (CSS value) */
  backgroundColor?: string;
  /** Initial emotion state */
  initialEmotion?: EmotionState;
  /** Callback when emotion changes */
  onEmotionChange?: (emotion: EmotionState) => void;
  /** Custom class name */
  className?: string;
}

interface EyeTarget {
  x: number; // -1 to 1 (left to right)
  y: number; // -1 to 1 (down to up)
}

// ============================================
// SHARED REFS (for cross-component communication)
// ============================================
const currentEmotionRef = { current: 'idle' as EmotionState };
const emotionStartTimeRef = { current: 0 };
const emotionDurationRef = { current: 0 };
const eyeTargetRef = { current: { x: 0, y: 0 } as EyeTarget };
const webcamEnabledRef = { current: false };

/**
 * Trigger an emotion from outside the component
 */
export function triggerEmotion(emotion: EmotionState, duration: number = 3.0) {
  currentEmotionRef.current = emotion;
  emotionStartTimeRef.current = -1;
  emotionDurationRef.current = duration;
}

// ============================================
// THREE.JS MODEL COMPONENT
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
  const sceneRef = useRef<THREE.Group | null>(null);
  const shakeStartTime = useRef<number | null>(null);
  const originalRotation = useRef<THREE.Euler | null>(null);
  const originalPosition = useRef<THREE.Vector3 | null>(null);

  // Eye tracking refs
  const eyeBoneRef = useRef<THREE.Bone | null>(null);
  const eyeOriginalRotation = useRef<THREE.Quaternion | null>(null);
  const currentEyeTarget = useRef<EyeTarget>({ x: 0, y: 0 });
  const randomLookTarget = useRef<EyeTarget>({ x: 0, y: 0 });
  const nextRandomLookTime = useRef<number>(0);

  // Emotion animation refs
  const happySpinProgress = useRef<number>(0);
  const currentRingColor = useRef<THREE.Color>(
    EMOTION_CONFIGS.idle.ringColor.clone()
  );

  // Setup on load
  useEffect(() => {
    if (scene && !hasFramed.current) {
      try {
        const box = new THREE.Box3().setFromObject(scene);
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());

        // Position camera directly in front
        const maxDim = Math.max(size.x, size.y, size.z);
        const fov = (camera as THREE.PerspectiveCamera).fov * (Math.PI / 180);
        const cameraDistance = (maxDim / (2 * Math.tan(fov / 2))) * 1.8;

        camera.position.set(
          center.x,
          center.y + cameraDistance * 0.1,
          center.z + cameraDistance
        );
        camera.lookAt(center);
        camera.updateProjectionMatrix();

        sceneRef.current = scene;
        originalRotation.current = scene.rotation.clone();
        originalPosition.current = scene.position.clone();

        // Find materials and bones
        scene.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            const materials = Array.isArray(child.material)
              ? child.material
              : [child.material];
            for (const mat of materials) {
              if (mat instanceof THREE.MeshStandardMaterial) {
                if (mat.emissive && mat.emissiveIntensity > 0) {
                  emissionMaterialRef.current = mat;
                } else if (
                  !mat.name?.toLowerCase().includes('eye') &&
                  !(mat.color?.getHex() < 0x333333)
                ) {
                  // Weathered body material
                  mat.roughness = 0.7;
                  mat.metalness = 0.1;
                  mat.envMapIntensity = 0.25;
                  if (mat.color) {
                    mat.color.offsetHSL(0.02, -0.05, -0.08);
                  }
                  mat.needsUpdate = true;
                }
              }
            }
          }

          if (child instanceof THREE.Bone) {
            const boneName = child.name.toUpperCase();
            if (boneName === 'EYE') {
              eyeBoneRef.current = child;
              eyeOriginalRotation.current = child.quaternion.clone();
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

  // Animation loop
  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();

    if (shakeStartTime.current === null && hasFramed.current) {
      shakeStartTime.current = time;
    }

    if (emotionStartTimeRef.current === -1) {
      emotionStartTimeRef.current = time;
      happySpinProgress.current = 0;
    }

    const emotion = currentEmotionRef.current;
    const config = EMOTION_CONFIGS[emotion];
    const emotionElapsed = time - emotionStartTimeRef.current;

    // Expire emotion back to idle
    if (
      emotion !== 'idle' &&
      emotionDurationRef.current > 0 &&
      emotionElapsed > emotionDurationRef.current
    ) {
      currentEmotionRef.current = 'idle';
      emotionStartTimeRef.current = time;
    }

    // Entrance shake
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
        // Emotion-specific animations
        let emotionRotZ = 0;
        let emotionRotX = 0;
        let emotionPosY = 0;

        if (emotion === 'happy') {
          const spinDuration = 1.0;
          if (happySpinProgress.current < 1) {
            happySpinProgress.current = Math.min(
              emotionElapsed / spinDuration,
              1
            );
            const spinEase = 1 - Math.pow(1 - happySpinProgress.current, 3);
            sceneRef.current.rotation.y =
              originalRotation.current.y + spinEase * Math.PI * 2;
          }
        }

        if (emotion === 'sad') {
          emotionRotX = Math.sin(time * config.bobSpeed) * 0.05 - 0.15;
          emotionPosY = config.bobAmount;
        }

        if (emotion === 'curious') {
          emotionRotZ = Math.sin(time * 1.5) * 0.1;
          emotionRotX = Math.sin(time * 2) * 0.05;
        }

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

    // Eye glow pulsing
    if (emissionMaterialRef.current) {
      const pulse =
        Math.sin(time * config.pulseSpeed) * config.pulseIntensity + 2.0;
      emissionMaterialRef.current.emissiveIntensity = pulse;
      currentRingColor.current.lerp(config.ringColor, 0.08);
      emissionMaterialRef.current.emissive.copy(currentRingColor.current);
    }

    // Eye tracking / random look
    if (eyeBoneRef.current && eyeOriginalRotation.current) {
      let targetX: number;
      let targetY: number;

      if (webcamEnabledRef.current) {
        targetX = eyeTargetRef.current.x;
        targetY = eyeTargetRef.current.y;
      } else {
        const lookInterval = (2 + Math.random() * 2) / config.lookSpeed;
        if (time > nextRandomLookTime.current) {
          if (emotion === 'sad') {
            randomLookTarget.current = {
              x: (Math.random() - 0.5) * 0.8,
              y: -0.3 - Math.random() * 0.3,
            };
          } else if (emotion === 'curious') {
            randomLookTarget.current = {
              x: (Math.random() - 0.5) * 1.5,
              y: (Math.random() - 0.5) * 1.2,
            };
          } else {
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

      const smoothing = 0.08;
      currentEyeTarget.current.x +=
        (targetX - currentEyeTarget.current.x) * smoothing;
      currentEyeTarget.current.y +=
        (targetY - currentEyeTarget.current.y) * smoothing;

      const maxAngle = 0.4;
      const rotX = -currentEyeTarget.current.y * maxAngle;
      const rotY = currentEyeTarget.current.x * maxAngle;

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
// SCENE LIGHTING
// ============================================
function SceneLighting() {
  return (
    <>
      <ambientLight intensity={0.6} color="#ffffff" />
      <directionalLight
        position={[15, 12, 20]}
        intensity={0.4}
        color="#ffffff"
      />
      <directionalLight
        position={[-12, 6, -8]}
        intensity={0.2}
        color="#e0e8f0"
      />
      <directionalLight
        position={[0, 8, -15]}
        intensity={0.25}
        color="#ffffff"
      />
      <hemisphereLight args={['#a0c4e8', '#404040', 0.35]} />
    </>
  );
}

// ============================================
// CAMERA CONTROLS
// ============================================
function CameraControls({ target }: { target: THREE.Vector3 }) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const controlsRef = useRef<any>(null);

  useFrame(() => {
    controlsRef.current?.update();
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
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      if (stream) stream.getTracks().forEach((track) => track.stop());
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
  return (
    <div
      style={{
        position: 'absolute',
        bottom: 16,
        left: 16,
        display: 'flex',
        gap: 8,
        zIndex: 20,
      }}
    >
      {EMOTION_BUTTONS.map(({ emotion, label, color }) => (
        <button
          key={emotion}
          onClick={() => triggerEmotion(emotion, 3.0)}
          title={`Trigger ${emotion}`}
          style={{
            width: 40,
            height: 40,
            border: 'none',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.1)',
            fontSize: 20,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = color;
            e.currentTarget.style.transform = 'scale(1.15)';
            e.currentTarget.style.boxShadow = `0 0 16px ${color}`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

// ============================================
// MAIN TOUR GUIDE COMPONENT
// ============================================
export function TourGuide({
  modelPath = '/brand/mascot/tour-guide.glb',
  enableWebcam = false,
  showEmotionButtons = true,
  showWebcamToggle = true,
  backgroundColor = 'transparent',
  initialEmotion = 'idle',
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onEmotionChange,
  className,
}: TourGuideProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [glbUrl, setGlbUrl] = useState<string | null>(null);
  const [orbitTarget, setOrbitTarget] = useState(new THREE.Vector3(0, 0, 0));
  const [hasError, setHasError] = useState(false);
  const [webcamEnabled, setWebcamEnabled] = useState(enableWebcam);

  // Initialize emotion
  useEffect(() => {
    if (initialEmotion !== 'idle') {
      triggerEmotion(initialEmotion, Infinity);
    }
  }, [initialEmotion]);

  // Check model exists
  useEffect(() => {
    async function checkAsset() {
      const paths = [
        modelPath,
        '/assets/tour-guide.glb',
        '/source-assets/tour-guide.glb',
      ];
      for (const path of paths) {
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

    checkAsset();
  }, [modelPath]);

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

  if (hasError || !glbUrl) {
    return null;
  }

  return (
    <div
      className={className}
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        background: backgroundColor,
      }}
    >
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
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(0, 0, 0, 0.3)',
            pointerEvents: 'none',
            zIndex: 10,
          }}
        >
          <div
            style={{
              width: 32,
              height: 32,
              border: '2px solid rgba(255, 255, 255, 0.1)',
              borderTopColor: '#7b2ff7',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
            }}
          />
        </div>
      )}

      {showEmotionButtons && <EmotionButtons />}

      {showWebcamToggle && (
        <button
          onClick={toggleWebcam}
          title={
            webcamEnabled
              ? 'Disable eye tracking'
              : 'Enable eye tracking (uses webcam)'
          }
          style={{
            position: 'absolute',
            bottom: 16,
            right: 16,
            width: 40,
            height: 40,
            border: 'none',
            borderRadius: '50%',
            background: webcamEnabled
              ? 'rgba(123, 47, 247, 0.6)'
              : 'rgba(255, 255, 255, 0.1)',
            color: webcamEnabled ? 'white' : 'rgba(255, 255, 255, 0.6)',
            fontSize: 18,
            cursor: 'pointer',
            zIndex: 20,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s ease',
            boxShadow: webcamEnabled
              ? '0 0 12px rgba(123, 47, 247, 0.4)'
              : 'none',
          }}
        >
          {webcamEnabled ? '👁️' : '👁️‍🗨️'}
        </button>
      )}

      <WebcamTracker enabled={webcamEnabled} onDisable={handleDisableWebcam} />
    </div>
  );
}

export default TourGuide;
