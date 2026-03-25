import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { drawerProps, fadeSlideUpProps } from "./MotionWrappers";
import { MOTION_SETTINGS, type MapProvider } from "../lib/frontendConfig";
import type { PinViewScope } from "../lib/types";
import "../styles/NavigationDrawer.css";

interface NavigationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onCreatePin: () => void;
  onOpenPeople: () => void;
  currentMapProvider: MapProvider;
  onMapProviderChange: (provider: MapProvider) => void;
  currentPinView: PinViewScope;
  onPinViewChange: (scope: PinViewScope) => void;
  onSignOut: () => void;
}

export function NavigationDrawer({
  isOpen,
  onClose,
  onCreatePin,
  onOpenPeople,
  currentMapProvider,
  onMapProviderChange,
  currentPinView,
  onPinViewChange,
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
            transition={{ duration: MOTION_SETTINGS.backdropDuration }}
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
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="drawer-content">
              <motion.section
                className="drawer-section"
                {...fadeSlideUpProps}
                transition={{ ...fadeSlideUpProps.transition, delay: MOTION_SETTINGS.drawerSectionDelayStart }}
              >
                <h3 className="drawer-section-title">Do now</h3>
                <button
                  className="drawer-item drawer-item-primary"
                  type="button"
                  onClick={onCreatePin}
                >
                  <span className="material-symbols-outlined">edit_note</span>
                  Leave a memory
                </button>
              </motion.section>

              <motion.section
                className="drawer-section"
                {...fadeSlideUpProps}
                transition={{ ...fadeSlideUpProps.transition, delay: MOTION_SETTINGS.drawerSectionDelayStart + 0.03 }}
              >
                <h3 className="drawer-section-title">Explore</h3>
                <button
                  className={`drawer-item ${currentPinView === "home" ? "active" : ""}`}
                  type="button"
                  onClick={() => onPinViewChange("home")}
                >
                  <span className="material-symbols-outlined">home</span>
                  Home
                </button>
                <button
                  className={`drawer-item ${currentPinView === "mine" ? "active" : ""}`}
                  type="button"
                  onClick={() => onPinViewChange("mine")}
                >
                  <span className="material-symbols-outlined">location_on</span>
                  My pins
                </button>
                <button
                  className={`drawer-item ${currentPinView === "friends" ? "active" : ""}`}
                  type="button"
                  onClick={() => onPinViewChange("friends")}
                >
                  <span className="material-symbols-outlined">group</span>
                  Friends' pins
                </button>
                <button
                  className="drawer-item"
                  type="button"
                  onClick={onOpenPeople}
                >
                  <span className="material-symbols-outlined">person_search</span>
                  People
                </button>
              </motion.section>

              <motion.section
                className="drawer-section"
                {...fadeSlideUpProps}
                transition={{ ...fadeSlideUpProps.transition, delay: MOTION_SETTINGS.drawerSectionDelayMapProvider }}
              >
                <h3 className="drawer-section-title">Preferences</h3>
                <button
                  className={`drawer-item theme-item ${currentMapProvider === "leaflet" ? "active" : ""}`}
                  onClick={() => onMapProviderChange("leaflet")}
                  type="button"
                >
                  <span className="material-symbols-outlined theme-icon">map</span>
                  Leaflet
                  {currentMapProvider === "leaflet" ? (
                    <span className="material-symbols-outlined check-icon">done</span>
                  ) : null}
                </button>
                <button
                  className={`drawer-item theme-item ${currentMapProvider === "google" ? "active" : ""}`}
                  onClick={() => onMapProviderChange("google")}
                  type="button"
                >
                  <span className="material-symbols-outlined theme-icon">travel_explore</span>
                  Google maps
                  {currentMapProvider === "google" ? (
                    <span className="material-symbols-outlined check-icon">done</span>
                  ) : null}
                </button>
              </motion.section>
            </div>

            <footer className="drawer-footer">
              <button className="drawer-item sign-out" onClick={onSignOut} type="button">
                <span className="material-symbols-outlined">logout</span>
                Sign out
              </button>
            </footer>
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  );
}
