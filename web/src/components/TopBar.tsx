import { useId, useState } from "react";
import { ICON_SIZES, ICON_STROKES } from "../lib/frontendConfig";
import "../styles/TopBar.css";

interface TopBarProps {
  onMenuClick: () => void;
  onPeopleClick?: () => void;
  onNotificationsClick?: () => void;
  onProfileClick?: () => void;
  friendRequestCount?: number;
  unreadNotificationCount?: number;
  userName?: string;
  userEmail?: string;
  userAvatarUrl?: string | null;
  onSignOut: () => void;
}

export function TopBar({ onMenuClick, onPeopleClick, onNotificationsClick, onProfileClick, friendRequestCount = 0, unreadNotificationCount = 0, userName, userEmail, userAvatarUrl, onSignOut }: TopBarProps) {
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

  return (
    <header className="command-bar">
      <div className="command-bar-left">
        <button className="command-btn" onClick={onMenuClick} aria-label="Open menu" aria-controls="brooks-navigation-drawer">
          <svg width={ICON_SIZES.shell} height={ICON_SIZES.shell} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={ICON_STROKES.shellLight}>
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
        <div className="brand-mark">
          <h1 className="brand-title">Brooks</h1>
          <p className="brand-subtitle">leave memories on places</p>
        </div>
      </div>

      <div className="command-bar-right">
        {onPeopleClick && (
          <button className="command-btn" onClick={onPeopleClick} aria-label="People">
            <svg width={ICON_SIZES.shell} height={ICON_SIZES.shell} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={ICON_STROKES.shell}>
              <circle cx="9" cy="8" r="3" />
              <path d="M4 19c1.1-3 3.3-4.5 6.7-4.5 3.1 0 5.4 1.5 6.4 4.5" />
              <path d="M18 8v6" />
              <path d="M15 11h6" />
            </svg>
            {friendRequestCount > 0 && <span className="topbar-badge" />}
          </button>
        )}
        {onNotificationsClick && (
          <button className="command-btn" onClick={onNotificationsClick} aria-label="Notifications">
            <svg width={ICON_SIZES.shell} height={ICON_SIZES.shell} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={ICON_STROKES.shell}>
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            {unreadNotificationCount > 0 && <span className="topbar-badge" />}
          </button>
        )}
        <div className="user-menu-container">
          <button
            className="user-avatar"
            onClick={() => setShowUserMenu(open => !open)}
            aria-label="User menu"
            aria-haspopup="menu"
            aria-expanded={showUserMenu}
            aria-controls={menuId}
          >
            {userAvatarUrl
              ? <img src={userAvatarUrl} alt={userName || "User"} className="user-avatar-image" />
              : getInitials(userName, userEmail)}
          </button>

          {showUserMenu ? (
            <>
              <div className="user-menu-backdrop" onClick={() => setShowUserMenu(false)} />
              <div className="user-menu" role="menu" id={menuId}>
                <div className="user-menu-header">
                  <div className="user-menu-name">{userName || "User"}</div>
                  <div className="user-menu-email">{userEmail}</div>
                </div>
                {onProfileClick ? (
                  <button
                    className="user-menu-item"
                    role="menuitem"
                    onClick={() => {
                      onProfileClick();
                      setShowUserMenu(false);
                    }}
                  >
                    <svg width={ICON_SIZES.small} height={ICON_SIZES.small} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={ICON_STROKES.shell}>
                      <circle cx="12" cy="8" r="4" />
                      <path d="M5 20c1.2-3.5 3.6-5.2 7-5.2 3.4 0 5.8 1.7 7 5.2" />
                    </svg>
                    Profile
                  </button>
                ) : null}
                <button
                  className="user-menu-item"
                  role="menuitem"
                  onClick={() => {
                    onSignOut();
                    setShowUserMenu(false);
                  }}
                >
                  <svg width={ICON_SIZES.small} height={ICON_SIZES.small} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={ICON_STROKES.shell}>
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
