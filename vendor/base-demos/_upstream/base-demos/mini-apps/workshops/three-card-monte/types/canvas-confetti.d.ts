declare module 'canvas-confetti' {
  interface ConfettiOptions {
    particleCount?: number;
    angle?: number;
    spread?: number;
    startVelocity?: number;
    decay?: number;
    gravity?: number;
    drift?: number;
    ticks?: number;
    origin?: {
      x?: number;
      y?: number;
    };
    colors?: string[];
    shapes?: string[];
    scalar?: number;
    zIndex?: number;
    disableForReducedMotion?: boolean;
  }

  type ConfettiCannon = (options?: ConfettiOptions) => Promise<{ reset: () => void }>;
  
  const confetti: ConfettiCannon & {
    reset: () => void;
    create: (canvas: HTMLCanvasElement, options?: { resize?: boolean, useWorker?: boolean }) => ConfettiCannon;
  };
  
  export default confetti;
} 