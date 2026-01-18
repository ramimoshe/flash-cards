import { useState } from 'react';
import { useWords } from '@/context/WordsContext';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';
import { Input } from '@/components/common/Input';
import { Word, CEFRLevel } from '@/types/Word';
import { filterBySearchTerm, filterByLevel, filterByKnown } from '@/utils/arrayHelpers';

type FilterTab = 'all' | 'learning' | 'known';

export function WordList(): React.ReactElement {
  const { words, updateWord, deleteWord } = useWords();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTab, setFilterTab] = useState<FilterTab>('all');
  const [levelFilter, setLevelFilter] = useState<CEFRLevel | 'all'>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  let filteredWords = filterBySearchTerm(words, searchTerm);

  if (filterTab === 'learning') {
    filteredWords = filterByKnown(filteredWords, false);
  } else if (filterTab === 'known') {
    filteredWords = filterByKnown(filteredWords, true);
  }

  if (levelFilter !== 'all') {
    filteredWords = filterByLevel(filteredWords, [levelFilter]);
  }

  const handleToggleKnown = (word: Word): void => {
    updateWord(word.id, { isKnown: !word.isKnown });
  };

  const handleDelete = (id: string): void => {
    if (confirm('Are you sure you want to delete this word?')) {
      deleteWord(id);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Word List</h1>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="mb-4">
          <Input
            type="text"
            placeholder="Search words..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          <Button
            size="sm"
            variant={filterTab === 'all' ? 'primary' : 'ghost'}
            onClick={() => setFilterTab('all')}
          >
            All Words ({words.length})
          </Button>
          <Button
            size="sm"
            variant={filterTab === 'learning' ? 'primary' : 'ghost'}
            onClick={() => setFilterTab('learning')}
          >
            Learning ({words.filter((w) => !w.isKnown).length})
          </Button>
          <Button
            size="sm"
            variant={filterTab === 'known' ? 'primary' : 'ghost'}
            onClick={() => setFilterTab('known')}
          >
            Known ({words.filter((w) => w.isKnown).length})
          </Button>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            size="sm"
            variant={levelFilter === 'all' ? 'primary' : 'ghost'}
            onClick={() => setLevelFilter('all')}
          >
            All Levels
          </Button>
          {(['A1', 'A2', 'B1', 'B2', 'C1', 'C2'] as CEFRLevel[]).map((level) => (
            <Button
              key={level}
              size="sm"
              variant={levelFilter === level ? 'primary' : 'ghost'}
              onClick={() => setLevelFilter(level)}
            >
              {level}
            </Button>
          ))}
        </div>
      </div>

      {/* Word List */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {filteredWords.length === 0 ? (
          <div className="p-8 text-center text-gray-600">
            <p>No words found.</p>
          </div>
        ) : (
          <div className="divide-y">
            {filteredWords.map((word) => (
              <div key={word.id} className="p-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-semibold">{word.word}</h3>
                      {word.level && <Badge level={word.level} size="sm" />}
                      <span className="text-sm text-gray-500">({word.language})</span>
                    </div>
                    <p className="text-gray-600 mt-1">
                      {word.translations.slice(0, 3).join(', ')}
                      {word.translations.length > 3 && '...'}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant={word.isKnown ? 'primary' : 'ghost'}
                      onClick={() => handleToggleKnown(word)}
                    >
                      {word.isKnown ? '✓ Known' : 'Mark Known'}
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setExpandedId(expandedId === word.id ? null : word.id)}
                    >
                      {expandedId === word.id ? '▲' : '▼'}
                    </Button>
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => handleDelete(word.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>

                {expandedId === word.id && (
                  <div className="mt-4 pt-4 border-t">
                    <div className="mb-4">
                      <h4 className="font-semibold mb-2">All Translations:</h4>
                      <ul className="list-disc list-inside">
                        {word.translations.map((trans, idx) => (
                          <li key={idx} className="text-gray-700">
                            {trans}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Example Sentences:</h4>
                      {word.sentences.map((sentence, idx) => (
                        <div key={idx} className="mb-2">
                          <p className="text-gray-700">{sentence}</p>
                          <p className="text-gray-500 text-sm italic">
                            {word.translatedSentences[idx]}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
