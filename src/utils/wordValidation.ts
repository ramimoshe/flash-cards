import { Word, Language } from '@/types/Word';

export function normalizeWord(word: string): string {
  return word.trim().toLowerCase();
}

export function isDuplicate(
  word: string,
  language: Language,
  existingWords: Word[],
  excludeId?: string
): boolean {
  const normalized = normalizeWord(word);
  return existingWords.some(
    (w) =>
      normalizeWord(w.word) === normalized &&
      w.sourceLanguage === language &&
      w.id !== excludeId
  );
}

export function validateWord(word: string): { valid: boolean; error?: string } {
  if (!word || word.trim().length === 0) {
    return { valid: false, error: 'Word cannot be empty' };
  }

  if (word.trim().length > 100) {
    return { valid: false, error: 'Word is too long (max 100 characters)' };
  }

  return { valid: true };
}
