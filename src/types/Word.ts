export type CEFRLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2' | 'Unknown';

export type Language = 'en' | 'he';

export interface Word {
  id: string;
  word: string;
  language: Language;
  translations: string[];
  sentences: string[];
  translatedSentences: string[];
  isKnown: boolean;
  level?: CEFRLevel;
}

export interface WordsData {
  words: Word[];
}
