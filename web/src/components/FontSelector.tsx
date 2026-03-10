import { useState } from "react";
import type { FontSlot } from "../lib/fonts";
import { getFontsForSlot } from "../lib/fonts";
import "../styles/FontSelector.css";

type FontSelectorProps = {
  selections: Record<FontSlot, string>;
  onChange: (slot: FontSlot, fontId: string) => void;
};

const SLOTS: { slot: FontSlot; label: string }[] = [
  { slot: "display", label: "Headings" },
  { slot: "body",    label: "Body" },
  { slot: "mono",    label: "Labels" },
];

export function FontSelector({ selections, onChange }: FontSelectorProps) {
  const [collapsed, setCollapsed] = useState(true);

  return (
    <div className={`font-selector ${collapsed ? "collapsed" : ""}`}>
      <button
        className="font-selector-toggle"
        onClick={() => setCollapsed(v => !v)}
        title="Font tester"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="4 7 4 4 20 4 20 7" />
          <line x1="9" y1="20" x2="15" y2="20" />
          <line x1="12" y1="4" x2="12" y2="20" />
        </svg>
        {collapsed ? null : <span>Fonts</span>}
      </button>

      {!collapsed && (
        <div className="font-selector-body">
          {SLOTS.map(({ slot, label }) => {
            const options = getFontsForSlot(slot);
            return (
              <div key={slot} className="font-slot-group">
                <span className="font-slot-label">{label}</span>
                <div className="font-slot-options">
                  {options.map(opt => (
                    <button
                      key={opt.id}
                      className={`font-option ${selections[slot] === opt.id ? "active" : ""}`}
                      onClick={() => onChange(slot, opt.id)}
                      style={{ fontFamily: opt.family }}
                      title={opt.origin}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
