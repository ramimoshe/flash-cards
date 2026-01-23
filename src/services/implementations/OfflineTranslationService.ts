import {
  ITranslationService,
  TranslationResult,
} from '@/services/interfaces/ITranslationService';

export class OfflineTranslationService implements ITranslationService {
  async translate(
    word: string,
    sourceLang: string,
    targetLang: string
  ): Promise<TranslationResult> {
    console.warn('📴 Offline mode: Translation service disabled');
    return { translations: [], confidence: [] };
  }

  isAvailable(): boolean {
    return true; // Always available, just returns empty results
  }

  getName(): string {
    return 'Offline Mode (No Translation)';
  }
}
