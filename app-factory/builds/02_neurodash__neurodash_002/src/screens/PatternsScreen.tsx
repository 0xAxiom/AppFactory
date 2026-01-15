import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, Modal } from 'react-native';
import { Card, Button } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { LineChart } from 'react-native-chart-kit';
import { useEnergy } from '../context/EnergyContext';
import { useTasks } from '../context/TaskContext';
import { useSubscription } from '../context/SubscriptionContext';
import PaywallScreen from './PaywallScreen';
import { getWeeklyInsights } from '../services/patternAnalysis';
import { getTaskCompletionStats } from '../services/taskRecommendations';
import { getEnergyNumeric, getEnergyFromNumeric, getRelativeTime } from '../utils/helpers';
import { format, subDays, startOfWeek, endOfWeek } from 'date-fns';

const screenWidth = Dimensions.get('window').width;

export default function PatternsScreen() {
  const { energyHistory, patterns } = useEnergy();
  const { tasks } = useTasks();
  const { isSubscribed } = useSubscription();
  const [showPaywall, setShowPaywall] = useState(false);
  
  const weeklyInsights = getWeeklyInsights(energyHistory);
  const taskStats = getTaskCompletionStats(tasks);

  const requiresSubscription = (feature: string) => {
    if (!isSubscribed) {
      setShowPaywall(true);
      return true;
    }
    return false;
  };
  
  const renderEnergyTrend = () => {
    const recentEntries = energyHistory.slice(0, 14).reverse(); // Last 14 entries
    
    if (recentEntries.length < 2) {
      return (
        <Card style={styles.card}>
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Energy Trend</Text>
            <View style={styles.noDataContainer}>
              <MaterialCommunityIcons name="chart-line" size={48} color="#6b7280" />
              <Text style={styles.noDataText}>Not enough data yet</Text>
              <Text style={styles.noDataSubtext}>Check in with your energy a few more times to see patterns</Text>
            </View>
          </View>
        </Card>
      );
    }
    
    const chartData = {
      labels: recentEntries.map((_, index) => 
        index % 3 === 0 ? format(recentEntries[index].timestamp, 'MM/dd') : ''
      ),
      datasets: [{
        data: recentEntries.map(entry => getEnergyNumeric(entry.level)),
        strokeWidth: 3,
        color: (opacity = 1) => `rgba(96, 165, 250, ${opacity})`,
      }],
    };
    
    return (
      <Card style={styles.card}>
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>Energy Trend</Text>
          <Text style={styles.cardSubtitle}>Your energy levels over the past two weeks</Text>
          
          <LineChart
            data={chartData}
            width={screenWidth - 80}
            height={200}
            chartConfig={{
              backgroundColor: '#1f2937',
              backgroundGradientFrom: '#1f2937',
              backgroundGradientTo: '#374151',
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(229, 229, 229, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(156, 163, 175, ${opacity})`,
              style: { borderRadius: 16 },
              propsForDots: {
                r: '4',
                strokeWidth: '2',
                stroke: '#60a5fa',
                fill: '#1f2937',
              },
            }}
            bezier
            style={styles.chart}
          />
          
          <View style={styles.legendContainer}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#3b82f6' }]} />
              <Text style={styles.legendText}>Low (1)</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#f59e0b' }]} />
              <Text style={styles.legendText}>Medium (2)</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#10b981' }]} />
              <Text style={styles.legendText}>High (3)</Text>
            </View>
          </View>
        </View>
      </Card>
    );
  };
  
  const renderInsights = () => (
    <Card style={styles.card}>
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>Weekly Insights</Text>
        
        <View style={styles.insightGrid}>
          <View style={styles.insightItem}>
            <MaterialCommunityIcons name="trending-up" size={24} color="#10b981" />
            <Text style={styles.insightValue}>
              {getEnergyFromNumeric(weeklyInsights.averageEnergy).charAt(0).toUpperCase() + 
               getEnergyFromNumeric(weeklyInsights.averageEnergy).slice(1)}
            </Text>
            <Text style={styles.insightLabel}>Average Energy</Text>
          </View>
          
          <View style={styles.insightItem}>
            <MaterialCommunityIcons name="chart-areaspline" size={24} color="#60a5fa" />
            <Text style={styles.insightValue}>
              {Math.round(weeklyInsights.consistencyScore * 100)}%
            </Text>
            <Text style={styles.insightLabel}>Consistency</Text>
          </View>
          
          <View style={styles.insightItem}>
            <MaterialCommunityIcons name="calendar-check" size={24} color="#f59e0b" />
            <Text style={styles.insightValue}>
              {weeklyInsights.highEnergyDays.length}
            </Text>
            <Text style={styles.insightLabel}>High Energy Days</Text>
          </View>
        </View>
        
        {weeklyInsights.highEnergyDays.length > 0 && (
          <View style={styles.insightDetail}>
            <Text style={styles.insightDetailTitle}>Your best days:</Text>
            <Text style={styles.insightDetailText}>
              {weeklyInsights.highEnergyDays.map(day => {
                const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                return dayNames[day];
              }).join(', ')}
            </Text>
          </View>
        )}
        
        {weeklyInsights.lowEnergyTimes.length > 0 && (
          <View style={styles.insightDetail}>
            <Text style={styles.insightDetailTitle}>Low energy times to protect:</Text>
            <Text style={styles.insightDetailText}>
              {weeklyInsights.lowEnergyTimes.slice(0, 3).map(time => {
                const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                const hour = time.hour === 0 ? '12am' : time.hour <= 12 ? `${time.hour}am` : `${time.hour - 12}pm`;
                return `${dayNames[time.day]} ${hour}`;
              }).join(', ')}
            </Text>
          </View>
        )}
      </View>
    </Card>
  );
  
  const renderTaskStats = () => (
    <Card style={styles.card}>
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>Task Performance</Text>
        
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <View style={styles.statHeader}>
              <MaterialCommunityIcons name="check-circle" size={20} color="#10b981" />
              <Text style={styles.statValue}>{Math.round(taskStats.completionRate)}%</Text>
            </View>
            <Text style={styles.statLabel}>Completion Rate</Text>
          </View>
          
          <View style={styles.statItem}>
            <View style={styles.statHeader}>
              <MaterialCommunityIcons name="heart" size={20} color="#ef4444" />
              <Text style={styles.statValue}>{taskStats.averageEffort.toFixed(1)}</Text>
            </View>
            <Text style={styles.statLabel}>Avg Effort (1-10)</Text>
          </View>
          
          <View style={styles.statItem}>
            <View style={styles.statHeader}>
              <MaterialCommunityIcons name="calendar-refresh" size={20} color="#f59e0b" />
              <Text style={styles.statValue}>{taskStats.averageRescheduled.toFixed(1)}</Text>
            </View>
            <Text style={styles.statLabel}>Avg Reschedules</Text>
          </View>
          
          <View style={styles.statItem}>
            <View style={styles.statHeader}>
              <MaterialCommunityIcons name="format-list-checks" size={20} color="#60a5fa" />
              <Text style={styles.statValue}>{taskStats.completedTasks}/{taskStats.totalTasks}</Text>
            </View>
            <Text style={styles.statLabel}>Tasks Done</Text>
          </View>
        </View>
      </View>
    </Card>
  );
  
  const renderOptimalTimes = () => {
    if (requiresSubscription('optimal-times')) {
      return (
        <Card style={styles.card}>
          <View style={styles.cardContent}>
            <View style={styles.premiumHeader}>
              <MaterialCommunityIcons name="star" size={24} color="#fbbf24" />
              <Text style={styles.premiumTitle}>Optimal Times for Complex Tasks</Text>
            </View>
            <Text style={styles.premiumDescription}>
              Discover your best times for challenging work based on your energy patterns
            </Text>
            <Button mode="contained" onPress={() => setShowPaywall(true)} style={styles.upgradeButton}>
              Unlock Advanced Analytics
            </Button>
          </View>
        </Card>
      );
    }

    if (patterns.length === 0) {
      return null;
    }
    
    const highEnergyPatterns = patterns
      .filter(p => p.averageEnergy > 2.5 && p.confidence > 0.3)
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, 3);
    
    if (highEnergyPatterns.length === 0) {
      return null;
    }
    
    return (
      <Card style={styles.card}>
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>Optimal Times for Complex Tasks</Text>
          <Text style={styles.cardSubtitle}>Based on your energy patterns</Text>
          
          {highEnergyPatterns.map((pattern, index) => {
            const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            const hour = pattern.hour === 0 ? '12:00 AM' : 
                        pattern.hour < 12 ? `${pattern.hour}:00 AM` : 
                        pattern.hour === 12 ? '12:00 PM' :
                        `${pattern.hour - 12}:00 PM`;
            
            return (
              <View key={index} style={styles.optimalTimeItem}>
                <MaterialCommunityIcons name="star" size={20} color="#fbbf24" />
                <View style={styles.optimalTimeText}>
                  <Text style={styles.optimalTimeDay}>{dayNames[pattern.dayOfWeek]}s at {hour}</Text>
                  <Text style={styles.optimalTimeConfidence}>
                    {Math.round(pattern.confidence * 100)}% confidence
                  </Text>
                </View>
              </View>
            );
          })}
        </View>
      </Card>
    );
  };
  
  const renderRecentActivity = () => {
    const recentEntries = energyHistory.slice(0, 5);
    
    if (recentEntries.length === 0) {
      return null;
    }
    
    return (
      <Card style={styles.card}>
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>Recent Energy Check-ins</Text>
          
          {recentEntries.map((entry, index) => (
            <View key={entry.id} style={styles.activityItem}>
              <MaterialCommunityIcons 
                name={entry.level === 'low' ? 'battery-low' : 
                     entry.level === 'medium' ? 'battery-medium' : 'battery-high'} 
                size={20} 
                color={entry.level === 'low' ? '#3b82f6' : 
                      entry.level === 'medium' ? '#f59e0b' : '#10b981'} 
              />
              <View style={styles.activityText}>
                <Text style={styles.activityLevel}>
                  {entry.level.charAt(0).toUpperCase() + entry.level.slice(1)} energy
                </Text>
                <Text style={styles.activityTime}>
                  {getRelativeTime(entry.timestamp)}
                  {entry.context && ` • ${entry.context}`}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </Card>
    );
  };
  
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {renderEnergyTrend()}
      {renderInsights()}
      {renderTaskStats()}
      {renderOptimalTimes()}
      {renderRecentActivity()}
      
      <Modal
        visible={showPaywall}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <PaywallScreen onClose={() => setShowPaywall(false)} />
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111827',
    padding: 16,
  },
  card: {
    backgroundColor: '#1f2937',
    marginBottom: 16,
  },
  cardContent: {
    padding: 20,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#e5e5e5',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#9ca3af',
    marginBottom: 16,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    marginTop: 12,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 12,
    color: '#9ca3af',
  },
  noDataContainer: {
    alignItems: 'center',
    padding: 32,
    gap: 8,
  },
  noDataText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#9ca3af',
  },
  noDataSubtext: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 20,
  },
  insightGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  insightItem: {
    alignItems: 'center',
    gap: 8,
  },
  insightValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#e5e5e5',
  },
  insightLabel: {
    fontSize: 12,
    color: '#9ca3af',
    textAlign: 'center',
  },
  insightDetail: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#374151',
    borderRadius: 8,
  },
  insightDetailTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#e5e5e5',
    marginBottom: 4,
  },
  insightDetailText: {
    fontSize: 14,
    color: '#d1d5db',
    lineHeight: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  statItem: {
    flex: 1,
    minWidth: '40%',
    alignItems: 'center',
    gap: 8,
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#e5e5e5',
  },
  statLabel: {
    fontSize: 12,
    color: '#9ca3af',
    textAlign: 'center',
  },
  optimalTimeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
    padding: 8,
  },
  optimalTimeText: {
    flex: 1,
  },
  optimalTimeDay: {
    fontSize: 14,
    fontWeight: '500',
    color: '#e5e5e5',
  },
  optimalTimeConfidence: {
    fontSize: 12,
    color: '#9ca3af',
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
    padding: 8,
  },
  activityText: {
    flex: 1,
  },
  activityLevel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#e5e5e5',
  },
  activityTime: {
    fontSize: 12,
    color: '#9ca3af',
  },
  premiumHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  premiumTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#e5e5e5',
    flex: 1,
  },
  premiumDescription: {
    fontSize: 14,
    color: '#9ca3af',
    lineHeight: 20,
    marginBottom: 20,
  },
  upgradeButton: {
    backgroundColor: '#fbbf24',
  },
});