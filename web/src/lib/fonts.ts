export type FontSlot = "display" | "body" | "mono";

export type FontOption = {
  id: string;
  label: string;
  family: string;
  slot: FontSlot;
  googleHref?: string;
  origin: string;
};

const FONT_CSS_BASE = "https://fonts.googleapis.com/css2";

const GOOGLE_FONT_HREFS = {
  inter: `${FONT_CSS_BASE}?family=Inter:wght@400;500;600&display=swap`,
  merriweather: `${FONT_CSS_BASE}?family=Merriweather:wght@400;700&display=swap`,
} as const satisfies Record<string, string>;

const loadedFontHrefs = new Set<string>();

function ensureGoogleFontLoaded(href?: string) {
  if (!href || typeof document === "undefined" || loadedFontHrefs.has(href)) {
    return;
  }
  const existing = document.querySelector(`link[data-font-href="${href}"]`);
  if (existing) {
    loadedFontHrefs.add(href);
    return;
  }
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = href;
  link.setAttribute("data-font-href", href);
  document.head.appendChild(link);
  loadedFontHrefs.add(href);
}

export const FONT_OPTIONS: FontOption[] = [
  { id: "merriweather", label: "Merriweather", family: '"Merriweather", Georgia, serif', slot: "display", googleHref: GOOGLE_FONT_HREFS.merriweather, origin: "Classic serif display" },
  { id: "inter-display", label: "Inter", family: '"Inter", system-ui, sans-serif', slot: "display", googleHref: GOOGLE_FONT_HREFS.inter, origin: "Clean modern display" },

  { id: "inter-body", label: "Inter", family: '"Inter", system-ui, sans-serif', slot: "body", googleHref: GOOGLE_FONT_HREFS.inter, origin: "Clean modern body text" },
  { id: "merriweather-body", label: "Merriweather", family: '"Merriweather", Georgia, serif', slot: "body", googleHref: GOOGLE_FONT_HREFS.merriweather, origin: "Classic serif body text" },

  { id: "inter-mono", label: "Inter", family: '"Inter", system-ui, sans-serif', slot: "mono", googleHref: GOOGLE_FONT_HREFS.inter, origin: "Clean modern labels" },
  { id: "merriweather-mono", label: "Merriweather", family: '"Merriweather", Georgia, serif', slot: "mono", googleHref: GOOGLE_FONT_HREFS.merriweather, origin: "Classic serif labels" },
];

const CSS_VAR_MAP: Record<FontSlot, string> = {
  display: "--font-display",
  body: "--font-serif",
  mono: "--font-mono"
};

function getEnvDefault(slot: FontSlot): string | undefined {
  const key = `VITE_FONT_${slot.toUpperCase()}` as const;
  return (import.meta.env[key] as string | undefined) || undefined;
}

function findOptionById(id: string): FontOption | undefined {
  return FONT_OPTIONS.find(option => option.id === id);
}

export function getDefaultFontId(slot: FontSlot): string {
  const envVal = getEnvDefault(slot);
  if (envVal) {
    const match = findOptionById(envVal);
    if (match && match.slot === slot) {
      return match.id;
    }
  }
  if (slot === "display") return "merriweather";
  if (slot === "body") return "inter-body";
  return "inter-mono";
}

export function applyFont(slot: FontSlot, fontId: string) {
  const option = findOptionById(fontId);
  if (!option) return;
  ensureGoogleFontLoaded(option.googleHref);
  document.documentElement.style.setProperty(CSS_VAR_MAP[slot], option.family);
  if (slot === "body") {
    document.body.style.fontFamily = option.family;
  }
}

export function getFontsForSlot(slot: FontSlot): FontOption[] {
  return FONT_OPTIONS.filter(option => option.slot === slot);
}
