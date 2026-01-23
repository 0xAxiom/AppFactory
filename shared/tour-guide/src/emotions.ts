import * as THREE from 'three';

/**
 * Available emotion states for the Tour Guide mascot
 */
export type EmotionState = 'idle' | 'happy' | 'curious' | 'sad' | 'excited';

/**
 * Configuration for each emotion's visual and animation properties
 */
export interface EmotionConfig {
  /** Color of the glowing eye ring */
  ringColor: THREE.Color;
  /** Speed of the glow pulsing animation */
  pulseSpeed: number;
  /** Intensity multiplier for the glow pulse */
  pulseIntensity: number;
  /** Speed of vertical bobbing movement */
  bobSpeed: number;
  /** Amount of vertical offset for bobbing */
  bobAmount: number;
  /** Speed multiplier for eye look transitions */
  lookSpeed: number;
}

/**
 * Emotion configuration presets
 */
export const EMOTION_CONFIGS: Record<EmotionState, EmotionConfig> = {
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

/**
 * Emotion button configuration for UI
 */
export const EMOTION_BUTTONS = [
  { emotion: 'happy' as EmotionState, label: '😊', color: '#4ade80' },
  { emotion: 'curious' as EmotionState, label: '🤔', color: '#fbbf24' },
  { emotion: 'sad' as EmotionState, label: '😢', color: '#60a5fa' },
  { emotion: 'excited' as EmotionState, label: '🤩', color: '#f472b6' },
];

/**
 * Default emotion durations in seconds
 */
export const EMOTION_DURATIONS: Record<EmotionState, number> = {
  idle: Infinity,
  happy: 3.0,
  curious: 4.0,
  sad: 5.0,
  excited: 3.0,
};
