import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Settings, DictionarySource } from '@/types/ServiceConfig';

const SETTINGS_KEY = 'flash-cards-settings';

const defaultSettings: Settings = {
  translationProvider: 'google',
  sentenceProvider: 'freedictionary',
  ttsProvider: 'browser',
  isOfflineMode: false,
  selectedDictionary: 'oxford-5000',
  apiKeys: {},
};

interface SettingsContextType {
  settings: Settings;
  updateSettings: (newSettings: Partial<Settings>) => void;
  resetSettings: () => void;
  toggleOfflineMode: () => void;
  switchDictionary: (dictionary: DictionarySource) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }): React.ReactElement {
  const [settings, setSettings] = useState<Settings>(defaultSettings);

  // Load settings from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(SETTINGS_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setSettings({ ...defaultSettings, ...parsed });
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
    }
  }, []);

  // Save settings to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  }, [settings]);

  const updateSettings = (newSettings: Partial<Settings>): void => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  const resetSettings = (): void => {
    setSettings(defaultSettings);
  };

  const toggleOfflineMode = (): void => {
    setSettings((prev) => ({ ...prev, isOfflineMode: !prev.isOfflineMode }));
  };

  const switchDictionary = (dictionary: DictionarySource): void => {
    setSettings((prev) => ({ ...prev, selectedDictionary: dictionary }));
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, resetSettings, toggleOfflineMode, switchDictionary }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings(): SettingsContextType {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
