import { Word } from '@/types/Word';
import { IStorageService } from '@/services/interfaces/IStorageService';
import { DictionarySource } from '@/types/ServiceConfig';

const STORAGE_KEY_PREFIX = 'flash-cards-words';
const OLD_STORAGE_KEY = 'flash-cards-words';

export class LocalStorageService implements IStorageService {
  private migrated = false;

  private getStorageKey(dictionary: DictionarySource): string {
    return `${STORAGE_KEY_PREFIX}-${dictionary}`;
  }

  private migrateOldData(): void {
    if (this.migrated) return;
    
    try {
      // Check if old single-key data exists
      const oldData = localStorage.getItem(OLD_STORAGE_KEY);
      const defaultKey = this.getStorageKey('default');
      
      if (oldData && !localStorage.getItem(defaultKey)) {
        // Migrate to new default key
        localStorage.setItem(defaultKey, oldData);
        localStorage.removeItem(OLD_STORAGE_KEY);
        console.log('✓ Migrated existing words to default dictionary storage');
      }
    } catch (error) {
      console.error('Failed to migrate old data:', error);
    }
    
    this.migrated = true;
  }

  async saveWords(words: Word[], dictionary: DictionarySource): Promise<void> {
    try {
      const key = this.getStorageKey(dictionary);
      const data = JSON.stringify({ words });
      localStorage.setItem(key, data);
    } catch (error) {
      console.error('Failed to save words to localStorage:', error);
      throw new Error('Failed to save words');
    }
  }

  async loadWords(dictionary: DictionarySource): Promise<Word[]> {
    this.migrateOldData();
    
    try {
      const key = this.getStorageKey(dictionary);
      const data = localStorage.getItem(key);
      if (!data) {
        return [];
      }
      const parsed = JSON.parse(data);
      return parsed.words || [];
    } catch (error) {
      console.error('Failed to load words from localStorage:', error);
      return [];
    }
  }

  async clearWords(dictionary: DictionarySource): Promise<void> {
    try {
      const key = this.getStorageKey(dictionary);
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Failed to clear words from localStorage:', error);
      throw new Error('Failed to clear words');
    }
  }

  isAvailable(): boolean {
    try {
      const test = '__test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch {
      return false;
    }
  }
}
