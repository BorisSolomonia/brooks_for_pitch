export type FontSlot = "display" | "body" | "mono";

export type FontOption = {
  id: string;
  label: string;
  family: string;
  slot: FontSlot;
  /** Which game(s) inspired this font choice */
  origin: string;
};

export const FONT_OPTIONS: FontOption[] = [
  // ── DISPLAY (headings / titles) ──────────────────────────────────────

  // Original antique book picks
  { id: "im-fell",        label: "IM Fell English",      family: '"IM Fell English", "Georgia", serif',          slot: "display", origin: "Kingdom Come: Deliverance — Renaissance letterpress" },
  { id: "cormorant-d",    label: "Cormorant Garamond",   family: '"Cormorant Garamond", "Georgia", serif',       slot: "display", origin: "AC Valhalla, CK3, Hogwarts Legacy" },
  { id: "medieval",        label: "MedievalSharp",        family: '"MedievalSharp", "Georgia", serif',            slot: "display", origin: "Generic medieval — Baldur's Gate style" },
  { id: "uncial",          label: "Uncial Antiqua",       family: '"Uncial Antiqua", "Georgia", serif',           slot: "display", origin: "Baldur's Gate 3 — medieval uncial hand" },

  // Game-inspired additions
  { id: "cinzel",          label: "Cinzel",               family: '"Cinzel", "Georgia", serif',                   slot: "display", origin: "AC Valhalla/Odyssey, Plague Tale, God of War, Elden Ring, Hogwarts Legacy — Roman capitals" },
  { id: "cinzel-deco",     label: "Cinzel Decorative",    family: '"Cinzel Decorative", "Georgia", serif',        slot: "display", origin: "Age of Empires IV, God of War — ornate Roman" },
  { id: "forum",           label: "Forum",                family: '"Forum", "Georgia", serif',                    slot: "display", origin: "AC Odyssey — Ancient Greek classical" },
  { id: "marcellus",       label: "Marcellus",            family: '"Marcellus", "Georgia", serif',                slot: "display", origin: "Civilization VI — flared Roman inscriptions" },
  { id: "fraktur",         label: "UnifrakturMaguntia",   family: '"UnifrakturMaguntia", "Georgia", serif',       slot: "display", origin: "Kingdom Come: Deliverance — Gothic blackletter" },
  { id: "almendra",        label: "Almendra",             family: '"Almendra", "Georgia", serif',                 slot: "display", origin: "Kingdom Come: Deliverance — hybrid blackletter/Roman" },
  { id: "eb-garamond-d",   label: "EB Garamond",          family: '"EB Garamond", "Georgia", serif',              slot: "display", origin: "Elden Ring, CK3 — old-style classical" },

  // ── BODY (paragraphs / descriptions) ─────────────────────────────────

  // Original antique book picks
  { id: "cormorant",       label: "Cormorant Garamond",   family: '"Cormorant Garamond", "Georgia", serif',       slot: "body", origin: "Base antique book serif" },
  { id: "eb-garamond",     label: "EB Garamond",          family: '"EB Garamond", "Georgia", serif',              slot: "body", origin: "Elden Ring, Crusader Kings III — scholarly old-style" },
  { id: "crimson",         label: "Crimson Pro",          family: '"Crimson Pro", "Georgia", serif',              slot: "body", origin: "Elden Ring — refined humanist serif" },
  { id: "baskerville",     label: "Libre Baskerville",    family: '"Libre Baskerville", "Georgia", serif',        slot: "body", origin: "Base antique book — transitional serif" },

  // Game-inspired additions
  { id: "alegreya",        label: "Alegreya",             family: '"Alegreya", "Georgia", serif',                 slot: "body", origin: "Baldur's Gate 3 — warm humanist text" },
  { id: "lora",            label: "Lora",                 family: '"Lora", "Georgia", serif',                     slot: "body", origin: "Age of Empires IV — balanced historical text" },
  { id: "vollkorn",        label: "Vollkorn",             family: '"Vollkorn", "Georgia", serif',                 slot: "body", origin: "Civilization VI — classical text" },
  { id: "spectral",        label: "Spectral",             family: '"Spectral", "Georgia", serif',                 slot: "body", origin: "Sekiro — high-contrast modern serif" },
  { id: "sura",            label: "Sura",                 family: '"Sura", "Georgia", serif',                     slot: "body", origin: "A Plague Tale — medieval France (exact match)" },
  { id: "belleza",         label: "Belleza",              family: '"Belleza", "Georgia", serif',                  slot: "body", origin: "A Plague Tale — elegant humanist (exact match)" },
  { id: "crimson-text",    label: "Crimson Text",         family: '"Crimson Text", "Georgia", serif',             slot: "body", origin: "Sekiro — elegant high-contrast serif" },

  // ── MONO / LABELS ────────────────────────────────────────────────────

  // Original picks
  { id: "special-elite",   label: "Special Elite",        family: '"Special Elite", "Courier New", monospace',    slot: "mono", origin: "Base antique book — typewriter letterpress" },
  { id: "cutive",          label: "Cutive Mono",          family: '"Cutive Mono", "Courier New", monospace',      slot: "mono", origin: "Base antique book — typewriter" },

  // Game-inspired additions
  { id: "fondamento",      label: "Fondamento",           family: '"Fondamento", "Georgia", serif',               slot: "mono", origin: "Crusader Kings III — calligraphic map labels (exact match)" },
  { id: "homemade-apple",  label: "Homemade Apple",       family: '"Homemade Apple", "Courier New", cursive',     slot: "mono", origin: "Red Dead Redemption 2 — Arthur's journal handwriting" },
  { id: "tangerine",       label: "Tangerine",            family: '"Tangerine", "Georgia", cursive',              slot: "mono", origin: "Hogwarts Legacy — italic calligraphy for letters" },
];

const CSS_VAR_MAP: Record<FontSlot, string> = {
  display: "--font-display",
  body:    "--font-serif",
  mono:    "--font-mono",
};

function getEnvDefault(slot: FontSlot): string | undefined {
  const key = `VITE_FONT_${slot.toUpperCase()}` as const;
  return (import.meta.env[key] as string | undefined) || undefined;
}

function findOptionById(id: string): FontOption | undefined {
  return FONT_OPTIONS.find(o => o.id === id);
}

export function getDefaultFontId(slot: FontSlot): string {
  const envVal = getEnvDefault(slot);
  if (envVal) {
    const match = findOptionById(envVal);
    if (match && match.slot === slot) return match.id;
  }
  // Fallbacks
  if (slot === "display") return "im-fell";
  if (slot === "body") return "cormorant";
  return "special-elite";
}

export function applyFont(slot: FontSlot, fontId: string) {
  const option = findOptionById(fontId);
  if (!option) return;
  document.documentElement.style.setProperty(CSS_VAR_MAP[slot], option.family);
  if (slot === "body") {
    document.body.style.fontFamily = option.family;
  }
}

export function getFontsForSlot(slot: FontSlot): FontOption[] {
  return FONT_OPTIONS.filter(o => o.slot === slot);
}
