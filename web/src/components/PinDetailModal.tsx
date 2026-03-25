import { motion, AnimatePresence } from "framer-motion";
import { fadeSlideUpProps } from "./MotionWrappers";
import { MOTION_SETTINGS } from "../lib/frontendConfig";
import type { MapPin } from "../lib/types";
import "../styles/PinDetailModal.css";

type PinDetailModalProps = {
  pin: MapPin | null;
  onClose: () => void;
  onOpenProfile?: (userId: string) => void;
};

export function PinDetailModal({ pin, onClose, onOpenProfile }: PinDetailModalProps) {
  const audienceLabel = pin?.audienceType === "PRIVATE"
    ? "Private"
    : pin?.audienceType === "FRIENDS"
      ? "Friends"
      : pin?.audienceType === "FOLLOWERS"
        ? "Followers"
        : "Public";
  const revealLabel = pin?.revealType === "REACH_TO_REVEAL" ? "Reveal on reach" : "Visible on map";
  const precisionLabel = pin?.mapPrecision === "BLURRED" ? "Blurred map point" : "Exact map point";

  return (
    <>
      <AnimatePresence>
        {pin && (
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
        {pin && (
          <motion.div
            className="pin-detail-modal open"
            initial={{ y: "102%" }}
            animate={{ y: 0 }}
            exit={{ y: "102%" }}
            transition={{ duration: MOTION_SETTINGS.drawerDuration, ease: MOTION_SETTINGS.easeEmphasized }}
          >
            <div className="modal-handle" />
            <div className="modal-header">
              <h2>Pin</h2>
              <button className="modal-close" onClick={onClose} aria-label="Close">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <motion.div
              className="pin-detail-body"
              initial="initial"
              animate="animate"
              transition={{ staggerChildren: 0.08 }}
            >
              <motion.div
                className="pin-detail-hero"
                variants={{ initial: { opacity: 0, y: MOTION_SETTINGS.fadeSlideDistanceSmall }, animate: { opacity: 1, y: 0 } }}
                transition={fadeSlideUpProps.transition}
              >
                <span className="pin-detail-kicker">{pin.owner ? "Your memory" : "Memory nearby"}</span>
                <p className="pin-detail-preview">{pin.textPreview}</p>
                <div className="pin-detail-summary">
                  <span className="pin-detail-chip">{audienceLabel}</span>
                  <span className="pin-detail-chip">{revealLabel}</span>
                  <span className="pin-detail-chip">{precisionLabel}</span>
                  {!pin.owner && onOpenProfile ? (
                    <button type="button" className="pin-detail-profile-link" onClick={() => onOpenProfile(pin.ownerId)}>
                      View profile
                    </button>
                  ) : null}
                </div>
              </motion.div>
              <motion.div
                className="pin-detail-meta"
                variants={{ initial: { opacity: 0, y: MOTION_SETTINGS.fadeSlideDistanceSmall }, animate: { opacity: 1, y: 0 } }}
                transition={fadeSlideUpProps.transition}
              >
                <div className="pin-detail-row">
                  <span className="pin-detail-label">Location</span>
                  <span className="pin-detail-value mono">
                    {pin.location.lat.toFixed(5)}, {pin.location.lng.toFixed(5)}
                  </span>
                </div>
                <div className="pin-detail-row">
                  <span className="pin-detail-label">Reference</span>
                  <span className="pin-detail-value mono">{pin.id.slice(0, 12)}...</span>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
