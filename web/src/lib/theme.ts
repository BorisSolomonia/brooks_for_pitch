export type CityTheme = "default";

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
  glowColor: string;
  glowColorStrong: string;
  auroraStart: string;
  auroraEnd: string;
  grainOpacity: string;
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
  "--glow-color": tokens.glowColor,
  "--glow-color-strong": tokens.glowColorStrong,
  "--aurora-start": tokens.auroraStart,
  "--aurora-end": tokens.auroraEnd,
  "--grain-opacity": tokens.grainOpacity,

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
  "--stroke": tokens.strokeSoft,
  "--paper-grain-opacity": tokens.grainOpacity
});

export const CITY_THEMES: Record<CityTheme, ThemePalette> = {
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
      strokeStrong: "rgba(44, 24, 16, 0.42)",
      glowColor: "rgba(184,134,11,0.60)",
      glowColorStrong: "rgba(184,134,11,0.85)",
      auroraStart: "rgba(184,134,11,0.32)",
      auroraEnd: "rgba(139,107,66,0.24)",
      grainOpacity: "0.30"
    })
  }
};

export function resolveTheme(): CityTheme {
  return "default";
}

export function applyTheme(theme: CityTheme) {
  const palette = CITY_THEMES[theme] ?? CITY_THEMES.default;
  const root = document.documentElement;
  for (const [key, value] of Object.entries(palette.vars)) {
    root.style.setProperty(key, value);
  }
  root.setAttribute("data-theme", theme);
}
