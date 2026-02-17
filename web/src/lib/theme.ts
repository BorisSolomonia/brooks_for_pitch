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
      bg0: "#161015",
      bg1: "#241822",
      bg2: "#382429",
      surface0: "rgba(24, 16, 22, 0.86)",
      surface1: "rgba(38, 24, 35, 0.78)",
      surface2: "rgba(54, 33, 44, 0.86)",
      surface3: "rgba(255, 236, 213, 0.08)",
      textStrong: "#fff4e8",
      textPrimary: "#f4ddd0",
      textMuted: "#d3b2a2",
      textDim: "#b18e80",
      accentPrimary: "#ff9465",
      accentSecondary: "#f9c66f",
      accentTertiary: "#ff6f83",
      ring: "rgba(255, 148, 101, 0.5)",
      glow: "rgba(255, 148, 101, 0.35)",
      strokeSoft: "rgba(255, 222, 198, 0.2)",
      strokeStrong: "rgba(255, 222, 198, 0.38)"
    })
  },
  tbilisi: {
    label: "Tbilisi",
    vars: makePalette({
      bg0: "#0c1318",
      bg1: "#132127",
      bg2: "#1e3438",
      surface0: "rgba(11, 19, 24, 0.84)",
      surface1: "rgba(19, 32, 39, 0.78)",
      surface2: "rgba(27, 47, 53, 0.86)",
      surface3: "rgba(218, 255, 249, 0.08)",
      textStrong: "#e8fff9",
      textPrimary: "#d2ece7",
      textMuted: "#9dc2ba",
      textDim: "#86aaa2",
      accentPrimary: "#59e3c7",
      accentSecondary: "#f0bd58",
      accentTertiary: "#67b5ff",
      ring: "rgba(89, 227, 199, 0.48)",
      glow: "rgba(89, 227, 199, 0.36)",
      strokeSoft: "rgba(206, 245, 236, 0.18)",
      strokeStrong: "rgba(206, 245, 236, 0.34)"
    })
  },
  paris: {
    label: "Paris",
    vars: makePalette({
      bg0: "#0d1220",
      bg1: "#172036",
      bg2: "#223355",
      surface0: "rgba(11, 18, 32, 0.84)",
      surface1: "rgba(18, 31, 52, 0.78)",
      surface2: "rgba(28, 45, 70, 0.88)",
      surface3: "rgba(231, 241, 255, 0.08)",
      textStrong: "#f0f6ff",
      textPrimary: "#d7e7ff",
      textMuted: "#9fb8db",
      textDim: "#88a2c8",
      accentPrimary: "#74b6ff",
      accentSecondary: "#ffd083",
      accentTertiary: "#8ca0ff",
      ring: "rgba(116, 182, 255, 0.5)",
      glow: "rgba(116, 182, 255, 0.35)",
      strokeSoft: "rgba(216, 232, 255, 0.19)",
      strokeStrong: "rgba(216, 232, 255, 0.35)"
    })
  },
  default: {
    label: "Atlas",
    vars: makePalette({
      bg0: "#090f1a",
      bg1: "#121b2b",
      bg2: "#1f2f3d",
      surface0: "rgba(9, 15, 26, 0.82)",
      surface1: "rgba(17, 28, 44, 0.78)",
      surface2: "rgba(21, 36, 54, 0.86)",
      surface3: "rgba(255, 255, 255, 0.08)",
      textStrong: "#f4f8ff",
      textPrimary: "#dbe6f9",
      textMuted: "#9eb0cc",
      textDim: "#7b8daa",
      accentPrimary: "#46e0c3",
      accentSecondary: "#f6b44e",
      accentTertiary: "#7a9eff",
      ring: "rgba(122, 158, 255, 0.55)",
      glow: "rgba(70, 224, 195, 0.38)",
      strokeSoft: "rgba(207, 225, 255, 0.18)",
      strokeStrong: "rgba(207, 225, 255, 0.34)"
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
