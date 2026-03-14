import { useState } from "react";
import { motion } from "framer-motion";
import { useSpotlight } from "../hooks/useSpotlight";
import { fadeSlideUpProps, staggerContainer } from "./MotionWrappers";

type AuthGateProps = {
  isLoading: boolean;
  onLogin: () => Promise<void>;
  onRegister: () => Promise<void>;
  error?: string | null;
};

export default function AuthGate({ isLoading, onLogin, onRegister, error }: AuthGateProps) {
  const [status, setStatus] = useState<"idle" | "working">("idle");
  const spotlight = useSpotlight<HTMLElement>();

  const handleLogin = async () => {
    if (status === "working") {
      return;
    }
    setStatus("working");
    await onLogin();
  };

  const handleRegister = async () => {
    if (status === "working") {
      return;
    }
    setStatus("working");
    await onRegister();
  };

  return (
    <div className="auth-gate">
      <div className="fairy-lights" aria-hidden="true" />
      <motion.div
        className="auth-shell"
        initial="initial"
        animate="animate"
        variants={staggerContainer}
      >
        <motion.section
          className="auth-hero aurora-bg"
          {...fadeSlideUpProps}
        >
          <p className="eyebrow">Brooks</p>
          <motion.h1
            initial={{ opacity: 0, filter: "blur(16px) saturate(0.1)" }}
            animate={{ opacity: 1, filter: "blur(0px) saturate(1)" }}
            transition={{ duration: 0.8, ease: [0.16, 0.84, 0.2, 1] as const, delay: 0.2 }}
          >
            The last page is yours.
          </motion.h1>
          <p className="muted lead">
            Every notebook has a last page — the one you kept for yourself. This is yours. Drop a mark anywhere in the world.
          </p>
          <motion.p
            className="auth-verse"
            initial={{ opacity: 0, filter: "sepia(0.85)" }}
            animate={{ opacity: 0.8, filter: "sepia(0)" }}
            transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] as const, delay: 0.6 }}
          >
            Every child draws on the last page of their notebook.<br />
            It is the one page that belongs only to them — ungraded, unjudged, completely free.
          </motion.p>
        </motion.section>

        <motion.aside
          className="auth-panel glow-border spotlight-target"
          ref={spotlight.ref}
          onMouseMove={spotlight.onMouseMove}
          {...fadeSlideUpProps}
          transition={{ ...fadeSlideUpProps.transition, delay: 0.12 }}
        >
          <h2>Open the book</h2>
          {error && <p className="error">{error}</p>}
          <div className="auth-actions">
            <motion.button
              type="button"
              className="primary auth-btn-glow"
              disabled={isLoading || status === "working"}
              onClick={handleLogin}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isLoading ? "Loading..." : "Sign in"}
            </motion.button>
            <motion.button
              type="button"
              className="ghost"
              disabled={isLoading || status === "working"}
              onClick={handleRegister}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Create account
            </motion.button>
          </div>
        </motion.aside>
      </motion.div>
    </div>
  );
}
