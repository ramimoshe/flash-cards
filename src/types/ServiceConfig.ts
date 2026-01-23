export type TranslationProvider = 'google' | 'mymemory' | 'libretranslate';
export type SentenceProvider = 'freedictionary' | 'wordnik';
export type TTSProvider = 'browser' | 'google';
export type DictionarySource = 'default' | 'oxford-5000';

export interface Settings {
  translationProvider: TranslationProvider;
  sentenceProvider: SentenceProvider;
  ttsProvider: TTSProvider;
  isOfflineMode: boolean;
  selectedDictionary: DictionarySource;
  apiKeys: {
    wordnik?: string;
    googleTTS?: string;
  };
}

export interface APIConfig {
  translation: {
    provider: TranslationProvider;
    timeout: number;
  };
  sentenceGenerator: {
    provider: SentenceProvider;
    maxSentences: number;
  };
  tts: {
    provider: TTSProvider;
  };
}
