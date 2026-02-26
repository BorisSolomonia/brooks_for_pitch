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

async function handleJson<T>(response: Response, label?: string): Promise<T> {
  if (!response.ok) {
    const body = await response.text().catch(() => "<unreadable>");
    const headers: Record<string, string> = {};
    response.headers.forEach((v, k) => { headers[k] = v; });
    console.error(
      `[API] ${label ?? "request"} failed`,
      { status: response.status, statusText: response.statusText, url: response.url, headers, body }
    );
    throw new Error(`Request failed: ${response.status}`);
  }
  return response.json() as Promise<T>;
}

export async function checkPinsHealth(): Promise<void> {
  try {
    const res = await fetch(`${PINS_API_URL}/pins/actuator/health`);
    const body = await res.text().catch(() => "<unreadable>");
    console.info("[API] pins-service health:", res.status, body);
  } catch (err) {
    console.error("[API] pins-service health check failed (network error):", err);
  }
}

export async function fetchMapPins(token: string, bbox: string): Promise<MapPin[]> {
  const url = `${PINS_API_URL}/pins/map?bbox=${encodeURIComponent(bbox)}`;
  console.debug("[API] fetchMapPins →", url);
  const response = await fetch(url, { headers: jsonHeaders(token) });
  const payload = await handleJson<MapPinsResponse>(response, "fetchMapPins");
  return payload.pins ?? [];
}

export async function createPin(
  token: string,
  form: PinForm,
  location: Coordinates
): Promise<void> {
  const expiresAt = form.expiresInHours === "permanent"
    ? new Date("2124-01-01T00:00:00Z").toISOString()
    : new Date(Date.now() + (form.expiresInHours as number) * 60 * 60 * 1000).toISOString();
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
    },
    ...(form.notifyRadiusM && form.notifyRadiusM > 0 ? { notifyRadiusM: form.notifyRadiusM } : {}),
    ...(form.revealAt ? { revealAt: new Date(form.revealAt).toISOString() } : {})
  };

  console.debug("[API] createPin →", `${PINS_API_URL}/pins`, payload);
  const response = await fetch(`${PINS_API_URL}/pins`, {
    method: "POST",
    headers: jsonHeaders(token),
    body: JSON.stringify(payload)
  });
  await handleJson(response, "createPin");
}
