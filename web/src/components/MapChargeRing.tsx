import { useEffect } from "react";
import { MAP_SETTINGS } from "../lib/frontendConfig";
import "../styles/MapChargeRing.css";

interface MapChargeRingProps {
  x: number;
  y: number;
  active: boolean;
  onComplete: () => void;
  onCancel: () => void;
}

export function MapChargeRing({ x, y, active, onComplete, onCancel }: MapChargeRingProps) {
  const radius = MAP_SETTINGS.holdRingRadius;
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
      style={{ left: x - MAP_SETTINGS.holdRingOffset, top: y - MAP_SETTINGS.holdRingOffset }}
      aria-hidden="true"
    >
      <svg width={MAP_SETTINGS.holdRingSize} height={MAP_SETTINGS.holdRingSize} viewBox="0 0 80 80">
        <defs>
          <filter id="ink-rough">
            <feTurbulence
              type="turbulence"
              baseFrequency={MAP_SETTINGS.holdRingTurbulenceBaseFrequency}
              numOctaves={MAP_SETTINGS.holdRingTurbulenceOctaves}
              result="noise"
            />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale={MAP_SETTINGS.holdRingDisplacementScale} />
          </filter>
        </defs>
        <circle
          className="charge-ring-track"
          cx={MAP_SETTINGS.holdRingCenter}
          cy={MAP_SETTINGS.holdRingCenter}
          r={radius}
          strokeWidth={MAP_SETTINGS.holdRingStrokeWidth}
          filter="url(#ink-rough)"
        />
        <circle
          className="charge-ring-fill"
          cx={MAP_SETTINGS.holdRingCenter}
          cy={MAP_SETTINGS.holdRingCenter}
          r={radius}
          strokeWidth={MAP_SETTINGS.holdRingStrokeWidth}
          strokeDasharray={circumference}
          onAnimationEnd={onComplete}
          filter="url(#ink-rough)"
        />
        <circle
          className="charge-ring-center"
          cx={MAP_SETTINGS.holdRingCenter}
          cy={MAP_SETTINGS.holdRingCenter}
          r={MAP_SETTINGS.holdRingCenterRadius}
        />
      </svg>
    </div>
  );
}
