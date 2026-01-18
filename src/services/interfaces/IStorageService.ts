import { Word } from '@/types/Word';

export interface IStorageService {
  saveWords(words: Word[]): Promise<void>;
  loadWords(): Promise<Word[]>;
  clearWords(): Promise<void>;
  isAvailable(): boolean;
}
