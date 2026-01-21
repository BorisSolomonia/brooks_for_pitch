import { useState, useEffect } from 'react';
import type { PinForm as PinFormType, Coordinates } from '../lib/types';
import '../styles/PinCreationModal.css';

interface PinCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (form: PinFormType) => Promise<void>;
  location: Coordinates;
}

export function PinCreationModal({
  isOpen,
  onClose,
  onSubmit,
  location,
}: PinCreationModalProps) {
  const [text, setText] = useState('');
  const [audienceType, setAudienceType] = useState<'PRIVATE' | 'FRIENDS' | 'FOLLOWERS' | 'PUBLIC'>('PUBLIC');
  const [revealType, setRevealType] = useState<'VISIBLE_ALWAYS' | 'REACH_TO_REVEAL'>('VISIBLE_ALWAYS');
  const [expiresInHours, setExpiresInHours] = useState(24);
  const [mapPrecision, setMapPrecision] = useState<'EXACT' | 'BLURRED'>('EXACT');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await onSubmit({
        text: text.trim(),
        audienceType,
        revealType,
        expiresInHours,
        mapPrecision,
      });
      // Reset form
      setText('');
      setAudienceType('PUBLIC');
      setRevealType('VISIBLE_ALWAYS');
      setExpiresInHours(24);
      setMapPrecision('EXACT');
      onClose();
    } catch (error) {
      console.error('Failed to create pin:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const charCount = text.length;
  const charLimit = 500;

  return (
    <>
      <div
        className={`modal-backdrop ${isOpen ? 'open' : ''}`}
        onClick={onClose}
      />
      <div className={`pin-modal ${isOpen ? 'open' : ''}`}>
        <div className="modal-handle" />

        <div className="modal-header">
          <h2>Leave a Mark</h2>
          <button
            className="modal-close"
            onClick={onClose}
            aria-label="Close"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <form className="modal-content" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="pin-text" className="form-label">
              Your Message
            </label>
            <textarea
              id="pin-text"
              className="form-textarea"
              placeholder="What's on your mind?"
              value={text}
              onChange={(e) => setText(e.target.value)}
              maxLength={charLimit}
              rows={4}
              autoFocus
            />
            <div className="char-count">
              {charCount} / {charLimit}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Who can see this?</label>
            <div className="pill-group">
              <button
                type="button"
                className={`pill ${audienceType === 'PRIVATE' ? 'active' : ''}`}
                onClick={() => setAudienceType('PRIVATE')}
              >
                🔒 Private
              </button>
              <button
                type="button"
                className={`pill ${audienceType === 'FRIENDS' ? 'active' : ''}`}
                onClick={() => setAudienceType('FRIENDS')}
              >
                👥 Friends
              </button>
              <button
                type="button"
                className={`pill ${audienceType === 'FOLLOWERS' ? 'active' : ''}`}
                onClick={() => setAudienceType('FOLLOWERS')}
              >
                👁️ Followers
              </button>
              <button
                type="button"
                className={`pill ${audienceType === 'PUBLIC' ? 'active' : ''}`}
                onClick={() => setAudienceType('PUBLIC')}
              >
                🌍 Public
              </button>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Reveal Mode</label>
            <div className="toggle-group">
              <button
                type="button"
                className={`toggle ${revealType === 'VISIBLE_ALWAYS' ? 'active' : ''}`}
                onClick={() => setRevealType('VISIBLE_ALWAYS')}
              >
                ✨ Always Visible
              </button>
              <button
                type="button"
                className={`toggle ${revealType === 'REACH_TO_REVEAL' ? 'active' : ''}`}
                onClick={() => setRevealType('REACH_TO_REVEAL')}
              >
                🎯 Reach to Reveal
              </button>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="expires" className="form-label">
                Expires In
              </label>
              <select
                id="expires"
                className="form-select"
                value={expiresInHours}
                onChange={(e) => setExpiresInHours(Number(e.target.value))}
              >
                <option value={1}>1 hour</option>
                <option value={6}>6 hours</option>
                <option value={24}>24 hours</option>
                <option value={168}>7 days</option>
                <option value={720}>30 days</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Location</label>
              <div className="toggle-group">
                <button
                  type="button"
                  className={`toggle ${mapPrecision === 'EXACT' ? 'active' : ''}`}
                  onClick={() => setMapPrecision('EXACT')}
                  title="Show exact location"
                >
                  📍 Exact
                </button>
                <button
                  type="button"
                  className={`toggle ${mapPrecision === 'BLURRED' ? 'active' : ''}`}
                  onClick={() => setMapPrecision('BLURRED')}
                  title="Hide exact location"
                >
                  🌫️ Blurred
                </button>
              </div>
            </div>
          </div>

          <div className="location-info">
            📍 {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={!text.trim() || isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="spinner" />
                  Posting...
                </>
              ) : (
                <>
                  ✨ Post
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
