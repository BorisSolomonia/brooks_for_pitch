import { useEffect, useId, useState } from "react";
import type { PinForm as PinFormType, Coordinates } from "../lib/types";
import "../styles/PinCreationModal.css";

interface PinCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (form: PinFormType) => Promise<void>;
  location: Coordinates;
}

export function PinCreationModal({ isOpen, onClose, onSubmit, location }: PinCreationModalProps) {
  const [text, setText] = useState("");
  const [audienceType, setAudienceType] = useState<"PRIVATE" | "FRIENDS" | "FOLLOWERS" | "PUBLIC">("PUBLIC");
  const [revealType, setRevealType] = useState<"VISIBLE_ALWAYS" | "REACH_TO_REVEAL">("VISIBLE_ALWAYS");
  const [expiresInHours, setExpiresInHours] = useState(24);
  const [mapPrecision, setMapPrecision] = useState<"EXACT" | "BLURRED">("EXACT");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timeCapsule, setTimeCapsule] = useState(false);
  const [sendToPeople, setSendToPeople] = useState(false);
  const [recipientInput, setRecipientInput] = useState("");
  const [externalRecipientInput, setExternalRecipientInput] = useState("");
  const [mediaType, setMediaType] = useState<"NONE" | "PHOTO" | "VIDEO" | "AUDIO" | "LINK">("NONE");
  const [recipientError, setRecipientError] = useState<string | null>(null);
  const headingId = useId();

  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

  useEffect(() => {
    document.body.classList.toggle("modal-open", isOpen);
    return () => {
      document.body.classList.remove("modal-open");
    };
  }, [isOpen]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!text.trim() || isSubmitting) {
      return;
    }

    if (sendToPeople) {
      const ids = recipientInput
        .split(",")
        .map(value => value.trim())
        .filter(Boolean);
      const invalidIds = ids.filter(value => !uuidRegex.test(value));
      if (invalidIds.length) {
        setRecipientError(`Invalid UUID(s): ${invalidIds.slice(0, 3).join(", ")}${invalidIds.length > 3 ? "..." : ""}`);
        return;
      }
      setRecipientError(null);
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        text: text.trim(),
        audienceType,
        revealType,
        expiresInHours,
        mapPrecision,
        timeCapsule,
        mediaType,
        recipientIds: sendToPeople
          ? recipientInput
              .split(",")
              .map(value => value.trim())
              .filter(Boolean)
          : [],
        externalRecipients: sendToPeople
          ? externalRecipientInput
              .split(",")
              .map(value => value.trim())
              .filter(Boolean)
          : []
      });

      setText("");
      setAudienceType("PUBLIC");
      setRevealType("VISIBLE_ALWAYS");
      setExpiresInHours(24);
      setMapPrecision("EXACT");
      setTimeCapsule(false);
      setSendToPeople(false);
      setRecipientInput("");
      setExternalRecipientInput("");
      setRecipientError(null);
      setMediaType("NONE");
      onClose();
    } catch (error) {
      console.error("Failed to create pin:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const charLimit = 500;

  return (
    <>
      <div className={`modal-backdrop ${isOpen ? "open" : ""}`} onClick={onClose} />
      <section
        className={`pin-modal ${isOpen ? "open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={headingId}
        aria-hidden={!isOpen}
      >
        <div className="modal-handle" />

        <header className="modal-header">
          <div>
            <p className="eyebrow">Create</p>
            <h2 id={headingId}>Leave a mark</h2>
          </div>
          <button className="modal-close" onClick={onClose} aria-label="Close" type="button">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </header>

        <form className="modal-content" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="pin-text" className="form-label">
              Message
            </label>
            <textarea
              id="pin-text"
              className="form-textarea"
              placeholder="Share a local note"
              value={text}
              onChange={event => setText(event.target.value)}
              maxLength={charLimit}
              rows={4}
              autoFocus
            />
            <div className="char-count">{text.length} / {charLimit}</div>
          </div>

          <div className="form-group">
            <label className="form-label">Audience</label>
            <div className="pill-group">
              <button type="button" className={`pill ${audienceType === "PRIVATE" ? "active" : ""}`} onClick={() => setAudienceType("PRIVATE")}>
                Private
              </button>
              <button type="button" className={`pill ${audienceType === "FRIENDS" ? "active" : ""}`} onClick={() => setAudienceType("FRIENDS")}>
                Friends
              </button>
              <button type="button" className={`pill ${audienceType === "FOLLOWERS" ? "active" : ""}`} onClick={() => setAudienceType("FOLLOWERS")}>
                Followers
              </button>
              <button type="button" className={`pill ${audienceType === "PUBLIC" ? "active" : ""}`} onClick={() => setAudienceType("PUBLIC")}>
                Public
              </button>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Media type</label>
            <div className="pill-group">
              <button type="button" className={`pill ${mediaType === "PHOTO" ? "active" : ""}`} onClick={() => setMediaType("PHOTO")}>
                Photo
              </button>
              <button type="button" className={`pill ${mediaType === "VIDEO" ? "active" : ""}`} onClick={() => setMediaType("VIDEO")}>
                Video
              </button>
              <button type="button" className={`pill ${mediaType === "AUDIO" ? "active" : ""}`} onClick={() => setMediaType("AUDIO")}>
                Audio
              </button>
              <button type="button" className={`pill ${mediaType === "LINK" ? "active" : ""}`} onClick={() => setMediaType("LINK")}>
                Link
              </button>
              <button type="button" className={`pill ${mediaType === "NONE" ? "active" : ""}`} onClick={() => setMediaType("NONE")}>
                None
              </button>
            </div>
          </div>

          <div className="form-group capsule-group">
            <label className="form-label">Time capsule</label>
            <label className="capsule-toggle" htmlFor="time-capsule">
              <input id="time-capsule" type="checkbox" checked={timeCapsule} onChange={event => setTimeCapsule(event.target.checked)} />
              Save for later reveal
            </label>

            {timeCapsule ? (
              <div className="capsule-options">
                <div className="pill-group">
                  <button type="button" className={`pill ${!sendToPeople ? "active" : ""}`} onClick={() => setSendToPeople(false)}>
                    Keep private
                  </button>
                  <button type="button" className={`pill ${sendToPeople ? "active" : ""}`} onClick={() => setSendToPeople(true)}>
                    Send to people
                  </button>
                </div>

                {sendToPeople ? (
                  <div className="capsule-recipients">
                    <label className="form-label">Recipient UUIDs (comma separated)</label>
                    <input
                      className="form-input"
                      placeholder="7c9e6679-7425-40de-944b-e07fc1f90ae7, 9a35d2b0-3b0a-4b25-9f4f-6d8c8adcb4e1"
                      value={recipientInput}
                      onChange={event => {
                        setRecipientInput(event.target.value);
                        if (recipientError) {
                          setRecipientError(null);
                        }
                      }}
                    />
                    {recipientError ? <div className="form-error">{recipientError}</div> : <div className="form-hint">Only UUIDs are accepted right now.</div>}
                    <label className="form-label">External recipients</label>
                    <input
                      className="form-input"
                      placeholder="email, handle, or note"
                      value={externalRecipientInput}
                      onChange={event => setExternalRecipientInput(event.target.value)}
                    />
                  </div>
                ) : null}
              </div>
            ) : null}
          </div>

          <div className="form-group">
            <label className="form-label">Reveal mode</label>
            <div className="toggle-group">
              <button type="button" className={`toggle ${revealType === "VISIBLE_ALWAYS" ? "active" : ""}`} onClick={() => setRevealType("VISIBLE_ALWAYS")}>
                Always visible
              </button>
              <button type="button" className={`toggle ${revealType === "REACH_TO_REVEAL" ? "active" : ""}`} onClick={() => setRevealType("REACH_TO_REVEAL")}>
                Reach to reveal
              </button>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="expires" className="form-label">
                Expires in
              </label>
              <select id="expires" className="form-select" value={expiresInHours} onChange={event => setExpiresInHours(Number(event.target.value))}>
                <option value={1}>1 hour</option>
                <option value={6}>6 hours</option>
                <option value={24}>24 hours</option>
                <option value={168}>7 days</option>
                <option value={720}>30 days</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Location precision</label>
              <div className="toggle-group">
                <button type="button" className={`toggle ${mapPrecision === "EXACT" ? "active" : ""}`} onClick={() => setMapPrecision("EXACT")}>
                  Exact
                </button>
                <button type="button" className={`toggle ${mapPrecision === "BLURRED" ? "active" : ""}`} onClick={() => setMapPrecision("BLURRED")}>
                  Blurred
                </button>
              </div>
            </div>
          </div>

          <div className="location-info">
            <span className="eyebrow">Pin location</span>
            <strong>
              {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
            </strong>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={!text.trim() || isSubmitting}>
              {isSubmitting ? (
                <>
                  <span className="spinner" />
                  Posting
                </>
              ) : (
                "Post"
              )}
            </button>
          </div>
        </form>
      </section>
    </>
  );
}
