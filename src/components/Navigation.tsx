import { Link, useLocation } from 'react-router-dom';

export function Navigation(): React.ReactElement {
  const location = useLocation();

  const isActive = (path: string): boolean => {
    return location.pathname === path;
  };

  const linkClasses = (path: string): string => {
    const base = 'px-4 py-2 rounded-lg font-medium transition-colors';
    return isActive(path)
      ? `${base} bg-primary text-white`
      : `${base} text-gray-700 hover:bg-gray-100`;
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">🎴</span>
            <h1 className="text-xl font-bold text-primary">Flash Cards</h1>
          </div>

          <div className="hidden md:flex space-x-2">
            <Link to="/" className={linkClasses('/')}>
              Games
            </Link>
            <Link to="/words" className={linkClasses('/words')}>
              Word List
            </Link>
            <Link to="/manage" className={linkClasses('/manage')}>
              Manage Words
            </Link>
            <Link to="/settings" className={linkClasses('/settings')}>
              Settings
            </Link>
          </div>

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
