import { useState } from "react";
import type { PinForm } from "../lib/types";

type PinFormProps = {
  onSubmit: (form: PinForm) => Promise<void>;
  disabled?: boolean;
};

const DEFAULT_FORM: PinForm = {
  text: "",
  audienceType: "PUBLIC",
  revealType: "VISIBLE_ALWAYS",
  expiresInHours: 24,
  mapPrecision: "EXACT"
};

export default function PinForm({ onSubmit, disabled }: PinFormProps) {
  const [form, setForm] = useState<PinForm>(DEFAULT_FORM);
  const [status, setStatus] = useState<"idle" | "saving" | "error" | "success">("idle");
  const [error, setError] = useState<string | null>(null);

  const update = <K extends keyof PinForm>(key: K, value: PinForm[K]) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setStatus("saving");
    setError(null);
    try {
      await onSubmit(form);
      setStatus("success");
      setForm(DEFAULT_FORM);
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Failed to create pin.");
    }
  };

  return (
    <form className="card pin-form" onSubmit={handleSubmit}>
      <div className="card-header">
        <h3>Create a pin</h3>
        <span className="badge">Wizard-lite</span>
      </div>
      <label className="field">
        <span>Message</span>
        <textarea
          value={form.text}
          onChange={event => update("text", event.target.value)}
          placeholder="Leave a future note, a secret trail, or a public whisper."
          rows={4}
          required
          disabled={disabled}
        />
      </label>
      <div className="field-grid">
        <label className="field">
          <span>Audience</span>
          <select
            value={form.audienceType}
            onChange={event => update("audienceType", event.target.value as PinForm["audienceType"])}
            disabled={disabled}
          >
            <option value="PRIVATE">Private</option>
            <option value="FRIENDS">Friends</option>
            <option value="FOLLOWERS">Followers</option>
            <option value="PUBLIC">Public</option>
          </select>
        </label>
        <label className="field">
          <span>Reveal</span>
          <select
            value={form.revealType}
            onChange={event => update("revealType", event.target.value as PinForm["revealType"])}
            disabled={disabled}
          >
            <option value="VISIBLE_ALWAYS">Visible always</option>
            <option value="REACH_TO_REVEAL">Reach to reveal</option>
          </select>
        </label>
        <label className="field">
          <span>Expires in (hours)</span>
          <input
            type="number"
            min={1}
            max={720}
            value={form.expiresInHours}
            onChange={event => update("expiresInHours", Number(event.target.value))}
            disabled={disabled}
          />
        </label>
      </div>
      <div className="form-footer">
        <button className="primary" type="submit" disabled={disabled || status === "saving"}>
          {status === "saving" ? "Dropping pin..." : "Drop pin"}
        </button>
        {status === "success" && <span className="success">Pin created.</span>}
        {status === "error" && <span className="error">{error}</span>}
      </div>
    </form>
  );
}
