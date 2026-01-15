import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect } from 'react';
import * as Haptics from 'expo-haptics';
import { v4 as uuidv4 } from 'uuid';
import { colors, typography, spacing, radius } from '@/constants/theme';
import { CloseIcon, CheckIcon, TrashIcon } from '@/ui/icons';
import { getTags, saveTag, deleteTag } from '@/services/storage';
import { Tag, TagCategory } from '@/types';

const CATEGORIES: { id: TagCategory; label: string; color: string }[] = [
  { id: 'evp', label: 'EVP', color: colors.tag.evp },
  { id: 'voice', label: 'Voice', color: colors.tag.voice },
  { id: 'noise', label: 'Noise', color: colors.tag.noise },
  { id: 'interference', label: 'Interference', color: colors.tag.interference },
  { id: 'other', label: 'Other', color: colors.tag.other },
];

export default function TagScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<TagCategory>('evp');
  const [label, setLabel] = useState('');
  const [notes, setNotes] = useState('');
  const [timestamp, setTimestamp] = useState('0:00');

  useEffect(() => {
    loadTags();
  }, [id]);

  const loadTags = async () => {
    if (id) {
      const tagData = await getTags(id);
      setTags(tagData);
    }
  };

  const parseTimestamp = (ts: string): number => {
    const parts = ts.split(':');
    if (parts.length === 2) {
      const mins = parseInt(parts[0], 10) || 0;
      const secs = parseInt(parts[1], 10) || 0;
      return mins * 60 + secs;
    }
    return 0;
  };

  const handleSave = async () => {
    if (!label.trim()) {
      Alert.alert('Label Required', 'Please enter a label for this tag.');
      return;
    }

    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    const newTag: Tag = {
      id: uuidv4(),
      investigationId: id!,
      category: selectedCategory,
      label: label.trim(),
      notes: notes.trim() || null,
      timestamp: parseTimestamp(timestamp),
      createdAt: new Date().toISOString(),
    };

    await saveTag(newTag);
    await loadTags();

    setLabel('');
    setNotes('');
    setTimestamp('0:00');
  };

  const handleDelete = async (tagId: string) => {
    Alert.alert('Delete Tag', 'Are you sure you want to delete this tag?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
          await deleteTag(tagId);
          await loadTags();
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.closeButton}>
          <CloseIcon size={24} color={colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.title}>Add Tag</Text>
        <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
          <CheckIcon size={24} color={colors.accent.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Category</Text>
          <View style={styles.categoryGrid}>
            {CATEGORIES.map((cat) => (
              <TouchableOpacity
                key={cat.id}
                style={[
                  styles.categoryChip,
                  { borderColor: cat.color },
                  selectedCategory === cat.id && { backgroundColor: cat.color + '30' },
                ]}
                onPress={() => setSelectedCategory(cat.id)}
              >
                <Text
                  style={[
                    styles.categoryLabel,
                    { color: cat.color },
                  ]}
                >
                  {cat.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Label</Text>
          <TextInput
            style={styles.input}
            value={label}
            onChangeText={setLabel}
            placeholder="e.g., Possible whisper"
            placeholderTextColor={colors.text.tertiary}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Timestamp</Text>
          <TextInput
            style={styles.input}
            value={timestamp}
            onChangeText={setTimestamp}
            placeholder="0:00"
            placeholderTextColor={colors.text.tertiary}
            keyboardType="numbers-and-punctuation"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notes (Optional)</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={notes}
            onChangeText={setNotes}
            placeholder="Add any additional observations..."
            placeholderTextColor={colors.text.tertiary}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        {tags.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Existing Tags</Text>
            {tags.map((tag) => {
              const category = CATEGORIES.find((c) => c.id === tag.category);
              return (
                <View key={tag.id} style={styles.tagItem}>
                  <View
                    style={[
                      styles.tagChip,
                      { backgroundColor: (category?.color || colors.text.secondary) + '20' },
                    ]}
                  >
                    <Text
                      style={[
                        styles.tagChipText,
                        { color: category?.color || colors.text.secondary },
                      ]}
                    >
                      {tag.category}
                    </Text>
                  </View>
                  <View style={styles.tagInfo}>
                    <Text style={styles.tagLabel}>{tag.label}</Text>
                    <Text style={styles.tagTime}>
                      {Math.floor(tag.timestamp / 60)}:
                      {String(tag.timestamp % 60).padStart(2, '0')}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => handleDelete(tag.id)}
                    style={styles.deleteButton}
                  >
                    <TrashIcon size={18} color={colors.status.error} />
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>
        )}

        <View style={styles.footer} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.background.tertiary,
  },
  closeButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    ...typography.headline,
    color: colors.text.primary,
  },
  saveButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  section: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.lg,
  },
  sectionTitle: {
    ...typography.footnote,
    color: colors.text.secondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: spacing.sm,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  categoryChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
    borderWidth: 1.5,
  },
  categoryLabel: {
    ...typography.body,
    fontWeight: '600',
  },
  input: {
    backgroundColor: colors.background.secondary,
    borderRadius: radius.md,
    padding: spacing.md,
    ...typography.body,
    color: colors.text.primary,
    borderWidth: 1,
    borderColor: colors.background.tertiary,
  },
  textArea: {
    minHeight: 100,
  },
  tagItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.secondary,
    padding: spacing.md,
    borderRadius: radius.md,
    marginBottom: spacing.xs,
  },
  tagChip: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
  },
  tagChipText: {
    ...typography.caption1,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  tagInfo: {
    flex: 1,
    marginLeft: spacing.sm,
  },
  tagLabel: {
    ...typography.body,
    color: colors.text.primary,
  },
  tagTime: {
    ...typography.caption1,
    color: colors.text.secondary,
  },
  deleteButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footer: {
    height: spacing['3xl'],
  },
});
