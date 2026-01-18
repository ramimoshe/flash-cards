import {
  ITranslationService,
  TranslationResult,
} from '@/services/interfaces/ITranslationService';

export class LibreTranslateService implements ITranslationService {
  private readonly baseUrl = 'https://libretranslate.com/translate';

  async translate(
    word: string,
    sourceLang: string,
    targetLang: string
  ): Promise<TranslationResult> {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          q: word,
          source: sourceLang,
          target: targetLang,
          format: 'text',
        }),
      });

      if (!response.ok) {
        throw new Error('LibreTranslate API request failed');
      }

      const data = await response.json();
      const translations: string[] = [];

      if (data.translatedText) {
        translations.push(data.translatedText);
      }

      return { translations, confidence: [100] };
    } catch (error) {
      console.error('LibreTranslate error:', error);
      return { translations: [], confidence: [] };
    }
  }

  isAvailable(): boolean {
    return typeof fetch !== 'undefined' && navigator.onLine;
  }

  getName(): string {
    return 'LibreTranslate';
  }
}
