import { Word } from '@/types/Word';
import { DictionarySource } from '@/types/ServiceConfig';

export interface IStorageService {
  saveWords(words: Word[], dictionary: DictionarySource): Promise<void>;
  loadWords(dictionary: DictionarySource): Promise<Word[]>;
  clearWords(dictionary: DictionarySource): Promise<void>;
  isAvailable(): boolean;
}
