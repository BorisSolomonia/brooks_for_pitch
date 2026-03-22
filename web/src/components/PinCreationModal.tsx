import { useEffect, useId, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { fadeSlideUpProps } from "./MotionWrappers";
import { RecipientPicker } from "./RecipientPicker";
import type { PinForm as PinFormType, Coordinates } from "../lib/types";
import {
  MOTION_SETTINGS,
  PIN_AUDIENCE_OPTIONS,
  PIN_CREATION_UI,
  PIN_DURATION_PRESETS,
  PIN_FORM_SETTINGS,
  PIN_RADIUS_OPTIONS,
  createDefaultRevealAtValue
} from "../lib/frontendConfig";
import "../styles/PinCreationModal.css";

type AudienceType = "PRIVATE" | "FRIENDS" | "FOLLOWERS" | "PUBLIC";
type RevealType = "VISIBLE_ALWAYS" | "REACH_TO_REVEAL";
type MapPrecision = "EXACT" | "BLURRED";
type MediaType = "NONE" | "PHOTO" | "VIDEO" | "AUDIO" | "LINK";

type MeterSectionProps = {
  title: string;
  subtitle: string;
  currentLabel: string;
  currentDescription: string;
  index: number;
  maxIndex: number;
  stepLabels: string[];
  onChangeIndex: (index: number) => void;
};

interface PinCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (form: PinFormType) => Promise<void>;
  location: Coordinates;
  token?: string;
}

function clampIndex(index: number, maxIndex: number) {
  return Math.max(0, Math.min(index, maxIndex));
}

function audienceIcon(icon: (typeof PIN_AUDIENCE_OPTIONS)[number]["icon"]) {
  switch (icon) {
    case "lock":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect x="5" y="11" width="14" height="9" rx="3" />
          <path d="M8 11V8a4 4 0 0 1 8 0v3" />
          <circle cx="12" cy="15.5" r="1.2" />
        </svg>
      );
    case "friends":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="8" cy="8.5" r="2.5" />
          <circle cx="16" cy="9.5" r="2.5" />
          <path d="M3.5 18c.8-2.7 2.8-4 6-4s5.2 1.3 6 4" />
          <path d="M12.5 18c.7-1.9 2.2-3 4.5-3 1.9 0 3.2.7 4 2.2" />
        </svg>
      );
    case "followers":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="9" cy="8" r="2.6" />
          <path d="M4.5 18c.8-2.8 2.8-4.2 6-4.2 3.1 0 5.1 1.4 5.9 4.2" />
          <path d="M17.5 7v6" />
          <path d="M14.5 10h6" />
        </svg>
      );
    case "public":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="12" cy="12" r="7" />
          <path d="M5 12h14" />
          <path d="M12 5a11 11 0 0 1 0 14" />
          <path d="M12 5a11 11 0 0 0 0 14" />
        </svg>
      );
  }
}

function MeterSection({
  title,
  subtitle,
  currentLabel,
  currentDescription,
  index,
  maxIndex,
  stepLabels,
  onChangeIndex
}: MeterSectionProps) {
  const progress = maxIndex === 0 ? 0 : index / maxIndex;
  const dashOffset = PIN_CREATION_UI.meterCircumference * (1 - progress);
  const angle = PIN_CREATION_UI.meterStartAngle + PIN_CREATION_UI.meterSweep * progress;
  const knobRadians = (angle * Math.PI) / 180;
  const knobX = 94 + Math.cos(knobRadians) * PIN_CREATION_UI.meterRadius;
  const knobY = 94 + Math.sin(knobRadians) * PIN_CREATION_UI.meterRadius;

  return (
    <div className="meter-block">
      <div className="section-copy compact">
        <p className="section-kicker">{subtitle}</p>
        <h3>{title}</h3>
      </div>

      <div className="meter-shell">
        <svg className="meter-svg" viewBox="0 0 188 188" aria-hidden="true">
          <defs>
            <linearGradient id={`${title}-gradient`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="var(--cta-bg-start)" />
              <stop offset="100%" stopColor="var(--cta-bg-end)" />
            </linearGradient>
          </defs>
          <circle className="meter-track" cx="94" cy="94" r={PIN_CREATION_UI.meterRadius} />
          <circle
            className="meter-fill"
            cx="94"
            cy="94"
            r={PIN_CREATION_UI.meterRadius}
            strokeDasharray={PIN_CREATION_UI.meterCircumference}
            strokeDashoffset={dashOffset}
            style={{ transform: `rotate(${PIN_CREATION_UI.meterStartAngle}deg)`, transformOrigin: "50% 50%", stroke: `url(#${title}-gradient)` }}
          />
          <circle className="meter-knob-shadow" cx={knobX} cy={knobY} r="10" />
          <circle className="meter-knob" cx={knobX} cy={knobY} r="8" />
        </svg>
        <div className="meter-center">
          <strong>{currentLabel}</strong>
          <span>{currentDescription}</span>
        </div>
      </div>

      <input
        className="meter-slider"
        type="range"
        min={0}
        max={maxIndex}
        step={1}
        value={index}
        onChange={event => onChangeIndex(clampIndex(Number(event.target.value), maxIndex))}
        aria-label={title}
      />

      <div className="meter-steps" role="list">
        {stepLabels.map((label, stepIndex) => (
          <button
            key={`${title}-${label}`}
            type="button"
            className={`meter-step ${stepIndex === index ? "active" : ""}`}
            onClick={() => onChangeIndex(stepIndex)}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}

export function PinCreationModal({ isOpen, onClose, onSubmit, location, token }: PinCreationModalProps) {
  const [text, setText] = useState("");
  const [audienceType, setAudienceType] = useState<AudienceType>("PUBLIC");
  const [revealType, setRevealType] = useState<RevealType>("VISIBLE_ALWAYS");
  const [expiresInHours, setExpiresInHours] = useState<number | "permanent">(PIN_FORM_SETTINGS.defaultExpiresInHours);
  const [notifyRadiusM, setNotifyRadiusM] = useState(0);
  const [mapPrecision, setMapPrecision] = useState<MapPrecision>("EXACT");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timeCapsule, setTimeCapsule] = useState(false);
  const [revealAt, setRevealAt] = useState(() => createDefaultRevealAtValue());
  const [sendToPeople, setSendToPeople] = useState(false);
  const [recipientInput, setRecipientInput] = useState("");
  const [externalRecipientInput, setExternalRecipientInput] = useState("");
  const [pickerRecipientIds, setPickerRecipientIds] = useState<string[]>([]);
  const [mediaType, setMediaType] = useState<MediaType>("NONE");
  const [recipientError, setRecipientError] = useState<string | null>(null);
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const headingId = useId();

  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

  useEffect(() => {
    if (!isOpen) {
      (document.activeElement as HTMLElement)?.blur();
    }
    document.body.classList.toggle("modal-open", isOpen);
    return () => {
      document.body.classList.remove("modal-open");
    };
  }, [isOpen]);

  const radiusIndex = useMemo(() => {
    const foundIndex = PIN_RADIUS_OPTIONS.findIndex(option => option.value === notifyRadiusM);
    return foundIndex >= 0 ? foundIndex : 0;
  }, [notifyRadiusM]);

  const timeIndex = useMemo(() => {
    const foundIndex = PIN_DURATION_PRESETS.findIndex(preset => preset.hours === expiresInHours);
    return foundIndex >= 0 ? foundIndex : 0;
  }, [expiresInHours]);

  const radiusDescription = notifyRadiusM === 0
    ? "No proximity trigger"
    : `Alert when someone enters ${PIN_RADIUS_OPTIONS[radiusIndex].label.toLowerCase()}`;
  const timeDescription = expiresInHours === "permanent"
    ? "The note stays active without expiry"
    : `Expires after ${PIN_DURATION_PRESETS[timeIndex].label.toLowerCase()}`;
  const audienceSummary = PIN_AUDIENCE_OPTIONS.find(option => option.value === audienceType)?.label ?? "Public";
  const precisionSummary = mapPrecision === "EXACT" ? "Exact location" : "Blurred location";
  const revealSummary = revealType === "VISIBLE_ALWAYS" ? "Visible on map" : "Reveal on reach";

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
      // Determine recipient IDs: prefer picker for FRIENDS/FOLLOWERS, fallback to manual input for vault
      const effectiveRecipientIds = (audienceType === "FRIENDS" || audienceType === "FOLLOWERS") && pickerRecipientIds.length > 0
        ? pickerRecipientIds
        : sendToPeople
          ? recipientInput.split(",").map(value => value.trim()).filter(Boolean)
          : [];

      await onSubmit({
        text: text.trim(),
        audienceType,
        revealType,
        expiresInHours,
        mapPrecision,
        timeCapsule,
        mediaType,
        notifyRadiusM,
        revealAt: timeCapsule ? revealAt : undefined,
        recipientIds: effectiveRecipientIds,
        externalRecipients: sendToPeople
          ? externalRecipientInput.split(",").map(value => value.trim()).filter(Boolean)
          : []
      });

      setText("");
      setAudienceType("PUBLIC");
      setRevealType("VISIBLE_ALWAYS");
      setExpiresInHours(PIN_FORM_SETTINGS.defaultExpiresInHours);
      setNotifyRadiusM(0);
      setMapPrecision("EXACT");
      setTimeCapsule(false);
      setRevealAt(createDefaultRevealAtValue());
      setSendToPeople(false);
      setRecipientInput("");
      setExternalRecipientInput("");
      setRecipientError(null);
      setPickerRecipientIds([]);
      setMediaType("NONE");
      setAdvancedOpen(false);
      onClose();
    } catch (error) {
      console.error("Failed to create pin:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const charLimit = PIN_FORM_SETTINGS.charLimit;
  const formGroupVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="modal-backdrop open"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: MOTION_SETTINGS.backdropDuration }}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {isOpen && (
          <motion.section
            className="pin-modal open"
            role="dialog"
            aria-modal="true"
            aria-labelledby={headingId}
            initial={{ y: "102%" }}
            animate={{ y: 0 }}
            exit={{ y: "102%" }}
            transition={{ duration: MOTION_SETTINGS.drawerDuration, ease: MOTION_SETTINGS.easeEmphasized }}
          >
            <div className="modal-handle" />

            <header className="modal-header">
              <div>
                <p className="eyebrow">Pin</p>
                <h2 id={headingId}>Leave a memory</h2>
              </div>
              <button className="modal-close" onClick={onClose} aria-label="Close" type="button">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </header>

            <motion.form
              className="modal-content"
              onSubmit={handleSubmit}
              initial="initial"
              animate="animate"
              transition={{ staggerChildren: 0.06 }}
            >
              <motion.div className="message-frame" variants={formGroupVariants} transition={fadeSlideUpProps.transition}>
                <div className="section-copy">
                  <p className="section-kicker">Message first</p>
                  <h3>Write the note before anything else</h3>
                </div>
                <label htmlFor="pin-text" className="sr-only">Message</label>
                <textarea
                  id="pin-text"
                  className="form-textarea message-textarea"
                  placeholder="Write what this place should remember."
                  value={text}
                  onChange={event => setText(event.target.value)}
                  maxLength={charLimit}
                  rows={5}
                  autoFocus
                />
                <div className="message-footer">
                  <span className="message-hint">This is the primary content viewers will uncover.</span>
                  <div className="char-count">{text.length} / {charLimit}</div>
                </div>
              </motion.div>

              <motion.div className="form-group" variants={formGroupVariants} transition={fadeSlideUpProps.transition}>
                <div className="section-copy compact">
                  <p className="section-kicker">Audience</p>
                  <h3>Choose who this note belongs to</h3>
                </div>
                <div className="audience-grid" role="radiogroup" aria-label="Audience">
                  {PIN_AUDIENCE_OPTIONS.map(option => (
                    <button
                      key={option.value}
                      type="button"
                      className={`audience-card ${audienceType === option.value ? "active" : ""}`}
                      onClick={() => setAudienceType(option.value)}
                      aria-pressed={audienceType === option.value}
                    >
                      <span className="audience-icon">{audienceIcon(option.icon)}</span>
                      <span className="audience-label">{option.label}</span>
                      <span className="audience-description">{option.description}</span>
                    </button>
                  ))}
                </div>
              </motion.div>

              {token && (audienceType === "FRIENDS" || audienceType === "FOLLOWERS") && (
                <motion.div className="form-group" variants={formGroupVariants} transition={fadeSlideUpProps.transition}>
                  <div className="section-copy compact">
                    <p className="section-kicker">Recipients</p>
                    <h3>Choose who sees this</h3>
                  </div>
                  <RecipientPicker
                    token={token}
                    audienceType={audienceType}
                    selectedIds={pickerRecipientIds}
                    onChange={setPickerRecipientIds}
                  />
                </motion.div>
              )}

              <motion.div className="form-group" variants={formGroupVariants} transition={fadeSlideUpProps.transition}>
                <MeterSection
                  title="Radius"
                  subtitle="Discovery distance"
                  currentLabel={PIN_RADIUS_OPTIONS[radiusIndex].label}
                  currentDescription={radiusDescription}
                  index={radiusIndex}
                  maxIndex={PIN_RADIUS_OPTIONS.length - 1}
                  stepLabels={PIN_RADIUS_OPTIONS.map(option => option.label)}
                  onChangeIndex={nextIndex => setNotifyRadiusM(PIN_RADIUS_OPTIONS[nextIndex].value)}
                />
              </motion.div>

              <motion.div className="form-group" variants={formGroupVariants} transition={fadeSlideUpProps.transition}>
                <MeterSection
                  title="Time"
                  subtitle="Pin lifetime"
                  currentLabel={PIN_DURATION_PRESETS[timeIndex].label}
                  currentDescription={timeDescription}
                  index={timeIndex}
                  maxIndex={PIN_DURATION_PRESETS.length - 1}
                  stepLabels={PIN_DURATION_PRESETS.map(preset => preset.label)}
                  onChangeIndex={nextIndex => setExpiresInHours(PIN_DURATION_PRESETS[nextIndex].hours)}
                />
              </motion.div>

              <motion.div className={`advanced-group${advancedOpen ? " open" : ""}`} variants={formGroupVariants} transition={fadeSlideUpProps.transition}>
                <button
                  type="button"
                  className="advanced-trigger"
                  onClick={() => setAdvancedOpen(value => !value)}
                  aria-expanded={advancedOpen}
                >
                  <span>
                    <span className="section-kicker">Advanced</span>
                    <strong>Reveal, vault, and media</strong>
                  </span>
                  <svg className={`vault-chevron${advancedOpen ? " expanded" : ""}`} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>

                {advancedOpen && (
                  <div className="advanced-body">
                    <div className="form-group compact-group">
                      <label className="form-label">Reveal mode</label>
                      <div className="toggle-group compact-toggle-group">
                        <button type="button" className={`toggle ${revealType === "VISIBLE_ALWAYS" ? "active" : ""}`} onClick={() => setRevealType("VISIBLE_ALWAYS")}>
                          Always visible
                        </button>
                        <button type="button" className={`toggle ${revealType === "REACH_TO_REVEAL" ? "active" : ""}`} onClick={() => setRevealType("REACH_TO_REVEAL")}>
                          Reach to reveal
                        </button>
                      </div>
                    </div>

                    <div className="form-group compact-group">
                      <label className="form-label">Media type</label>
                      <div className="pill-group compact-pill-group">
                        {(["PHOTO", "VIDEO", "AUDIO", "LINK", "NONE"] as MediaType[]).map(option => (
                          <button
                            key={option}
                            type="button"
                            className={`pill ${mediaType === option ? "active" : ""}`}
                            onClick={() => setMediaType(option)}
                          >
                            {option === "NONE" ? "None" : option.charAt(0) + option.slice(1).toLowerCase()}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className={`vault-group${timeCapsule ? " vault-open" : ""}`}>
                      <button
                        type="button"
                        className="vault-trigger"
                        onClick={() => setTimeCapsule(v => !v)}
                        aria-expanded={timeCapsule}
                      >
                        <span className="vault-icon">{timeCapsule ? "Lock on" : "Locked"}</span>
                        <span className="vault-title">Vault mode</span>
                        <span className="vault-desc">
                          {timeCapsule ? "Hidden until the unlock date arrives" : "Schedule this memory for later"}
                        </span>
                        <svg className={`vault-chevron${timeCapsule ? " expanded" : ""}`} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <polyline points="6 9 12 15 18 9" />
                        </svg>
                      </button>

                      {timeCapsule && (
                        <div className="vault-body">
                          <div className="vault-date-row">
                            <label className="form-label form-label-small" htmlFor="reveal-at">Unlock on</label>
                            <input
                              id="reveal-at"
                              type="datetime-local"
                              className="form-input vault-date-input"
                              value={revealAt}
                              min={new Date(Date.now() + 86_400_000).toISOString().slice(0, 16)}
                              onChange={e => setRevealAt(e.target.value)}
                            />
                            <p className="vault-hint">This note stays invisible until the unlock date. Only you can see it.</p>
                          </div>

                          <div className="vault-recipients">
                            <div className="pill-group compact-pill-group">
                              <button type="button" className={`pill ${!sendToPeople ? "active" : ""}`} onClick={() => setSendToPeople(false)}>
                                Keep private
                              </button>
                              <button type="button" className={`pill ${sendToPeople ? "active" : ""}`} onClick={() => setSendToPeople(true)}>
                                Send to people
                              </button>
                            </div>

                            {sendToPeople && (
                              <div className="capsule-recipients">
                                <label className="form-label form-label-small">Recipient UUIDs</label>
                                <input
                                  className="form-input"
                                  placeholder="7c9e6679-7425-40de-944b-e07fc1f90ae7"
                                  value={recipientInput}
                                  onChange={event => {
                                    setRecipientInput(event.target.value);
                                    if (recipientError) {
                                      setRecipientError(null);
                                    }
                                  }}
                                />
                                {recipientError ? <div className="form-error">{recipientError}</div> : <div className="form-hint">Only UUIDs accepted right now.</div>}
                                <label className="form-label form-label-small">External recipients</label>
                                <input
                                  className="form-input"
                                  placeholder="email, handle, or note"
                                  value={externalRecipientInput}
                                  onChange={event => setExternalRecipientInput(event.target.value)}
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </motion.div>

              <motion.div className="sheet-meta" variants={formGroupVariants} transition={fadeSlideUpProps.transition}>
                <div className="precision-block">
                  <span className="form-label form-label-small">Location precision</span>
                  <div className="precision-toggle">
                    <button type="button" className={`precision-chip ${mapPrecision === "EXACT" ? "active" : ""}`} onClick={() => setMapPrecision("EXACT")}>
                      Exact
                    </button>
                    <button type="button" className={`precision-chip ${mapPrecision === "BLURRED" ? "active" : ""}`} onClick={() => setMapPrecision("BLURRED")}>
                      Blurred
                    </button>
                  </div>
                </div>
                <div className="location-info compact-location-info">
                  <span className="eyebrow">Coordinates</span>
                  <strong>{location.lat.toFixed(6)}, {location.lng.toFixed(6)}</strong>
                </div>
              </motion.div>

              <motion.div className="submit-summary" variants={formGroupVariants} transition={fadeSlideUpProps.transition}>
                <span className="submit-summary-label">Ready to post</span>
                <div className="submit-summary-chips">
                  <span className="submit-summary-chip">{audienceSummary}</span>
                  <span className="submit-summary-chip">{PIN_RADIUS_OPTIONS[radiusIndex].label}</span>
                  <span className="submit-summary-chip">{PIN_DURATION_PRESETS[timeIndex].label}</span>
                  <span className="submit-summary-chip">{precisionSummary}</span>
                  <span className="submit-summary-chip">{revealSummary}</span>
                </div>
              </motion.div>

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
            </motion.form>
          </motion.section>
        )}
      </AnimatePresence>
    </>
  );
}
