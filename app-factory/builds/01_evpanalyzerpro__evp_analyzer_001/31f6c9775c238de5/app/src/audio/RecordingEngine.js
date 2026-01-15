// Audio Recording Engine for EVP Analyzer Pro
// Handles professional audio recording with real-time analysis

import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import { Platform } from 'react-native';

export class RecordingEngine {
  constructor(options = {}) {
    this.recording = null;
    this.isRecording = false;
    this.isPaused = false;
    this.startTime = null;
    this.pausedDuration = 0;
    this.options = {
      sampleRate: options.sampleRate || 44100,
      bitDepth: options.bitDepth || 16,
      channels: options.channels || 1,
      quality: options.quality || Audio.RECORDING_OPTION_IOS_AUDIO_QUALITY_HIGH,
      ...options
    };
    this.listeners = {
      onStatusUpdate: null,
      onAnomalyDetected: null,
      onError: null
    };
  }

  async initialize() {
    try {
      // Request audio permissions
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== 'granted') {
        throw new Error('Audio recording permission not granted');
      }

      // Configure audio session
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
        staysActiveInBackground: false,
      });

      console.log('RecordingEngine initialized successfully');
    } catch (error) {
      console.error('Failed to initialize recording engine:', error);
      throw error;
    }
  }

  getRecordingOptions() {
    if (Platform.OS === 'ios') {
      return {
        android: {
          extension: '.wav',
          outputFormat: Audio.RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_DEFAULT,
          audioEncoder: Audio.RECORDING_OPTION_ANDROID_AUDIO_ENCODER_DEFAULT,
          sampleRate: this.options.sampleRate,
          numberOfChannels: this.options.channels,
          bitRate: this.options.bitDepth * this.options.sampleRate * this.options.channels,
        },
        ios: {
          extension: '.wav',
          outputFormat: Audio.RECORDING_OPTION_IOS_OUTPUT_FORMAT_LINEARPCM,
          audioQuality: this.options.quality,
          sampleRate: this.options.sampleRate,
          numberOfChannels: this.options.channels,
          bitRate: this.options.bitDepth * this.options.sampleRate * this.options.channels,
          linearPCMBitDepth: this.options.bitDepth,
          linearPCMIsBigEndian: false,
          linearPCMIsFloat: false,
        },
      };
    } else {
      return {
        android: {
          extension: '.wav',
          outputFormat: Audio.RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_DEFAULT,
          audioEncoder: Audio.RECORDING_OPTION_ANDROID_AUDIO_ENCODER_DEFAULT,
          sampleRate: this.options.sampleRate,
          numberOfChannels: this.options.channels,
          bitRate: this.options.bitDepth * this.options.sampleRate * this.options.channels,
        },
        ios: {
          extension: '.wav',
          audioQuality: Audio.RECORDING_OPTION_IOS_AUDIO_QUALITY_HIGH,
          sampleRate: this.options.sampleRate,
          numberOfChannels: this.options.channels,
        },
      };
    }
  }

  async startRecording() {
    try {
      if (this.isRecording) {
        throw new Error('Recording already in progress');
      }

      console.log('Starting recording with options:', this.options);

      this.recording = new Audio.Recording();
      await this.recording.prepareToRecordAsync(this.getRecordingOptions());
      
      // Set up status listener for real-time monitoring
      this.recording.setOnRecordingStatusUpdate((status) => {
        this.handleStatusUpdate(status);
      });

      await this.recording.startAsync();
      
      this.isRecording = true;
      this.isPaused = false;
      this.startTime = Date.now();
      this.pausedDuration = 0;

      console.log('Recording started successfully');
      return { success: true };
    } catch (error) {
      console.error('Failed to start recording:', error);
      this.listeners.onError?.(error);
      return { success: false, error: error.message };
    }
  }

  async pauseRecording() {
    try {
      if (!this.isRecording || this.isPaused) {
        return { success: false, error: 'No active recording to pause' };
      }

      await this.recording.pauseAsync();
      this.isPaused = true;

      console.log('Recording paused');
      return { success: true };
    } catch (error) {
      console.error('Failed to pause recording:', error);
      return { success: false, error: error.message };
    }
  }

  async resumeRecording() {
    try {
      if (!this.isRecording || !this.isPaused) {
        return { success: false, error: 'No paused recording to resume' };
      }

      await this.recording.startAsync();
      this.isPaused = false;

      console.log('Recording resumed');
      return { success: true };
    } catch (error) {
      console.error('Failed to resume recording:', error);
      return { success: false, error: error.message };
    }
  }

  async stopRecording() {
    try {
      if (!this.isRecording) {
        return { success: false, error: 'No recording in progress' };
      }

      console.log('Stopping recording...');
      
      await this.recording.stopAndUnloadAsync();
      const uri = this.recording.getURI();
      const status = await this.recording.getStatusAsync();

      // Get file info
      const fileInfo = await FileSystem.getInfoAsync(uri);
      
      // Calculate final duration
      const endTime = Date.now();
      const totalDuration = endTime - this.startTime - this.pausedDuration;

      const result = {
        uri,
        duration: totalDuration,
        size: fileInfo.size,
        sampleRate: this.options.sampleRate,
        bitDepth: this.options.bitDepth,
        channels: this.options.channels,
        success: true
      };

      // Clean up
      this.recording = null;
      this.isRecording = false;
      this.isPaused = false;
      this.startTime = null;
      this.pausedDuration = 0;

      console.log('Recording stopped successfully:', result);
      return result;
    } catch (error) {
      console.error('Failed to stop recording:', error);
      return { success: false, error: error.message };
    }
  }

  handleStatusUpdate(status) {
    if (!status) return;

    // Calculate current duration accounting for pauses
    const currentTime = Date.now();
    let currentDuration = 0;
    
    if (this.startTime) {
      if (this.isPaused) {
        currentDuration = status.durationMillis || 0;
      } else {
        currentDuration = currentTime - this.startTime - this.pausedDuration;
      }
    }

    const statusInfo = {
      isRecording: status.isRecording,
      isDoneRecording: status.isDoneRecording,
      duration: currentDuration,
      metering: status.metering || -160, // dB level
      canRecord: status.canRecord,
    };

    // Real-time anomaly detection based on audio levels
    this.performAnomalyDetection(statusInfo);

    // Notify listeners
    this.listeners.onStatusUpdate?.(statusInfo);
  }

  performAnomalyDetection(status) {
    // Simple spike detection based on metering levels
    // In a production app, this would be more sophisticated
    const threshold = -30; // dB threshold for anomaly detection
    const previousLevel = this.lastMeteringLevel || -160;
    const currentLevel = status.metering;
    
    // Detect sudden spikes in audio level
    if (currentLevel > threshold && (currentLevel - previousLevel) > 10) {
      const anomaly = {
        timestamp: status.duration,
        type: 'amplitude_spike',
        confidence: Math.min((currentLevel - threshold) / 20, 1),
        amplitude: currentLevel,
        description: 'Sudden increase in audio amplitude detected'
      };

      console.log('Anomaly detected:', anomaly);
      this.listeners.onAnomalyDetected?.(anomaly);
    }

    this.lastMeteringLevel = currentLevel;
  }

  // Event listeners
  setOnStatusUpdate(callback) {
    this.listeners.onStatusUpdate = callback;
  }

  setOnAnomalyDetected(callback) {
    this.listeners.onAnomalyDetected = callback;
  }

  setOnError(callback) {
    this.listeners.onError = callback;
  }

  // Utility methods
  getCurrentDuration() {
    if (!this.startTime) return 0;
    
    const currentTime = Date.now();
    return currentTime - this.startTime - this.pausedDuration;
  }

  getStatus() {
    return {
      isRecording: this.isRecording,
      isPaused: this.isPaused,
      duration: this.getCurrentDuration()
    };
  }

  async cleanup() {
    try {
      if (this.recording) {
        await this.recording.stopAndUnloadAsync();
        this.recording = null;
      }
      
      this.isRecording = false;
      this.isPaused = false;
      this.startTime = null;
      this.pausedDuration = 0;
      this.listeners = {};
      
      console.log('RecordingEngine cleaned up');
    } catch (error) {
      console.error('Error during cleanup:', error);
    }
  }
}

export default RecordingEngine;