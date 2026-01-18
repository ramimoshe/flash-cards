import {
  ITranslationService,
  TranslationResult,
} from '@/services/interfaces/ITranslationService';
import { getCommonTranslations } from '@/data/commonTranslations';

export class GoogleTranslateService implements ITranslationService {
  private readonly baseUrl = 'https://translate.googleapis.com/translate_a/single';

  /**
   * Translate using Google Translate (unofficial free API)
   * This uses the public Google Translate endpoint
   */
  async translate(
    word: string,
    sourceLang: string,
    targetLang: string
  ): Promise<TranslationResult> {
    try {
      const translations: string[] = [];
      const confidence: number[] = [];

      // First, check our common translations dictionary for better quality
      if (sourceLang === 'en' && targetLang === 'he') {
        const commonTrans = getCommonTranslations(word, 'he');
        if (commonTrans.length > 0) {
          commonTrans.forEach((trans) => {
            translations.push(trans);
            confidence.push(100); // High confidence for curated translations
          });
        }
      }

      // Fetch from Google Translate
      const params = new URLSearchParams({
        client: 'gtx',
        sl: sourceLang,
        tl: targetLang,
        q: word,
      });
      // Add multiple dt parameters for different data types
      params.append('dt', 't');  // Translation
      params.append('dt', 'bd'); // Dictionary

      const url = `${this.baseUrl}?${params.toString()}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Google Translate API request failed: ${response.status}`);
      }

      const data = await response.json();

      // Parse main translation
      if (data[0] && Array.isArray(data[0])) {
        data[0].forEach((item: string[]) => {
          if (item[0]) {
            const translation = item[0].trim();
            if (translation && !translations.includes(translation)) {
              translations.push(translation);
              confidence.push(95);
            }
          }
        });
      }

      // Parse dictionary entries (alternative translations)
      if (data[1] && Array.isArray(data[1])) {
        data[1].forEach((entry: { entry: { word: string }[] }) => {
          if (entry.entry && Array.isArray(entry.entry)) {
            entry.entry.slice(0, 3).forEach((item: { word: string }) => {
              if (item.word) {
                const translation = item.word.trim();
                if (translation && !translations.includes(translation)) {
                  translations.push(translation);
                  confidence.push(85);
                }
              }
            });
          }
        });
      }

      // If no translations found, return empty
      if (translations.length === 0) {
        console.warn('No translations found from Google Translate');
      }

      return { translations, confidence };
    } catch (error) {
      console.error('Google Translate error:', error);

      // Fallback to common translations if API fails
      if (sourceLang === 'en' && targetLang === 'he') {
        const commonTrans = getCommonTranslations(word, 'he');
        if (commonTrans.length > 0) {
          return {
            translations: commonTrans,
            confidence: commonTrans.map(() => 100),
          };
        }
      }

      return { translations: [], confidence: [] };
    }
  }

  isAvailable(): boolean {
    return typeof fetch !== 'undefined';
  }

  getName(): string {
    return 'Google Translate';
  }
}
