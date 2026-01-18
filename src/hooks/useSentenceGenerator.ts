import { useState } from 'react';
import { ISentenceGeneratorService } from '@/services/interfaces/ISentenceGeneratorService';

export function useSentenceGenerator(service: ISentenceGeneratorService) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateSentences = async (word: string, count: number): Promise<string[]> => {
    setLoading(true);
    setError(null);

    try {
      const result = await service.generateSentences(word, count);
      return result.sentences;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Sentence generation failed';
      setError(errorMessage);
      return [];
    } finally {
      setLoading(false);
    }
  };

  return { generateSentences, loading, error };
}
