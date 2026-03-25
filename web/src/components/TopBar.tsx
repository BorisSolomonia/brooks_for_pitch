import { useId, useState } from "react";
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
          <span className="material-symbols-outlined">menu</span>
        </button>
        <div className="brand-mark">
          <h1 className="brand-title">Brooks</h1>
          <p className="brand-subtitle">social archive</p>
        </div>
      </div>

      <div className="command-bar-right">
        {onPeopleClick && (
          <button className="command-btn" onClick={onPeopleClick} aria-label="People">
            <span className="material-symbols-outlined">group</span>
            {friendRequestCount > 0 && <span className="topbar-badge" />}
          </button>
        )}
        {onNotificationsClick && (
          <button className="command-btn" onClick={onNotificationsClick} aria-label="Notifications">
            <span className="material-symbols-outlined">notifications</span>
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
                    <span className="material-symbols-outlined">person</span>
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
                  <span className="material-symbols-outlined">logout</span>
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
