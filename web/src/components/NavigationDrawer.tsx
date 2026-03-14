import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { drawerProps, fadeSlideUpProps } from "./MotionWrappers";
import "../styles/NavigationDrawer.css";

interface NavigationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentMapProvider: "leaflet" | "google";
  onMapProviderChange: (provider: "leaflet" | "google") => void;
  onSignOut: () => void;
}

export function NavigationDrawer({
  isOpen,
  onClose,
  currentMapProvider,
  onMapProviderChange,
  onSignOut
}: NavigationDrawerProps) {
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="drawer-backdrop open"
            onClick={onClose}
            aria-hidden={!isOpen}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {isOpen && (
          <motion.nav
            id="brooks-navigation-drawer"
            className="navigation-drawer open"
            aria-label="Navigation drawer"
            {...drawerProps}
          >
            <div className="drawer-header">
              <div>
                <p className="eyebrow">Brooks</p>
                <h2>Controls</h2>
              </div>
              <button className="drawer-close" onClick={onClose} aria-label="Close menu">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <div className="drawer-content">
              <motion.section
                className="drawer-section"
                {...fadeSlideUpProps}
                transition={{ ...fadeSlideUpProps.transition, delay: 0.05 }}
              >
                <h3 className="drawer-section-title">Views</h3>
                <button className="drawer-item active" type="button">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                    <polyline points="9 22 9 12 15 12 15 22" />
                  </svg>
                  Home
                </button>
                <button className="drawer-item" type="button">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  My pins
                </button>
                <button className="drawer-item" type="button">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                  Friends' pins
                </button>
              </motion.section>

              <motion.section
                className="drawer-section"
                {...fadeSlideUpProps}
                transition={{ ...fadeSlideUpProps.transition, delay: 0.13 }}
              >
                <h3 className="drawer-section-title">Map provider</h3>
                <button
                  className={`drawer-item theme-item ${currentMapProvider === "leaflet" ? "active" : ""}`}
                  onClick={() => onMapProviderChange("leaflet")}
                  type="button"
                >
                  <span className="theme-icon">LF</span>
                  Leaflet
                  {currentMapProvider === "leaflet" ? (
                    <svg className="check-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  ) : null}
                </button>
                <button
                  className={`drawer-item theme-item ${currentMapProvider === "google" ? "active" : ""}`}
                  onClick={() => onMapProviderChange("google")}
                  type="button"
                >
                  <span className="theme-icon">GM</span>
                  Google maps
                  {currentMapProvider === "google" ? (
                    <svg className="check-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  ) : null}
                </button>
              </motion.section>
            </div>

            <footer className="drawer-footer">
              <button className="drawer-item sign-out" onClick={onSignOut} type="button">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
                Sign out
              </button>
            </footer>
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  );
}
