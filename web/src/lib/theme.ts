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
      bg0: "#f2e4c7",
      bg1: "#ebd8b6",
      bg2: "#e1c89b",
      surface0: "rgba(121, 82, 29, 0.14)",
      surface1: "rgba(121, 82, 29, 0.22)",
      surface2: "rgba(121, 82, 29, 0.34)",
      surface3: "rgba(197, 151, 43, 0.18)",
      glassBg: "linear-gradient(160deg, rgba(249, 240, 220, 0.82), rgba(232, 211, 173, 0.76))",
      glassBgStrong: "linear-gradient(160deg, rgba(250, 242, 225, 0.90), rgba(229, 204, 160, 0.84))",
      glassBorder: "rgba(197, 151, 43, 0.34)",
      fieldBg: "rgba(255, 248, 236, 0.56)",
      fieldBgStrong: "rgba(255, 248, 236, 0.68)",
      backdropScrim: "rgba(32, 19, 10, 0.58)",
      panelShadowRest: "0 18px 44px rgba(62, 40, 18, 0.18), 0 0 28px rgba(197, 151, 43, 0.18), inset 0 1px 0 rgba(255, 250, 241, 0.46)",
      panelShadowStrong: "0 28px 78px rgba(62, 40, 18, 0.28), 0 0 38px rgba(197, 151, 43, 0.28), inset 0 1px 0 rgba(255, 250, 241, 0.52)",
      ctaBgStart: "#2b180f",
      ctaBgEnd: "#5a3a1d",
      ctaText: "#f9efdb",
      ctaShadowRest: "0 16px 34px rgba(62, 40, 18, 0.24), 0 6px 24px rgba(197, 151, 43, 0.28)",
      ctaShadowHover: "0 22px 42px rgba(62, 40, 18, 0.30), 0 8px 30px rgba(231, 190, 79, 0.38)",
      ornamentDot: "rgba(74, 49, 24, 0.38)",
      ornamentOpacity: "0.38",
      glassBlur: "20px",
      textStrong: "#24150d",
      textPrimary: "#4a321c",
      textMuted: "#70553c",
      textDim: "#9d7b57",
      accentPrimary: "#2b180f",
      accentSecondary: "#c5972b",
      accentTertiary: "rgba(82, 56, 30, 0.78)",
      ring: "rgba(197, 151, 43, 0.62)",
      glow: "rgba(197, 151, 43, 0.38)",
      strokeSoft: "rgba(82, 56, 30, 0.28)",
      strokeStrong: "rgba(43, 24, 15, 0.56)",
      glowColor: "rgba(197,151,43,0.74)",
      glowColorStrong: "rgba(231,190,79,0.94)",
      auroraStart: "rgba(214,173,66,0.44)",
      auroraEnd: "rgba(121,82,29,0.34)",
      grainOpacity: "0.18"
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
