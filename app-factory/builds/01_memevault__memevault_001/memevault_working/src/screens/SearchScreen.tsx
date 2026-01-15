import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  FlatList,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { Colors, Typography, Spacing, BorderRadius, Components } from '../design/tokens';
import { MemeStorage, Meme } from '../services/MemeStorage';
import Button from '../components/Button';

const { width } = Dimensions.get('window');
const MEME_SIZE = (width - (Spacing.md * 3)) / 2;

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Meme[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [allMemes, setAllMemes] = useState<Meme[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    performSearch();
  }, [searchQuery]);

  const loadInitialData = async () => {
    try {
      const memes = await MemeStorage.getAllMemes();
      setAllMemes(memes);
      // Load recent searches from storage
      // For now, we'll use a mock list
      setRecentSearches(['funny', 'reaction', 'cats', 'work']);
    } catch (error) {
      console.error('Failed to load data:', error);
    }
  };

  const performSearch = async () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const results = await MemeStorage.searchMemes(searchQuery);
      setSearchResults(results);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearchSubmit = () => {
    if (searchQuery.trim() && !recentSearches.includes(searchQuery.trim())) {
      setRecentSearches(prev => [searchQuery.trim(), ...prev.slice(0, 4)]);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
  };

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

  const renderRecentSearch = ({ item }: { item: string }) => (
    <TouchableOpacity
      style={styles.recentSearchItem}
      onPress={() => setSearchQuery(item)}
    >
      <Text style={styles.recentSearchText}>{item}</Text>
      <Text style={styles.recentSearchIcon}>🔍</Text>
    </TouchableOpacity>
  );

  const renderEmptySearch = () => (
    <View style={styles.emptySearch}>
      <Text style={styles.emptySearchIcon}>🔍</Text>
      <Text style={styles.emptySearchTitle}>
        {searchQuery ? 'No memes found' : 'Search your memes'}
      </Text>
      <Text style={styles.emptySearchText}>
        {searchQuery 
          ? `No results for "${searchQuery}". Try different keywords or tags.`
          : 'Search by filename, tags, or captions to find your memes quickly'
        }
      </Text>
      {searchQuery && (
        <Button
          title="Clear Search"
          onPress={clearSearch}
          variant="outline"
          style={styles.clearButton}
        />
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Search Memes</Text>
        <Text style={styles.subtitle}>
          {allMemes.length} memes in your collection
        </Text>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search by tags, filename, or caption..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearchSubmit}
            autoCorrect={false}
            autoCapitalize="none"
            returnKeyType="search"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={clearSearch}>
              <Text style={styles.clearIcon}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {!searchQuery && recentSearches.length > 0 && (
        <View style={styles.recentSearchesSection}>
          <Text style={styles.recentSearchesTitle}>Recent Searches</Text>
          <FlatList
            data={recentSearches}
            renderItem={renderRecentSearch}
            keyExtractor={(item, index) => `recent-${index}`}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.recentSearchesList}
          />
        </View>
      )}

      {searchQuery && (
        <View style={styles.resultsHeader}>
          <Text style={styles.resultsText}>
            {isSearching ? 'Searching...' : `${searchResults.length} results`}
          </Text>
        </View>
      )}

      {searchQuery && searchResults.length === 0 && !isSearching ? (
        renderEmptySearch()
      ) : (
        <FlatList
          data={searchQuery ? searchResults : []}
          renderItem={renderMeme}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={styles.resultsGrid}
          columnWrapperStyle={styles.resultsRow}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={!searchQuery ? renderEmptySearch() : null}
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
  
  header: {
    padding: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  
  title: {
    fontSize: Typography.fontSize.xxxxl,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  
  subtitle: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
  },
  
  searchContainer: {
    padding: Spacing.md,
    paddingBottom: Spacing.sm,
  },
  
  searchInputContainer: {
    ...Components.input,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
  },
  
  searchIcon: {
    fontSize: 18,
    marginRight: Spacing.sm,
    color: Colors.textSecondary,
  },
  
  searchInput: {
    flex: 1,
    fontSize: Typography.fontSize.base,
    color: Colors.textPrimary,
  },
  
  clearIcon: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginLeft: Spacing.sm,
    paddingHorizontal: Spacing.sm,
  },
  
  recentSearchesSection: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.md,
  },
  
  recentSearchesTitle: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  
  recentSearchesList: {
    paddingRight: Spacing.md,
  },
  
  recentSearchItem: {
    backgroundColor: Colors.gray100,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.round,
    marginRight: Spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  recentSearchText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textPrimary,
    marginRight: Spacing.xs,
  },
  
  recentSearchIcon: {
    fontSize: 12,
    opacity: 0.6,
  },
  
  resultsHeader: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.sm,
  },
  
  resultsText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    fontWeight: Typography.fontWeight.medium,
  },
  
  resultsGrid: {
    padding: Spacing.md,
    paddingTop: 0,
    paddingBottom: 100,
  },
  
  resultsRow: {
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
  
  emptySearch: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  
  emptySearchIcon: {
    fontSize: 64,
    marginBottom: Spacing.lg,
    opacity: 0.6,
  },
  
  emptySearchTitle: {
    fontSize: Typography.fontSize.xxl,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
    textAlign: 'center',
  },
  
  emptySearchText: {
    fontSize: Typography.fontSize.base,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: Typography.lineHeight.base,
    marginBottom: Spacing.xl,
  },
  
  clearButton: {
    minWidth: 150,
  },
});