import { motion } from "framer-motion";

const ease = [0.16, 0.84, 0.2, 1] as const;

// Fade + slide up entrance (replaces CSS fadeSlideUp)
export const FadeSlideUp = motion.div;
export const fadeSlideUpProps = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease }
} as const;

// Stagger container
export const staggerContainer = {
  animate: { transition: { staggerChildren: 0.08 } }
};

// Scale + fade for modals
export const modalProps = {
  initial: { opacity: 0, scale: 0.96, y: 20 },
  animate: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0.96, y: 20 },
  transition: { duration: 0.35, ease }
} as const;

// Slide from left for drawer
export const drawerProps = {
  initial: { x: "-105%" },
  animate: { x: 0 },
  exit: { x: "-105%" },
  transition: { duration: 0.4, ease }
} as const;

export { motion };
