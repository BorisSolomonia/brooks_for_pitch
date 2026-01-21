export type CityTheme = "rome" | "tbilisi" | "paris" | "default";

export type ThemePalette = {
  label: string;
  vars: Record<string, string>;
};

export const CITY_THEMES: Record<CityTheme, ThemePalette> = {
  rome: {
    label: "Rome",
    vars: {
      "--bg": "#f8f1e6",
      "--bg-1": "#f6e2c8",
      "--bg-2": "#f1d9b2",
      "--bg-3": "#fdf7ef",
      "--accent": "#c45a3d",
      "--accent-2": "#d7a047",
      "--accent-3": "#5b3a2b",
      "--ink": "#2d241f",
      "--muted": "#6a5a50",
      "--card": "rgba(255, 252, 246, 0.9)",
      "--card-strong": "#fffaf2",
      "--stroke": "rgba(45, 36, 31, 0.12)",
      "--glow": "rgba(196, 90, 61, 0.25)",
      "--ring": "rgba(196, 90, 61, 0.3)"
    }
  },
  tbilisi: {
    label: "Tbilisi",
    vars: {
      "--bg": "#f3f4f0",
      "--bg-1": "#dee8dd",
      "--bg-2": "#cfe3e6",
      "--bg-3": "#f7f8f2",
      "--accent": "#2b6f62",
      "--accent-2": "#f0a64b",
      "--accent-3": "#1f3c36",
      "--ink": "#1f2623",
      "--muted": "#576661",
      "--card": "rgba(255, 255, 255, 0.86)",
      "--card-strong": "#ffffff",
      "--stroke": "rgba(31, 38, 35, 0.12)",
      "--glow": "rgba(43, 111, 98, 0.25)",
      "--ring": "rgba(43, 111, 98, 0.32)"
    }
  },
  paris: {
    label: "Paris",
    vars: {
      "--bg": "#f2f4f6",
      "--bg-1": "#e6edf2",
      "--bg-2": "#f1e1d6",
      "--bg-3": "#f9fbfc",
      "--accent": "#2d5a72",
      "--accent-2": "#e38b5c",
      "--accent-3": "#1c3946",
      "--ink": "#1d2730",
      "--muted": "#5c6c78",
      "--card": "rgba(255, 255, 255, 0.9)",
      "--card-strong": "#ffffff",
      "--stroke": "rgba(29, 39, 48, 0.12)",
      "--glow": "rgba(45, 90, 114, 0.23)",
      "--ring": "rgba(45, 90, 114, 0.28)"
    }
  },
  default: {
    label: "Atlas",
    vars: {
      "--bg": "#f7f4ed",
      "--bg-1": "#f3e7d1",
      "--bg-2": "#d5f0ea",
      "--bg-3": "#f9f2e6",
      "--accent": "#0f6a63",
      "--accent-2": "#f1a23a",
      "--accent-3": "#0b3b38",
      "--ink": "#1b2324",
      "--muted": "#5b6a69",
      "--card": "rgba(255, 255, 255, 0.86)",
      "--card-strong": "#ffffff",
      "--stroke": "rgba(27, 35, 36, 0.12)",
      "--glow": "rgba(15, 106, 99, 0.25)",
      "--ring": "rgba(15, 106, 99, 0.35)"
    }
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
