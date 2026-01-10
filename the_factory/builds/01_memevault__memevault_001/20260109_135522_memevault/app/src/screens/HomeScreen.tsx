import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, SafeAreaView, Text } from 'react-native';
import MemeGrid from '../components/MemeGrid';
import SearchBar from '../components/SearchBar';
import SubscriptionGate from '../components/SubscriptionGate';
import { MemeStorage } from '../services/MemeStorage';
import { RevenueCatService } from '../services/RevenueCatService';

interface Meme {
  id: string;
  uri: string;
  tags: string[];
  caption?: string;
  dateAdded: Date;
}

export default function HomeScreen() {
  const [memes, setMemes] = useState<Meme[]>([]);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadMemes();
    checkSubscriptionStatus();
  }, []);

  const loadMemes = async () => {
    try {
      const storedMemes = await MemeStorage.getAllMemes();
      setMemes(storedMemes);
    } catch (error) {
      console.error('Failed to load memes:', error);
    }
  };

  const checkSubscriptionStatus = async () => {
    try {
      const status = await RevenueCatService.getSubscriptionStatus();
      setIsSubscribed(status.isActive);
    } catch (error) {
      console.error('Failed to check subscription:', error);
    }
  };

  const filteredMemes = memes.filter(meme => {
    if (!searchQuery) return true;
    return (
      meme.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (meme.caption && meme.caption.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  });

  // Free tier limitation: 100 memes
  const displayMemes = isSubscribed ? filteredMemes : filteredMemes.slice(0, 100);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>MemeVault</Text>
        <SearchBar 
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search memes..."
        />
      </View>

      {!isSubscribed && memes.length >= 100 && (
        <SubscriptionGate 
          message="Upgrade to Pro for unlimited meme storage"
          onUpgrade={() => RevenueCatService.showPaywall()}
        />
      )}

      <MemeGrid 
        memes={displayMemes}
        onMemePress={(meme) => {
          // Navigate to MemeDetailScreen
          console.log('Meme pressed:', meme.id);
        }}
        isSubscribed={isSubscribed}
      />

      {memes.length === 0 && (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No memes yet!</Text>
          <Text style={styles.emptySubtext}>
            Tap the + tab to start building your meme library
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#000',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    lineHeight: 22,
  },
});