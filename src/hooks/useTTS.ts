import { useState } from 'react';
import { ITTSService } from '@/services/interfaces/ITTSService';

export function useTTS(service: ITTSService) {
  const [speaking, setSpeaking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const speak = async (text: string, lang: string): Promise<void> => {
    setSpeaking(true);
    setError(null);

    try {
      await service.speak(text, lang);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Speech failed';
      setError(errorMessage);
    } finally {
      setSpeaking(false);
    }
  };

  const stop = (): void => {
    service.stop();
    setSpeaking(false);
  };

  const pause = (): void => {
    service.pause();
  };

  const resume = (): void => {
    service.resume();
  };

  return { speak, stop, pause, resume, speaking, error };
}
