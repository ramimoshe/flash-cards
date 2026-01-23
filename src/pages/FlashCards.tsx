import { useState, useEffect } from 'react';
import { useWords } from '@/context/WordsContext';
import { useSettings } from '@/context/SettingsContext';
import { ServiceFactory } from '@/services/ServiceFactory';
import { useTTS } from '@/hooks/useTTS';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { Word, CEFRLevel } from '@/types/Word';
import { shuffleArray, filterByLevel, filterByKnown } from '@/utils/arrayHelpers';
import { getTextDirection } from '@/utils/textNormalization';

type GameMode = 'unknown' | 'by-level' | 'all';

export function FlashCards(): React.ReactElement {
  const { words, updateWord } = useWords();
  const { settings } = useSettings();
  const ttsService = ServiceFactory.createTTSService(
    settings.ttsProvider,
    settings.apiKeys.googleTTS,
    settings.isOfflineMode
  );
  const { speak, speaking } = useTTS(ttsService);

  const [gameMode, setGameMode] = useState<GameMode>('unknown');
  const [selectedLevels, setSelectedLevels] = useState<CEFRLevel[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [filteredWords, setFilteredWords] = useState<Word[]>([]);

  useEffect(() => {
    let filtered = [...words];

    if (gameMode === 'unknown') {
      filtered = filterByKnown(filtered, false);
    } else if (gameMode === 'by-level' && selectedLevels.length > 0) {
      filtered = filterByLevel(filtered, selectedLevels);
    }

    setFilteredWords(shuffleArray(filtered));
    setCurrentIndex(0);
    setFlipped(false);
  }, [words, gameMode, selectedLevels]);

  const currentWord = filteredWords[currentIndex];

  const handleNext = (): void => {
    setCurrentIndex((prev) => (prev + 1) % filteredWords.length);
    setFlipped(false);
  };

  const handleMarkKnown = (): void => {
    if (currentWord) {
      updateWord(currentWord.id, { isKnown: !currentWord.isKnown });
      handleNext();
    }
  };

  const handleSpeak = (text: string, lang: string): void => {
    speak(text, lang);
  };

  if (filteredWords.length === 0) {
    return (
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Flash Cards Game</h1>
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <p className="text-gray-600 mb-4">No words available for this mode.</p>
          <p className="text-sm text-gray-500">Add some words in the Manage Words section!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Flash Cards Game</h1>

      {/* Game Mode Selector */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <h2 className="text-lg font-semibold mb-3">Game Mode</h2>
        <div className="flex flex-wrap gap-2">
          <Button
            variant={gameMode === 'unknown' ? 'primary' : 'ghost'}
            onClick={() => setGameMode('unknown')}
          >
            Practice Unknown Words
          </Button>
          <Button
            variant={gameMode === 'by-level' ? 'primary' : 'ghost'}
            onClick={() => setGameMode('by-level')}
          >
            Practice by Level
          </Button>
          <Button
            variant={gameMode === 'all' ? 'primary' : 'ghost'}
            onClick={() => setGameMode('all')}
          >
            Practice All Words
          </Button>
        </div>

        {gameMode === 'by-level' && (
          <div className="mt-4">
            <p className="text-sm text-gray-600 mb-2">Select levels:</p>
            <div className="flex flex-wrap gap-2">
              {(['A1', 'A2', 'B1', 'B2', 'C1', 'C2'] as CEFRLevel[]).map((level) => (
                <Button
                  key={level}
                  size="sm"
                  variant={selectedLevels.includes(level) ? 'primary' : 'ghost'}
                  onClick={() => {
                    setSelectedLevels((prev) =>
                      prev.includes(level) ? prev.filter((l) => l !== level) : [...prev, level]
                    );
                  }}
                >
                  {level}
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Progress */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-600">
            Card {currentIndex + 1} of {filteredWords.length}
          </p>
          {settings.isOfflineMode && (
            <p className="text-sm text-amber-600 font-medium">
              📴 Using offline voice
            </p>
          )}
        </div>
      </div>

      {/* Flash Card */}
      {currentWord && (
        <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
          <div className="flex justify-between items-start mb-4">
            {currentWord.level && <Badge level={currentWord.level} />}
            <Button
              size="sm"
              variant="ghost"
              onClick={() => handleSpeak(currentWord.word, currentWord.sourceLanguage)}
              disabled={speaking}
            >
              🔊
            </Button>
          </div>

          <div className={`text-center ${getTextDirection(currentWord.word) === 'rtl' ? 'rtl' : ''}`}>
            <h2 className="text-4xl font-bold mb-6">{currentWord.word}</h2>

            {!flipped ? (
              <div>
                <div className="space-y-3 mb-6">
                  {currentWord.sentences.map((sentence, idx) => (
                    <div key={idx} className="flex items-center justify-center gap-2">
                      <p className="text-lg text-gray-700">{sentence}</p>
                      <button
                        onClick={() => handleSpeak(sentence, currentWord.sourceLanguage)}
                        className="text-primary hover:text-primary-dark"
                        disabled={speaking}
                      >
                        🔊
                      </button>
                    </div>
                  ))}
                </div>
                <Button onClick={() => setFlipped(true)}>Show Translation</Button>
              </div>
            ) : (
              <div>
                <div className="mb-4">
                  <h3 className="text-xl font-semibold mb-2">Translations:</h3>
                  {currentWord.translations.map((trans, idx) => (
                    <p key={idx} className="text-lg text-gray-700">
                      {trans}
                    </p>
                  ))}
                </div>
                <div className="mb-6">
                  <h3 className="text-xl font-semibold mb-2">Example Sentences:</h3>
                  {currentWord.translatedSentences.map((sentence, idx) => (
                    <p key={idx} className="text-lg text-gray-700 mb-1">
                      {sentence}
                    </p>
                  ))}
                </div>
                <Button onClick={() => setFlipped(false)}>Hide Translation</Button>
              </div>
            )}
          </div>

          <div className="flex justify-center gap-4 mt-8">
            <Button onClick={handleMarkKnown} variant="secondary">
              {currentWord.isKnown ? 'Mark as Unknown' : 'Mark as Known'}
            </Button>
            <Button onClick={handleNext}>Next Card</Button>
          </div>
        </div>
      )}

      {speaking && (
        <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg p-4">
          <LoadingSpinner size="sm" />
          <p className="text-sm text-gray-600 mt-2">Speaking...</p>
        </div>
      )}
    </div>
  );
}
