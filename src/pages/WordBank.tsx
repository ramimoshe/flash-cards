import { useState, useEffect } from 'react';
import { useWords } from '@/context/WordsContext';
import { useSettings } from '@/context/SettingsContext';
import { ServiceFactory } from '@/services/ServiceFactory';
import { useTranslation } from '@/hooks/useTranslation';
import { useSentenceGenerator } from '@/hooks/useSentenceGenerator';
import { useCEFR } from '@/hooks/useCEFR';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Word, Language, CEFRLevel } from '@/types/Word';
import { isDuplicate, validateWord } from '@/utils/wordValidation';

// Helper functions for multi-value parsing
function parseMultiValue(text: string): string[] {
  return text
    .split(/[,\n]/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function formatMultiValue(arr: string[]): string {
  return arr.join(', ');
}

function parseSentences(text: string): string[] {
  return text
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean);
}

export function WordBank(): React.ReactElement {
  const { words, addWord } = useWords();
  const { settings } = useSettings();

  const translationService = ServiceFactory.createTranslationService(
    settings.translationProvider,
    settings.isOfflineMode
  );
  const sentenceService = ServiceFactory.createSentenceGeneratorService(
    settings.sentenceProvider,
    settings.apiKeys.wordnik,
    settings.isOfflineMode
  );
  const cefrService = ServiceFactory.createCEFRService();

  const { translateWord, loading: translating } = useTranslation(translationService);
  const { generateSentences, loading: generating } = useSentenceGenerator(sentenceService);
  const { detectLevel, loading: detecting } = useCEFR(cefrService);

  const [word, setWord] = useState('');
  const [language, setLanguage] = useState<Language>('en');
  const [translationsText, setTranslationsText] = useState('');
  const [sentencesText, setSentencesText] = useState('');
  const [translatedSentencesText, setTranslatedSentencesText] = useState('');
  const [level, setLevel] = useState<CEFRLevel>('Unknown');
  const [isKnown, setIsKnown] = useState(false);
  const [error, setError] = useState('');
  const [isAutoFilling, setIsAutoFilling] = useState(false);

  const handleAutoFillAll = async (): Promise<void> => {
    if (!word.trim()) {
      setError('Please enter a word first');
      return;
    }

    setIsAutoFilling(true);
    setError('');

    try {
      const targetLang = language === 'en' ? 'he' : 'en';

      // 1. Translate word
      const translationResults = await translateWord(word, language, targetLang);
      if (translationResults.length > 0) {
        setTranslationsText(formatMultiValue(translationResults));
      }

      // 2. Detect Level (only for English)
      if (language === 'en') {
        const detectedLevel = await detectLevel(word);
        setLevel(detectedLevel);
      }

      // 3. Generate Sentences (only for English)
      if (language === 'en') {
        const sentenceResults = await generateSentences(word, 2);
        if (sentenceResults.length > 0) {
          setSentencesText(sentenceResults.join('\n'));

          // 4. Translate each sentence to Hebrew
          const translatedSentencesArray: string[] = [];
          for (const sentence of sentenceResults) {
            try {
              const sentenceTranslations = await translateWord(sentence, 'en', 'he');
              if (sentenceTranslations.length > 0) {
                translatedSentencesArray.push(sentenceTranslations[0]); // Use first translation
              } else {
                translatedSentencesArray.push(''); // Empty if translation fails
              }
            } catch (err) {
              console.error('Failed to translate sentence:', sentence, err);
              translatedSentencesArray.push(''); // Empty if error
            }
          }
          setTranslatedSentencesText(translatedSentencesArray.join('\n'));
        }
      }
    } catch (err) {
      console.error('Auto-fill error:', err);
      setError('Failed to auto-fill. Please try again or enter manually.');
    } finally {
      setIsAutoFilling(false);
    }
  };

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    setError('');

    const validation = validateWord(word);
    if (!validation.valid) {
      setError(validation.error || 'Invalid word');
      return;
    }

    if (isDuplicate(word, language, words)) {
      setError('This word already exists in your word bank');
      return;
    }

    const translations = parseMultiValue(translationsText);
    const sentences = parseSentences(sentencesText);
    const translatedSentences = parseSentences(translatedSentencesText);

    if (translations.length === 0) {
      setError('Please add at least one translation');
      return;
    }

    const newWord: Word = {
      id: Date.now().toString(),
      word: word.trim(),
      language,
      translations,
      sentences,
      translatedSentences,
      isKnown,
      level,
    };

    addWord(newWord);

    // Reset form
    setWord('');
    setTranslationsText('');
    setSentencesText('');
    setTranslatedSentencesText('');
    setLevel('Unknown');
    setIsKnown(false);
    alert('Word added successfully!');
  };

  const isLoading = translating || generating || detecting || isAutoFilling;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Manage Words</h1>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Add New Word</h2>
          <Button
            type="submit"
            form="word-form"
            variant="primary"
            size="lg"
            disabled={!word.trim() || isLoading}
          >
            Add Word
          </Button>
        </div>

        <form id="word-form" onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Word"
              value={word}
              onChange={(e) => setWord(e.target.value)}
              placeholder="Enter word"
              required
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as Language)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="en">English</option>
                <option value="he">Hebrew</option>
              </select>
            </div>
          </div>

          <div className="flex justify-center">
            <Button
              type="button"
              onClick={handleAutoFillAll}
              variant="secondary"
              size="lg"
              disabled={!word.trim() || isAutoFilling || settings.isOfflineMode}
              loading={isAutoFilling}
              className="w-full max-w-md"
              title={settings.isOfflineMode ? 'Requires internet connection' : 'Auto-fill translations, level, and sentences'}
            >
              🤖 Auto-Fill from Internet
            </Button>
          </div>
          
          {settings.isOfflineMode && (
            <div className="bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded text-center">
              📴 Offline Mode: Auto-fill features disabled. Enter translations and sentences manually.
            </div>
          )}


          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Translations (comma-separated)
            </label>
            <textarea
              value={translationsText}
              onChange={(e) => setTranslationsText(e.target.value)}
              placeholder="e.g., לשחק, משחק, הצגה"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              rows={2}
              required
            />
            {translationsText && (
              <p className="text-xs text-gray-500 mt-1">
                {parseMultiValue(translationsText).length} translation(s)
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Example Sentences (one per line)
            </label>
            <textarea
              value={sentencesText}
              onChange={(e) => setSentencesText(e.target.value)}
              placeholder="Children learn through play.&#10;This kind of play helps develop skills."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              rows={3}
            />
            {sentencesText && (
              <p className="text-xs text-gray-500 mt-1">
                {parseSentences(sentencesText).length} sentence(s)
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Translated Sentences (one per line)
            </label>
            <textarea
              value={translatedSentencesText}
              onChange={(e) => setTranslatedSentencesText(e.target.value)}
              placeholder="ילדים לומדים דרך משחק.&#10;סוג זה של משחק עוזר לפתח מיומנויות."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">CEFR Level</label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value as CEFRLevel)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="Unknown">Unknown</option>
                <option value="A1">A1 - Beginner</option>
                <option value="A2">A2 - Elementary</option>
                <option value="B1">B1 - Intermediate</option>
                <option value="B2">B2 - Upper Intermediate</option>
                <option value="C1">C1 - Advanced</option>
                <option value="C2">C2 - Proficient</option>
              </select>
            </div>

            <div className="flex items-end pb-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={isKnown}
                  onChange={(e) => setIsKnown(e.target.checked)}
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded mr-2"
                />
                <span className="text-sm font-medium text-gray-700">Mark as Known</span>
              </label>
            </div>
          </div>
        </form>
      </div>

      <div className="mt-6 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Your Words</h2>
        <p className="text-gray-600">
          Total words: {words.length} | Known: {words.filter((w) => w.isKnown).length} | Learning:{' '}
          {words.filter((w) => !w.isKnown).length}
        </p>
      </div>
    </div>
  );
}
