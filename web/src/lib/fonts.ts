export type FontSlot = "display" | "body" | "mono";

export type FontOption = {
  id: string;
  label: string;
  family: string;
  slot: FontSlot;
  googleHref?: string;
  /** Which game(s) inspired this font choice */
  origin: string;
};

const FONT_CSS_BASE = "https://fonts.googleapis.com/css2";

const GOOGLE_FONT_HREFS = {
  "im-fell": `${FONT_CSS_BASE}?family=IM+Fell+English:ital@0;1&display=swap`,
  "cormorant-d": `${FONT_CSS_BASE}?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&display=swap`,
  medieval: `${FONT_CSS_BASE}?family=MedievalSharp&display=swap`,
  uncial: `${FONT_CSS_BASE}?family=Uncial+Antiqua&display=swap`,
  cinzel: `${FONT_CSS_BASE}?family=Cinzel:wght@400;600;700&display=swap`,
  "cinzel-deco": `${FONT_CSS_BASE}?family=Cinzel+Decorative:wght@400;700&display=swap`,
  forum: `${FONT_CSS_BASE}?family=Forum&display=swap`,
  marcellus: `${FONT_CSS_BASE}?family=Marcellus&display=swap`,
  fraktur: `${FONT_CSS_BASE}?family=UnifrakturMaguntia&display=swap`,
  almendra: `${FONT_CSS_BASE}?family=Almendra:ital,wght@0,400;0,700;1,400&display=swap`,
  "eb-garamond-d": `${FONT_CSS_BASE}?family=EB+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&display=swap`,
  cormorant: `${FONT_CSS_BASE}?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&display=swap`,
  "eb-garamond": `${FONT_CSS_BASE}?family=EB+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&display=swap`,
  crimson: `${FONT_CSS_BASE}?family=Crimson+Pro:ital,wght@0,400;0,600;0,700;1,400;1,600&display=swap`,
  baskerville: `${FONT_CSS_BASE}?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&display=swap`,
  alegreya: `${FONT_CSS_BASE}?family=Alegreya:ital,wght@0,400;0,600;0,700;1,400;1,600&display=swap`,
  lora: `${FONT_CSS_BASE}?family=Lora:ital,wght@0,400;0,600;0,700;1,400;1,600&display=swap`,
  vollkorn: `${FONT_CSS_BASE}?family=Vollkorn:ital,wght@0,400;0,600;0,700;1,400;1,600&display=swap`,
  spectral: `${FONT_CSS_BASE}?family=Spectral:ital,wght@0,400;0,600;0,700;1,400;1,600&display=swap`,
  sura: `${FONT_CSS_BASE}?family=Sura:wght@400;700&display=swap`,
  belleza: `${FONT_CSS_BASE}?family=Belleza&display=swap`,
  "crimson-text": `${FONT_CSS_BASE}?family=Crimson+Text:ital,wght@0,400;0,600;0,700;1,400;1,600&display=swap`,
  "special-elite": `${FONT_CSS_BASE}?family=Special+Elite&display=swap`,
  cutive: `${FONT_CSS_BASE}?family=Cutive+Mono&display=swap`,
  fondamento: `${FONT_CSS_BASE}?family=Fondamento:ital@0;1&display=swap`,
  "homemade-apple": `${FONT_CSS_BASE}?family=Homemade+Apple&display=swap`,
  tangerine: `${FONT_CSS_BASE}?family=Tangerine:wght@400;700&display=swap`
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
  // ── DISPLAY (headings / titles) ──────────────────────────────────────

  // Original antique book picks
  { id: "im-fell", label: "IM Fell English", family: '"IM Fell English", "Georgia", serif', slot: "display", googleHref: GOOGLE_FONT_HREFS["im-fell"], origin: "Kingdom Come: Deliverance — Renaissance letterpress" },
  { id: "cormorant-d", label: "Cormorant Garamond", family: '"Cormorant Garamond", "Georgia", serif', slot: "display", googleHref: GOOGLE_FONT_HREFS["cormorant-d"], origin: "AC Valhalla, CK3, Hogwarts Legacy" },
  { id: "medieval", label: "MedievalSharp", family: '"MedievalSharp", "Georgia", serif', slot: "display", googleHref: GOOGLE_FONT_HREFS.medieval, origin: "Generic medieval — Baldur's Gate style" },
  { id: "uncial", label: "Uncial Antiqua", family: '"Uncial Antiqua", "Georgia", serif', slot: "display", googleHref: GOOGLE_FONT_HREFS.uncial, origin: "Baldur's Gate 3 — medieval uncial hand" },

  // Game-inspired additions
  { id: "cinzel", label: "Cinzel", family: '"Cinzel", "Georgia", serif', slot: "display", googleHref: GOOGLE_FONT_HREFS.cinzel, origin: "AC Valhalla/Odyssey, Plague Tale, God of War, Elden Ring, Hogwarts Legacy — Roman capitals" },
  { id: "cinzel-deco", label: "Cinzel Decorative", family: '"Cinzel Decorative", "Georgia", serif', slot: "display", googleHref: GOOGLE_FONT_HREFS["cinzel-deco"], origin: "Age of Empires IV, God of War — ornate Roman" },
  { id: "forum", label: "Forum", family: '"Forum", "Georgia", serif', slot: "display", googleHref: GOOGLE_FONT_HREFS.forum, origin: "AC Odyssey — Ancient Greek classical" },
  { id: "marcellus", label: "Marcellus", family: '"Marcellus", "Georgia", serif', slot: "display", googleHref: GOOGLE_FONT_HREFS.marcellus, origin: "Civilization VI — flared Roman inscriptions" },
  { id: "fraktur", label: "UnifrakturMaguntia", family: '"UnifrakturMaguntia", "Georgia", serif', slot: "display", googleHref: GOOGLE_FONT_HREFS.fraktur, origin: "Kingdom Come: Deliverance — Gothic blackletter" },
  { id: "almendra", label: "Almendra", family: '"Almendra", "Georgia", serif', slot: "display", googleHref: GOOGLE_FONT_HREFS.almendra, origin: "Kingdom Come: Deliverance — hybrid blackletter/Roman" },
  { id: "eb-garamond-d", label: "EB Garamond", family: '"EB Garamond", "Georgia", serif', slot: "display", googleHref: GOOGLE_FONT_HREFS["eb-garamond-d"], origin: "Elden Ring, CK3 — old-style classical" },

  // ── BODY (paragraphs / descriptions) ─────────────────────────────────

  // Original antique book picks
  { id: "cormorant", label: "Cormorant Garamond", family: '"Cormorant Garamond", "Georgia", serif', slot: "body", googleHref: GOOGLE_FONT_HREFS.cormorant, origin: "Base antique book serif" },
  { id: "eb-garamond", label: "EB Garamond", family: '"EB Garamond", "Georgia", serif', slot: "body", googleHref: GOOGLE_FONT_HREFS["eb-garamond"], origin: "Elden Ring, Crusader Kings III — scholarly old-style" },
  { id: "crimson", label: "Crimson Pro", family: '"Crimson Pro", "Georgia", serif', slot: "body", googleHref: GOOGLE_FONT_HREFS.crimson, origin: "Elden Ring — refined humanist serif" },
  { id: "baskerville", label: "Libre Baskerville", family: '"Libre Baskerville", "Georgia", serif', slot: "body", googleHref: GOOGLE_FONT_HREFS.baskerville, origin: "Base antique book — transitional serif" },

  // Game-inspired additions
  { id: "alegreya", label: "Alegreya", family: '"Alegreya", "Georgia", serif', slot: "body", googleHref: GOOGLE_FONT_HREFS.alegreya, origin: "Baldur's Gate 3 — warm humanist text" },
  { id: "lora", label: "Lora", family: '"Lora", "Georgia", serif', slot: "body", googleHref: GOOGLE_FONT_HREFS.lora, origin: "Age of Empires IV — balanced historical text" },
  { id: "vollkorn", label: "Vollkorn", family: '"Vollkorn", "Georgia", serif', slot: "body", googleHref: GOOGLE_FONT_HREFS.vollkorn, origin: "Civilization VI — classical text" },
  { id: "spectral", label: "Spectral", family: '"Spectral", "Georgia", serif', slot: "body", googleHref: GOOGLE_FONT_HREFS.spectral, origin: "Sekiro — high-contrast modern serif" },
  { id: "sura", label: "Sura", family: '"Sura", "Georgia", serif', slot: "body", googleHref: GOOGLE_FONT_HREFS.sura, origin: "A Plague Tale — medieval France (exact match)" },
  { id: "belleza", label: "Belleza", family: '"Belleza", "Georgia", serif', slot: "body", googleHref: GOOGLE_FONT_HREFS.belleza, origin: "A Plague Tale — elegant humanist (exact match)" },
  { id: "crimson-text", label: "Crimson Text", family: '"Crimson Text", "Georgia", serif', slot: "body", googleHref: GOOGLE_FONT_HREFS["crimson-text"], origin: "Sekiro — elegant high-contrast serif" },

  // ── MONO / LABELS ────────────────────────────────────────────────────

  // Original picks
  { id: "special-elite", label: "Special Elite", family: '"Special Elite", "Courier New", monospace', slot: "mono", googleHref: GOOGLE_FONT_HREFS["special-elite"], origin: "Base antique book — typewriter letterpress" },
  { id: "cutive", label: "Cutive Mono", family: '"Cutive Mono", "Courier New", monospace', slot: "mono", googleHref: GOOGLE_FONT_HREFS.cutive, origin: "Base antique book — typewriter" },

  // Game-inspired additions
  { id: "fondamento", label: "Fondamento", family: '"Fondamento", "Georgia", serif', slot: "mono", googleHref: GOOGLE_FONT_HREFS.fondamento, origin: "Crusader Kings III — calligraphic map labels (exact match)" },
  { id: "homemade-apple", label: "Homemade Apple", family: '"Homemade Apple", "Courier New", cursive', slot: "mono", googleHref: GOOGLE_FONT_HREFS["homemade-apple"], origin: "Red Dead Redemption 2 — Arthur's journal handwriting" },
  { id: "tangerine", label: "Tangerine", family: '"Tangerine", "Georgia", cursive', slot: "mono", googleHref: GOOGLE_FONT_HREFS.tangerine, origin: "Hogwarts Legacy — italic calligraphy for letters" },
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
  ensureGoogleFontLoaded(option.googleHref);
  document.documentElement.style.setProperty(CSS_VAR_MAP[slot], option.family);
  if (slot === "body") {
    document.body.style.fontFamily = option.family;
  }
}

export function getFontsForSlot(slot: FontSlot): FontOption[] {
  return FONT_OPTIONS.filter(o => o.slot === slot);
}
