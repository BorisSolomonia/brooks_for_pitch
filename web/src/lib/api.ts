import type { Coordinates, MapPin, PinForm } from "./types";

const rawPinsApiUrl = import.meta.env.VITE_PINS_API_URL as string | undefined;
if (!rawPinsApiUrl) {
  throw new Error("VITE_PINS_API_URL is required");
}
const PINS_API_URL = rawPinsApiUrl.replace(/\/pins\/?$/, "");

type MapPinsResponse = {
  pins: MapPin[];
};

function jsonHeaders(token?: string) {
  const headers: Record<string, string> = {
    "Content-Type": "application/json"
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
}

async function handleJson<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || `Request failed: ${response.status}`);
  }
  return response.json() as Promise<T>;
}

export async function fetchMapPins(token: string, bbox: string): Promise<MapPin[]> {
  const response = await fetch(`${PINS_API_URL}/pins/map?bbox=${encodeURIComponent(bbox)}`, {
    headers: jsonHeaders(token)
  });
  const payload = await handleJson<MapPinsResponse>(response);
  return payload.pins ?? [];
}

export async function createPin(
  token: string,
  form: PinForm,
  location: Coordinates
): Promise<void> {
  const expiresAt = new Date(Date.now() + form.expiresInHours * 60 * 60 * 1000).toISOString();
  const acl = form.recipientIds && form.recipientIds.length
    ? { userIds: form.recipientIds }
    : undefined;
  const payload = {
    text: form.text,
    audienceType: form.audienceType,
    expiresAt,
    revealType: form.revealType,
    mapPrecision: form.mapPrecision,
    futureSelf: form.timeCapsule ?? false,
    acl,
    location: {
      lat: location.lat,
      lng: location.lng,
      altitudeM: null
    }
  };

  const response = await fetch(`${PINS_API_URL}/pins`, {
    method: "POST",
    headers: jsonHeaders(token),
    body: JSON.stringify(payload)
  });
  await handleJson(response);
}
