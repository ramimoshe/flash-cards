import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useWords } from '@/context/WordsContext';
import { useSettings } from '@/context/SettingsContext';
import { ServiceFactory } from '@/services/ServiceFactory';
import { useTTS } from '@/hooks/useTTS';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { Word } from '@/types/Word';
import { shuffleArray, filterByLevel, filterByKnown } from '@/utils/arrayHelpers';
import { getTextDirection } from '@/utils/textNormalization';
import { GameSettings } from './FlashCardsSetup';

export function FlashCardsPlay(): React.ReactElement {
  const location = useLocation();
  const navigate = useNavigate();
  const { words, updateWord } = useWords();
  const { settings } = useSettings();
  
  const ttsService = ServiceFactory.createTTSService(
    settings.ttsProvider,
    settings.apiKeys.googleTTS,
    settings.isOfflineMode
  );
  const { speak, speaking } = useTTS(ttsService);

  const [gameCards, setGameCards] = useState<Word[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);

  // Get game settings from navigation state
  const gameSettings = location.state?.gameSettings as GameSettings | undefined;

  // Initialize game cards on mount or when settings change
  useEffect(() => {
    if (!gameSettings) {
      // No settings provided, redirect to setup
      navigate('/games/flashcards');
      return;
    }

    let filtered = [...words];

    // Filter based on game mode
    if (gameSettings.mode === 'unknown') {
      filtered = filterByKnown(filtered, false);
    } else if (gameSettings.mode === 'by-level' && gameSettings.selectedLevels) {
      filtered = filterByLevel(filtered, gameSettings.selectedLevels);
    }

    // Shuffle once
    const shuffled = shuffleArray(filtered);

    // Limit to selected number
    const limited =
      gameSettings.numberOfCards === 'all'
        ? shuffled
        : shuffled.slice(0, gameSettings.numberOfCards);

    setGameCards(limited);
    setCurrentIndex(0);
    setFlipped(false);
    setGameCompleted(false);
  }, [words, gameSettings, navigate]);

  const currentWord = gameCards[currentIndex];

  const handleNext = (): void => {
    if (currentIndex + 1 >= gameCards.length) {
      // Game completed
      setGameCompleted(true);
    } else {
      setCurrentIndex((prev) => prev + 1);
      setFlipped(false);
    }
  };

  const handlePrevious = (): void => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setFlipped(false);
    }
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

  const handlePlayAgain = (): void => {
    // Re-shuffle and restart
    const shuffled = shuffleArray([...gameCards]);
    setGameCards(shuffled);
    setCurrentIndex(0);
    setFlipped(false);
    setGameCompleted(false);
  };

  const handleBackToSetup = (): void => {
    navigate('/games/flashcards');
  };

  // No words available
  if (gameCards.length === 0 && !gameCompleted) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <p className="text-gray-600 mb-4">No words available for this mode.</p>
          <Button onClick={handleBackToSetup}>Back to Setup</Button>
        </div>
      </div>
    );
  }

  // Game completed screen
  if (gameCompleted) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Congratulations!</h1>
          <p className="text-lg text-gray-600 mb-8">
            You've completed all {gameCards.length} cards!
          </p>
          <div className="flex justify-center gap-4">
            <Button onClick={handlePlayAgain} variant="primary" size="lg">
              🔄 Play Again
            </Button>
            <Button onClick={handleBackToSetup} variant="secondary" size="lg">
              ← Back to Setup
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Gameplay screen
  return (
    <div className="max-w-4xl mx-auto">
      {/* Header with Exit button */}
      <div className="flex justify-between items-center mb-6">
        <Button onClick={handleBackToSetup} variant="ghost" size="sm">
          ← Exit Game
        </Button>
        <h1 className="text-2xl font-bold text-gray-900">Flash Cards</h1>
        <div className="w-24"></div> {/* Spacer for centering */}
      </div>

      {/* Progress */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-600">
            Card {currentIndex + 1} of {gameCards.length}
          </p>
          {settings.isOfflineMode && (
            <p className="text-sm text-amber-600 font-medium">📴 Using offline voice</p>
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
              onClick={() => handleSpeak(currentWord.word, currentWord.language)}
              disabled={speaking}
            >
              🔊
            </Button>
          </div>

          <div
            className={`text-center ${
              getTextDirection(currentWord.word) === 'rtl' ? 'rtl' : ''
            }`}
          >
            <h2 className="text-4xl font-bold mb-6">{currentWord.word}</h2>

            {!flipped ? (
              <div>
                <div className="space-y-3 mb-6">
                  {currentWord.sentences.map((sentence, idx) => (
                    <div key={idx} className="flex items-center justify-center gap-2">
                      <p className="text-lg text-gray-700">{sentence}</p>
                      <button
                        onClick={() => handleSpeak(sentence, currentWord.language)}
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
            <Button 
              onClick={handlePrevious} 
              disabled={currentIndex === 0}
              className="border-2 border-gray-300 bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-400"
            >
              ← Previous
            </Button>
            <Button onClick={handleMarkKnown} variant="secondary">
              {currentWord.isKnown ? 'Mark as Unknown' : 'Mark as Known'}
            </Button>
            <Button onClick={handleNext}>
              {currentIndex + 1 >= gameCards.length ? 'Finish' : 'Next →'}
            </Button>
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
