export type CityTheme = "rome" | "tbilisi" | "paris" | "default";

export type ThemePalette = {
  label: string;
  vars: Record<string, string>;
};

const makePalette = (tokens: {
  bg0: string;
  bg1: string;
  bg2: string;
  surface0: string;
  surface1: string;
  surface2: string;
  surface3: string;
  textStrong: string;
  textPrimary: string;
  textMuted: string;
  textDim: string;
  accentPrimary: string;
  accentSecondary: string;
  accentTertiary: string;
  ring: string;
  glow: string;
  strokeSoft: string;
  strokeStrong: string;
}): Record<string, string> => ({
  "--bg-0": tokens.bg0,
  "--bg-1": tokens.bg1,
  "--bg-2": tokens.bg2,
  "--surface-0": tokens.surface0,
  "--surface-1": tokens.surface1,
  "--surface-2": tokens.surface2,
  "--surface-3": tokens.surface3,
  "--text-strong": tokens.textStrong,
  "--text-primary": tokens.textPrimary,
  "--text-muted": tokens.textMuted,
  "--text-dim": tokens.textDim,
  "--accent-primary": tokens.accentPrimary,
  "--accent-secondary": tokens.accentSecondary,
  "--accent-tertiary": tokens.accentTertiary,
  "--ring": tokens.ring,
  "--glow": tokens.glow,
  "--stroke-soft": tokens.strokeSoft,
  "--stroke-strong": tokens.strokeStrong,

  // Compatibility aliases
  "--bg": tokens.bg0,
  "--bg-3": tokens.bg2,
  "--card": tokens.surface1,
  "--card-strong": tokens.surface2,
  "--ink": tokens.textPrimary,
  "--muted": tokens.textMuted,
  "--accent": tokens.accentPrimary,
  "--accent-2": tokens.accentSecondary,
  "--accent-3": tokens.accentTertiary,
  "--stroke": tokens.strokeSoft
});

export const CITY_THEMES: Record<CityTheme, ThemePalette> = {
  rome: {
    label: "Rome",
    vars: makePalette({
      bg0: "#f0e0c8",
      bg1: "#e8d5b5",
      bg2: "#dcc9a5",
      surface0: "rgba(139, 107, 66, 0.06)",
      surface1: "rgba(139, 107, 66, 0.10)",
      surface2: "rgba(139, 107, 66, 0.16)",
      surface3: "rgba(180, 76, 58, 0.08)",
      textStrong: "#3c1518",
      textPrimary: "#5a2d20",
      textMuted: "#8a6050",
      textDim: "#a68070",
      accentPrimary: "#3c1518",
      accentSecondary: "#b44c3a",
      accentTertiary: "rgba(90, 45, 32, 0.72)",
      ring: "rgba(180, 76, 58, 0.45)",
      glow: "rgba(180, 76, 58, 0.35)",
      strokeSoft: "rgba(90, 45, 32, 0.20)",
      strokeStrong: "rgba(60, 21, 24, 0.42)"
    })
  },
  tbilisi: {
    label: "Tbilisi",
    vars: makePalette({
      bg0: "#eee8d5",
      bg1: "#e4dcc8",
      bg2: "#d8cfb8",
      surface0: "rgba(122, 59, 46, 0.06)",
      surface1: "rgba(122, 59, 46, 0.10)",
      surface2: "rgba(122, 59, 46, 0.16)",
      surface3: "rgba(122, 59, 46, 0.08)",
      textStrong: "#2d2417",
      textPrimary: "#4a3828",
      textMuted: "#7a6450",
      textDim: "#9a8470",
      accentPrimary: "#2d2417",
      accentSecondary: "#7a3b2e",
      accentTertiary: "rgba(74, 56, 40, 0.72)",
      ring: "rgba(122, 59, 46, 0.45)",
      glow: "rgba(122, 59, 46, 0.35)",
      strokeSoft: "rgba(74, 56, 40, 0.20)",
      strokeStrong: "rgba(45, 36, 23, 0.42)"
    })
  },
  paris: {
    label: "Paris",
    vars: makePalette({
      bg0: "#f2eee5",
      bg1: "#eae5da",
      bg2: "#dfd9cc",
      surface0: "rgba(26, 35, 50, 0.06)",
      surface1: "rgba(26, 35, 50, 0.10)",
      surface2: "rgba(26, 35, 50, 0.16)",
      surface3: "rgba(197, 160, 40, 0.08)",
      textStrong: "#1a2332",
      textPrimary: "#2e3d52",
      textMuted: "#5a6a80",
      textDim: "#7a8a9a",
      accentPrimary: "#1a2332",
      accentSecondary: "#c5a028",
      accentTertiary: "rgba(46, 61, 82, 0.72)",
      ring: "rgba(197, 160, 40, 0.45)",
      glow: "rgba(197, 160, 40, 0.35)",
      strokeSoft: "rgba(46, 61, 82, 0.20)",
      strokeStrong: "rgba(26, 35, 50, 0.42)"
    })
  },
  default: {
    label: "Atlas",
    vars: makePalette({
      bg0: "#f4ead5",
      bg1: "#efe3cb",
      bg2: "#e8d9b8",
      surface0: "rgba(139, 107, 66, 0.06)",
      surface1: "rgba(139, 107, 66, 0.10)",
      surface2: "rgba(139, 107, 66, 0.16)",
      surface3: "rgba(184, 134, 11, 0.08)",
      textStrong: "#2c1810",
      textPrimary: "#4a3728",
      textMuted: "#7a6652",
      textDim: "#9c8b78",
      accentPrimary: "#2c1810",
      accentSecondary: "#b8860b",
      accentTertiary: "rgba(74, 55, 40, 0.72)",
      ring: "rgba(184, 134, 11, 0.45)",
      glow: "rgba(184, 134, 11, 0.35)",
      strokeSoft: "rgba(74, 55, 40, 0.20)",
      strokeStrong: "rgba(44, 24, 16, 0.42)"
    })
  }
};

const CITY_ALIASES: Record<string, CityTheme> = {
  rome: "rome",
  roma: "rome",
  tbilisi: "tbilisi",
  paris: "paris"
};

export function resolveTheme(city?: string): CityTheme {
  if (!city) {
    return "default";
  }
  const normalized = city.trim().toLowerCase();
  return CITY_ALIASES[normalized] ?? "default";
}

export function applyTheme(theme: CityTheme) {
  const palette = CITY_THEMES[theme] ?? CITY_THEMES.default;
  const root = document.documentElement;
  for (const [key, value] of Object.entries(palette.vars)) {
    root.style.setProperty(key, value);
  }
  root.setAttribute("data-theme", theme);
}
