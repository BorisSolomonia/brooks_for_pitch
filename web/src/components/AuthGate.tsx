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
      <div className="fairy-lights" aria-hidden="true" />
      <div className="auth-shell">
        <section className="auth-hero">
          <p className="eyebrow">Brooks</p>
          <h1>The last page is yours.</h1>
          <p className="muted lead">
            Every notebook has a last page — the one you kept for yourself. This is yours. Drop a mark anywhere in the world.
          </p>
          <p className="auth-verse">
            Every child draws on the last page of their notebook.<br />
            It is the one page that belongs only to them — ungraded, unjudged, completely free.
          </p>
        </section>

        <aside className="auth-panel">
          <h2>Open the book</h2>
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
        </aside>
      </div>
    </div>
  );
}
