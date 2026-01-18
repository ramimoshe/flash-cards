import { Word } from '@/types/Word';
import { IStorageService } from '@/services/interfaces/IStorageService';

const STORAGE_KEY = 'flash-cards-words';

export class LocalStorageService implements IStorageService {
  async saveWords(words: Word[]): Promise<void> {
    try {
      const data = JSON.stringify({ words });
      localStorage.setItem(STORAGE_KEY, data);
    } catch (error) {
      console.error('Failed to save words to localStorage:', error);
      throw new Error('Failed to save words');
    }
  }

  async loadWords(): Promise<Word[]> {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
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

  async clearWords(): Promise<void> {
    try {
      localStorage.removeItem(STORAGE_KEY);
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
