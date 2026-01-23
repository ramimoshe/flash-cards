import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSettings } from '@/context/SettingsContext';
import { Dropdown, DropdownItem } from './common/Dropdown';

export function Navigation(): React.ReactElement {
  const location = useLocation();
  const navigate = useNavigate();
  const { settings, toggleOfflineMode } = useSettings();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const isMainMenu = location.pathname === '/';

  const isActive = (path: string): boolean => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const toggleDropdown = (menu: string) => {
    setOpenDropdown(openDropdown === menu ? null : menu);
  };

  const closeDropdown = () => {
    setOpenDropdown(null);
  };

  const handleMenuClick = (path: string, menu: string) => {
    navigate(path);
    toggleDropdown(menu);
  };

  const handleDropdownItemClick = (path: string) => {
    navigate(path);
    closeDropdown();
  };

  const menuButtonClasses = (path: string, hasDropdown: boolean = false): string => {
    const base = 'px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-1';
    const active = isActive(path);
    return active
      ? `${base} bg-primary text-white`
      : `${base} text-gray-700 hover:bg-gray-100`;
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <span className="text-2xl">🎴</span>
            <h1 className="text-xl font-bold text-primary">Language Learner</h1>
          </Link>

          {!isMainMenu && (
            <div className="hidden md:flex items-center space-x-2">
            {/* Games Menu with Dropdown */}
            <div className="relative">
              <button
                onClick={() => handleMenuClick('/', 'games')}
                className={menuButtonClasses('/', true)}
              >
                Games
                <svg
                  className={`w-4 h-4 transition-transform ${openDropdown === 'games' ? 'rotate-180' : ''}`}
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <Dropdown isOpen={openDropdown === 'games'} onClose={closeDropdown}>
                <DropdownItem onClick={() => handleDropdownItemClick('/games/flashcards')}>
                  🎴 Flash Cards
                </DropdownItem>
              </Dropdown>
            </div>

            {/* Manage Words Menu with Dropdown */}
            <div className="relative">
              <button
                onClick={() => handleMenuClick('/manage', 'manage')}
                className={menuButtonClasses('/manage', true)}
              >
                Manage Words
                <svg
                  className={`w-4 h-4 transition-transform ${openDropdown === 'manage' ? 'rotate-180' : ''}`}
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <Dropdown isOpen={openDropdown === 'manage'} onClose={closeDropdown}>
                <DropdownItem onClick={() => handleDropdownItemClick('/manage/words')}>
                  📋 Word List
                </DropdownItem>
                <DropdownItem onClick={() => handleDropdownItemClick('/manage/edit')}>
                  ✏️ Manage Words
                </DropdownItem>
              </Dropdown>
            </div>

            {/* Settings Link */}
            <Link to="/settings" className={menuButtonClasses('/settings')}>
              Settings
            </Link>
            
            {/* Offline/Online Toggle */}
            <button
              onClick={toggleOfflineMode}
              className={`ml-4 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                settings.isOfflineMode
                  ? 'bg-amber-500 text-white hover:bg-amber-600'
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}
              title={settings.isOfflineMode ? 'Switch to Online Mode' : 'Switch to Offline Mode'}
            >
              {settings.isOfflineMode ? '📴 Offline' : '🌐 Online'}
            </button>
          </div>
          )}

          {/* Offline toggle for main menu */}
          {isMainMenu && (
            <button
              onClick={toggleOfflineMode}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                settings.isOfflineMode
                  ? 'bg-amber-500 text-white hover:bg-amber-600'
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}
              title={settings.isOfflineMode ? 'Switch to Online Mode' : 'Switch to Offline Mode'}
            >
              {settings.isOfflineMode ? '📴 Offline' : '🌐 Online'}
            </button>
          )}

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button className="text-gray-700 hover:text-primary">
              <svg
                className="h-6 w-6"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
