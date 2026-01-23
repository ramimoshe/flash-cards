import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWords } from '@/context/WordsContext';
import { Button } from '@/components/common/Button';
import { CEFRLevel } from '@/types/Word';
import { filterByLevel, filterByKnown } from '@/utils/arrayHelpers';

type GameMode = 'unknown' | 'by-level' | 'all';

export interface GameSettings {
  mode: GameMode;
  selectedLevels?: CEFRLevel[];
  numberOfCards: number | 'all';
}

export function FlashCardsSetup(): React.ReactElement {
  const { words } = useWords();
  const navigate = useNavigate();
  
  const [gameMode, setGameMode] = useState<GameMode>('unknown');
  const [selectedLevels, setSelectedLevels] = useState<CEFRLevel[]>([]);
  const [numberOfCards, setNumberOfCards] = useState<number | 'all'>(10);
  const [error, setError] = useState('');

  const getAvailableWordsCount = (): number => {
    let filtered = [...words];
    
    if (gameMode === 'unknown') {
      filtered = filterByKnown(filtered, false);
    } else if (gameMode === 'by-level' && selectedLevels.length > 0) {
      filtered = filterByLevel(filtered, selectedLevels);
    }
    
    return filtered.length;
  };

  const handleStartGame = (): void => {
    setError('');

    // Validation
    if (gameMode === 'by-level' && selectedLevels.length === 0) {
      setError('Please select at least one level');
      return;
    }

    const availableWords = getAvailableWordsCount();
    if (availableWords === 0) {
      setError('No words available for the selected mode. Please add some words first.');
      return;
    }

    // Prepare game settings
    const gameSettings: GameSettings = {
      mode: gameMode,
      selectedLevels: gameMode === 'by-level' ? selectedLevels : undefined,
      numberOfCards,
    };

    // Navigate to play screen with settings
    navigate('/games/flashcards/play', { state: { gameSettings } });
  };

  const toggleLevel = (level: CEFRLevel): void => {
    setSelectedLevels((prev) =>
      prev.includes(level) ? prev.filter((l) => l !== level) : [...prev, level]
    );
  };

  const availableWords = getAvailableWordsCount();

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">🎴 Flash Cards Setup</h1>
        <p className="text-lg text-gray-600">Configure your practice session</p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-8">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* Game Mode Selection */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Game Mode</h2>
          
          <div className="space-y-3">
            {/* Practice Unknown Words */}
            <label className="flex items-start p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
              <input
                type="radio"
                name="gameMode"
                value="unknown"
                checked={gameMode === 'unknown'}
                onChange={() => setGameMode('unknown')}
                className="mt-1 mr-3"
              />
              <div>
                <div className="font-medium text-gray-900">Practice Unknown Words</div>
                <div className="text-sm text-gray-600">
                  Focus on words you haven't marked as known yet
                </div>
              </div>
            </label>

            {/* Practice by Level */}
            <label className="flex items-start p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
              <input
                type="radio"
                name="gameMode"
                value="by-level"
                checked={gameMode === 'by-level'}
                onChange={() => setGameMode('by-level')}
                className="mt-1 mr-3"
              />
              <div className="flex-1">
                <div className="font-medium text-gray-900">Practice by Level</div>
                <div className="text-sm text-gray-600 mb-3">
                  Choose specific CEFR levels to practice
                </div>
                
                {gameMode === 'by-level' && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {(['A1', 'A2', 'B1', 'B2', 'C1', 'C2'] as CEFRLevel[]).map((level) => (
                      <button
                        key={level}
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          toggleLevel(level);
                        }}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                          selectedLevels.includes(level)
                            ? 'bg-primary text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </label>

            {/* Practice All Words */}
            <label className="flex items-start p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
              <input
                type="radio"
                name="gameMode"
                value="all"
                checked={gameMode === 'all'}
                onChange={() => setGameMode('all')}
                className="mt-1 mr-3"
              />
              <div>
                <div className="font-medium text-gray-900">Practice All Words</div>
                <div className="text-sm text-gray-600">
                  Practice your entire vocabulary collection
                </div>
              </div>
            </label>
          </div>
        </div>

        {/* Number of Cards */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Number of Cards</h2>
          <select
            value={numberOfCards}
            onChange={(e) => setNumberOfCards(e.target.value === 'all' ? 'all' : parseInt(e.target.value))}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-lg"
          >
            <option value="5">5 cards</option>
            <option value="10">10 cards</option>
            <option value="15">15 cards</option>
            <option value="20">20 cards</option>
            <option value="25">25 cards</option>
            <option value="30">30 cards</option>
            <option value="all">All available cards</option>
          </select>
        </div>

        {/* Available Words Info */}
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-blue-800">
            <span className="font-semibold">{availableWords}</span> word{availableWords !== 1 ? 's' : ''} available for this mode
          </p>
        </div>

        {/* Start Game Button */}
        <Button
          onClick={handleStartGame}
          variant="primary"
          size="lg"
          className="w-full"
          disabled={availableWords === 0}
        >
          🎮 Start Game
        </Button>
      </div>
    </div>
  );
}
