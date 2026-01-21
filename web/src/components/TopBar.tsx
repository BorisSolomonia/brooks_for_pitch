import { useState } from 'react';
import '../styles/TopBar.css';

interface TopBarProps {
  onMenuClick: () => void;
  userName?: string;
  userEmail?: string;
  onSignOut: () => void;
  currentTheme: string;
}

export function TopBar({ onMenuClick, userName, userEmail, onSignOut, currentTheme }: TopBarProps) {
  const [showUserMenu, setShowUserMenu] = useState(false);

  const getInitials = (name?: string, email?: string) => {
    if (name) {
      return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    }
    if (email) {
      return email[0].toUpperCase();
    }
    return '?';
  };

  const getThemeLabel = (theme: string) => {
    const themes: Record<string, string> = {
      rome: 'RM',
      tbilisi: 'TB',
      paris: 'PR',
      default: 'AT'
    };
    return themes[theme.toLowerCase()] || themes.default;
  };

  return (
    <header className="top-bar">
      <div className="top-bar-left">
        <button
          className="hamburger-btn"
          onClick={onMenuClick}
          aria-label="Open menu"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
        <h1 className="app-title">Brooks</h1>
      </div>

      <div className="top-bar-right">
        <div className="theme-badge" title={`Theme: ${currentTheme}`}>
          {getThemeLabel(currentTheme)}
        </div>

        <div className="user-menu-container">
          <button
            className="user-avatar"
            onClick={() => setShowUserMenu(!showUserMenu)}
            aria-label="User menu"
          >
            {getInitials(userName, userEmail)}
          </button>

          {showUserMenu && (
            <>
              <div
                className="user-menu-backdrop"
                onClick={() => setShowUserMenu(false)}
              />
              <div className="user-menu">
                <div className="user-menu-header">
                  <div className="user-menu-name">{userName || 'User'}</div>
                  <div className="user-menu-email">{userEmail}</div>
                </div>
                <button
                  className="user-menu-item"
                  onClick={() => {
                    onSignOut();
                    setShowUserMenu(false);
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <polyline points="16 17 21 12 16 7" />
                    <line x1="21" y1="12" x2="9" y2="12" />
                  </svg>
                  Sign Out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
