import {
  ITranslationService,
  TranslationResult,
} from '@/services/interfaces/ITranslationService';
import { getCommonTranslations } from '@/data/commonTranslations';

export class MyMemoryTranslationService implements ITranslationService {
  private readonly baseUrl = 'https://api.mymemory.translated.net/get';

  /**
   * Decode HTML entities and clean up translation text
   */
  private decodeHtmlEntities(text: string): string {
    // Create a temporary element to decode HTML entities
    const textarea = document.createElement('textarea');
    textarea.innerHTML = text;
    const decoded = textarea.value;
    
    // Remove extra whitespace and newlines
    return decoded.trim().replace(/\s+/g, ' ');
  }

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

      // Then fetch from API to supplement
      const langPair = `${sourceLang}|${targetLang}`;
      const url = `${this.baseUrl}?q=${encodeURIComponent(word)}&langpair=${langPair}`;

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Translation API request failed');
      }

      const data = await response.json();

      // Add main translation if not already present
      if (data.responseData?.translatedText) {
        const decoded = this.decodeHtmlEntities(data.responseData.translatedText);
        if (decoded && !translations.includes(decoded)) {
          translations.push(decoded);
          confidence.push(90);
        }
      }

      // Add matches if available (prioritize by quality)
      if (data.matches && Array.isArray(data.matches)) {
        // Sort matches by quality (highest first)
        const sortedMatches = [...data.matches].sort((a, b) => (b.quality || 0) - (a.quality || 0));
        
        sortedMatches.slice(0, 3).forEach((match: { translation: string; quality: number }) => {
          if (match.translation) {
            const decoded = this.decodeHtmlEntities(match.translation);
            if (decoded && !translations.includes(decoded)) {
              translations.push(decoded);
              confidence.push(match.quality || 50);
            }
          }
        });
      }

      return { translations, confidence };
    } catch (error) {
      console.error('MyMemory translation error:', error);
      
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
    return 'MyMemory';
  }
}
