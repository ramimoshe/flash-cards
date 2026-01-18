import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Word } from '@/types/Word';
import { ServiceFactory } from '@/services/ServiceFactory';

interface WordsContextType {
  words: Word[];
  addWord: (word: Word) => void;
  updateWord: (id: string, updates: Partial<Word>) => void;
  deleteWord: (id: string) => void;
  getWordById: (id: string) => Word | undefined;
  loadWords: () => Promise<void>;
  saveWords: () => Promise<void>;
  clearAllWords: () => Promise<void>;
  importWords: (newWords: Word[]) => void;
  loading: boolean;
}

const WordsContext = createContext<WordsContextType | undefined>(undefined);

const storageService = ServiceFactory.createStorageService();

export function WordsProvider({ children }: { children: ReactNode }): React.ReactElement {
  const [words, setWords] = useState<Word[]>([]);
  const [loading, setLoading] = useState(true);

  const loadWords = useCallback(async (): Promise<void> => {
    setLoading(true);
    try {
      const loadedWords = await storageService.loadWords();
      
      // If no words in storage, load default words
      if (loadedWords.length === 0) {
        console.log('No words in storage, loading default words...');
        try {
          const response = await fetch('/data/default-words.json');
          if (response.ok) {
            const data = await response.json();
            if (data.words && Array.isArray(data.words)) {
              console.log(`Loaded ${data.words.length} default words`);
              setWords(data.words);
              // Save default words to storage
              await storageService.saveWords(data.words);
              return;
            }
          }
        } catch (err) {
          console.error('Failed to load default words:', err);
        }
      }
      
      setWords(loadedWords);
    } catch (error) {
      console.error('Failed to load words:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const saveWords = useCallback(async (): Promise<void> => {
    try {
      await storageService.saveWords(words);
    } catch (error) {
      console.error('Failed to save words:', error);
      throw error;
    }
  }, [words]);

  const clearAllWords = useCallback(async (): Promise<void> => {
    try {
      await storageService.clearWords();
      setWords([]);
    } catch (error) {
      console.error('Failed to clear words:', error);
      throw error;
    }
  }, []);

  // Load words on mount
  useEffect(() => {
    loadWords();
  }, [loadWords]);

  // Auto-save words whenever they change
  useEffect(() => {
    if (!loading && words.length >= 0) {
      saveWords().catch((err) => console.error('Auto-save failed:', err));
    }
  }, [words, loading, saveWords]);

  const addWord = useCallback((word: Word): void => {
    setWords((prev) => [...prev, word]);
  }, []);

  const updateWord = useCallback((id: string, updates: Partial<Word>): void => {
    setWords((prev) => prev.map((word) => (word.id === id ? { ...word, ...updates } : word)));
  }, []);

  const deleteWord = useCallback((id: string): void => {
    setWords((prev) => prev.filter((word) => word.id !== id));
  }, []);

  const getWordById = useCallback(
    (id: string): Word | undefined => {
      return words.find((word) => word.id === id);
    },
    [words]
  );

  const importWords = useCallback((newWords: Word[]): void => {
    setWords(newWords);
  }, []);

  return (
    <WordsContext.Provider
      value={{
        words,
        addWord,
        updateWord,
        deleteWord,
        getWordById,
        loadWords,
        saveWords,
        clearAllWords,
        importWords,
        loading,
      }}
    >
      {children}
    </WordsContext.Provider>
  );
}

export function useWords(): WordsContextType {
  const context = useContext(WordsContext);
  if (!context) {
    throw new Error('useWords must be used within a WordsProvider');
  }
  return context;
}
