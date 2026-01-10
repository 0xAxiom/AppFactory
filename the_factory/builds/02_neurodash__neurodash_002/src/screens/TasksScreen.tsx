import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Searchbar, SegmentedButtons, FAB, Portal, Modal, Button, TextInput, Chip } from 'react-native-paper';
import { useTasks } from '../context/TaskContext';
import { useEnergy } from '../context/EnergyContext';
import TaskCard from '../components/TaskCard';
import { Task, EnergyLevel } from '../types';
import { getTasksByCategory, getSuggestedTaskDuration } from '../services/taskRecommendations';
import { generateId } from '../utils/helpers';

export default function TasksScreen() {
  const { tasks, addTask, completeTask, rescheduleTask } = useTasks();
  const { currentEnergy } = useEnergy();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  
  // Add task form state
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [newTaskEnergy, setNewTaskEnergy] = useState<EnergyLevel>('medium');
  const [newTaskCogLoad, setNewTaskCogLoad] = useState<'light' | 'medium' | 'heavy'>('medium');
  const [newTaskCategory, setNewTaskCategory] = useState('');

  const filterOptions = [
    { value: 'all', label: 'All Tasks' },
    { value: 'energy', label: 'Energy Match' },
    { value: 'completed', label: 'Completed' },
    { value: 'pending', label: 'Pending' },
  ];

  const getFilteredTasks = () => {
    let filteredTasks = tasks;

    // Apply filter type
    switch (filterType) {
      case 'energy':
        filteredTasks = tasks.filter(task => 
          currentEnergy && task.energyRequirement === currentEnergy && !task.completed
        );
        break;
      case 'completed':
        filteredTasks = tasks.filter(task => task.completed);
        break;
      case 'pending':
        filteredTasks = tasks.filter(task => !task.completed);
        break;
      default:
        break;
    }

    // Apply search query
    if (searchQuery) {
      filteredTasks = filteredTasks.filter(task =>
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.category?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filteredTasks;
  };

  const handleAddTask = () => {
    if (newTaskTitle.trim()) {
      const estimatedDuration = getSuggestedTaskDuration(newTaskEnergy, newTaskCogLoad);
      
      addTask({
        title: newTaskTitle.trim(),
        description: newTaskDescription.trim() || undefined,
        energyRequirement: newTaskEnergy,
        cognitiveLoad: newTaskCogLoad,
        estimatedDuration,
        category: newTaskCategory.trim() || undefined,
      });

      // Reset form
      setNewTaskTitle('');
      setNewTaskDescription('');
      setNewTaskEnergy('medium');
      setNewTaskCogLoad('medium');
      setNewTaskCategory('');
      setShowAddModal(false);
    }
  };

  const filteredTasks = getFilteredTasks();
  const tasksByCategory = getTasksByCategory(filteredTasks);

  const renderTasksByCategory = () => {
    if (Object.keys(tasksByCategory).length === 0) {
      return (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateTitle}>No tasks found</Text>
          <Text style={styles.emptyStateText}>
            {searchQuery 
              ? 'Try adjusting your search or filter criteria'
              : 'Add your first task to get started with adaptive productivity'
            }
          </Text>
        </View>
      );
    }

    return Object.entries(tasksByCategory).map(([category, categoryTasks]) => (
      <View key={category} style={styles.categorySection}>
        <Text style={styles.categoryTitle}>{category}</Text>
        {categoryTasks.map(task => (
          <TaskCard
            key={task.id}
            task={task}
            onComplete={() => completeTask(task.id)}
            onReschedule={() => rescheduleTask(task.id)}
          />
        ))}
      </View>
    ));
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Searchbar
          placeholder="Search tasks..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchbar}
        />
        
        <SegmentedButtons
          value={filterType}
          onValueChange={setFilterType}
          buttons={filterOptions}
          style={styles.segmentedButtons}
        />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {renderTasksByCategory()}
      </ScrollView>

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => setShowAddModal(true)}
      />

      <Portal>
        <Modal
          visible={showAddModal}
          onDismiss={() => setShowAddModal(false)}
          contentContainerStyle={styles.modalContent}
        >
          <Text style={styles.modalTitle}>Add New Task</Text>
          
          <TextInput
            label="Task Title"
            value={newTaskTitle}
            onChangeText={setNewTaskTitle}
            mode="outlined"
            style={styles.input}
            placeholder="What needs to be done?"
          />
          
          <TextInput
            label="Description (optional)"
            value={newTaskDescription}
            onChangeText={setNewTaskDescription}
            mode="outlined"
            multiline
            numberOfLines={3}
            style={styles.input}
            placeholder="Add more details..."
          />
          
          <TextInput
            label="Category (optional)"
            value={newTaskCategory}
            onChangeText={setNewTaskCategory}
            mode="outlined"
            style={styles.input}
            placeholder="e.g., Work, Personal, Health"
          />

          <Text style={styles.sectionLabel}>Energy Requirement</Text>
          <View style={styles.chipContainer}>
            {(['low', 'medium', 'high'] as EnergyLevel[]).map(level => (
              <Chip
                key={level}
                selected={newTaskEnergy === level}
                onPress={() => setNewTaskEnergy(level)}
                style={styles.chip}
              >
                {level.charAt(0).toUpperCase() + level.slice(1)}
              </Chip>
            ))}
          </View>

          <Text style={styles.sectionLabel}>Cognitive Load</Text>
          <View style={styles.chipContainer}>
            {(['light', 'medium', 'heavy'] as const).map(load => (
              <Chip
                key={load}
                selected={newTaskCogLoad === load}
                onPress={() => setNewTaskCogLoad(load)}
                style={styles.chip}
              >
                {load.charAt(0).toUpperCase() + load.slice(1)}
              </Chip>
            ))}
          </View>

          <View style={styles.modalActions}>
            <Button
              mode="outlined"
              onPress={() => setShowAddModal(false)}
              style={styles.modalButton}
            >
              Cancel
            </Button>
            <Button
              mode="contained"
              onPress={handleAddTask}
              disabled={!newTaskTitle.trim()}
              style={styles.modalButton}
            >
              Add Task
            </Button>
          </View>
        </Modal>
      </Portal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111827',
  },
  header: {
    padding: 16,
    gap: 12,
  },
  searchbar: {
    backgroundColor: '#1f2937',
  },
  segmentedButtons: {
    backgroundColor: '#1f2937',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  categorySection: {
    marginBottom: 24,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#e5e5e5',
    marginBottom: 12,
    marginLeft: 4,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 48,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#e5e5e5',
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#9ca3af',
    textAlign: 'center',
    lineHeight: 20,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#60a5fa',
  },
  modalContent: {
    backgroundColor: '#1f2937',
    margin: 20,
    borderRadius: 12,
    padding: 24,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#e5e5e5',
    marginBottom: 20,
  },
  input: {
    marginBottom: 16,
    backgroundColor: '#111827',
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#e5e5e5',
    marginBottom: 8,
    marginTop: 8,
  },
  chipContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  chip: {
    backgroundColor: '#374151',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  modalButton: {
    flex: 1,
  },
});