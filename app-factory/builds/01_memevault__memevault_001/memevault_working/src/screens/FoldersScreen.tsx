import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  Alert,
  TextInput,
  Modal,
  Dimensions,
} from 'react-native';
import { Colors, Typography, Spacing, BorderRadius, Components } from '../design/tokens';
import { MemeStorage, MemeFolder, Meme } from '../services/MemeStorage';
import Button from '../components/Button';

const { width } = Dimensions.get('window');

const FOLDER_COLORS = [
  '#FF6B6B', '#4ECDC4', '#FFD93D', '#FF8E53',
  '#6C5CE7', '#A29BFE', '#FD79A8', '#FDCB6E',
  '#00B894', '#00CEC9', '#E17055', '#DDA0DD'
];

export default function FoldersScreen() {
  const [folders, setFolders] = useState<MemeFolder[]>([]);
  const [memes, setMemes] = useState<Meme[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [selectedColor, setSelectedColor] = useState(FOLDER_COLORS[0]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [foldersData, memesData] = await Promise.all([
        MemeStorage.getAllFolders(),
        MemeStorage.getAllMemes()
      ]);
      setFolders(foldersData);
      setMemes(memesData);
    } catch (error) {
      console.error('Failed to load folders:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const createFolder = async () => {
    if (!newFolderName.trim()) {
      Alert.alert('Error', 'Please enter a folder name');
      return;
    }

    try {
      const folderId = await MemeStorage.createFolder(newFolderName.trim(), selectedColor);
      await loadData();
      setShowCreateModal(false);
      setNewFolderName('');
      setSelectedColor(FOLDER_COLORS[0]);
      
      Alert.alert('Success', `Folder "${newFolderName}" created!`);
    } catch (error) {
      Alert.alert('Error', 'Failed to create folder');
    }
  };

  const getFolderMemeCount = (folderId: string) => {
    return memes.filter(meme => meme.folderId === folderId).length;
  };

  const getUnorganizedMemes = () => {
    return memes.filter(meme => !meme.folderId);
  };

  const openFolder = (folder: MemeFolder) => {
    const folderMemes = memes.filter(meme => meme.folderId === folder.id);
    console.log('Opening folder:', folder.name, 'with', folderMemes.length, 'memes');
    // Navigation to folder detail can be implemented when FolderDetailScreen is available
    // Example: navigation.navigate('FolderDetail', { folderId: folder.id });
    Alert.alert('Coming Soon', `Folder "${folder.name}" contains ${folderMemes.length} memes. Detailed view coming in next update!`);
  };

  const renderFolder = ({ item: folder }: { item: MemeFolder }) => {
    const memeCount = getFolderMemeCount(folder.id);
    const recentMemes = memes
      .filter(meme => meme.folderId === folder.id)
      .sort((a, b) => new Date(b.dateModified).getTime() - new Date(a.dateModified).getTime())
      .slice(0, 4);

    return (
      <TouchableOpacity
        style={[styles.folderCard, { borderLeftColor: folder.color }]}
        onPress={() => openFolder(folder)}
      >
        <View style={styles.folderHeader}>
          <View style={[styles.folderColorIndicator, { backgroundColor: folder.color }]} />
          <View style={styles.folderInfo}>
            <Text style={styles.folderName}>{folder.name}</Text>
            <Text style={styles.folderCount}>
              {memeCount} {memeCount === 1 ? 'meme' : 'memes'}
            </Text>
          </View>
          <Text style={styles.folderArrow}>›</Text>
        </View>

        {folder.description && (
          <Text style={styles.folderDescription}>{folder.description}</Text>
        )}

        {recentMemes.length > 0 && (
          <View style={styles.previewContainer}>
            <Text style={styles.previewLabel}>Recent memes:</Text>
            <View style={styles.previewMemes}>
              {recentMemes.map((meme, index) => (
                <View key={meme.id} style={styles.previewMeme}>
                  <Text style={styles.previewMemeText} numberOfLines={1}>
                    {meme.filename}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        <Text style={styles.folderDate}>
          Created {new Date(folder.dateCreated).toLocaleDateString()}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderUnorganizedSection = () => {
    const unorganizedMemes = getUnorganizedMemes();
    
    if (unorganizedMemes.length === 0) return null;

    return (
      <TouchableOpacity
        style={[styles.folderCard, styles.unorganizedCard]}
        onPress={() => console.log('Open unorganized memes')}
      >
        <View style={styles.folderHeader}>
          <View style={[styles.folderColorIndicator, { backgroundColor: Colors.gray400 }]} />
          <View style={styles.folderInfo}>
            <Text style={styles.folderName}>Unorganized</Text>
            <Text style={styles.folderCount}>
              {unorganizedMemes.length} {unorganizedMemes.length === 1 ? 'meme' : 'memes'}
            </Text>
          </View>
          <Text style={styles.folderArrow}>›</Text>
        </View>
        <Text style={styles.folderDescription}>
          Memes that haven't been organized into folders yet
        </Text>
      </TouchableOpacity>
    );
  };

  const renderCreateModal = () => (
    <Modal
      visible={showCreateModal}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={() => setShowCreateModal(false)}
    >
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={() => setShowCreateModal(false)}>
            <Text style={styles.modalCancel}>Cancel</Text>
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Create Folder</Text>
          <TouchableOpacity onPress={createFolder}>
            <Text style={styles.modalDone}>Done</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.modalContent}>
          <View style={styles.inputSection}>
            <Text style={styles.inputLabel}>Folder Name</Text>
            <TextInput
              style={styles.nameInput}
              placeholder="Enter folder name..."
              value={newFolderName}
              onChangeText={setNewFolderName}
              autoFocus
              maxLength={50}
            />
          </View>

          <View style={styles.colorSection}>
            <Text style={styles.inputLabel}>Color</Text>
            <View style={styles.colorGrid}>
              {FOLDER_COLORS.map((color, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.colorOption,
                    { backgroundColor: color },
                    selectedColor === color && styles.selectedColor
                  ]}
                  onPress={() => setSelectedColor(color)}
                />
              ))}
            </View>
          </View>

          <View style={styles.previewSection}>
            <Text style={styles.inputLabel}>Preview</Text>
            <View style={[styles.folderPreview, { borderLeftColor: selectedColor }]}>
              <View style={[styles.folderColorIndicator, { backgroundColor: selectedColor }]} />
              <Text style={styles.previewFolderName}>
                {newFolderName || 'New Folder'}
              </Text>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyStateIcon}>📁</Text>
      <Text style={styles.emptyStateTitle}>No Folders Yet</Text>
      <Text style={styles.emptyStateText}>
        Create folders to organize your memes by topic, mood, or any way you like!
      </Text>
      <Button
        title="Create Your First Folder"
        onPress={() => setShowCreateModal(true)}
        variant="primary"
        style={styles.emptyStateButton}
      />
    </View>
  );

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading folders...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Folders</Text>
        <Text style={styles.subtitle}>
          {folders.length} folders • {memes.length} total memes
        </Text>
      </View>

      <View style={styles.actionsBar}>
        <Button
          title="+ Create Folder"
          onPress={() => setShowCreateModal(true)}
          variant="primary"
          size="small"
          style={styles.createButton}
        />
      </View>

      {folders.length === 0 ? (
        renderEmptyState()
      ) : (
        <FlatList
          data={[...folders]}
          renderItem={renderFolder}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.foldersList}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={renderUnorganizedSection}
          onRefresh={loadData}
          refreshing={isLoading}
        />
      )}

      {renderCreateModal()}
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
  
  actionsBar: {
    padding: Spacing.md,
    paddingBottom: Spacing.sm,
  },
  
  createButton: {
    alignSelf: 'flex-start',
  },
  
  foldersList: {
    padding: Spacing.md,
    paddingTop: 0,
    paddingBottom: 100,
  },
  
  folderCard: {
    ...Components.card,
    marginBottom: Spacing.md,
    borderLeftWidth: 4,
  },
  
  unorganizedCard: {
    borderLeftColor: Colors.gray400,
    backgroundColor: Colors.gray50,
    marginBottom: Spacing.lg,
  },
  
  folderHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  
  folderColorIndicator: {
    width: 16,
    height: 16,
    borderRadius: BorderRadius.round,
    marginRight: Spacing.md,
  },
  
  folderInfo: {
    flex: 1,
  },
  
  folderName: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  
  folderCount: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
  },
  
  folderArrow: {
    fontSize: Typography.fontSize.xxl,
    color: Colors.textTertiary,
    fontWeight: Typography.fontWeight.bold,
  },
  
  folderDescription: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
    lineHeight: Typography.lineHeight.sm,
  },
  
  previewContainer: {
    marginBottom: Spacing.sm,
  },
  
  previewLabel: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textTertiary,
    marginBottom: Spacing.xs,
    textTransform: 'uppercase',
    fontWeight: Typography.fontWeight.semibold,
  },
  
  previewMemes: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
  },
  
  previewMeme: {
    backgroundColor: Colors.gray100,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.xs,
  },
  
  previewMemeText: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textSecondary,
  },
  
  folderDate: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textTertiary,
    fontStyle: 'italic',
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
  
  // Modal styles
  modalContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  
  modalCancel: {
    fontSize: Typography.fontSize.base,
    color: Colors.textSecondary,
  },
  
  modalTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.textPrimary,
  },
  
  modalDone: {
    fontSize: Typography.fontSize.base,
    color: Colors.primary,
    fontWeight: Typography.fontWeight.semibold,
  },
  
  modalContent: {
    padding: Spacing.md,
  },
  
  inputSection: {
    marginBottom: Spacing.xl,
  },
  
  inputLabel: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  
  nameInput: {
    ...Components.input,
    fontSize: Typography.fontSize.base,
  },
  
  colorSection: {
    marginBottom: Spacing.xl,
  },
  
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  
  colorOption: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.round,
    borderWidth: 3,
    borderColor: 'transparent',
  },
  
  selectedColor: {
    borderColor: Colors.black,
  },
  
  previewSection: {},
  
  folderPreview: {
    ...Components.card,
    flexDirection: 'row',
    alignItems: 'center',
    borderLeftWidth: 4,
  },
  
  previewFolderName: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.textPrimary,
  },
});