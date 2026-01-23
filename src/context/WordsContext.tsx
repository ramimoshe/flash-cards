import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Word } from '@/types/Word';
import { ServiceFactory } from '@/services/ServiceFactory';
import { getDataPath } from '@/utils/basePath';
import { useSettings } from './SettingsContext';
import { DictionarySource } from '@/types/ServiceConfig';

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
  const { settings } = useSettings();
  const [words, setWords] = useState<Word[]>([]);
  const [loading, setLoading] = useState(true);

  const getDictionaryFilename = (dictionary: DictionarySource): string => {
    return dictionary === 'default' ? 'default-words.json' : 'oxford-5000-words.json';
  };

  const loadWords = useCallback(async (): Promise<void> => {
    setLoading(true);
    try {
      const dictionary = settings.selectedDictionary;
      const loadedWords = await storageService.loadWords(dictionary);
      
      // If no words in storage, load from JSON file
      if (loadedWords.length === 0) {
        const filename = getDictionaryFilename(dictionary);
        console.log(`No words in storage, loading ${filename}...`);
        try {
          const response = await fetch(getDataPath(filename));
          if (response.ok) {
            const data = await response.json();
            if (data.words && Array.isArray(data.words)) {
              console.log(`✓ Loaded ${data.words.length} words from ${filename}`);
              setWords(data.words);
              // Save words to storage
              await storageService.saveWords(data.words, dictionary);
              return;
            }
          }
        } catch (err) {
          console.error(`Failed to load ${filename}:`, err);
        }
      }
      
      setWords(loadedWords);
    } catch (error) {
      console.error('Failed to load words:', error);
    } finally {
      setLoading(false);
    }
  }, [settings.selectedDictionary]);

  const saveWords = useCallback(async (): Promise<void> => {
    try {
      const dictionary = settings.selectedDictionary;
      await storageService.saveWords(words, dictionary);
    } catch (error) {
      console.error('Failed to save words:', error);
      throw error;
    }
  }, [words, settings.selectedDictionary]);

  const clearAllWords = useCallback(async (): Promise<void> => {
    try {
      const dictionary = settings.selectedDictionary;
      await storageService.clearWords(dictionary);
      setWords([]);
    } catch (error) {
      console.error('Failed to clear words:', error);
      throw error;
    }
  }, [settings.selectedDictionary]);

  // Load words on mount
  useEffect(() => {
    loadWords();
  }, [loadWords]);

  // Watch for dictionary changes and reload words
  useEffect(() => {
    console.log(`📚 Dictionary changed to: ${settings.selectedDictionary}`);
    loadWords();
  }, [settings.selectedDictionary]);

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
