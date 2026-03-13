import { useEffect, useRef, useState } from "react";
import { useSpotlight } from "../hooks/useSpotlight";

type AuthGateProps = {
  isLoading: boolean;
  onLogin: () => Promise<void>;
  onRegister: () => Promise<void>;
  error?: string | null;
};

export default function AuthGate({ isLoading, onLogin, onRegister, error }: AuthGateProps) {
  const [status, setStatus] = useState<"idle" | "working">("idle");
  const h1Ref = useRef<HTMLHeadingElement>(null);
  const verseRef = useRef<HTMLParagraphElement>(null);
  const spotlight = useSpotlight<HTMLElement>();

  useEffect(() => {
    const timer1 = setTimeout(() => {
      h1Ref.current?.classList.add("revealed");
    }, 200);
    const timer2 = setTimeout(() => {
      verseRef.current?.classList.add("revealed");
    }, 600);
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

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
      <div className="auth-shell">
        <section className="auth-hero aurora-bg">
          <p className="eyebrow">Brooks</p>
          <h1 ref={h1Ref} className="blur-reveal">The last page is yours.</h1>
          <p className="muted lead">
            Every notebook has a last page — the one you kept for yourself. This is yours. Drop a mark anywhere in the world.
          </p>
          <p ref={verseRef} className="auth-verse sepia-reveal">
            Every child draws on the last page of their notebook.<br />
            It is the one page that belongs only to them — ungraded, unjudged, completely free.
          </p>
        </section>

        <aside
          className="auth-panel glow-border spotlight-target"
          ref={spotlight.ref}
          onMouseMove={spotlight.onMouseMove}
        >
          <h2>Open the book</h2>
          {error && <p className="error">{error}</p>}
          <div className="auth-actions">
            <button
              type="button"
              className="primary auth-btn-glow"
              disabled={isLoading || status === "working"}
              onClick={handleLogin}
            >
              {isLoading ? "Loading..." : "Sign in"}
            </button>
            <button
              type="button"
              className="ghost"
              disabled={isLoading || status === "working"}
              onClick={handleRegister}
            >
              Create account
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}
