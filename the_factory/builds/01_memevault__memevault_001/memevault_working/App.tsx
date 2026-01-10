import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { Text, View } from 'react-native';

import HomeScreen from './src/screens/HomeScreen';
import SearchScreen from './src/screens/SearchScreen';
import FoldersScreen from './src/screens/FoldersScreen';
import AddMemeScreen from './src/screens/AddMemeScreen';
import SettingsScreen from './src/screens/SettingsScreen';

import { MemeStorage } from './src/services/MemeStorage';
import { RevenueCatService } from './src/services/RevenueCatService';
import { Colors } from './src/design/tokens';

const Tab = createBottomTabNavigator();

function TabIcon({ name, focused }: { name: string; focused: boolean }) {
  const iconMap = {
    Home: '🏠',
    Search: '🔍', 
    Add: '➕',
    Folders: '📁',
    Settings: '⚙️',
  } as const;
  
  return (
    <Text style={{ 
      fontSize: 20, 
      opacity: focused ? 1 : 0.6,
      transform: [{ scale: focused ? 1.1 : 1 }] 
    }}>
      {iconMap[name as keyof typeof iconMap] || '?'}
    </Text>
  );
}

export default function App() {
  useEffect(() => {
    async function initializeApp() {
      try {
        // Initialize services
        await Promise.all([
          MemeStorage.initialize(),
          RevenueCatService.initialize()
        ]);
        console.log('✅ App initialized successfully');
      } catch (error) {
        console.error('❌ App initialization failed:', error);
      }
    }

    initializeApp();
  }, []);

  return (
    <>
      <StatusBar style="dark" backgroundColor={Colors.background} />
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused }) => (
              <TabIcon name={route.name} focused={focused} />
            ),
            tabBarActiveTintColor: Colors.primary,
            tabBarInactiveTintColor: Colors.textSecondary,
            tabBarStyle: {
              backgroundColor: Colors.surface,
              borderTopColor: Colors.border,
              paddingBottom: 8,
              paddingTop: 8,
              height: 70,
            },
            tabBarLabelStyle: {
              fontSize: 12,
              fontWeight: '500',
              marginTop: 4,
            },
            headerShown: false,
          })}
        >
          <Tab.Screen 
            name="Home" 
            component={HomeScreen}
            options={{ title: 'My Memes' }}
          />
          <Tab.Screen 
            name="Search" 
            component={SearchScreen}
            options={{ title: 'Search' }}
          />
          <Tab.Screen 
            name="Add" 
            component={AddMemeScreen}
            options={{ title: 'Add Meme' }}
          />
          <Tab.Screen 
            name="Folders" 
            component={FoldersScreen}
            options={{ title: 'Folders' }}
          />
          <Tab.Screen 
            name="Settings" 
            component={SettingsScreen}
            options={{ title: 'Settings' }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </>
  );
}
