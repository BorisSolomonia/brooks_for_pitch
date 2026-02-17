import { useId, useState } from "react";
import "../styles/TopBar.css";

interface TopBarProps {
  onMenuClick: () => void;
  userName?: string;
  userEmail?: string;
  onSignOut: () => void;
  currentTheme: string;
}

export function TopBar({ onMenuClick, userName, userEmail, onSignOut, currentTheme }: TopBarProps) {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const menuId = useId();

  const getInitials = (name?: string, email?: string) => {
    if (name) {
      return name
        .split(" ")
        .map(part => part[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    }
    if (email) {
      return email[0]?.toUpperCase() ?? "?";
    }
    return "?";
  };

  const getThemeLabel = (theme: string) => {
    const themes: Record<string, string> = {
      rome: "RM",
      tbilisi: "TB",
      paris: "PR",
      default: "AT"
    };
    return themes[theme.toLowerCase()] || themes.default;
  };

  return (
    <header className="command-bar">
      <div className="command-bar-left">
        <button className="command-btn" onClick={onMenuClick} aria-label="Open menu" aria-controls="brooks-navigation-drawer">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
        <div className="brand-mark">
          <p className="eyebrow">Brooks</p>
          <h1 className="brand-title">City pulse map</h1>
        </div>
      </div>

      <div className="command-bar-right">
        <div className="theme-chip" title={`Theme: ${currentTheme}`}>
          <span>{getThemeLabel(currentTheme)}</span>
        </div>

        <div className="user-menu-container">
          <button
            className="user-avatar"
            onClick={() => setShowUserMenu(open => !open)}
            aria-label="User menu"
            aria-haspopup="menu"
            aria-expanded={showUserMenu}
            aria-controls={menuId}
          >
            {getInitials(userName, userEmail)}
          </button>

          {showUserMenu ? (
            <>
              <div className="user-menu-backdrop" onClick={() => setShowUserMenu(false)} />
              <div className="user-menu" role="menu" id={menuId}>
                <div className="user-menu-header">
                  <div className="user-menu-name">{userName || "User"}</div>
                  <div className="user-menu-email">{userEmail}</div>
                </div>
                <button
                  className="user-menu-item"
                  role="menuitem"
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
                  Sign out
                </button>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </header>
  );
}
