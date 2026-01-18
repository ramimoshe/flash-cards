import { useState } from 'react';
import { ITranslationService } from '@/services/interfaces/ITranslationService';

export function useTranslation(service: ITranslationService) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const translateWord = async (
    word: string,
    sourceLang: string,
    targetLang: string
  ): Promise<string[]> => {
    setLoading(true);
    setError(null);

    try {
      const result = await service.translate(word, sourceLang, targetLang);
      return result.translations;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Translation failed';
      setError(errorMessage);
      return [];
    } finally {
      setLoading(false);
    }
  };

  return { translateWord, loading, error };
}
