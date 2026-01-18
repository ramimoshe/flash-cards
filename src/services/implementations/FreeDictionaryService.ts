import {
  ISentenceGeneratorService,
  SentenceResult,
} from '@/services/interfaces/ISentenceGeneratorService';

interface Definition {
  definition: string;
  example?: string;
}

interface Meaning {
  partOfSpeech: string;
  definitions: Definition[];
}

interface DictionaryEntry {
  word: string;
  meanings: Meaning[];
}

export class FreeDictionaryService implements ISentenceGeneratorService {
  private readonly baseUrl = 'https://api.dictionaryapi.dev/api/v2/entries/en';

  async generateSentences(word: string, count: number): Promise<SentenceResult> {
    try {
      const url = `${this.baseUrl}/${encodeURIComponent(word)}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error('Dictionary API request failed');
      }

      const data: DictionaryEntry[] = await response.json();
      const sentences: string[] = [];

      // Extract example sentences from definitions
      for (const entry of data) {
        for (const meaning of entry.meanings) {
          for (const definition of meaning.definitions) {
            if (definition.example && sentences.length < count) {
              // Clean up the example sentence
              const sentence = definition.example.trim();
              if (sentence.length > 0 && sentence.length < 150) {
                sentences.push(sentence);
              }
            }
          }
        }
        if (sentences.length >= count) break;
      }

      return { sentences: sentences.slice(0, count) };
    } catch (error) {
      console.error('FreeDictionary error:', error);
      return { sentences: [] };
    }
  }

  isAvailable(): boolean {
    return typeof fetch !== 'undefined';
  }

  getName(): string {
    return 'Free Dictionary';
  }
}
