import type { MapPin } from "../lib/types";
import "../styles/PinDetailModal.css";

type PinDetailModalProps = {
  pin: MapPin | null;
  onClose: () => void;
};

export function PinDetailModal({ pin, onClose }: PinDetailModalProps) {
  if (!pin) return null;

  return (
    <>
      <div className={`modal-backdrop ${pin ? "open" : ""}`} onClick={onClose} />
      <div className={`pin-detail-modal ${pin ? "open" : ""}`}>
        <div className="modal-handle" />
        <div className="modal-header">
          <h2>Pin</h2>
          <button className="modal-close" onClick={onClose} aria-label="Close">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        <div className="pin-detail-body">
          <div className="pin-detail-row">
            <span className="pin-detail-label">ID</span>
            <span className="pin-detail-value mono">{pin.id.slice(0, 12)}...</span>
          </div>
          <div className="pin-detail-row">
            <span className="pin-detail-label">Location</span>
            <span className="pin-detail-value mono">
              {pin.location.lat.toFixed(5)}, {pin.location.lng.toFixed(5)}
            </span>
          </div>
          <div className="pin-detail-row">
            <span className="pin-detail-label">Precision</span>
            <span className="pin-detail-value">
              {pin.mapPrecision === "BLURRED" ? "Blurred" : "Exact"}
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
