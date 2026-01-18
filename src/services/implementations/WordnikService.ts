import {
  ISentenceGeneratorService,
  SentenceResult,
} from '@/services/interfaces/ISentenceGeneratorService';

export class WordnikService implements ISentenceGeneratorService {
  private readonly baseUrl = 'https://api.wordnik.com/v4/word.json';
  private apiKey: string;

  constructor(apiKey: string = '') {
    this.apiKey = apiKey;
  }

  async generateSentences(word: string, count: number): Promise<SentenceResult> {
    if (!this.apiKey) {
      console.warn('Wordnik API key not provided');
      return { sentences: [] };
    }

    try {
      const url = `${this.baseUrl}/${encodeURIComponent(word)}/examples?limit=${count}&api_key=${this.apiKey}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error('Wordnik API request failed');
      }

      const data = await response.json();
      const sentences: string[] = [];

      if (data.examples && Array.isArray(data.examples)) {
        data.examples.forEach((example: { text: string }) => {
          if (example.text && sentences.length < count) {
            sentences.push(example.text.trim());
          }
        });
      }

      return { sentences };
    } catch (error) {
      console.error('Wordnik error:', error);
      return { sentences: [] };
    }
  }

  isAvailable(): boolean {
    return typeof fetch !== 'undefined' && this.apiKey.length > 0;
  }

  getName(): string {
    return 'Wordnik';
  }
}
