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
  fondamento: `${FONT_CSS_BASE}?family=Fondamento:ital@0;1&display=swap`,
  "homemade-apple": `${FONT_CSS_BASE}?family=Homemade+Apple&display=swap`,
  tangerine: `${FONT_CSS_BASE}?family=Tangerine:wght@400;700&display=swap`,
  caveat: `${FONT_CSS_BASE}?family=Caveat:wght@400;500;600;700&display=swap`,
  kalam: `${FONT_CSS_BASE}?family=Kalam:wght@300;400;700&display=swap`,
  "patrick-hand": `${FONT_CSS_BASE}?family=Patrick+Hand&display=swap`,
  "marck-script": `${FONT_CSS_BASE}?family=Marck+Script&display=swap`
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
  { id: "tangerine", label: "Tangerine", family: '"Tangerine", "Georgia", cursive', slot: "display", googleHref: GOOGLE_FONT_HREFS.tangerine, origin: "Elegant handwritten calligraphy" },
  { id: "marck-script", label: "Marck Script", family: '"Marck Script", "Georgia", cursive', slot: "display", googleHref: GOOGLE_FONT_HREFS["marck-script"], origin: "Loose brush handwriting" },
  { id: "homemade-apple-display", label: "Homemade Apple", family: '"Homemade Apple", "Georgia", cursive', slot: "display", googleHref: GOOGLE_FONT_HREFS["homemade-apple"], origin: "Personal notebook handwriting" },
  { id: "fondamento-display", label: "Fondamento", family: '"Fondamento", "Georgia", cursive', slot: "display", googleHref: GOOGLE_FONT_HREFS.fondamento, origin: "Decorative manuscript hand" },

  { id: "kalam", label: "Kalam", family: '"Kalam", "Georgia", cursive', slot: "body", googleHref: GOOGLE_FONT_HREFS.kalam, origin: "Readable pen-written text" },
  { id: "patrick-hand-body", label: "Patrick Hand", family: '"Patrick Hand", "Georgia", cursive', slot: "body", googleHref: GOOGLE_FONT_HREFS["patrick-hand"], origin: "Marker-like handwritten text" },
  { id: "caveat-body", label: "Caveat", family: '"Caveat", "Georgia", cursive', slot: "body", googleHref: GOOGLE_FONT_HREFS.caveat, origin: "Casual handwritten body text" },
  { id: "fondamento-body", label: "Fondamento", family: '"Fondamento", "Georgia", cursive', slot: "body", googleHref: GOOGLE_FONT_HREFS.fondamento, origin: "Decorative manuscript hand" },

  { id: "patrick-hand-mono", label: "Patrick Hand", family: '"Patrick Hand", "Georgia", cursive', slot: "mono", googleHref: GOOGLE_FONT_HREFS["patrick-hand"], origin: "Quick handwritten labels" },
  { id: "homemade-apple-mono", label: "Homemade Apple", family: '"Homemade Apple", "Georgia", cursive', slot: "mono", googleHref: GOOGLE_FONT_HREFS["homemade-apple"], origin: "Personal notebook labels" },
  { id: "caveat-mono", label: "Caveat", family: '"Caveat", "Georgia", cursive', slot: "mono", googleHref: GOOGLE_FONT_HREFS.caveat, origin: "Loose handwritten labels" },
  { id: "tangerine-mono", label: "Tangerine", family: '"Tangerine", "Georgia", cursive', slot: "mono", googleHref: GOOGLE_FONT_HREFS.tangerine, origin: "Calligraphic handwritten labels" }
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
  if (slot === "display") return "tangerine";
  if (slot === "body") return "kalam";
  return "patrick-hand-mono";
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
