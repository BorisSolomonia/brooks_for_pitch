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
  location: Coordinates;
  mapPrecision: "EXACT" | "BLURRED";
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

export type CityTheme = 'rome' | 'tbilisi' | 'paris' | 'default';
