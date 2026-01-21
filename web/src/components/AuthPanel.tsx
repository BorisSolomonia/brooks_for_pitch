import { useState } from "react";

type AuthPanelProps = {
  token: string | null;
  onLogin: (email: string, password: string) => Promise<void>;
  onLogout: () => void;
};

export default function AuthPanel({ token, onLogin, onLogout }: AuthPanelProps) {
  const [email, setEmail] = useState("demo@brooks.app");
  const [password, setPassword] = useState("password");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setStatus("loading");
    setError(null);
    try {
      await onLogin(email, password);
      setStatus("idle");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Login failed.");
    }
  };

  if (token) {
    return (
      <div className="card auth-panel">
        <div className="card-header">
          <h3>Session</h3>
          <span className="badge success">Connected</span>
        </div>
        <p className="muted">Access token stored locally for API calls.</p>
        <button className="ghost" type="button" onClick={onLogout}>
          Sign out
        </button>
      </div>
    );
  }

  return (
    <form className="card auth-panel" onSubmit={handleSubmit}>
      <div className="card-header">
        <h3>Sign in</h3>
        <span className="badge">Demo account</span>
      </div>
      <label className="field">
        <span>Email</span>
        <input value={email} onChange={event => setEmail(event.target.value)} />
      </label>
      <label className="field">
        <span>Password</span>
        <input
          type="password"
          value={password}
          onChange={event => setPassword(event.target.value)}
        />
      </label>
      <button className="primary" type="submit" disabled={status === "loading"}>
        {status === "loading" ? "Signing in..." : "Sign in"}
      </button>
      {status === "error" && <span className="error">{error}</span>}
    </form>
  );
}
