import { motion, AnimatePresence } from "framer-motion";
import { fadeSlideUpProps } from "./MotionWrappers";
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
            transition={{ duration: 0.3 }}
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
            transition={{ duration: 0.4, ease: [0.16, 0.84, 0.2, 1] as const }}
          >
            <div className="modal-handle" />
            <div className="modal-header">
              <h2>Pin</h2>
              <button className="modal-close" onClick={onClose} aria-label="Close">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
                variants={{ initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 } }}
                transition={fadeSlideUpProps.transition}
              >
                <span className="pin-detail-label">ID</span>
                <span className="pin-detail-value mono">{pin.id.slice(0, 12)}...</span>
              </motion.div>
              <motion.div
                className="pin-detail-row"
                variants={{ initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 } }}
                transition={fadeSlideUpProps.transition}
              >
                <span className="pin-detail-label">Location</span>
                <span className="pin-detail-value mono">
                  {pin.location.lat.toFixed(5)}, {pin.location.lng.toFixed(5)}
                </span>
              </motion.div>
              <motion.div
                className="pin-detail-row"
                variants={{ initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 } }}
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
