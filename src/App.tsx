import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { WordsProvider } from './context/WordsContext';
import { SettingsProvider } from './context/SettingsContext';
import { ServiceFactory } from './services/ServiceFactory';
import { getBasePath } from './utils/basePath';
import { Layout } from './components/Layout';
import { MainMenu } from './pages/MainMenu';
import { GamesHub } from './pages/GamesHub';
import { FlashCardsSetup } from './pages/FlashCardsSetup';
import { FlashCardsPlay } from './pages/FlashCardsPlay';
import { QuizSetup } from './pages/QuizSetup';
import { QuizPlay } from './pages/QuizPlay';
import { ManageHub } from './pages/ManageHub';
import { WordList } from './pages/WordList';
import { WordBank } from './pages/WordBank';
import { Settings } from './pages/Settings';

function App(): React.ReactElement {
  // Preload CEFR dataset on app startup
  useEffect(() => {
    console.log('🚀 Preloading CEFR dataset...');
    ServiceFactory.createCEFRService();
  }, []);

  return (
    <SettingsProvider>
      <WordsProvider>
        <Router basename={getBasePath()}>
          <Layout>
            <Routes>
              <Route path="/" element={<MainMenu />} />
              <Route path="/games" element={<GamesHub />} />
              <Route path="/games/flashcards" element={<FlashCardsSetup />} />
              <Route path="/games/flashcards/play" element={<FlashCardsPlay />} />
              <Route path="/games/quiz" element={<QuizSetup />} />
              <Route path="/games/quiz/play" element={<QuizPlay />} />
              <Route path="/manage" element={<ManageHub />} />
              <Route path="/manage/words" element={<WordList />} />
              <Route path="/manage/edit" element={<WordBank />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </Layout>
        </Router>
      </WordsProvider>
    </SettingsProvider>
  );
}

export default App;
