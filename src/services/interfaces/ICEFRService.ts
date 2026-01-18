import { CEFRLevel } from '@/types/Word';

export interface ICEFRService {
  getLevel(word: string): Promise<CEFRLevel>;
  loadDataset(): Promise<void>;
  isAvailable(): boolean;
}
