import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Image,
  Dimensions,
  Alert,
} from 'react-native';
import { Colors, Typography, Spacing, BorderRadius, Components } from '../design/tokens';
import { MemeStorage, Meme } from '../services/MemeStorage';
import { RevenueCatService } from '../services/RevenueCatService';
import Button from '../components/Button';

const { width } = Dimensions.get('window');
const MEME_SIZE = (width - (Spacing.md * 3)) / 2;

export default function HomeScreen({ navigation }: { navigation: any }) {
  const [memes, setMemes] = useState<Meme[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPro, setIsPro] = useState(false);
  const [memeCount, setMemeCount] = useState(0);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [memesData, proStatus] = await Promise.all([
        MemeStorage.getAllMemes(),
        RevenueCatService.hasPremiumAccess(),
      ]);
      
      setMemes(memesData.sort((a, b) => 
        new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime()
      ));
      setMemeCount(memesData.length);
      setIsPro(proStatus);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpgradeToPro = async () => {
    Alert.alert(
      'MemeVault Pro',
      'Upgrade to Pro for unlimited meme storage, AI tagging, and premium features!',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Upgrade', onPress: () => console.log('Navigate to paywall') },
      ]
    );
  };

  const displayMemes = isPro ? memes : memes.slice(0, 100);
  const isLimitReached = !isPro && memeCount >= 100;

  const renderMeme = ({ item }: { item: Meme }) => (
    <TouchableOpacity 
      style={styles.memeCard}
      onPress={() => console.log('Open meme:', item.id)}
    >
      <Image source={{ uri: item.uri }} style={styles.memeImage} />
      <View style={styles.memeInfo}>
        <Text style={styles.memeFilename} numberOfLines={1}>
          {item.filename}
        </Text>
        {item.tags.length > 0 && (
          <View style={styles.tagsContainer}>
            {item.tags.slice(0, 2).map((tag, index) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
            {item.tags.length > 2 && (
              <Text style={styles.moreTagsText}>+{item.tags.length - 2}</Text>
            )}
          </View>
        )}
      </View>
      {item.favorite && (
        <View style={styles.favoriteIcon}>
          <Text style={styles.favoriteText}>♥</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>MemeVault</Text>
        <View style={styles.statusContainer}>
          <Text style={styles.statusText}>
            {memeCount} memes • {isPro ? 'Pro' : 'Free'}
          </Text>
          {!isPro && (
            <TouchableOpacity 
              style={styles.proButton}
              onPress={handleUpgradeToPro}
            >
              <Text style={styles.proButtonText}>Upgrade</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyStateIcon}>📱</Text>
      <Text style={styles.emptyStateTitle}>No Memes Yet!</Text>
      <Text style={styles.emptyStateText}>
        Start building your meme collection by adding your first meme
      </Text>
      <Button
        title="Add Your First Meme"
        onPress={() => console.log('Navigate to add meme')}
        variant="primary"
        style={styles.emptyStateButton}
      />
    </View>
  );

  const renderLimitBanner = () => (
    isLimitReached && (
      <View style={styles.limitBanner}>
        <Text style={styles.limitText}>
          You've reached the 100 meme limit for free users
        </Text>
        <Button
          title="Upgrade to Pro"
          onPress={handleUpgradeToPro}
          variant="premium"
          size="small"
          style={styles.limitButton}
        />
      </View>
    )
  );

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading your memes...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {renderHeader()}
      {renderLimitBanner()}
      
      {memes.length === 0 ? (
        renderEmptyState()
      ) : (
        <FlatList
          data={displayMemes}
          renderItem={renderMeme}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={styles.memeGrid}
          columnWrapperStyle={styles.memeRow}
          showsVerticalScrollIndicator={false}
          onRefresh={loadData}
          refreshing={isLoading}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  loadingText: {
    fontSize: Typography.fontSize.lg,
    color: Colors.textSecondary,
    fontWeight: Typography.fontWeight.medium,
  },
  
  header: {
    padding: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  
  title: {
    fontSize: Typography.fontSize.xxxxl,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.textPrimary,
  },
  
  statusContainer: {
    alignItems: 'flex-end',
  },
  
  statusText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  
  proButton: {
    backgroundColor: Colors.premium,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
  },
  
  proButtonText: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.black,
  },
  
  limitBanner: {
    backgroundColor: Colors.premium,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.md,
    margin: Spacing.md,
    borderRadius: BorderRadius.md,
  },
  
  limitText: {
    flex: 1,
    fontSize: Typography.fontSize.sm,
    color: Colors.black,
    fontWeight: Typography.fontWeight.medium,
    marginRight: Spacing.md,
  },
  
  limitButton: {
    minWidth: 100,
  },
  
  memeGrid: {
    padding: Spacing.md,
    paddingBottom: 100,
  },
  
  memeRow: {
    justifyContent: 'space-between',
  },
  
  memeCard: {
    ...Components.memeCard,
    width: MEME_SIZE,
    marginBottom: Spacing.md,
    overflow: 'hidden',
  },
  
  memeImage: {
    width: '100%',
    height: MEME_SIZE * 0.8,
    backgroundColor: Colors.gray200,
    resizeMode: 'cover',
  },
  
  memeInfo: {
    padding: Spacing.sm,
  },
  
  memeFilename: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  
  tag: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.xs,
    paddingVertical: 2,
    borderRadius: BorderRadius.xs,
    marginRight: Spacing.xs,
    marginBottom: 2,
  },
  
  tagText: {
    fontSize: 10,
    color: Colors.white,
    fontWeight: Typography.fontWeight.medium,
  },
  
  moreTagsText: {
    fontSize: 10,
    color: Colors.textTertiary,
    fontStyle: 'italic',
  },
  
  favoriteIcon: {
    position: 'absolute',
    top: Spacing.sm,
    right: Spacing.sm,
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: BorderRadius.round,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  favoriteText: {
    color: Colors.error,
    fontSize: 14,
  },
  
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  
  emptyStateIcon: {
    fontSize: 64,
    marginBottom: Spacing.lg,
  },
  
  emptyStateTitle: {
    fontSize: Typography.fontSize.xxl,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
    textAlign: 'center',
  },
  
  emptyStateText: {
    fontSize: Typography.fontSize.base,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: Typography.lineHeight.base,
    marginBottom: Spacing.xl,
  },
  
  emptyStateButton: {
    minWidth: 200,
  },
});