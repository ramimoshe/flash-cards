import { Word, CEFRLevel, Language } from '@/types/Word';

export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j]!, shuffled[i]!];
  }
  return shuffled;
}

export function filterByLevel(words: Word[], levels: CEFRLevel[]): Word[] {
  if (levels.length === 0) {
    return words;
  }
  return words.filter((word) => word.level && levels.includes(word.level));
}

export function filterByLanguage(words: Word[], language: Language | 'both'): Word[] {
  if (language === 'both') {
    return words;
  }
  return words.filter((word) => word.language === language);
}

export function filterByKnown(words: Word[], known: boolean): Word[] {
  return words.filter((word) => word.isKnown === known);
}

export function filterBySearchTerm(words: Word[], searchTerm: string): Word[] {
  if (!searchTerm || searchTerm.trim().length === 0) {
    return words;
  }

  const normalized = searchTerm.toLowerCase().trim();
  return words.filter(
    (word) =>
      word.word.toLowerCase().includes(normalized) ||
      word.translations.some((t) => t.toLowerCase().includes(normalized))
  );
}
