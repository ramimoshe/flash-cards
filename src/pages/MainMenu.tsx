import { useNavigate } from 'react-router-dom';

export function MainMenu(): React.ReactElement {
  const navigate = useNavigate();

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">Welcome to Language Learner</h1>
        <p className="text-xl text-gray-600">Master English & Hebrew Vocabulary</p>
      </div>

      <div className="space-y-4">
        {/* Games Button */}
        <button
          onClick={() => navigate('/games')}
          className="w-full bg-white rounded-lg shadow-md p-8 hover:shadow-xl hover:-translate-y-1 transform transition-all duration-200 text-left"
        >
          <div className="flex items-center gap-4">
            <div className="text-5xl">🎮</div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-1">Games</h2>
              <p className="text-gray-600">Practice with interactive flashcards and games</p>
            </div>
            <div className="text-gray-400 text-2xl">→</div>
          </div>
        </button>

        {/* Manage Words Button */}
        <button
          onClick={() => navigate('/manage')}
          className="w-full bg-white rounded-lg shadow-md p-8 hover:shadow-xl hover:-translate-y-1 transform transition-all duration-200 text-left"
        >
          <div className="flex items-center gap-4">
            <div className="text-5xl">📚</div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-1">Manage Words</h2>
              <p className="text-gray-600">View, edit, and organize your vocabulary collection</p>
            </div>
            <div className="text-gray-400 text-2xl">→</div>
          </div>
        </button>

        {/* Settings Button */}
        <button
          onClick={() => navigate('/settings')}
          className="w-full bg-white rounded-lg shadow-md p-8 hover:shadow-xl hover:-translate-y-1 transform transition-all duration-200 text-left"
        >
          <div className="flex items-center gap-4">
            <div className="text-5xl">⚙️</div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-1">Settings</h2>
              <p className="text-gray-600">Configure app preferences and manage data</p>
            </div>
            <div className="text-gray-400 text-2xl">→</div>
          </div>
        </button>
      </div>
    </div>
  );
}
