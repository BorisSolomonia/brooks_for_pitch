import { motion } from "framer-motion";
import "../styles/SketchOverlay.css";

export function SketchOverlay() {
  return (
    <div className="sketch-overlay" aria-hidden="true">
      <motion.svg
        className="sketch sketch-tl"
        width="80" height="80" viewBox="0 0 80 80"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.3 }}
      >
        <circle cx="40" cy="40" r="28" fill="none" stroke="currentColor" strokeWidth="0.6" opacity="0.42" />
        <circle cx="40" cy="40" r="20" fill="none" stroke="currentColor" strokeWidth="0.4" opacity="0.32" />
        <line x1="40" y1="10" x2="40" y2="70" stroke="currentColor" strokeWidth="0.4" opacity="0.32" />
        <line x1="10" y1="40" x2="70" y2="40" stroke="currentColor" strokeWidth="0.4" opacity="0.32" />
      </motion.svg>

      <motion.svg
        className="sketch sketch-br"
        width="120" height="60" viewBox="0 0 120 60"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
      >
        <path
          d="M10 50 Q30 10 60 30 Q90 50 110 15"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.7"
          opacity="0.38"
          strokeLinecap="round"
        />
        <path
          d="M14 48 Q32 14 58 32"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.4"
          opacity="0.30"
          strokeLinecap="round"
        />
      </motion.svg>

      <motion.svg
        className="sketch sketch-ml"
        width="50" height="50" viewBox="0 0 50 50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.7 }}
      >
        <path
          d="M25 25 C25 20 30 18 32 22 C34 26 28 30 24 28 C20 26 22 20 26 19 C30 18 34 22 33 26 C32 30 26 32 23 30"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.5"
          opacity="0.35"
          strokeLinecap="round"
        />
      </motion.svg>

      <motion.svg
        className="sketch sketch-tr"
        width="60" height="60" viewBox="0 0 60 60"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.9 }}
      >
        <line x1="30" y1="8" x2="30" y2="52" stroke="currentColor" strokeWidth="0.5" opacity="0.32" />
        <line x1="8" y1="30" x2="52" y2="30" stroke="currentColor" strokeWidth="0.5" opacity="0.32" />
        <line x1="14" y1="14" x2="46" y2="46" stroke="currentColor" strokeWidth="0.35" opacity="0.24" />
        <line x1="46" y1="14" x2="14" y2="46" stroke="currentColor" strokeWidth="0.35" opacity="0.24" />
        <circle cx="30" cy="30" r="3" fill="none" stroke="currentColor" strokeWidth="0.4" opacity="0.38" />
      </motion.svg>
    </div>
  );
}
