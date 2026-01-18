"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { sdk } from "@farcaster/miniapp-sdk";
import { Button } from "~/components/ui/button";

type CaptureMode = "camera" | "microphone";

export function RequestCameraMicrophoneAction() {
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<string | undefined>(undefined);

  const [hasContext, setHasContext] = useState<boolean>(false);
  const [hasPermissions, setHasPermissions] = useState<boolean>(false);

  const [mode, setMode] = useState<CaptureMode>("camera");
  const [isCapturing, setIsCapturing] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>(undefined);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const rafRef = useRef<number | null>(null);
  const [micLevel, setMicLevel] = useState<number>(0);

  const isWebPlatformNote = useMemo(
    () =>
      "Camera and microphone access is not supported in web mini apps and will reject on web.",
    []
  );

  const stopAll = useCallback((): void => {
    // Stop any animation frames
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }

    // Disconnect audio
    try {
      analyserRef.current?.disconnect();
      analyserRef.current = null;
      audioContextRef.current?.close().catch(() => undefined);
    } catch {
      // ignore
    } finally {
      audioContextRef.current = null;
    }

    // Stop media tracks
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }

    // Clear video element
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setIsCapturing(false);
  }, []);

  const checkContext = useCallback(async (): Promise<void> => {
    try {
      const context = await sdk.context;
      const contextExists = !!context;
      const permissionsGranted = Boolean(
        context?.features?.cameraAndMicrophoneAccess
      );

      setHasContext(contextExists);
      setHasPermissions(permissionsGranted);
    } catch (err) {
      console.error("Context check error:", err);
      setHasContext(false);
      setHasPermissions(false);
    }
  }, []);

  const handleRequestAccess = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      setError(undefined);
      setResult(undefined);

      await sdk.actions.requestCameraAndMicrophoneAccess();
      setResult("Camera and microphone access granted!");

      await checkContext();
    } catch (err) {
      console.error("Request camera/microphone access error:", err);
      setError("Access denied or not supported.");
    } finally {
      setLoading(false);
    }
  }, [checkContext]);

  const startCapture = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      setError(undefined);
      setResult(undefined);

      if (mode === "camera") {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 640, height: 480 },
          audio: false,
        });

        streamRef.current = stream;

        if (videoRef.current) {
          videoRef.current.srcObject = stream;

          videoRef.current.onloadedmetadata = () => {
            if (videoRef.current) {
              videoRef.current.play();
            }
          };
        }
        
        setResult("Camera started successfully!");
      } else {
        // Microphone level meter via Web Audio API
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        audioContextRef.current = audioContext;
        
        const constraints: MediaStreamConstraints = { video: false, audio: true };
        const micStream = await navigator.mediaDevices.getUserMedia(constraints);
        streamRef.current = micStream;
        
        const source = audioContext.createMediaStreamSource(micStream);
        const analyser = audioContext.createAnalyser();
        analyser.fftSize = 2048;
        analyserRef.current = analyser;
        source.connect(analyser);

        const buffer = new Uint8Array(analyser.fftSize);
        const updateLevel = () => {
          if (!analyserRef.current) return;
          analyserRef.current.getByteTimeDomainData(buffer);
          // Compute RMS to a 0..100 scale
          let sumSquares = 0;
          for (let i = 0; i < buffer.length; i += 1) {
            const v = (buffer[i] - 128) / 128; // -1..1
            sumSquares += v * v;
          }
          const rms = Math.sqrt(sumSquares / buffer.length);
          const level = Math.min(100, Math.max(0, Math.round(rms * 140)));
          setMicLevel(level);
          rafRef.current = requestAnimationFrame(updateLevel);
        };
        rafRef.current = requestAnimationFrame(updateLevel);
        
        setResult("Microphone started successfully!");
      }

      setIsCapturing(true);
    } catch (err) {
      console.error("Start capture error:", err);
      setError("Failed to start capture. Check permissions and platform support.");
      stopAll();
    } finally {
      setLoading(false);
    }
  }, [mode, stopAll]);

  const stopCapture = useCallback((): void => {
    stopAll();
    setResult("Capture stopped.");
  }, [stopAll]);

  // Stop capture when mode changes to avoid mixed constraints
  useEffect(() => {
    if (isCapturing) {
      stopAll();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  // Cleanup on unmount
  useEffect(() => stopAll, [stopAll]);

  // Initial context check
  useEffect(() => {
    checkContext();
  }, [checkContext]);

  return (
    <div className="space-y-4">
      <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
        <pre className="font-mono text-xs text-emerald-500 dark:text-emerald-400">
          sdk.actions.requestCameraAndMicrophoneAccess()
        </pre>
      </div>

      <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
        <div className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-1">
          Permission Status
        </div>
        <div className="text-xs text-blue-700 dark:text-blue-300">
          {hasPermissions
            ? "Feature supported - permissions granted"
            : "Feature not supported or permissions not granted"}
        </div>
      </div>

      {/* Mode toggle */}
      <div className="grid grid-cols-2 gap-2">
        <Button
          className={
            mode === "camera"
              ? ""
              : "bg-gray-200 text-gray-900 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-700"
          }
          onClick={() => setMode("camera")}
          disabled={loading}
        >
          Camera
        </Button>
        <Button
          className={
            mode === "microphone"
              ? ""
              : "bg-gray-200 text-gray-900 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-700"
          }
          onClick={() => setMode("microphone")}
          disabled={loading}
        >
          Microphone
        </Button>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-2 gap-2">
        {hasContext && (
          <Button onClick={handleRequestAccess} disabled={loading}>
            {loading ? "Requesting..." : "Request Access"}
          </Button>
        )}
        {!isCapturing ? (
          <Button onClick={startCapture} disabled={loading || !hasPermissions}>
            {loading ? "Starting..." : `Start ${mode}`}
          </Button>
        ) : (
          <Button
            onClick={stopCapture}
            disabled={loading}
            className="bg-red-600 hover:bg-red-700 focus:ring-red-500"
          >
            Stop
          </Button>
        )}
      </div>

      {/* Live preview / meter */}
      {isCapturing && mode === "camera" && (
        <div style={{ width: "100%", height: "400px", backgroundColor: "black", borderRadius: "8px", overflow: "hidden" }}>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transform: "scaleX(-1)",
            }}
          />
        </div>
      )}

      {isCapturing && mode === "microphone" && (
        <div className="p-3 bg-gray-50 dark:bg-gray-900/30 rounded-lg border border-gray-200 dark:border-gray-800">
          <div className="text-xs mb-2 text-gray-700 dark:text-gray-300">Mic level</div>
          <div className="w-full h-3 bg-gray-200 dark:bg-gray-800 rounded">
            <div
              className="h-3 bg-emerald-500 rounded transition-[width] duration-75"
              style={{ width: `${micLevel}%` }}
            />
          </div>
        </div>
      )}

      {/* Platform Support Info */}
      <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
        <div className="text-sm font-medium text-yellow-900 dark:text-yellow-100 mb-2">
          Platform Support
        </div>
        <div className="text-xs text-yellow-700 dark:text-yellow-300 space-y-1">
          <div>• iOS: ✅ Full support</div>
          <div>• Android: ✅ Supported</div>
          <div>• Web: ❌ Not supported</div>
          <div className="mt-1 opacity-80">{isWebPlatformNote}</div>
        </div>
      </div>

      {/* Messages */}
      {error && (
        <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
          <div className="text-sm font-medium text-red-900 dark:text-red-100 mb-1">Error</div>
          <div className="text-xs text-red-700 dark:text-red-300 whitespace-pre-wrap">{error}</div>
        </div>
      )}

      {result && !loading && (
        <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
          <div className="text-sm font-medium text-green-900 dark:text-green-100 mb-1">Success</div>
          <div className="text-xs text-green-700 dark:text-green-300 whitespace-pre-wrap">{result}</div>
        </div>
      )}
    </div>
  );
}