export type FontSlot = "display" | "body" | "mono";

export type FontOption = {
  id: string;
  label: string;
  family: string;
  slot: FontSlot;
};

export const FONT_OPTIONS: FontOption[] = [
  // Display fonts (headings)
  { id: "im-fell",      label: "IM Fell English",    family: '"IM Fell English", "Georgia", serif',              slot: "display" },
  { id: "cinzel",       label: "Cinzel",             family: '"Cinzel", "Georgia", serif',                       slot: "display" },
  { id: "uncial",       label: "Uncial Antiqua",     family: '"Uncial Antiqua", "Georgia", serif',               slot: "display" },
  { id: "medieval",     label: "MedievalSharp",      family: '"MedievalSharp", "Georgia", serif',                slot: "display" },
  { id: "cormorant-d",  label: "Cormorant Garamond", family: '"Cormorant Garamond", "Georgia", serif',           slot: "display" },
  { id: "eb-garamond-d",label: "EB Garamond",        family: '"EB Garamond", "Georgia", serif',                  slot: "display" },

  // Body fonts
  { id: "cormorant",    label: "Cormorant Garamond", family: '"Cormorant Garamond", "Georgia", serif',           slot: "body" },
  { id: "eb-garamond",  label: "EB Garamond",        family: '"EB Garamond", "Georgia", serif',                  slot: "body" },
  { id: "crimson",      label: "Crimson Pro",        family: '"Crimson Pro", "Georgia", serif',                  slot: "body" },
  { id: "baskerville",  label: "Libre Baskerville",  family: '"Libre Baskerville", "Georgia", serif',            slot: "body" },

  // Mono fonts
  { id: "special-elite",label: "Special Elite",      family: '"Special Elite", "Courier New", monospace',        slot: "mono" },
  { id: "cutive",       label: "Cutive Mono",        family: '"Cutive Mono", "Courier New", monospace',          slot: "mono" },
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
