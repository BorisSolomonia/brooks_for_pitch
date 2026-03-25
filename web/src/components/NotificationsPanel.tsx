import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { fetchNotifications, markNotificationRead } from "../lib/api";
import { MOTION_SETTINGS } from "../lib/frontendConfig";
import type { AppNotification } from "../lib/types";
import "../styles/NotificationsPanel.css";

type NotificationsPanelProps = {
  isOpen: boolean;
  token: string | null;
  onClose: () => void;
  onNotificationRead?: () => void;
};

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60_000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export function NotificationsPanel({ isOpen, token, onClose, onNotificationRead }: NotificationsPanelProps) {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen || !token) return;
    setLoading(true);
    fetchNotifications(token)
      .then(setNotifications)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [isOpen, token]);

  const handleMarkRead = async (id: string) => {
    if (!token) return;
    try {
      await markNotificationRead(token, id);
      setNotifications(prev =>
        prev.map(n => n.id === id ? { ...n, read: true } : n)
      );
      onNotificationRead?.();
    } catch {
      // ignore
    }
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="modal-backdrop open"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: MOTION_SETTINGS.backdropDuration }}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {isOpen && (
          <motion.section
            className="notifications-panel open"
            role="dialog"
            aria-modal="true"
            aria-label="Notifications"
            initial={{ y: "102%" }}
            animate={{ y: 0 }}
            exit={{ y: "102%" }}
            transition={{ duration: MOTION_SETTINGS.drawerDuration, ease: MOTION_SETTINGS.easeEmphasized }}
          >
            <div className="modal-handle" />
            <header className="modal-header notifications-header">
              <div>
                <p className="eyebrow">Activity</p>
                <h2>Notifications</h2>
              </div>
              <button className="modal-close" onClick={onClose} aria-label="Close" type="button">
                <span className="material-symbols-outlined">close</span>
              </button>
            </header>

            <div className="notifications-body">
              {loading ? (
                <div className="notifications-loading">Loading notifications...</div>
              ) : notifications.length === 0 ? (
                <div className="notifications-empty">No notifications yet.</div>
              ) : (
                <div className="notifications-list">
                  {notifications.map(n => (
                    <button
                      key={n.id}
                      type="button"
                      className={`notification-card${n.read ? "" : " unread"}`}
                      onClick={() => !n.read && handleMarkRead(n.id)}
                    >
                      <div className="notification-content">
                        <strong className="notification-title">{n.title}</strong>
                        {n.body ? <span className="notification-body">{n.body}</span> : null}
                      </div>
                      <span className="notification-time">{timeAgo(n.createdAt)}</span>
                      {!n.read && <span className="notification-dot" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </>
  );
}
