import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
} from 'react-native';
import { Link } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GestureHandlerRootView, Swipeable } from 'react-native-gesture-handler';
import { useTaskStore } from '../src/store/taskStore';
import { usePremiumStore } from '../src/store/premiumStore';

export default function HomeScreen() {
  const [taskText, setTaskText] = useState('');
  const { tasks, addTask, completeTask, loadTasks } = useTaskStore();
  const { isPremium } = usePremiumStore();

  useEffect(() => {
    loadTasks();
  }, []);

  const handleAddTask = () => {
    if (!taskText.trim()) return;
    
    const activeTasks = tasks.filter(task => !task.completed).length;
    if (!isPremium && activeTasks >= 20) {
      Alert.alert(
        'Premium Required',
        'You\'ve reached the 20 task limit. Upgrade to Premium for unlimited tasks.',
        [{ text: 'OK' }]
      );
      return;
    }

    addTask(taskText.trim());
    setTaskText('');
  };

  const renderRightAction = (taskId: string) => (
    <TouchableOpacity
      style={styles.completeButton}
      onPress={() => completeTask(taskId)}
    >
      <Text style={styles.completeButtonText}>✓</Text>
    </TouchableOpacity>
  );

  const renderTask = ({ item }: { item: any }) => (
    <Swipeable renderRightActions={() => renderRightAction(item.id)}>
      <View style={styles.taskRow}>
        <Text style={styles.taskText}>{item.text}</Text>
      </View>
    </Swipeable>
  );

  const activeTasks = tasks.filter(task => !task.completed);
  const completedToday = tasks.filter(task => 
    task.completed && 
    new Date(task.completedAt || 0).toDateString() === new Date().toDateString()
  ).length;

  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>ClearTasks</Text>
          <Link href="/settings" style={styles.settingsLink}>
            Settings
          </Link>
        </View>

        <View style={styles.addSection}>
          <TextInput
            style={styles.textInput}
            placeholder="Add a task..."
            value={taskText}
            onChangeText={setTaskText}
            onSubmitEditing={handleAddTask}
            returnKeyType="done"
            autoFocus
          />
          <TouchableOpacity 
            style={styles.addButton} 
            onPress={handleAddTask}
          >
            <Text style={styles.addButtonText}>Add</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={activeTasks}
          renderItem={renderTask}
          keyExtractor={item => item.id}
          style={styles.taskList}
          showsVerticalScrollIndicator={false}
        />

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            {completedToday} completed today
          </Text>
          {!isPremium && (
            <Text style={styles.limitText}>
              {activeTasks.length}/20 tasks
            </Text>
          )}
        </View>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1E293B',
  },
  settingsLink: {
    color: '#2563EB',
    fontSize: 16,
  },
  addSection: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingVertical: 16,
    gap: 12,
  },
  textInput: {
    flex: 1,
    height: 48,
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 17,
    color: '#1E293B',
  },
  addButton: {
    height: 48,
    backgroundColor: '#2563EB',
    borderRadius: 8,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  taskList: {
    flex: 1,
    paddingHorizontal: 24,
  },
  taskRow: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  taskText: {
    fontSize: 17,
    color: '#1E293B',
  },
  completeButton: {
    backgroundColor: '#059669',
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
  },
  completeButtonText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  footerText: {
    fontSize: 14,
    color: '#64748B',
  },
  limitText: {
    fontSize: 12,
    color: '#64748B',
  },
});