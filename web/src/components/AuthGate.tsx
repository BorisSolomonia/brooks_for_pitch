import { useState } from "react";

type AuthGateProps = {
  isLoading: boolean;
  onLogin: () => Promise<void>;
  onRegister: () => Promise<void>;
  error?: string | null;
};

export default function AuthGate({ isLoading, onLogin, onRegister, error }: AuthGateProps) {
  const [status, setStatus] = useState<"idle" | "working">("idle");

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
      <div className="auth-shell">
        <section className="auth-hero">
          <p className="eyebrow">Brooks</p>
          <h1>Read the city as it breathes around you.</h1>
          <p className="muted lead">
            Drop a pin, tune visibility, and discover what nearby people leave in motion.
          </p>
          <div className="hero-grid">
            <div className="hero-tile">
              <span className="hero-label">Nearby feed</span>
              <span className="hero-value">Live map layer</span>
              <p className="hero-sub">Pins refresh as your location changes.</p>
            </div>
            <div className="hero-tile">
              <span className="hero-label">Quick post</span>
              <span className="hero-value">One-tap publish</span>
              <p className="hero-sub">Leave a mark without breaking your flow.</p>
            </div>
            <div className="hero-tile">
              <span className="hero-label">City aware</span>
              <span className="hero-value">Adaptive skin</span>
              <p className="hero-sub">The UI shifts with your surroundings.</p>
            </div>
            <div className="hero-tile">
              <span className="hero-label">Proximity first</span>
              <span className="hero-value">Local by default</span>
              <p className="hero-sub">Only nearby pins surface in your view.</p>
            </div>
          </div>
          <div className="hero-strip">
            <span className="hero-chip">Live radius</span>
            <span className="hero-chip">Context first</span>
            <span className="hero-chip">Instant map</span>
          </div>
        </section>

        <aside className="auth-panel">
          <p className="eyebrow">Access</p>
          <h2>Sign in to publish and reveal local pins.</h2>
          <p className="muted">
            Use your account to open the map feed and post spatial notes around you.
          </p>
          {error && <p className="error">{error}</p>}
          <div className="auth-actions">
            <button
              type="button"
              className="primary"
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
          <p className="muted small">
            You will be redirected to Auth0 to complete authentication.
          </p>
          <div className="auth-meta">
            <span className="auth-chip">Secure auth</span>
            <span className="auth-chip">Fast entry</span>
            <span className="auth-chip">Privacy first</span>
          </div>
        </aside>
      </div>
    </div>
  );
}
