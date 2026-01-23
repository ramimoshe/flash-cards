import { ReactNode } from 'react';
import { Navigation } from './Navigation';
import { useSettings } from '@/context/SettingsContext';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps): React.ReactElement {
  const { settings } = useSettings();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      {/* Offline Mode Banner */}
      {settings.isOfflineMode && (
        <div className="bg-amber-500 text-white py-2 px-4 text-center font-medium shadow-md">
          📴 OFFLINE MODE - Using local features only (no translation or sentence generation)
        </div>
      )}
      
      <main className="container mx-auto px-4 py-8">{children}</main>
      <footer className="bg-white border-t mt-auto">
        <div className="container mx-auto px-4 py-6 text-center text-gray-600 text-sm">
          <p>Flash Cards - English & Hebrew Vocabulary Learning</p>
          <p className="mt-1">Built with React, TypeScript & Tailwind CSS</p>
        </div>
      </footer>
    </div>
  );
}
