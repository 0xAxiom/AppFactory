import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
  TextInput,
  TouchableOpacity,
  Alert,
  Dimensions,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';
import { Colors, Typography, Spacing, BorderRadius, Components } from '../design/tokens';
import { MemeStorage, Meme } from '../services/MemeStorage';
import { RevenueCatService } from '../services/RevenueCatService';
import Button from '../components/Button';

const { width } = Dimensions.get('window');

interface NewMeme {
  uri: string;
  filename: string;
  tags: string[];
  caption: string;
  source: 'camera' | 'gallery' | 'import';
  metadata?: {
    width?: number;
    height?: number;
    fileSize?: number;
  };
}

export default function AddMemeScreen() {
  const [selectedImage, setSelectedImage] = useState<NewMeme | null>(null);
  const [caption, setCaption] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const checkPermissions = async () => {
    const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
    const mediaPermission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (!cameraPermission.granted || !mediaPermission.granted) {
      Alert.alert(
        'Permissions Required',
        'Camera and photo library access are needed to add memes.',
        [{ text: 'OK' }]
      );
      return false;
    }
    return true;
  };

  const checkStorageLimit = async () => {
    const isPro = await RevenueCatService.hasPremiumAccess();
    if (!isPro) {
      const isLimitReached = await MemeStorage.isFreeTierLimitReached();
      if (isLimitReached) {
        Alert.alert(
          'Storage Limit Reached',
          'Free users can store up to 100 memes. Upgrade to Pro for unlimited storage!',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Upgrade to Pro', onPress: () => console.log('Navigate to paywall') }
          ]
        );
        return false;
      }
    }
    return true;
  };

  const takePhoto = async () => {
    if (!await checkPermissions()) return;
    if (!await checkStorageLimit()) return;

    setIsLoading(true);
    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: 'images' as any,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        setSelectedImage({
          uri: asset.uri,
          filename: `camera_${Date.now()}.jpg`,
          tags: [],
          caption: '',
          source: 'camera',
          metadata: {
            width: asset.width,
            height: asset.height,
          },
        });
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to take photo. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const selectFromGallery = async () => {
    if (!await checkPermissions()) return;
    if (!await checkStorageLimit()) return;

    setIsLoading(true);
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: 'images' as any,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        setSelectedImage({
          uri: asset.uri,
          filename: asset.fileName || `gallery_${Date.now()}.jpg`,
          tags: [],
          caption: '',
          source: 'gallery',
          metadata: {
            width: asset.width,
            height: asset.height,
          },
        });
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to select image. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const addTag = () => {
    const newTag = tagInput.trim().toLowerCase();
    if (newTag && !tags.includes(newTag) && tags.length < 10) {
      setTags([...tags, newTag]);
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const saveMeme = async () => {
    if (!selectedImage) return;

    setIsSaving(true);
    try {
      await MemeStorage.saveMeme({
        uri: selectedImage.uri,
        filename: selectedImage.filename,
        tags: tags,
        caption: caption.trim(),
        favorite: false,
        metadata: {
          ...selectedImage.metadata,
          source: selectedImage.source,
        },
      });

      Alert.alert(
        'Success!', 
        'Meme added to your collection',
        [{ text: 'OK', onPress: clearForm }]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to save meme. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const clearForm = () => {
    setSelectedImage(null);
    setCaption('');
    setTags([]);
    setTagInput('');
  };

  const renderImageSelector = () => (
    <View style={styles.imageSelectorContainer}>
      {selectedImage ? (
        <View style={styles.selectedImageContainer}>
          <Image source={{ uri: selectedImage.uri }} style={styles.selectedImage} />
          <TouchableOpacity style={styles.changeImageButton} onPress={clearForm}>
            <Text style={styles.changeImageText}>Change Image</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.imagePlaceholder}>
          <Text style={styles.imagePlaceholderIcon}>📸</Text>
          <Text style={styles.imagePlaceholderText}>Select or take a photo</Text>
          <View style={styles.imageButtonsContainer}>
            <Button
              title="Take Photo"
              onPress={takePhoto}
              variant="primary"
              style={styles.imageButton}
              loading={isLoading}
            />
            <Button
              title="Choose from Gallery"
              onPress={selectFromGallery}
              variant="secondary"
              style={styles.imageButton}
              loading={isLoading}
            />
          </View>
        </View>
      )}
    </View>
  );

  const renderTagsSection = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Tags (Optional)</Text>
      <Text style={styles.sectionSubtitle}>
        Add tags to make your memes easier to find
      </Text>
      
      <View style={styles.tagInputContainer}>
        <TextInput
          style={styles.tagInput}
          placeholder="Add a tag..."
          value={tagInput}
          onChangeText={setTagInput}
          onSubmitEditing={addTag}
          autoCorrect={false}
          autoCapitalize="none"
          returnKeyType="done"
          maxLength={20}
        />
        <Button
          title="Add"
          onPress={addTag}
          variant="outline"
          size="small"
          disabled={!tagInput.trim() || tags.length >= 10}
          style={styles.addTagButton}
        />
      </View>

      {tags.length > 0 && (
        <View style={styles.tagsContainer}>
          {tags.map((tag, index) => (
            <TouchableOpacity
              key={index}
              style={styles.tag}
              onPress={() => removeTag(tag)}
            >
              <Text style={styles.tagText}>{tag}</Text>
              <Text style={styles.tagRemove}> ✕</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
      
      <Text style={styles.tagLimit}>
        {tags.length}/10 tags • Tap a tag to remove it
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Add New Meme</Text>
        <Text style={styles.subtitle}>
          Build your collection with photos and memes
        </Text>
      </View>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {renderImageSelector()}

        {selectedImage && (
          <>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Caption (Optional)</Text>
              <TextInput
                style={styles.captionInput}
                placeholder="Add a funny caption..."
                value={caption}
                onChangeText={setCaption}
                multiline
                maxLength={200}
                textAlignVertical="top"
              />
              <Text style={styles.captionLimit}>
                {caption.length}/200 characters
              </Text>
            </View>

            {renderTagsSection()}

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>File Info</Text>
              <View style={styles.fileInfoContainer}>
                <Text style={styles.fileInfoText}>
                  📁 {selectedImage.filename}
                </Text>
                <Text style={styles.fileInfoText}>
                  📷 {selectedImage.source === 'camera' ? 'Camera' : 'Gallery'}
                </Text>
                {selectedImage.metadata?.width && selectedImage.metadata?.height && (
                  <Text style={styles.fileInfoText}>
                    📐 {selectedImage.metadata.width} × {selectedImage.metadata.height}
                  </Text>
                )}
              </View>
            </View>

            <View style={styles.actionButtons}>
              <Button
                title="Save Meme"
                onPress={saveMeme}
                variant="primary"
                loading={isSaving}
                style={styles.saveButton}
              />
              <Button
                title="Clear"
                onPress={clearForm}
                variant="outline"
                disabled={isSaving}
                style={styles.clearButton}
              />
            </View>
          </>
        )}
      </ScrollView>
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
  
  scrollView: {
    flex: 1,
  },
  
  imageSelectorContainer: {
    padding: Spacing.md,
  },
  
  selectedImageContainer: {
    alignItems: 'center',
  },
  
  selectedImage: {
    width: width - (Spacing.md * 2),
    height: width - (Spacing.md * 2),
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.gray200,
    resizeMode: 'cover',
  },
  
  changeImageButton: {
    marginTop: Spacing.md,
    padding: Spacing.sm,
    backgroundColor: Colors.gray100,
    borderRadius: BorderRadius.sm,
  },
  
  changeImageText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    fontWeight: Typography.fontWeight.medium,
  },
  
  imagePlaceholder: {
    ...Components.card,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 300,
  },
  
  imagePlaceholderIcon: {
    fontSize: 64,
    marginBottom: Spacing.lg,
  },
  
  imagePlaceholderText: {
    fontSize: Typography.fontSize.lg,
    color: Colors.textSecondary,
    fontWeight: Typography.fontWeight.medium,
    marginBottom: Spacing.xl,
  },
  
  imageButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.md,
  },
  
  imageButton: {
    minWidth: 140,
  },
  
  section: {
    padding: Spacing.md,
    paddingTop: Spacing.lg,
  },
  
  sectionTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  
  sectionSubtitle: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
  },
  
  captionInput: {
    ...Components.input,
    height: 100,
    fontSize: Typography.fontSize.base,
    textAlignVertical: 'top',
  },
  
  captionLimit: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textTertiary,
    marginTop: Spacing.xs,
    textAlign: 'right',
  },
  
  tagInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  
  tagInput: {
    ...Components.input,
    flex: 1,
    fontSize: Typography.fontSize.base,
  },
  
  addTagButton: {
    minWidth: 60,
  },
  
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: Spacing.md,
    gap: Spacing.xs,
  },
  
  tag: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.round,
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  tagText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.white,
    fontWeight: Typography.fontWeight.medium,
  },
  
  tagRemove: {
    fontSize: Typography.fontSize.xs,
    color: Colors.white,
    opacity: 0.8,
  },
  
  tagLimit: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textTertiary,
    marginTop: Spacing.md,
  },
  
  fileInfoContainer: {
    ...Components.card,
    backgroundColor: Colors.gray50,
  },
  
  fileInfoText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  
  actionButtons: {
    padding: Spacing.md,
    paddingTop: Spacing.xl,
    gap: Spacing.md,
  },
  
  saveButton: {
    marginBottom: Spacing.sm,
  },
  
  clearButton: {
    marginBottom: Spacing.xl,
  },
});