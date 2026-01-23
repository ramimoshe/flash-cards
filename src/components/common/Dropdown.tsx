import { ReactNode, useEffect, useRef } from 'react';

interface DropdownProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  className?: string;
}

export function Dropdown({ isOpen, onClose, children, className = '' }: DropdownProps): React.ReactElement | null {
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={dropdownRef}
      className={`absolute top-full left-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 py-2 min-w-[200px] z-50 ${className}`}
    >
      {children}
    </div>
  );
}

interface DropdownItemProps {
  children: ReactNode;
  onClick: () => void;
  className?: string;
}

export function DropdownItem({ children, onClick, className = '' }: DropdownItemProps): React.ReactElement {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors ${className}`}
    >
      {children}
    </button>
  );
}
