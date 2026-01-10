import { EnergyEntry, EnergyPattern } from '../types';
import { getEnergyNumeric } from '../utils/helpers';

export function getPatternAnalysis(energyHistory: EnergyEntry[]): EnergyPattern[] {
  if (energyHistory.length < 7) {
    return []; // Need at least a week of data
  }

  const patterns: Map<string, { total: number; count: number; entries: EnergyEntry[] }> = new Map();

  // Group entries by day of week and hour
  energyHistory.forEach(entry => {
    const date = new Date(entry.timestamp);
    const dayOfWeek = date.getDay();
    const hour = date.getHours();
    const key = `${dayOfWeek}-${hour}`;

    if (!patterns.has(key)) {
      patterns.set(key, { total: 0, count: 0, entries: [] });
    }

    const pattern = patterns.get(key)!;
    pattern.total += getEnergyNumeric(entry.level);
    pattern.count += 1;
    pattern.entries.push(entry);
  });

  // Convert to EnergyPattern array
  const result: EnergyPattern[] = [];

  patterns.forEach((data, key) => {
    const [dayOfWeek, hour] = key.split('-').map(Number);
    const averageEnergy = data.total / data.count;
    
    // Calculate confidence based on number of data points and consistency
    const variance = data.entries.reduce((sum, entry) => {
      const energyNum = getEnergyNumeric(entry.level);
      return sum + Math.pow(energyNum - averageEnergy, 2);
    }, 0) / data.count;
    
    const consistency = Math.max(0, 1 - variance / 2); // Lower variance = higher consistency
    const dataConfidence = Math.min(1, data.count / 5); // More data points = higher confidence
    const confidence = consistency * dataConfidence;

    if (data.count >= 2) { // Only include patterns with at least 2 data points
      result.push({
        dayOfWeek,
        hour,
        averageEnergy,
        confidence,
      });
    }
  });

  return result.sort((a, b) => {
    // Sort by day of week, then by hour
    if (a.dayOfWeek !== b.dayOfWeek) {
      return a.dayOfWeek - b.dayOfWeek;
    }
    return a.hour - b.hour;
  });
}

export function getPredictedEnergy(
  patterns: EnergyPattern[],
  targetDate: Date
): { prediction: number; confidence: number } {
  const dayOfWeek = targetDate.getDay();
  const hour = targetDate.getHours();

  // Find exact match
  let bestPattern = patterns.find(p => p.dayOfWeek === dayOfWeek && p.hour === hour);

  if (!bestPattern) {
    // Find nearby time slots (within 2 hours)
    const nearbyPatterns = patterns.filter(p => 
      p.dayOfWeek === dayOfWeek && Math.abs(p.hour - hour) <= 2
    );

    if (nearbyPatterns.length > 0) {
      // Weight by proximity
      let weightedSum = 0;
      let totalWeight = 0;

      nearbyPatterns.forEach(pattern => {
        const hourDiff = Math.abs(pattern.hour - hour);
        const weight = pattern.confidence * (1 / (hourDiff + 1));
        weightedSum += pattern.averageEnergy * weight;
        totalWeight += weight;
      });

      return {
        prediction: weightedSum / totalWeight,
        confidence: totalWeight / nearbyPatterns.length,
      };
    }

    // Fallback to same day of week average
    const sameDayPatterns = patterns.filter(p => p.dayOfWeek === dayOfWeek);
    if (sameDayPatterns.length > 0) {
      const avgEnergy = sameDayPatterns.reduce((sum, p) => sum + p.averageEnergy, 0) / sameDayPatterns.length;
      const avgConfidence = sameDayPatterns.reduce((sum, p) => sum + p.confidence, 0) / sameDayPatterns.length;
      
      return {
        prediction: avgEnergy,
        confidence: avgConfidence * 0.5, // Lower confidence for broader average
      };
    }

    // No pattern data available
    return { prediction: 2, confidence: 0 }; // Default to medium energy
  }

  return {
    prediction: bestPattern.averageEnergy,
    confidence: bestPattern.confidence,
  };
}

export function getOptimalTimes(patterns: EnergyPattern[], energyLevel: number): EnergyPattern[] {
  return patterns
    .filter(pattern => 
      Math.abs(pattern.averageEnergy - energyLevel) <= 0.5 && 
      pattern.confidence >= 0.3
    )
    .sort((a, b) => b.confidence - a.confidence)
    .slice(0, 5); // Top 5 optimal times
}

export function getWeeklyInsights(energyHistory: EnergyEntry[]): {
  averageEnergy: number;
  highEnergyDays: number[];
  lowEnergyTimes: { day: number; hour: number }[];
  consistencyScore: number;
} {
  if (energyHistory.length === 0) {
    return {
      averageEnergy: 2,
      highEnergyDays: [],
      lowEnergyTimes: [],
      consistencyScore: 0,
    };
  }

  const totalEnergy = energyHistory.reduce((sum, entry) => sum + getEnergyNumeric(entry.level), 0);
  const averageEnergy = totalEnergy / energyHistory.length;

  // Find high energy days (day of week with average energy > 2.5)
  const dayAverages = new Map<number, number[]>();
  
  energyHistory.forEach(entry => {
    const dayOfWeek = new Date(entry.timestamp).getDay();
    if (!dayAverages.has(dayOfWeek)) {
      dayAverages.set(dayOfWeek, []);
    }
    dayAverages.get(dayOfWeek)!.push(getEnergyNumeric(entry.level));
  });

  const highEnergyDays: number[] = [];
  dayAverages.forEach((energyValues, day) => {
    const dayAverage = energyValues.reduce((sum, val) => sum + val, 0) / energyValues.length;
    if (dayAverage > 2.5) {
      highEnergyDays.push(day);
    }
  });

  // Find low energy times
  const patterns = getPatternAnalysis(energyHistory);
  const lowEnergyTimes = patterns
    .filter(p => p.averageEnergy < 1.5 && p.confidence > 0.3)
    .map(p => ({ day: p.dayOfWeek, hour: p.hour }))
    .slice(0, 5);

  // Calculate consistency score (lower variance = higher consistency)
  const variance = energyHistory.reduce((sum, entry) => {
    const energyNum = getEnergyNumeric(entry.level);
    return sum + Math.pow(energyNum - averageEnergy, 2);
  }, 0) / energyHistory.length;
  
  const consistencyScore = Math.max(0, Math.min(1, 1 - variance / 2));

  return {
    averageEnergy,
    highEnergyDays,
    lowEnergyTimes,
    consistencyScore,
  };
}