import { Link } from 'react-router-dom';

export function ManageHub(): React.ReactElement {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">📚 Manage Words</h1>
        <p className="text-lg text-gray-600">Organize your vocabulary collection</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Word List */}
        <Link
          to="/manage/words"
          className="bg-white rounded-lg shadow-md p-8 hover:shadow-xl transition-shadow duration-200 hover:-translate-y-1 transform"
        >
          <div className="text-center">
            <div className="text-6xl mb-4">📋</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Word List</h2>
            <p className="text-gray-600 mb-4">
              View and search through your vocabulary collection. Browse all words with their
              translations and details.
            </p>
            <div className="inline-block bg-primary text-white px-6 py-2 rounded-lg font-medium">
              View List
            </div>
          </div>
        </Link>

        {/* Manage Words */}
        <Link
          to="/manage/edit"
          className="bg-white rounded-lg shadow-md p-8 hover:shadow-xl transition-shadow duration-200 hover:-translate-y-1 transform"
        >
          <div className="text-center">
            <div className="text-6xl mb-4">✏️</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Manage Words</h2>
            <p className="text-gray-600 mb-4">
              Add new words to your collection. Edit translations, add example sentences, and
              organize your vocabulary.
            </p>
            <div className="inline-block bg-primary text-white px-6 py-2 rounded-lg font-medium">
              Edit Words
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
