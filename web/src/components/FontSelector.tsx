import { useState } from "react";
import type { FontSlot } from "../lib/fonts";
import { getFontsForSlot } from "../lib/fonts";
import { FONT_SELECTOR_SLOTS } from "../lib/frontendConfig";
import "../styles/FontSelector.css";

type FontSelectorProps = {
  selections: Record<FontSlot, string>;
  onChange: (slot: FontSlot, fontId: string) => void;
};

export function FontSelector({ selections, onChange }: FontSelectorProps) {
  const [collapsed, setCollapsed] = useState(true);

  return (
    <div className={`font-selector ${collapsed ? "collapsed" : ""}`}>
      <button
        className="font-selector-toggle"
        onClick={() => setCollapsed(v => !v)}
        title="Font tester"
      >
        <span className="material-symbols-outlined">text_fields</span>
        {collapsed ? null : <span>Fonts</span>}
      </button>

      {!collapsed && (
        <div className="font-selector-body">
          {FONT_SELECTOR_SLOTS.map(({ slot, label }) => {
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
