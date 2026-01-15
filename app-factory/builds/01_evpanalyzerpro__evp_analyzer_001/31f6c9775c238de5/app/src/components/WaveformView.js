// Waveform visualization component for real-time audio monitoring
// Shows live audio levels and anomaly detection markers

import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Svg, { Line, Circle, Rect } from 'react-native-svg';

const { width: screenWidth } = Dimensions.get('window');

const WaveformView = ({ 
  audioLevel, 
  isRecording, 
  anomalies = [], 
  duration, 
  colors 
}) => {
  const [waveformData, setWaveformData] = useState([]);
  const intervalRef = useRef(null);
  const maxPoints = Math.floor(screenWidth / 4); // Sample every 4 pixels

  useEffect(() => {
    if (isRecording) {
      // Start collecting waveform data
      intervalRef.current = setInterval(() => {
        collectWaveformSample();
      }, 100); // Collect sample every 100ms
    } else {
      // Stop collecting data
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRecording]);

  const collectWaveformSample = () => {
    const normalizedLevel = normalizeAudioLevel(audioLevel);
    
    setWaveformData(prevData => {
      const newData = [...prevData, normalizedLevel];
      
      // Keep only the last maxPoints samples
      if (newData.length > maxPoints) {
        return newData.slice(-maxPoints);
      }
      
      return newData;
    });
  };

  const normalizeAudioLevel = (level) => {
    // Convert dB level (-160 to 0) to normalized value (0 to 1)
    const minDb = -60; // Noise floor
    const maxDb = 0;   // Maximum level
    
    const clampedLevel = Math.max(minDb, Math.min(maxDb, level));
    return (clampedLevel - minDb) / (maxDb - minDb);
  };

  const renderWaveform = () => {
    if (waveformData.length < 2) {
      return null;
    }

    const waveformHeight = 120;
    const waveformWidth = screenWidth - 32;
    const centerY = waveformHeight / 2;
    const maxAmplitude = waveformHeight * 0.4;

    return waveformData.map((level, index) => {
      const x = (index / (maxPoints - 1)) * waveformWidth;
      const amplitude = level * maxAmplitude;
      
      return (
        <Line
          key={index}
          x1={x}
          y1={centerY - amplitude}
          x2={x}
          y2={centerY + amplitude}
          stroke={colors.audio.waveform.normal}
          strokeWidth={2}
          opacity={0.8}
        />
      );
    });
  };

  const renderAnomalyMarkers = () => {
    const waveformWidth = screenWidth - 32;
    const waveformHeight = 120;
    
    return anomalies.map((anomaly, index) => {
      // Calculate position based on timestamp
      const durationSeconds = duration / 1000;
      const anomalySeconds = anomaly.timestamp / 1000;
      const relativePosition = durationSeconds > 0 ? anomalySeconds / durationSeconds : 0;
      const x = relativePosition * waveformWidth;
      
      return (
        <Circle
          key={anomaly.id || index}
          cx={x}
          cy={waveformHeight / 2}
          r={4}
          fill={colors.audio.waveform.anomaly}
          stroke={colors.audio.waveform.anomaly}
          strokeWidth={2}
          opacity={0.9}
        />
      );
    });
  };

  const renderGrid = () => {
    const waveformHeight = 120;
    const waveformWidth = screenWidth - 32;
    const gridLines = [];

    // Horizontal center line
    gridLines.push(
      <Line
        key="center"
        x1={0}
        y1={waveformHeight / 2}
        x2={waveformWidth}
        y2={waveformHeight / 2}
        stroke={colors.audio.waveform.grid}
        strokeWidth={1}
        opacity={0.3}
      />
    );

    // Vertical time markers (every 10 seconds if duration > 30 seconds)
    if (duration > 30000) {
      const interval = 10000; // 10 seconds
      const numMarkers = Math.floor(duration / interval);
      
      for (let i = 1; i <= numMarkers; i++) {
        const markerTime = i * interval;
        const x = (markerTime / duration) * waveformWidth;
        
        gridLines.push(
          <Line
            key={`marker-${i}`}
            x1={x}
            y1={0}
            x2={x}
            y2={waveformHeight}
            stroke={colors.audio.waveform.grid}
            strokeWidth={1}
            opacity={0.2}
          />
        );
      }
    }

    return gridLines;
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      backgroundColor: colors.audio.waveform.background,
      borderRadius: 8,
      padding: 16,
      margin: 16,
    },
    emptyState: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    emptyText: {
      color: colors.text.tertiary,
      fontSize: 16,
    },
    currentLevel: {
      position: 'absolute',
      top: 8,
      right: 8,
      backgroundColor: colors.background.secondary,
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 4,
    },
    levelText: {
      color: colors.text.secondary,
      fontSize: 12,
      fontFamily: 'monospace',
    },
  });

  if (!isRecording && waveformData.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>
            Audio visualization will appear here during recording
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Current audio level indicator */}
      <View style={styles.currentLevel}>
        <Text style={styles.levelText}>
          {audioLevel.toFixed(0)} dB
        </Text>
      </View>

      {/* Waveform SVG */}
      <Svg
        width={screenWidth - 64}
        height={120}
        style={{ alignSelf: 'center' }}
      >
        {/* Background grid */}
        {renderGrid()}
        
        {/* Waveform data */}
        {renderWaveform()}
        
        {/* Anomaly markers */}
        {renderAnomalyMarkers()}
        
        {/* Recording indicator pulse */}
        {isRecording && (
          <Circle
            cx={8}
            cy={8}
            r={4}
            fill={colors.session.recording}
            opacity={0.8}
          >
            {/* Simple pulse animation would require react-native-reanimated */}
          </Circle>
        )}
      </Svg>
    </View>
  );
};

export default WaveformView;