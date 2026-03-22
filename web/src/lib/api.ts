import type {
  AppNotification,
  Coordinates,
  FollowRecord,
  FriendRequestRecord,
  FriendshipRecord,
  MapPin,
  PinForm,
  PinViewScope,
  ProfileMapSummary,
  ProfileMemoryCard,
  ProfileRelationshipSummary,
  ProximityCheckResponse,
  UpdateUserProfile,
  UserSummary
} from "./types";
import type { UserProfile } from "./types";
import { env } from "./env";
import { PIN_FORM_SETTINGS } from "./frontendConfig";

const PINS_API_URL = env.pinsApiUrl;
const AUTH_API_URL = env.authApiUrl ?? `${PINS_API_URL}/auth`;
const SOCIAL_API_URL = env.socialApiUrl ?? `${PINS_API_URL}/social`;
const NOTIFICATIONS_API_URL = env.notificationsApiUrl ?? `${PINS_API_URL}/notifications`;

type MapPinsResponse = {
  pins: MapPin[];
};

type ProfileMemoriesResponse = {
  memories: ProfileMemoryCard[];
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
    ...(form.notifyRadiusM && form.notifyRadiusM > 0 && form.revealType === "REACH_TO_REVEAL" ? { revealRadiusM: form.notifyRadiusM } : {}),
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

export async function fetchMyProfile(token: string): Promise<UserProfile> {
  const response = await fetch(`${AUTH_API_URL}/users/me/profile`, {
    headers: jsonHeaders(token)
  });
  return handleJson<UserProfile>(response, "fetchMyProfile");
}

export async function fetchUserProfile(token: string, userId: string): Promise<UserProfile> {
  const response = await fetch(`${AUTH_API_URL}/users/${encodeURIComponent(userId)}/profile`, {
    headers: jsonHeaders(token)
  });
  return handleJson<UserProfile>(response, "fetchUserProfile");
}

export async function updateMyProfile(token: string, profile: UpdateUserProfile): Promise<UserProfile> {
  const response = await fetch(`${AUTH_API_URL}/users/me/profile`, {
    method: "PATCH",
    headers: jsonHeaders(token),
    body: JSON.stringify(profile)
  });
  return handleJson<UserProfile>(response, "updateMyProfile");
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

export async function fetchProfileRelationshipSummary(token: string, userId: string): Promise<ProfileRelationshipSummary> {
  const response = await fetch(`${SOCIAL_API_URL}/relationships/${encodeURIComponent(userId)}/summary`, {
    headers: jsonHeaders(token)
  });
  return handleJson<ProfileRelationshipSummary>(response, "fetchProfileRelationshipSummary");
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

export async function fetchProfileFeaturedMemories(token: string, userId: string): Promise<ProfileMemoryCard[]> {
  const response = await fetch(`${PINS_API_URL}/pins/profiles/${encodeURIComponent(userId)}/featured`, {
    headers: jsonHeaders(token)
  });
  const payload = await handleJson<ProfileMemoriesResponse>(response, "fetchProfileFeaturedMemories");
  return payload.memories ?? [];
}

export async function fetchProfileRecentMemories(token: string, userId: string): Promise<ProfileMemoryCard[]> {
  const response = await fetch(`${PINS_API_URL}/pins/profiles/${encodeURIComponent(userId)}/recent`, {
    headers: jsonHeaders(token)
  });
  const payload = await handleJson<ProfileMemoriesResponse>(response, "fetchProfileRecentMemories");
  return payload.memories ?? [];
}

export async function fetchProfileMapSummary(token: string, userId: string): Promise<ProfileMapSummary> {
  const response = await fetch(`${PINS_API_URL}/pins/profiles/${encodeURIComponent(userId)}/map-summary`, {
    headers: jsonHeaders(token)
  });
  return handleJson<ProfileMapSummary>(response, "fetchProfileMapSummary");
}

export async function proximityCheck(token: string, location: Coordinates): Promise<ProximityCheckResponse> {
  const response = await fetch(`${PINS_API_URL}/pins/proximity-check`, {
    method: "POST",
    headers: jsonHeaders(token),
    body: JSON.stringify({ location: { lat: location.lat, lng: location.lng } })
  });
  return handleJson<ProximityCheckResponse>(response, "proximityCheck");
}

export async function fetchNotifications(token: string): Promise<AppNotification[]> {
  const response = await fetch(`${NOTIFICATIONS_API_URL}`, {
    headers: jsonHeaders(token)
  });
  return handleJson<AppNotification[]>(response, "fetchNotifications");
}

export async function fetchUnreadNotificationCount(token: string): Promise<number> {
  const response = await fetch(`${NOTIFICATIONS_API_URL}/unread-count`, {
    headers: jsonHeaders(token)
  });
  const data = await handleJson<{ count: number }>(response, "fetchUnreadNotificationCount");
  return data.count;
}

export async function markNotificationRead(token: string, id: string): Promise<void> {
  const response = await fetch(`${NOTIFICATIONS_API_URL}/${encodeURIComponent(id)}/read`, {
    method: "POST",
    headers: jsonHeaders(token)
  });
  if (!response.ok) {
    await handleJson(response, "markNotificationRead");
  }
}
