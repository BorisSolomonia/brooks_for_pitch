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
      bg0: "#fcf9f5",
      bg1: "#f6f3ee",
      bg2: "#eae8e1",
      surface0: "rgba(228, 227, 218, 0.38)",
      surface1: "rgba(240, 238, 232, 0.92)",
      surface2: "rgba(228, 227, 218, 0.96)",
      surface3: "rgba(255, 255, 255, 0.96)",
      glassBg: "rgba(252, 249, 245, 0.86)",
      glassBgStrong: "rgba(252, 249, 245, 0.96)",
      glassBorder: "rgba(123, 123, 116, 0.22)",
      fieldBg: "#ffffff",
      fieldBgStrong: "#ffffff",
      backdropScrim: "rgba(50, 51, 45, 0.24)",
      panelShadowRest: "0 16px 40px rgba(50, 51, 45, 0.05)",
      panelShadowStrong: "0 24px 56px rgba(50, 51, 45, 0.08)",
      ctaBgStart: "#46645b",
      ctaBgEnd: "#3a584f",
      ctaText: "#defff2",
      ctaShadowRest: "0 10px 24px rgba(70, 100, 91, 0.16)",
      ctaShadowHover: "0 16px 32px rgba(70, 100, 91, 0.22)",
      ornamentDot: "rgba(123, 123, 116, 0.08)",
      ornamentOpacity: "0",
      glassBlur: "18px",
      textStrong: "#32332d",
      textPrimary: "#3f403a",
      textMuted: "#5f5f59",
      textDim: "#7b7b74",
      accentPrimary: "#46645b",
      accentSecondary: "#6d5c49",
      accentTertiary: "rgba(200, 234, 221, 0.78)",
      ring: "rgba(70, 100, 91, 0.32)",
      glow: "rgba(70, 100, 91, 0.08)",
      strokeSoft: "rgba(123, 123, 116, 0.16)",
      strokeStrong: "rgba(123, 123, 116, 0.28)",
      glowColor: "rgba(70, 100, 91, 0.08)",
      glowColorStrong: "rgba(70, 100, 91, 0.14)",
      auroraStart: "rgba(200, 234, 221, 0.28)",
      auroraEnd: "rgba(252, 228, 203, 0.26)",
      grainOpacity: "0.02"
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
