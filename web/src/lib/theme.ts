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
  glassBg: string;
  glassBgStrong: string;
  glassBorder: string;
  fieldBg: string;
  fieldBgStrong: string;
  backdropScrim: string;
  panelShadowRest: string;
  panelShadowStrong: string;
  ctaBgStart: string;
  ctaBgEnd: string;
  ctaText: string;
  ctaShadowRest: string;
  ctaShadowHover: string;
  ornamentDot: string;
  ornamentOpacity: string;
  glassBlur: string;
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
  "--glass-bg": tokens.glassBg,
  "--glass-bg-strong": tokens.glassBgStrong,
  "--glass-border": tokens.glassBorder,
  "--field-bg": tokens.fieldBg,
  "--field-bg-strong": tokens.fieldBgStrong,
  "--backdrop-scrim": tokens.backdropScrim,
  "--panel-shadow-rest": tokens.panelShadowRest,
  "--panel-shadow-strong": tokens.panelShadowStrong,
  "--cta-bg-start": tokens.ctaBgStart,
  "--cta-bg-end": tokens.ctaBgEnd,
  "--cta-text": tokens.ctaText,
  "--cta-shadow-rest": tokens.ctaShadowRest,
  "--cta-shadow-hover": tokens.ctaShadowHover,
  "--ornament-dot": tokens.ornamentDot,
  "--ornament-opacity": tokens.ornamentOpacity,
  "--glass-blur": tokens.glassBlur,
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
      bg0: "#F5F1E8",
      bg1: "#EDE8DD",
      bg2: "#E5E0D5",
      surface0: "rgba(107, 103, 94, 0.08)",
      surface1: "rgba(107, 103, 94, 0.12)",
      surface2: "rgba(107, 103, 94, 0.18)",
      surface3: "rgba(107, 103, 94, 0.10)",
      glassBg: "rgba(255, 255, 255, 0.92)",
      glassBgStrong: "rgba(255, 255, 255, 0.96)",
      glassBorder: "rgba(107, 103, 94, 0.20)",
      fieldBg: "#FDFCFA",
      fieldBgStrong: "#FDFCFA",
      backdropScrim: "rgba(44, 36, 22, 0.48)",
      panelShadowRest: "0 4px 20px rgba(107, 142, 158, 0.15)",
      panelShadowStrong: "0 8px 32px rgba(107, 142, 158, 0.18)",
      ctaBgStart: "#FDB913",
      ctaBgEnd: "#F5AD0D",
      ctaText: "#2C2416",
      ctaShadowRest: "0 4px 16px rgba(253, 185, 19, 0.25)",
      ctaShadowHover: "0 8px 24px rgba(253, 185, 19, 0.35)",
      ornamentDot: "rgba(107, 103, 94, 0.12)",
      ornamentOpacity: "0",
      glassBlur: "20px",
      textStrong: "#2C2416",
      textPrimary: "#3D3529",
      textMuted: "#6B675E",
      textDim: "#9A9590",
      accentPrimary: "#FDB913",
      accentSecondary: "#E8A87C",
      accentTertiary: "rgba(253, 185, 19, 0.30)",
      ring: "rgba(253, 185, 19, 0.50)",
      glow: "rgba(253, 185, 19, 0.15)",
      strokeSoft: "rgba(107, 103, 94, 0.16)",
      strokeStrong: "rgba(107, 103, 94, 0.32)",
      glowColor: "rgba(253, 185, 19, 0.15)",
      glowColorStrong: "rgba(253, 185, 19, 0.25)",
      auroraStart: "rgba(253, 185, 19, 0.08)",
      auroraEnd: "rgba(107, 142, 158, 0.06)",
      grainOpacity: "0.05"
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
