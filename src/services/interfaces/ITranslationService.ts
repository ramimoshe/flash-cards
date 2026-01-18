export interface TranslationResult {
  translations: string[];
  confidence?: number[];
}

export interface ITranslationService {
  translate(
    word: string,
    sourceLang: string,
    targetLang: string
  ): Promise<TranslationResult>;
  isAvailable(): boolean;
  getName(): string;
}
