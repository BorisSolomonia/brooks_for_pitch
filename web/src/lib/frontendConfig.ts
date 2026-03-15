import type { Coordinates, PinForm } from "./types";
import type { FontSlot } from "./fonts";

export type MapProvider = "leaflet" | "google";

export const MAP_SETTINGS = {
  defaultZoom: 13,
  legacyBboxDelta: 0.04,
  activeBboxDelta: 0.05,
  holdRingRadius: 32,
  holdRingSize: 80,
  holdRingOffset: 40,
  holdRingCenter: 40,
  holdRingCenterRadius: 5,
  holdRingStrokeWidth: 4,
  holdRingTurbulenceBaseFrequency: 0.04,
  holdRingTurbulenceOctaves: 4,
  holdRingDisplacementScale: 1.5
} as const;

export const MOTION_SETTINGS = {
  easeEmphasized: [0.16, 0.84, 0.2, 1] as const,
  fadeSlideDistance: 24,
  fadeSlideDistanceSmall: 10,
  fadeSlideDuration: 0.5,
  modalDuration: 0.35,
  drawerDuration: 0.4,
  backdropDuration: 0.3,
  staggerChildren: 0.08,
  drawerSectionDelayStart: 0.05,
  drawerSectionDelayMapProvider: 0.13
} as const;

export const ICON_SIZES = {
  shell: 22,
  medium: 18,
  small: 16,
  fab: 24
} as const;

export const ICON_STROKES = {
  shell: 2,
  shellLight: 1.8,
  strong: 3
} as const;

export const FONT_SELECTOR_SLOTS: { slot: FontSlot; label: string }[] = [
  { slot: "display", label: "Headings" },
  { slot: "body", label: "Body" },
  { slot: "mono", label: "Labels" }
];

export const PIN_FORM_SETTINGS = {
  defaultExpiresInHours: 24,
  defaultRevealAtDaysAhead: 30,
  charLimit: 500,
  maxManualHours: 720,
  permanentExpiryIso: "2124-01-01T00:00:00Z",
  millisecondsPerHour: 60 * 60 * 1000
} as const;

export const PIN_DURATION_PRESETS = [
  { label: "1 day", hours: 24, icon: "D1" },
  { label: "1 week", hours: 168, icon: "W1" },
  { label: "1 month", hours: 720, icon: "M1" },
  { label: "1 year", hours: 8_760, icon: "Y1" },
  { label: "10 years", hours: 87_600, icon: "Y10" },
  { label: "100 yrs", hours: 876_000, icon: "Y100" },
  { label: "Forever", hours: "permanent", icon: "INF" }
] as const;

export const PIN_RADIUS_OPTIONS = [
  { label: "None", value: 0 },
  { label: "50 m", value: 50 },
  { label: "100 m", value: 100 },
  { label: "250 m", value: 250 },
  { label: "500 m", value: 500 },
  { label: "1 km", value: 1000 },
  { label: "5 km", value: 5000 }
] as const;

export const PIN_AUDIENCE_OPTIONS = [
  {
    value: "PRIVATE",
    label: "Private",
    description: "Only you",
    icon: "lock"
  },
  {
    value: "FRIENDS",
    label: "Friends",
    description: "Trusted circle",
    icon: "friends"
  },
  {
    value: "FOLLOWERS",
    label: "Followers",
    description: "Your audience",
    icon: "followers"
  },
  {
    value: "PUBLIC",
    label: "Public",
    description: "Everyone nearby",
    icon: "public"
  }
] as const;

export const PIN_CREATION_UI = {
  meterSize: 188,
  meterStroke: 13,
  meterRadius: 74,
  meterCircumference: 2 * Math.PI * 74,
  meterStartAngle: -90,
  meterSweep: 360
} as const;

export function createDefaultPinForm(): PinForm {
  return {
    text: "",
    audienceType: "PUBLIC",
    revealType: "VISIBLE_ALWAYS",
    expiresInHours: PIN_FORM_SETTINGS.defaultExpiresInHours,
    mapPrecision: "EXACT"
  };
}

export function createDefaultRevealAtValue(daysAhead = PIN_FORM_SETTINGS.defaultRevealAtDaysAhead): string {
  const date = new Date();
  date.setDate(date.getDate() + daysAhead);
  return date.toISOString().slice(0, 16);
}

export function buildLegacyBbox(center: Coordinates, delta = MAP_SETTINGS.legacyBboxDelta): string {
  const minLng = center.lng - delta;
  const minLat = center.lat - delta;
  const maxLng = center.lng + delta;
  const maxLat = center.lat + delta;
  return `${minLng},${minLat},${maxLng},${maxLat}`;
}

export function buildActiveBbox(center: Coordinates, delta = MAP_SETTINGS.activeBboxDelta): string {
  const minLng = center.lng - delta;
  const minLat = center.lat - delta;
  const maxLng = center.lng + delta;
  const maxLat = center.lat + delta;
  return `${minLng},${minLat},${maxLng},${maxLat}`;
}
