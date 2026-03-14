import { motion, AnimatePresence } from "framer-motion";
import { fadeSlideUpProps } from "./MotionWrappers";
import { ICON_SIZES, ICON_STROKES, MOTION_SETTINGS } from "../lib/frontendConfig";
import type { MapPin } from "../lib/types";
import "../styles/PinDetailModal.css";

type PinDetailModalProps = {
  pin: MapPin | null;
  onClose: () => void;
};

export function PinDetailModal({ pin, onClose }: PinDetailModalProps) {
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
                <svg width={ICON_SIZES.medium} height={ICON_SIZES.medium} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={ICON_STROKES.shell} strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            <motion.div
              className="pin-detail-body"
              initial="initial"
              animate="animate"
              transition={{ staggerChildren: 0.08 }}
            >
              <motion.div
                className="pin-detail-row"
                variants={{ initial: { opacity: 0, y: MOTION_SETTINGS.fadeSlideDistanceSmall }, animate: { opacity: 1, y: 0 } }}
                transition={fadeSlideUpProps.transition}
              >
                <span className="pin-detail-label">ID</span>
                <span className="pin-detail-value mono">{pin.id.slice(0, 12)}...</span>
              </motion.div>
              <motion.div
                className="pin-detail-row"
                variants={{ initial: { opacity: 0, y: MOTION_SETTINGS.fadeSlideDistanceSmall }, animate: { opacity: 1, y: 0 } }}
                transition={fadeSlideUpProps.transition}
              >
                <span className="pin-detail-label">Location</span>
                <span className="pin-detail-value mono">
                  {pin.location.lat.toFixed(5)}, {pin.location.lng.toFixed(5)}
                </span>
              </motion.div>
              <motion.div
                className="pin-detail-row"
                variants={{ initial: { opacity: 0, y: MOTION_SETTINGS.fadeSlideDistanceSmall }, animate: { opacity: 1, y: 0 } }}
                transition={fadeSlideUpProps.transition}
              >
                <span className="pin-detail-label">Precision</span>
                <span className="pin-detail-value">
                  {pin.mapPrecision === "BLURRED" ? "Blurred" : "Exact"}
                </span>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
