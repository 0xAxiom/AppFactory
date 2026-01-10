// Main navigation for EVP Analyzer Pro
// Based on Stage 03 UX design specifications

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Platform } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

// Screens
import SessionsScreen from '../screens/SessionsScreen';
import AnalysisScreen from '../screens/AnalysisScreen';
import LibraryScreen from '../screens/LibraryScreen';
import SettingsScreen from '../screens/SettingsScreen';
import RecordingScreen from '../screens/RecordingScreen';
import SessionDetailScreen from '../screens/SessionDetailScreen';
import AnomalyDetailScreen from '../screens/AnomalyDetailScreen';
import PaywallScreen from '../screens/PaywallScreen';
import OnboardingScreen from '../screens/OnboardingScreen';

// Theme
import { useTheme } from '../styles/theme';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Tab Navigator Component
const TabNavigator = () => {
  const { colors } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          switch (route.name) {
            case 'Sessions':
              iconName = 'fiber-smart-record';
              break;
            case 'Analysis':
              iconName = 'graphic-eq';
              break;
            case 'Library':
              iconName = 'library-music';
              break;
            case 'Settings':
              iconName = 'settings';
              break;
            default:
              iconName = 'help';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.text.secondary,
        tabBarStyle: {
          backgroundColor: colors.background.secondary,
          borderTopColor: colors.border.primary,
          borderTopWidth: 1,
          paddingTop: Platform.OS === 'ios' ? 5 : 0,
          height: Platform.OS === 'ios' ? 85 : 65,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
          paddingBottom: Platform.OS === 'ios' ? 20 : 5,
        },
        headerStyle: {
          backgroundColor: colors.background.secondary,
          shadowColor: 'transparent',
          elevation: 0,
        },
        headerTintColor: colors.text.primary,
        headerTitleStyle: {
          fontWeight: '600',
          fontSize: 18,
        },
      })}
    >
      <Tab.Screen 
        name="Sessions" 
        component={SessionsScreen}
        options={{
          title: 'Sessions',
          headerTitle: 'EVP Sessions'
        }}
      />
      <Tab.Screen 
        name="Analysis" 
        component={AnalysisScreen}
        options={{
          title: 'Analysis',
          headerTitle: 'Audio Analysis'
        }}
      />
      <Tab.Screen 
        name="Library" 
        component={LibraryScreen}
        options={{
          title: 'Library',
          headerTitle: 'Session Library'
        }}
      />
      <Tab.Screen 
        name="Settings" 
        component={SettingsScreen}
        options={{
          title: 'Settings',
          headerTitle: 'Settings'
        }}
      />
    </Tab.Navigator>
  );
};

// Main Stack Navigator
const AppNavigator = () => {
  const { colors } = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.surface,
          shadowColor: 'transparent',
          elevation: 0,
        },
          headerTintColor: colors.text.primary,
          headerTitleStyle: {
            fontWeight: '600',
            fontSize: 18,
          },
          headerBackTitleVisible: false,
          cardStyle: {
            backgroundColor: colors.background.primary,
          },
        }}
      >
        {/* Main tab navigation */}
        <Stack.Screen 
          name="Main" 
          component={TabNavigator} 
          options={{ headerShown: false }}
        />
        
        {/* Modal screens */}
        <Stack.Screen 
          name="Recording" 
          component={RecordingScreen}
          options={{
            title: 'Recording Session',
            presentation: 'modal',
            headerStyle: {
              backgroundColor: colors.background,
            },
          }}
        />
        
        <Stack.Screen 
          name="Paywall" 
          component={PaywallScreen}
          options={{
            title: 'Upgrade to Pro',
            presentation: 'modal',
            headerStyle: {
              backgroundColor: colors.background,
            },
          }}
        />
        
        <Stack.Screen 
          name="Onboarding" 
          component={OnboardingScreen}
          options={{
            headerShown: false,
            gestureEnabled: false,
          }}
        />
        
        {/* Detail screens */}
        <Stack.Screen 
          name="SessionDetail" 
          component={SessionDetailScreen}
          options={{
            title: 'Session Details',
          }}
        />
        
        <Stack.Screen 
          name="AnomalyDetail" 
          component={AnomalyDetailScreen}
          options={{
            title: 'Anomaly Details',
          }}
        />
      </Stack.Navigator>
  );
};

// Navigation helpers
export const navigationRef = React.createRef();

export const navigate = (name, params) => {
  navigationRef.current?.navigate(name, params);
};

export const goBack = () => {
  navigationRef.current?.goBack();
};

export const resetToScreen = (name, params) => {
  navigationRef.current?.reset({
    index: 0,
    routes: [{ name, params }],
  });
};

// Screen names for type safety
export const SCREENS = {
  MAIN: 'Main',
  SESSIONS: 'Sessions',
  ANALYSIS: 'Analysis',
  LIBRARY: 'Library',
  SETTINGS: 'Settings',
  RECORDING: 'Recording',
  SESSION_DETAIL: 'SessionDetail',
  ANOMALY_DETAIL: 'AnomalyDetail',
  PAYWALL: 'Paywall',
  ONBOARDING: 'Onboarding',
};

export { AppNavigator };