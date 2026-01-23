import { useState } from 'react';
import { useWords } from '@/context/WordsContext';
import { useSettings } from '@/context/SettingsContext';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Word } from '@/types/Word';

export function Settings(): React.ReactElement {
  const { words, importWords, clearAllWords } = useWords();
  const { settings, updateSettings, resetSettings } = useSettings();
  const [uploadError, setUploadError] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState('');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError('');
    setUploadSuccess('');

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const data = JSON.parse(content);

        if (!data.words || !Array.isArray(data.words)) {
          throw new Error('Invalid JSON format: missing words array');
        }

        // Basic validation
        data.words.forEach((word: Word, idx: number) => {
          if (!word.id || !word.word || !word.sourceLanguage || !word.targetLanguage) {
            throw new Error(`Invalid word at index ${idx}: missing required fields (id, word, sourceLanguage, targetLanguage)`);
          }
        });

        importWords(data.words);
        setUploadSuccess(`Successfully imported ${data.words.length} words!`);
        e.target.value = '';
      } catch (error) {
        setUploadError(
          error instanceof Error ? error.message : 'Failed to parse JSON file'
        );
      }
    };

    reader.readAsText(file);
  };

  const handleDownload = (): void => {
    const data = { words };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `flash-cards-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleClearAll = (): void => {
    if (confirm('Are you sure you want to delete ALL words? This cannot be undone!')) {
      clearAllWords();
      alert('All words have been deleted.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Settings</h1>

      {/* File Management */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">File Management</h2>

        {uploadError && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {uploadError}
          </div>
        )}

        {uploadSuccess && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4">
            {uploadSuccess}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload JSON File
            </label>
            <input
              type="file"
              accept=".json"
              onChange={handleFileUpload}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary-dark"
            />
            <p className="text-sm text-gray-500 mt-1">
              Upload a JSON file to replace all current words
            </p>
          </div>

          <div>
            <Button onClick={handleDownload} disabled={words.length === 0}>
              📥 Download Words as JSON
            </Button>
            <p className="text-sm text-gray-500 mt-1">
              Download your current word bank ({words.length} words)
            </p>
          </div>

          <div>
            <Button variant="danger" onClick={handleClearAll} disabled={words.length === 0}>
              🗑️ Clear All Words
            </Button>
            <p className="text-sm text-gray-500 mt-1">Delete all words from your word bank</p>
          </div>
        </div>
      </div>

      {/* API Configuration */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">API Configuration</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Translation Provider
            </label>
            <select
              value={settings.translationProvider}
              onChange={(e) =>
                updateSettings({
                  translationProvider: e.target.value as 'google' | 'mymemory' | 'libretranslate',
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="google">Google Translate (Free, Best Quality) ⭐</option>
              <option value="mymemory">MyMemory (Free, No API Key)</option>
              <option value="libretranslate">LibreTranslate (Free, No API Key)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sentence Provider
            </label>
            <select
              value={settings.sentenceProvider}
              onChange={(e) =>
                updateSettings({
                  sentenceProvider: e.target.value as 'freedictionary' | 'wordnik',
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="freedictionary">Free Dictionary (Free, No API Key)</option>
              <option value="wordnik">Wordnik (Requires API Key)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">TTS Provider</label>
            <select
              value={settings.ttsProvider}
              onChange={(e) =>
                updateSettings({ ttsProvider: e.target.value as 'browser' | 'google' })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="browser">Browser TTS (Free, Built-in)</option>
              <option value="google">Google TTS (Requires API Key)</option>
            </select>
          </div>

          {settings.sentenceProvider === 'wordnik' && (
            <Input
              label="Wordnik API Key (Optional)"
              type="text"
              value={settings.apiKeys.wordnik || ''}
              onChange={(e) =>
                updateSettings({
                  apiKeys: { ...settings.apiKeys, wordnik: e.target.value },
                })
              }
              placeholder="Enter Wordnik API key"
            />
          )}

          {settings.ttsProvider === 'google' && (
            <Input
              label="Google TTS API Key (Optional)"
              type="text"
              value={settings.apiKeys.googleTTS || ''}
              onChange={(e) =>
                updateSettings({
                  apiKeys: { ...settings.apiKeys, googleTTS: e.target.value },
                })
              }
              placeholder="Enter Google TTS API key"
            />
          )}

          <Button variant="ghost" onClick={resetSettings}>
            Reset to Defaults
          </Button>
        </div>
      </div>

      {/* App Info */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">About</h2>
        <div className="space-y-2 text-sm text-gray-600">
          <p>
            <strong>Version:</strong> 1.0.0
          </p>
          <p>
            <strong>Built with:</strong> React, TypeScript, Tailwind CSS
          </p>
          <p>
            <strong>Features:</strong> Flash Cards, Word Management, CEFR Levels, TTS, Auto-translation
          </p>
          <p className="mt-4">
            <strong>API Credits:</strong>
          </p>
          <ul className="list-disc list-inside ml-4">
            <li>Google Translate API</li>
            <li>MyMemory Translation API</li>
            <li>Free Dictionary API</li>
            <li>Words-CEFR-Dataset (MIT License)</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
