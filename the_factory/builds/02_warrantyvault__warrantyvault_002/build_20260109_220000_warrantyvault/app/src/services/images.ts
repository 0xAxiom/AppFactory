/**
 * Image Service for receipt photo capture and storage
 */

import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { v4 as uuidv4 } from 'uuid';

// Directory for storing receipt images
const RECEIPTS_DIR = `${FileSystem.documentDirectory}receipts/`;

/**
 * Ensure receipts directory exists
 */
async function ensureReceiptsDir(): Promise<void> {
  const dirInfo = await FileSystem.getInfoAsync(RECEIPTS_DIR);
  if (!dirInfo.exists) {
    await FileSystem.makeDirectoryAsync(RECEIPTS_DIR, { intermediates: true });
  }
}

/**
 * Request camera permissions
 */
export async function requestCameraPermissions(): Promise<boolean> {
  const { status } = await ImagePicker.requestCameraPermissionsAsync();
  return status === 'granted';
}

/**
 * Request media library permissions
 */
export async function requestMediaLibraryPermissions(): Promise<boolean> {
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  return status === 'granted';
}

/**
 * Pick image from camera
 */
export async function pickImageFromCamera(): Promise<string | null> {
  const hasPermission = await requestCameraPermissions();
  if (!hasPermission) {
    return null;
  }

  const result = await ImagePicker.launchCameraAsync({
    mediaTypes: ['images'],
    allowsEditing: true,
    aspect: [3, 4],
    quality: 0.8,
  });

  if (result.canceled || !result.assets[0]) {
    return null;
  }

  return saveImageToReceipts(result.assets[0].uri);
}

/**
 * Pick image from library
 */
export async function pickImageFromLibrary(): Promise<string | null> {
  const hasPermission = await requestMediaLibraryPermissions();
  if (!hasPermission) {
    return null;
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['images'],
    allowsEditing: true,
    aspect: [3, 4],
    quality: 0.8,
  });

  if (result.canceled || !result.assets[0]) {
    return null;
  }

  return saveImageToReceipts(result.assets[0].uri);
}

/**
 * Save image to receipts directory
 */
async function saveImageToReceipts(sourceUri: string): Promise<string> {
  await ensureReceiptsDir();

  const filename = `receipt_${uuidv4()}.jpg`;
  const destUri = `${RECEIPTS_DIR}${filename}`;

  await FileSystem.copyAsync({
    from: sourceUri,
    to: destUri,
  });

  return destUri;
}

/**
 * Delete a receipt image
 */
export async function deleteReceiptImage(uri: string): Promise<void> {
  try {
    const fileInfo = await FileSystem.getInfoAsync(uri);
    if (fileInfo.exists) {
      await FileSystem.deleteAsync(uri);
    }
  } catch (error) {
    console.error('Error deleting receipt image:', error);
  }
}

/**
 * Get the size of all stored receipts
 */
export async function getStorageUsage(): Promise<number> {
  try {
    await ensureReceiptsDir();
    const files = await FileSystem.readDirectoryAsync(RECEIPTS_DIR);
    let totalSize = 0;

    for (const file of files) {
      const info = await FileSystem.getInfoAsync(`${RECEIPTS_DIR}${file}`);
      if (info.exists && info.size) {
        totalSize += info.size;
      }
    }

    return totalSize;
  } catch (error) {
    console.error('Error calculating storage usage:', error);
    return 0;
  }
}
