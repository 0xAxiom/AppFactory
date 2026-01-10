import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { Provider as PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import EnergyScreen from './src/screens/EnergyScreen';
import TasksScreen from './src/screens/TasksScreen';
import FocusScreen from './src/screens/FocusScreen';
import PatternsScreen from './src/screens/PatternsScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import { EnergyProvider } from './src/context/EnergyContext';
import { TaskProvider } from './src/context/TaskContext';
import { SubscriptionProvider } from './src/context/SubscriptionContext';
import { theme } from './src/theme';

const Tab = createBottomTabNavigator();

function TabIcon({ name, color }: { name: string; color: string }) {
  return <MaterialCommunityIcons name={name} size={24} color={color} />;
}

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PaperProvider theme={theme}>
        <SubscriptionProvider>
          <EnergyProvider>
            <TaskProvider>
              <NavigationContainer>
              <StatusBar style="light" backgroundColor="#1a1a2e" />
              <Tab.Navigator
                screenOptions={{
                  headerStyle: {
                    backgroundColor: '#1a1a2e',
                  },
                  headerTintColor: '#e5e5e5',
                  tabBarStyle: {
                    backgroundColor: '#1f2937',
                    borderTopColor: '#374151',
                  },
                  tabBarActiveTintColor: '#60a5fa',
                  tabBarInactiveTintColor: '#9ca3af',
                }}
              >
                <Tab.Screen
                  name="Energy"
                  component={EnergyScreen}
                  options={{
                    tabBarIcon: ({ color }) => <TabIcon name="lightning-bolt" color={color} />,
                  }}
                />
                <Tab.Screen
                  name="Tasks"
                  component={TasksScreen}
                  options={{
                    tabBarIcon: ({ color }) => <TabIcon name="checkbox-marked-circle-outline" color={color} />,
                  }}
                />
                <Tab.Screen
                  name="Focus"
                  component={FocusScreen}
                  options={{
                    tabBarIcon: ({ color }) => <TabIcon name="meditation" color={color} />,
                  }}
                />
                <Tab.Screen
                  name="Patterns"
                  component={PatternsScreen}
                  options={{
                    tabBarIcon: ({ color }) => <TabIcon name="chart-line" color={color} />,
                  }}
                />
                <Tab.Screen
                  name="Settings"
                  component={SettingsScreen}
                  options={{
                    tabBarIcon: ({ color }) => <TabIcon name="cog" color={color} />,
                  }}
                />
              </Tab.Navigator>
              </NavigationContainer>
            </TaskProvider>
          </EnergyProvider>
        </SubscriptionProvider>
      </PaperProvider>
    </GestureHandlerRootView>
  );
}