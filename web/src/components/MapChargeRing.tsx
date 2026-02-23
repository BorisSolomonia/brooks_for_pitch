import { useEffect } from "react";
import "../styles/MapChargeRing.css";

interface MapChargeRingProps {
  x: number;
  y: number;
  active: boolean;
  onComplete: () => void;
  onCancel: () => void;
}

export function MapChargeRing({ x, y, active, onComplete, onCancel }: MapChargeRingProps) {
  const radius = 32;
  const circumference = 2 * Math.PI * radius; // ≈ 201.06

  useEffect(() => {
    if (!active) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [active, onCancel]);

  if (!active) return null;

  return (
    <div
      className="charge-ring-container"
      style={{ left: x - 40, top: y - 40 }}
      aria-hidden="true"
    >
      <svg width="80" height="80" viewBox="0 0 80 80">
        <circle
          className="charge-ring-track"
          cx="40"
          cy="40"
          r={radius}
          strokeWidth="4"
        />
        <circle
          className="charge-ring-fill"
          cx="40"
          cy="40"
          r={radius}
          strokeWidth="4"
          strokeDasharray={circumference}
          onAnimationEnd={onComplete}
        />
        <circle className="charge-ring-center" cx="40" cy="40" r="5" />
      </svg>
    </div>
  );
}
