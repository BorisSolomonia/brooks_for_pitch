import { motion } from 'framer-motion';
import { useSpotlight } from '../hooks/useSpotlight';
import '../styles/FAB.css';

interface FABProps {
  onClick: () => void;
  label?: string;
}

export function FAB({ onClick, label = 'Leave a Mark' }: FABProps) {
  const spotlight = useSpotlight<HTMLButtonElement>();

  return (
    <motion.button
      type="button"
      className="fab"
      onClick={onClick}
      aria-label={label}
      ref={spotlight.ref}
      onMouseMove={spotlight.onMouseMove}
      whileHover={{ y: -4, scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <span className="fab-spotlight" aria-hidden="true" />
      <span className="material-symbols-outlined fab-icon">edit_note</span>
      <span className="fab-label">{label}</span>
    </motion.button>
  );
}
