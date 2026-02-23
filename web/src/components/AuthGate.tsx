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
          <h1>Leave a trace in time.</h1>
          <p className="muted lead">
            Drop a pin anywhere. Choose who finds it — and when.
          </p>
          <p className="auth-verse">
            Some things are meant to be discovered<br />
            by the right person, at the right moment.
          </p>
        </section>

        <aside className="auth-panel">
          <h2>Open the door</h2>
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
