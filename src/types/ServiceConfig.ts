export type TranslationProvider = 'google' | 'mymemory' | 'libretranslate';
export type SentenceProvider = 'freedictionary' | 'wordnik';
export type TTSProvider = 'browser' | 'google';

export interface Settings {
  translationProvider: TranslationProvider;
  sentenceProvider: SentenceProvider;
  ttsProvider: TTSProvider;
  isOfflineMode: boolean;
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
