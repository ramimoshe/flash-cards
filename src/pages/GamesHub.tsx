import { Link } from 'react-router-dom';

export function GamesHub(): React.ReactElement {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">🎮 Games</h1>
        <p className="text-lg text-gray-600">Choose a game to practice vocabulary</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Flash Cards Game */}
        <Link
          to="/games/flashcards"
          className="bg-white rounded-lg shadow-md p-8 hover:shadow-xl transition-shadow duration-200 hover:-translate-y-1 transform"
        >
          <div className="text-center">
            <div className="text-6xl mb-4">🎴</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Flash Cards</h2>
            <p className="text-gray-600 mb-4">
              Practice vocabulary with interactive flashcards. Test your knowledge with translations
              and example sentences.
            </p>
            <div className="inline-block bg-primary text-white px-6 py-2 rounded-lg font-medium">
              Play Now
            </div>
          </div>
        </Link>

        {/* Coming Soon - Memory Game */}
        <div className="bg-gray-100 rounded-lg shadow-md p-8 opacity-60 cursor-not-allowed">
          <div className="text-center">
            <div className="text-6xl mb-4">🎯</div>
            <h2 className="text-2xl font-bold text-gray-500 mb-2">Memory Game</h2>
            <p className="text-gray-500 mb-4">
              Match words with their translations in this fun memory challenge.
            </p>
            <div className="inline-block bg-gray-400 text-white px-6 py-2 rounded-lg font-medium">
              Coming Soon
            </div>
          </div>
        </div>

        {/* Quiz Game */}
        <Link
          to="/games/quiz"
          className="bg-white rounded-lg shadow-md p-8 hover:shadow-xl transition-shadow duration-200 hover:-translate-y-1 transform"
        >
          <div className="text-center">
            <div className="text-6xl mb-4">📝</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Quiz</h2>
            <p className="text-gray-600 mb-4">
              Test your vocabulary knowledge with multiple-choice questions and track your progress.
            </p>
            <div className="inline-block bg-primary text-white px-6 py-2 rounded-lg font-medium">
              Play Now
            </div>
          </div>
        </Link>

        {/* Coming Soon - Spelling Practice */}
        <div className="bg-gray-100 rounded-lg shadow-md p-8 opacity-60 cursor-not-allowed">
          <div className="text-center">
            <div className="text-6xl mb-4">✍️</div>
            <h2 className="text-2xl font-bold text-gray-500 mb-2">Spelling Practice</h2>
            <p className="text-gray-500 mb-4">
              Improve your spelling by typing words you hear. Perfect for listening practice.
            </p>
            <div className="inline-block bg-gray-400 text-white px-6 py-2 rounded-lg font-medium">
              Coming Soon
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
