import { useState, useEffect } from 'react';
import { CEFRLevel } from '@/types/Word';
import { ICEFRService } from '@/services/interfaces/ICEFRService';

export function useCEFR(service: ICEFRService) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Load dataset on mount
    service.loadDataset().catch((err) => {
      console.error('Failed to load CEFR dataset:', err);
    });
  }, [service]);

  const detectLevel = async (word: string): Promise<CEFRLevel> => {
    setLoading(true);
    setError(null);

    try {
      const level = await service.getLevel(word);
      return level;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Level detection failed';
      setError(errorMessage);
      return 'Unknown';
    } finally {
      setLoading(false);
    }
  };

  return { detectLevel, loading, error };
}
