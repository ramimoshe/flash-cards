import { CEFRLevel } from '@/types/Word';
import { ICEFRService } from '@/services/interfaces/ICEFRService';
import { getDataPath } from '@/utils/basePath';

export class CEFRDatasetService implements ICEFRService {
  private dataset: Map<string, CEFRLevel> = new Map();
  private loaded = false;

  async loadDataset(): Promise<void> {
    if (this.loaded) {
      return;
    }

    try {
      // Files in public/ folder are served from root
      // In dev: /data/cefr-words.json
      // In prod: /flash-cards/data/cefr-words.json (handled by getDataPath)
      const response = await fetch(getDataPath('cefr-words.json'));
      
      if (!response.ok) {
        throw new Error(`Failed to load CEFR dataset: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      // Convert object to Map for faster lookups
      Object.entries(data).forEach(([word, level]) => {
        this.dataset.set(word.toLowerCase(), level as CEFRLevel);
      });
      
      this.loaded = true;
      console.log(`✓ CEFR dataset loaded: ${this.dataset.size} words`);
    } catch (error) {
      console.error('✗ Failed to load CEFR dataset:', error);
      // Continue without dataset - app will still work but level detection won't
    }
  }

  async getLevel(word: string): Promise<CEFRLevel> {
    if (!this.loaded) {
      await this.loadDataset();
    }

    const normalized = word.trim().toLowerCase();
    return this.dataset.get(normalized) || 'Unknown';
  }

  isAvailable(): boolean {
    return this.loaded;
  }
}
