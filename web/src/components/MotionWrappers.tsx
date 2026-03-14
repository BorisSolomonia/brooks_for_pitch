import { motion } from "framer-motion";
import { MOTION_SETTINGS } from "../lib/frontendConfig";

// Fade + slide up entrance (replaces CSS fadeSlideUp)
export const FadeSlideUp = motion.div;
export const fadeSlideUpProps = {
  initial: { opacity: 0, y: MOTION_SETTINGS.fadeSlideDistance },
  animate: { opacity: 1, y: 0 },
  transition: { duration: MOTION_SETTINGS.fadeSlideDuration, ease: MOTION_SETTINGS.easeEmphasized }
} as const;

// Stagger container
export const staggerContainer = {
  animate: { transition: { staggerChildren: MOTION_SETTINGS.staggerChildren } }
};

// Scale + fade for modals
export const modalProps = {
  initial: { opacity: 0, scale: 0.96, y: 20 },
  animate: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0.96, y: 20 },
  transition: { duration: MOTION_SETTINGS.modalDuration, ease: MOTION_SETTINGS.easeEmphasized }
} as const;

// Slide from left for drawer
export const drawerProps = {
  initial: { x: "-105%" },
  animate: { x: 0 },
  exit: { x: "-105%" },
  transition: { duration: MOTION_SETTINGS.drawerDuration, ease: MOTION_SETTINGS.easeEmphasized }
} as const;

export { motion };
