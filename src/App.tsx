import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { WordsProvider } from './context/WordsContext';
import { SettingsProvider } from './context/SettingsContext';
import { ServiceFactory } from './services/ServiceFactory';
import { getBasePath } from './utils/basePath';
import { Layout } from './components/Layout';
import { FlashCards } from './pages/FlashCards';
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
              <Route path="/" element={<FlashCards />} />
              <Route path="/words" element={<WordList />} />
              <Route path="/manage" element={<WordBank />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </Layout>
        </Router>
      </WordsProvider>
    </SettingsProvider>
  );
}

export default App;
