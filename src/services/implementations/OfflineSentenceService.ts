import {
  ISentenceGeneratorService,
  SentenceResult,
} from '@/services/interfaces/ISentenceGeneratorService';

export class OfflineSentenceService implements ISentenceGeneratorService {
  async generateSentences(word: string, count: number): Promise<SentenceResult> {
    console.warn('📴 Offline mode: Sentence generation service disabled');
    return { sentences: [] };
  }

  isAvailable(): boolean {
    return true; // Always available, just returns empty results
  }

  getName(): string {
    return 'Offline Mode (No Sentence Generation)';
  }
}
