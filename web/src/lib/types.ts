export type AuthTokens = {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
};

export type Coordinates = {
  lat: number;
  lng: number;
};

export type MapPin = {
  id: string;
  ownerId: string;
  location: Coordinates;
  mapPrecision: "EXACT" | "BLURRED";
  textPreview: string;
  audienceType: "PRIVATE" | "FRIENDS" | "FOLLOWERS" | "PUBLIC";
  revealType: "VISIBLE_ALWAYS" | "REACH_TO_REVEAL";
  owner: boolean;
};

export type PinForm = {
  text: string;
  audienceType: "PRIVATE" | "FRIENDS" | "FOLLOWERS" | "PUBLIC";
  revealType: "VISIBLE_ALWAYS" | "REACH_TO_REVEAL";
  mapPrecision: "EXACT" | "BLURRED";
  expiresInHours: number | "permanent";
  timeCapsule?: boolean;
  mediaType?: "NONE" | "PHOTO" | "VIDEO" | "AUDIO" | "LINK";
  recipientIds?: string[];
  externalRecipients?: string[];
  notifyRadiusM?: number;
  revealAt?: string;
};

export type CityResult = {
  city?: string;
  country?: string;
  lat: number;
  lng: number;
};

export type CityTheme = "default";

export type PinViewScope = "home" | "mine" | "friends";

export type UserSummary = {
  userId: string;
  handle: string;
  displayName: string;
};

export type UserProfile = {
  userId: string;
  handle: string;
  displayName: string;
  avatarUrl?: string | null;
  bio?: string | null;
  about?: string | null;
  pronouns?: string | null;
  locationLabel?: string | null;
  websiteUrl?: string | null;
};

export type UpdateUserProfile = {
  handle?: string;
  displayName?: string;
  avatarUrl?: string | null;
  bio?: string | null;
  about?: string | null;
  pronouns?: string | null;
  locationLabel?: string | null;
  websiteUrl?: string | null;
};

export type ProfileRelationshipSummary = {
  userId: string;
  self: boolean;
  friend: boolean;
  following: boolean;
  incomingFriendRequest: boolean;
  outgoingFriendRequest: boolean;
  friendCount: number;
  followerCount: number;
  followingCount: number;
};

export type ProfileMemoryCard = {
  id: string;
  location: Coordinates;
  mapPrecision: "EXACT" | "BLURRED";
  textPreview: string;
  audienceType: "PRIVATE" | "FRIENDS" | "FOLLOWERS" | "PUBLIC";
  revealType: "VISIBLE_ALWAYS" | "REACH_TO_REVEAL";
  createdAt: string;
  owner: boolean;
};

export type ProfileMapSummary = {
  totalCount: number;
  markers: Coordinates[];
};

export type FriendRequestRecord = {
  requestId: string;
  userId: string;
  status: string;
};

export type FriendshipRecord = {
  friendshipId: string;
  userId: string;
  status: string;
};

export type FollowRecord = {
  followId: string;
  userId: string;
  status: string;
};
