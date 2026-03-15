import type {
  Coordinates,
  FollowRecord,
  FriendRequestRecord,
  FriendshipRecord,
  MapPin,
  PinForm,
  PinViewScope,
  UserSummary
} from "./types";
import { env } from "./env";
import { PIN_FORM_SETTINGS } from "./frontendConfig";

const PINS_API_URL = env.pinsApiUrl;
const AUTH_API_URL = `${PINS_API_URL}/auth`;
const SOCIAL_API_URL = `${PINS_API_URL}/social`;

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

export async function checkPinsHealth(token?: string): Promise<void> {
  try {
    const res = await fetch(`${PINS_API_URL}/pins/actuator/health`, {
      headers: token ? jsonHeaders(token) : undefined
    });
    const body = await res.text().catch(() => "<unreadable>");
    console.info("[API] pins-service health:", res.status, body);
  } catch (err) {
    console.error("[API] pins-service health check failed (network error):", err);
  }
}

export async function fetchMapPins(token: string, bbox: string, scope: PinViewScope = "home"): Promise<MapPin[]> {
  const url = `${PINS_API_URL}/pins/map?bbox=${encodeURIComponent(bbox)}&scope=${encodeURIComponent(scope)}`;
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
    ? new Date(PIN_FORM_SETTINGS.permanentExpiryIso).toISOString()
    : new Date(Date.now() + (form.expiresInHours as number) * PIN_FORM_SETTINGS.millisecondsPerHour).toISOString();
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

export async function searchUsers(token: string, query: string): Promise<UserSummary[]> {
  if (!query.trim()) {
    return [];
  }
  const response = await fetch(`${AUTH_API_URL}/users/search?q=${encodeURIComponent(query.trim())}`, {
    headers: jsonHeaders(token)
  });
  return handleJson<UserSummary[]>(response, "searchUsers");
}

export async function fetchUserSummaries(token: string, ids: string[]): Promise<UserSummary[]> {
  if (!ids.length) {
    return [];
  }
  const params = new URLSearchParams();
  ids.forEach(id => params.append("ids", id));
  const response = await fetch(`${AUTH_API_URL}/users?${params.toString()}`, {
    headers: jsonHeaders(token)
  });
  return handleJson<UserSummary[]>(response, "fetchUserSummaries");
}

export async function fetchFriends(token: string): Promise<FriendshipRecord[]> {
  const response = await fetch(`${SOCIAL_API_URL}/friends`, { headers: jsonHeaders(token) });
  return handleJson<FriendshipRecord[]>(response, "fetchFriends");
}

export async function fetchIncomingFriendRequests(token: string): Promise<FriendRequestRecord[]> {
  const response = await fetch(`${SOCIAL_API_URL}/friends/requests/incoming`, { headers: jsonHeaders(token) });
  return handleJson<FriendRequestRecord[]>(response, "fetchIncomingFriendRequests");
}

export async function fetchSentFriendRequests(token: string): Promise<FriendRequestRecord[]> {
  const response = await fetch(`${SOCIAL_API_URL}/friends/requests/sent`, { headers: jsonHeaders(token) });
  return handleJson<FriendRequestRecord[]>(response, "fetchSentFriendRequests");
}

export async function fetchFollowing(token: string): Promise<FollowRecord[]> {
  const response = await fetch(`${SOCIAL_API_URL}/following`, { headers: jsonHeaders(token) });
  return handleJson<FollowRecord[]>(response, "fetchFollowing");
}

export async function fetchFollowers(token: string): Promise<FollowRecord[]> {
  const response = await fetch(`${SOCIAL_API_URL}/followers`, { headers: jsonHeaders(token) });
  return handleJson<FollowRecord[]>(response, "fetchFollowers");
}

export async function requestFriend(token: string, userId: string): Promise<void> {
  const response = await fetch(`${SOCIAL_API_URL}/friends/request/${encodeURIComponent(userId)}`, {
    method: "POST",
    headers: jsonHeaders(token)
  });
  await handleJson(response, "requestFriend");
}

export async function acceptFriend(token: string, requestId: string): Promise<void> {
  const response = await fetch(`${SOCIAL_API_URL}/friends/accept/${encodeURIComponent(requestId)}`, {
    method: "POST",
    headers: jsonHeaders(token)
  });
  await handleJson(response, "acceptFriend");
}

export async function declineFriend(token: string, requestId: string): Promise<void> {
  const response = await fetch(`${SOCIAL_API_URL}/friends/decline/${encodeURIComponent(requestId)}`, {
    method: "POST",
    headers: jsonHeaders(token)
  });
  if (!response.ok) {
    await handleJson(response, "declineFriend");
  }
}

export async function removeFriend(token: string, userId: string): Promise<void> {
  const response = await fetch(`${SOCIAL_API_URL}/friends/remove/${encodeURIComponent(userId)}`, {
    method: "POST",
    headers: jsonHeaders(token)
  });
  if (!response.ok) {
    await handleJson(response, "removeFriend");
  }
}

export async function followUser(token: string, userId: string): Promise<void> {
  const response = await fetch(`${SOCIAL_API_URL}/follow/${encodeURIComponent(userId)}`, {
    method: "POST",
    headers: jsonHeaders(token)
  });
  await handleJson(response, "followUser");
}

export async function unfollowUser(token: string, userId: string): Promise<void> {
  const response = await fetch(`${SOCIAL_API_URL}/unfollow/${encodeURIComponent(userId)}`, {
    method: "POST",
    headers: jsonHeaders(token)
  });
  if (!response.ok) {
    await handleJson(response, "unfollowUser");
  }
}
