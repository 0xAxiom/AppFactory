import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Card, IconButton, Chip } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Task } from '../types';
import { formatDuration, getCognitiveLoadIcon, getEnergyColor, getEnergyLabel } from '../utils/helpers';

interface TaskCardProps {
  task: Task;
  onPress?: () => void;
  onComplete?: () => void;
  onReschedule?: () => void;
  showEnergyLevel?: boolean;
}

export default function TaskCard({ 
  task, 
  onPress, 
  onComplete, 
  onReschedule,
  showEnergyLevel = true 
}: TaskCardProps) {
  const energyColor = getEnergyColor(task.energyRequirement);
  const cognitiveIcon = getCognitiveLoadIcon(task.cognitiveLoad);
  
  return (
    <Card style={styles.container} mode="outlined">
      <TouchableOpacity onPress={onPress} style={styles.content}>
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Text style={styles.title} numberOfLines={1}>
              {task.title}
            </Text>
            {task.category && (
              <Text style={styles.category}>{task.category}</Text>
            )}
          </View>
          
          <View style={styles.indicators}>
            {showEnergyLevel && (
              <Chip 
                mode="outlined" 
                style={[styles.energyChip, { borderColor: energyColor }]}
                textStyle={{ color: energyColor, fontSize: 12 }}
              >
                {getEnergyLabel(task.energyRequirement)}
              </Chip>
            )}
            
            <View style={styles.metadata}>
              <MaterialCommunityIcons 
                name={cognitiveIcon} 
                size={16} 
                color="#9ca3af" 
              />
              <Text style={styles.duration}>
                {formatDuration(task.estimatedDuration)}
              </Text>
            </View>
          </View>
        </View>

        {task.description && (
          <Text style={styles.description} numberOfLines={2}>
            {task.description}
          </Text>
        )}

        <View style={styles.footer}>
          <View style={styles.statusIndicators}>
            {task.rescheduledCount > 0 && (
              <View style={styles.rescheduledBadge}>
                <MaterialCommunityIcons name="calendar-refresh" size={12} color="#f59e0b" />
                <Text style={styles.rescheduledText}>{task.rescheduledCount}</Text>
              </View>
            )}
            
            {task.dueDate && (
              <View style={styles.dueDateContainer}>
                <MaterialCommunityIcons name="clock-outline" size={12} color="#9ca3af" />
                <Text style={styles.dueDate}>
                  {new Date(task.dueDate).toLocaleDateString()}
                </Text>
              </View>
            )}
          </View>

          <View style={styles.actions}>
            {onReschedule && (
              <IconButton
                icon="calendar-refresh"
                size={20}
                iconColor="#f59e0b"
                onPress={onReschedule}
                style={styles.actionButton}
              />
            )}
            
            {onComplete && (
              <IconButton
                icon="check-circle"
                size={20}
                iconColor="#10b981"
                onPress={onComplete}
                style={styles.actionButton}
              />
            )}
          </View>
        </View>
      </TouchableOpacity>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 4,
    backgroundColor: '#1f2937',
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  titleContainer: {
    flex: 1,
    marginRight: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#e5e5e5',
    marginBottom: 2,
  },
  category: {
    fontSize: 12,
    color: '#9ca3af',
  },
  indicators: {
    alignItems: 'flex-end',
    gap: 8,
  },
  energyChip: {
    height: 24,
  },
  metadata: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  duration: {
    fontSize: 12,
    color: '#9ca3af',
  },
  description: {
    fontSize: 14,
    color: '#d1d5db',
    lineHeight: 20,
    marginBottom: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusIndicators: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  rescheduledBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#92400e',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  rescheduledText: {
    fontSize: 10,
    color: '#fbbf24',
    fontWeight: '500',
  },
  dueDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dueDate: {
    fontSize: 12,
    color: '#9ca3af',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    margin: 0,
  },
});