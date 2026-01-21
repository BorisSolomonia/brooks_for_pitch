import type { MapPin } from "../lib/types";

type PinListProps = {
  pins: MapPin[];
  loading?: boolean;
  onRefresh?: () => void;
};

export default function PinList({ pins, loading, onRefresh }: PinListProps) {
  return (
    <div className="card pin-list">
      <div className="card-header">
        <h3>Nearby pins</h3>
        <button className="ghost" type="button" onClick={onRefresh} disabled={loading}>
          {loading ? "Refreshing..." : "Refresh"}
        </button>
      </div>
      {pins.length === 0 ? (
        <p className="empty">No pins yet. Drop the first one in this area.</p>
      ) : (
        <ul>
          {pins.map(pin => (
            <li key={pin.id}>
              <div>
                <strong>{pin.id.slice(0, 8)}</strong>
                <span className="muted">
                  {pin.mapPrecision === "BLURRED" ? "Blurred" : "Exact"}
                </span>
              </div>
              <span className="coords">
                {pin.location.lat.toFixed(4)}, {pin.location.lng.toFixed(4)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
