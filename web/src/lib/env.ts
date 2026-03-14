import type { MapProvider } from "./frontendConfig";

function readRequired(name: string): string {
  const value = import.meta.env[name] as string | undefined;
  if (!value) {
    throw new Error(`${name} is required`);
  }
  return value;
}

function readOptional(name: string): string | undefined {
  const value = import.meta.env[name] as string | undefined;
  return value || undefined;
}

function readNumber(name: string): number {
  const raw = readRequired(name);
  const value = Number(raw);
  if (Number.isNaN(value)) {
    throw new Error(`${name} must be a valid number`);
  }
  return value;
}

function readMapProvider(name: string): MapProvider {
  const value = readRequired(name);
  if (value !== "leaflet" && value !== "google") {
    throw new Error(`${name} must be "leaflet" or "google"`);
  }
  return value;
}

export const env = {
  auth0Domain: readRequired("VITE_AUTH0_DOMAIN"),
  auth0ClientId: readRequired("VITE_AUTH0_CLIENT_ID"),
  auth0Audience: readRequired("VITE_AUTH0_AUDIENCE"),
  auth0RedirectUri: readRequired("VITE_AUTH0_REDIRECT_URI"),
  pinsApiUrl: readRequired("VITE_PINS_API_URL").replace(/\/pins\/?$/, ""),
  mapProvider: readMapProvider("VITE_MAP_PROVIDER"),
  googleMapsKey: readOptional("VITE_GOOGLE_MAPS_KEY"),
  reverseGeocodeUrl: readRequired("VITE_REVERSE_GEOCODE_URL"),
  leafletTileUrl: readOptional("VITE_LEAFLET_TILE_URL"),
  leafletAttribution: readOptional("VITE_LEAFLET_ATTRIBUTION"),
  defaultCenterLat: readNumber("VITE_DEFAULT_CENTER_LAT"),
  defaultCenterLng: readNumber("VITE_DEFAULT_CENTER_LNG")
};
