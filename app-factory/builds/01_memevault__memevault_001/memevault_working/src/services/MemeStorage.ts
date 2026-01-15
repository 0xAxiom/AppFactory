import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Meme {
  id: string;
  uri: string;
  filename: string;
  tags: string[];
  caption?: string;
  dateAdded: Date;
  dateModified: Date;
  favorite: boolean;
  folderId?: string;
  metadata: {
    width?: number;
    height?: number;
    fileSize?: number;
    source: 'camera' | 'gallery' | 'import';
  };
}

export interface MemeFolder {
  id: string;
  name: string;
  description?: string;
  color: string;
  memeIds: string[];
  dateCreated: Date;
  dateModified: Date;
}

/**
 * MemeStorage - Local storage service for memes and folders
 */
export class MemeStorage {
  private static readonly MEMES_KEY = '@memevault_memes';
  private static readonly FOLDERS_KEY = '@memevault_folders';
  private static readonly SETTINGS_KEY = '@memevault_settings';
  private static readonly FREE_TIER_LIMIT = 100;

  static async initialize(): Promise<void> {
    try {
      // Test AsyncStorage
      await AsyncStorage.setItem('@memevault_test', 'test');
      await AsyncStorage.removeItem('@memevault_test');
      console.log('✅ MemeStorage initialized');
    } catch (error) {
      console.error('❌ MemeStorage initialization failed:', error);
      throw error;
    }
  }

  static async getAllMemes(): Promise<Meme[]> {
    try {
      const memesData = await AsyncStorage.getItem(this.MEMES_KEY);
      if (!memesData) return [];

      const memes = JSON.parse(memesData) as Meme[];
      return memes.map(meme => ({
        ...meme,
        dateAdded: new Date(meme.dateAdded),
        dateModified: new Date(meme.dateModified),
      }));
    } catch (error) {
      console.error('❌ Failed to get memes:', error);
      return [];
    }
  }

  static async saveMeme(meme: Omit<Meme, 'id' | 'dateAdded' | 'dateModified'>): Promise<string> {
    try {
      const existingMemes = await this.getAllMemes();
      
      const newMeme: Meme = {
        ...meme,
        id: `meme_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        dateAdded: new Date(),
        dateModified: new Date(),
      };

      const updatedMemes = [...existingMemes, newMeme];
      await AsyncStorage.setItem(this.MEMES_KEY, JSON.stringify(updatedMemes));
      
      return newMeme.id;
    } catch (error) {
      console.error('❌ Failed to save meme:', error);
      throw error;
    }
  }

  static async updateMeme(memeId: string, updates: Partial<Meme>): Promise<void> {
    try {
      const memes = await this.getAllMemes();
      const index = memes.findIndex(m => m.id === memeId);
      
      if (index === -1) throw new Error(`Meme not found: ${memeId}`);
      
      memes[index] = { ...memes[index], ...updates, dateModified: new Date() };
      await AsyncStorage.setItem(this.MEMES_KEY, JSON.stringify(memes));
    } catch (error) {
      console.error('❌ Failed to update meme:', error);
      throw error;
    }
  }

  static async deleteMeme(memeId: string): Promise<void> {
    try {
      const memes = await this.getAllMemes();
      const filtered = memes.filter(m => m.id !== memeId);
      await AsyncStorage.setItem(this.MEMES_KEY, JSON.stringify(filtered));
    } catch (error) {
      console.error('❌ Failed to delete meme:', error);
      throw error;
    }
  }

  static async searchMemes(query: string): Promise<Meme[]> {
    try {
      const allMemes = await this.getAllMemes();
      if (!query.trim()) return allMemes;

      const normalizedQuery = query.toLowerCase().trim();
      return allMemes.filter(meme => {
        const matchesTags = meme.tags.some(tag => 
          tag.toLowerCase().includes(normalizedQuery)
        );
        const matchesCaption = meme.caption?.toLowerCase().includes(normalizedQuery);
        const matchesFilename = meme.filename.toLowerCase().includes(normalizedQuery);
        
        return matchesTags || matchesCaption || matchesFilename;
      });
    } catch (error) {
      console.error('❌ Search failed:', error);
      return [];
    }
  }

  static async getMemeCount(): Promise<number> {
    try {
      const memes = await this.getAllMemes();
      return memes.length;
    } catch (error) {
      return 0;
    }
  }

  static async isFreeTierLimitReached(): Promise<boolean> {
    const count = await this.getMemeCount();
    return count >= this.FREE_TIER_LIMIT;
  }

  static async getAllFolders(): Promise<MemeFolder[]> {
    try {
      const foldersData = await AsyncStorage.getItem(this.FOLDERS_KEY);
      if (!foldersData) return [];

      const folders = JSON.parse(foldersData) as MemeFolder[];
      return folders.map(folder => ({
        ...folder,
        dateCreated: new Date(folder.dateCreated),
        dateModified: new Date(folder.dateModified),
      }));
    } catch (error) {
      console.error('❌ Failed to get folders:', error);
      return [];
    }
  }

  static async createFolder(name: string, color: string = '#FF6B6B'): Promise<string> {
    try {
      const existingFolders = await this.getAllFolders();
      
      const newFolder: MemeFolder = {
        id: `folder_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name,
        color,
        memeIds: [],
        dateCreated: new Date(),
        dateModified: new Date(),
      };

      const updatedFolders = [...existingFolders, newFolder];
      await AsyncStorage.setItem(this.FOLDERS_KEY, JSON.stringify(updatedFolders));
      
      return newFolder.id;
    } catch (error) {
      console.error('❌ Failed to create folder:', error);
      throw error;
    }
  }

  static async addMemeToFolder(memeId: string, folderId: string): Promise<void> {
    try {
      const folders = await this.getAllFolders();
      const folder = folders.find(f => f.id === folderId);
      
      if (!folder) throw new Error(`Folder not found: ${folderId}`);
      
      if (!folder.memeIds.includes(memeId)) {
        folder.memeIds.push(memeId);
        folder.dateModified = new Date();
        await AsyncStorage.setItem(this.FOLDERS_KEY, JSON.stringify(folders));
      }

      // Update meme's folderId
      await this.updateMeme(memeId, { folderId });
    } catch (error) {
      console.error('❌ Failed to add meme to folder:', error);
      throw error;
    }
  }

  static async clearAllData(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([
        this.MEMES_KEY,
        this.FOLDERS_KEY,
        this.SETTINGS_KEY,
      ]);
    } catch (error) {
      console.error('❌ Failed to clear data:', error);
      throw error;
    }
  }
}