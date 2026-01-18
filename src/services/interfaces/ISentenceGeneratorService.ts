export interface SentenceResult {
  sentences: string[];
}

export interface ISentenceGeneratorService {
  generateSentences(word: string, count: number): Promise<SentenceResult>;
  isAvailable(): boolean;
  getName(): string;
}
