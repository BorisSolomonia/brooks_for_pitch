import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  acceptFriend,
  declineFriend,
  fetchIncomingFriendRequests,
  fetchProfileFeaturedMemories,
  fetchProfileMapSummary,
  fetchProfileRecentMemories,
  fetchProfileRelationshipSummary,
  fetchUserProfile,
  followUser,
  removeFriend,
  requestFriend,
  unfollowUser,
  updateMyProfile
} from "../lib/api";
import type {
  MapPin,
  ProfileMemoryCard,
  ProfileRelationshipSummary,
  UpdateUserProfile,
  UserProfile
} from "../lib/types";
import type { MapProvider } from "../lib/frontendConfig";
import { ICON_SIZES, ICON_STROKES, MOTION_SETTINGS } from "../lib/frontendConfig";
import { env } from "../lib/env";
import "../styles/ProfileScreen.css";
import MapView from "./MapView";

type ProfileTab = "memories" | "map" | "about";

type ProfileScreenProps = {
  isOpen: boolean;
  token: string | null;
  userId: string | null;
  mapProvider: MapProvider;
  onClose: () => void;
  onProfileUpdated?: (profile: UserProfile) => void;
  onUseFriendsPins?: () => void;
};

function toMapPin(memory: ProfileMemoryCard): MapPin {
  return {
    id: memory.id,
    ownerId: "",
    location: memory.location,
    mapPrecision: memory.mapPrecision,
    textPreview: memory.textPreview,
    audienceType: memory.audienceType,
    revealType: memory.revealType,
    owner: memory.owner
  };
}

function initials(profile?: UserProfile | null) {
  const source = profile?.displayName || profile?.handle || "?";
  return source
    .split(" ")
    .map(part => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function ProfileScreen({
  isOpen,
  token,
  userId,
  mapProvider,
  onClose,
  onProfileUpdated,
  onUseFriendsPins
}: ProfileScreenProps) {
  const [tab, setTab] = useState<ProfileTab>("memories");
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [summary, setSummary] = useState<ProfileRelationshipSummary | null>(null);
  const [featured, setFeatured] = useState<ProfileMemoryCard[]>([]);
  const [recent, setRecent] = useState<ProfileMemoryCard[]>([]);
  const [totalMemories, setTotalMemories] = useState(0);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState<UpdateUserProfile>({
    handle: "",
    displayName: "",
    avatarUrl: "",
    bio: "",
    about: "",
    pronouns: "",
    locationLabel: "",
    websiteUrl: ""
  });

  const loadProfile = async () => {
    if (!isOpen || !token || !userId) {
      return;
    }
    setLoading(true);
    try {
      const [profileData, featuredData, recentData, summaryData, mapSummary] = await Promise.all([
        fetchUserProfile(token, userId),
        fetchProfileFeaturedMemories(token, userId),
        fetchProfileRecentMemories(token, userId),
        fetchProfileRelationshipSummary(token, userId),
        fetchProfileMapSummary(token, userId)
      ]);
      setProfile(profileData);
      setFeatured(featuredData);
      setRecent(recentData);
      setSummary(summaryData);
      setTotalMemories(mapSummary.totalCount);
      setForm({
        handle: profileData.handle,
        displayName: profileData.displayName,
        avatarUrl: profileData.avatarUrl ?? "",
        bio: profileData.bio ?? "",
        about: profileData.about ?? "",
        pronouns: profileData.pronouns ?? "",
        locationLabel: profileData.locationLabel ?? "",
        websiteUrl: profileData.websiteUrl ?? ""
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isOpen) {
      setEditMode(false);
      setTab("memories");
      return;
    }
    loadProfile();
  }, [isOpen, token, userId]);

  const mapPins = useMemo(() => recent.map(toMapPin), [recent]);
  const mapCenter = mapPins[0]?.location ?? { lat: env.defaultCenterLat, lng: env.defaultCenterLng };

  const handleRelationshipAction = async (action: () => Promise<void>) => {
    if (!token || !profile) {
      return;
    }
    setSaving(true);
    try {
      await action();
      const nextSummary = await fetchProfileRelationshipSummary(token, profile.userId);
      setSummary(nextSummary);
    } finally {
      setSaving(false);
    }
  };

  const saveProfile = async () => {
    if (!token) {
      return;
    }
    setSaving(true);
    try {
      const next = await updateMyProfile(token, form);
      setProfile(next);
      setEditMode(false);
      onProfileUpdated?.(next);
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="profile-screen-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            transition={{ duration: MOTION_SETTINGS.backdropDuration }}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {isOpen && (
          <motion.section
            className="profile-screen"
            role="dialog"
            aria-modal="true"
            aria-label="Profile"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ duration: MOTION_SETTINGS.drawerDuration, ease: MOTION_SETTINGS.easeEmphasized }}
          >
            <header className="profile-screen-header">
              <button type="button" className="profile-back" onClick={onClose}>
                <svg width={ICON_SIZES.shell} height={ICON_SIZES.shell} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={ICON_STROKES.shell}>
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </button>
              <div>
                <p className="eyebrow">Profile</p>
                <h2>{profile?.handle ? `@${profile.handle}` : "Loading..."}</h2>
              </div>
            </header>

            <div className="profile-screen-body">
              {loading ? <div className="profile-empty">Loading profile…</div> : null}
              {profile && summary ? (
                <>
                  <section className="profile-hero">
                    <div className="profile-avatar-shell">
                      {profile.avatarUrl ? (
                        <img src={profile.avatarUrl} alt={profile.displayName} className="profile-avatar-image" />
                      ) : (
                        <div className="profile-avatar-fallback">{initials(profile)}</div>
                      )}
                    </div>
                    <div className="profile-identity">
                      <h1>{profile.displayName}</h1>
                      <div className="profile-handle-row">
                        <span>@{profile.handle}</span>
                        {profile.pronouns ? <span>{profile.pronouns}</span> : null}
                        {profile.locationLabel ? <span>{profile.locationLabel}</span> : null}
                      </div>
                      {profile.bio ? <p className="profile-bio">{profile.bio}</p> : null}
                      {profile.websiteUrl ? <a className="profile-link" href={profile.websiteUrl} target="_blank" rel="noreferrer">{profile.websiteUrl}</a> : null}
                    </div>
                  </section>

                  <section className="profile-stats">
                    <div><strong>{summary.friendCount}</strong><span>Friends</span></div>
                    <div><strong>{summary.followerCount}</strong><span>Followers</span></div>
                    <div><strong>{summary.followingCount}</strong><span>Following</span></div>
                    <div><strong>{totalMemories}</strong><span>Memories</span></div>
                  </section>

                  <section className="profile-actions">
                    {summary.self ? (
                      <button type="button" className="profile-primary" onClick={() => setEditMode(v => !v)}>
                        {editMode ? "Close editor" : "Edit profile"}
                      </button>
                    ) : (
                      <>
                        {summary.friend ? (
                          <button type="button" className="profile-primary" disabled={saving} onClick={() => handleRelationshipAction(() => removeFriend(token!, profile.userId))}>
                            Remove friend
                          </button>
                        ) : summary.incomingFriendRequest ? (
                          <>
                            <button type="button" className="profile-primary" disabled={saving} onClick={() => handleRelationshipAction(async () => {
                              const incoming = await fetchIncomingFriendRequests(token!);
                              const request = incoming.find(item => item.userId === profile.userId);
                              if (request) {
                                await acceptFriend(token!, request.requestId);
                              }
                            })}>
                              Accept friend
                            </button>
                            <button type="button" className="profile-secondary" disabled={saving} onClick={() => handleRelationshipAction(async () => {
                              const incoming = await fetchIncomingFriendRequests(token!);
                              const request = incoming.find(item => item.userId === profile.userId);
                              if (request) {
                                await declineFriend(token!, request.requestId);
                              }
                            })}>
                              Decline
                            </button>
                          </>
                        ) : summary.outgoingFriendRequest ? (
                          <span className="profile-pill">Friend request sent</span>
                        ) : (
                          <button type="button" className="profile-primary" disabled={saving} onClick={() => handleRelationshipAction(() => requestFriend(token!, profile.userId))}>
                            Add friend
                          </button>
                        )}
                        {summary.following ? (
                          <button type="button" className="profile-secondary" disabled={saving} onClick={() => handleRelationshipAction(() => unfollowUser(token!, profile.userId))}>
                            Unfollow
                          </button>
                        ) : (
                          <button type="button" className="profile-secondary" disabled={saving} onClick={() => handleRelationshipAction(() => followUser(token!, profile.userId))}>
                            Follow
                          </button>
                        )}
                        {summary.friend && onUseFriendsPins ? (
                          <button type="button" className="profile-secondary" onClick={onUseFriendsPins}>
                            Friends' pins
                          </button>
                        ) : null}
                      </>
                    )}
                  </section>

                  {editMode && summary.self ? (
                    <section className="profile-editor">
                      <label>
                        <span className="form-label">Display name</span>
                        <input className="form-input" value={form.displayName ?? ""} onChange={event => setForm(prev => ({ ...prev, displayName: event.target.value }))} />
                      </label>
                      <label>
                        <span className="form-label">Handle</span>
                        <input className="form-input" value={form.handle ?? ""} onChange={event => setForm(prev => ({ ...prev, handle: event.target.value }))} />
                      </label>
                      <label>
                        <span className="form-label">Avatar URL</span>
                        <input className="form-input" value={form.avatarUrl ?? ""} onChange={event => setForm(prev => ({ ...prev, avatarUrl: event.target.value }))} />
                      </label>
                      <label>
                        <span className="form-label">Bio</span>
                        <textarea className="form-textarea" rows={2} value={form.bio ?? ""} onChange={event => setForm(prev => ({ ...prev, bio: event.target.value }))} />
                      </label>
                      <label>
                        <span className="form-label">About</span>
                        <textarea className="form-textarea" rows={4} value={form.about ?? ""} onChange={event => setForm(prev => ({ ...prev, about: event.target.value }))} />
                      </label>
                      <div className="profile-editor-grid">
                        <label>
                          <span className="form-label">Pronouns</span>
                          <input className="form-input" value={form.pronouns ?? ""} onChange={event => setForm(prev => ({ ...prev, pronouns: event.target.value }))} />
                        </label>
                        <label>
                          <span className="form-label">Location</span>
                          <input className="form-input" value={form.locationLabel ?? ""} onChange={event => setForm(prev => ({ ...prev, locationLabel: event.target.value }))} />
                        </label>
                      </div>
                      <label>
                        <span className="form-label">Website</span>
                        <input className="form-input" value={form.websiteUrl ?? ""} onChange={event => setForm(prev => ({ ...prev, websiteUrl: event.target.value }))} />
                      </label>
                      <div className="profile-editor-actions">
                        <button type="button" className="profile-primary" disabled={saving} onClick={saveProfile}>Save profile</button>
                        <button type="button" className="profile-secondary" onClick={() => setEditMode(false)}>Cancel</button>
                      </div>
                    </section>
                  ) : null}

                  {featured.length ? (
                    <section className="profile-featured">
                      <div className="profile-section-head">
                        <strong>Featured memories</strong>
                        <span>{featured.length}</span>
                      </div>
                      <div className="profile-featured-row">
                        {featured.map(item => (
                          <article key={item.id} className="profile-memory-card featured-card">
                            <span className="profile-memory-meta">{new Date(item.createdAt).toLocaleDateString()}</span>
                            <p>{item.textPreview}</p>
                          </article>
                        ))}
                      </div>
                    </section>
                  ) : null}

                  <nav className="profile-tabs" aria-label="Profile tabs">
                    {([
                      ["memories", "Memories"],
                      ["map", "Map"],
                      ["about", "About"]
                    ] as [ProfileTab, string][]).map(([value, label]) => (
                      <button key={value} type="button" className={`profile-tab ${tab === value ? "active" : ""}`} onClick={() => setTab(value)}>
                        {label}
                      </button>
                    ))}
                  </nav>

                  {tab === "memories" ? (
                    <section className="profile-memories">
                      {!recent.length ? <div className="profile-empty">No visible memories yet.</div> : null}
                      {recent.map(item => (
                        <article key={item.id} className="profile-memory-card">
                          <div className="profile-memory-head">
                            <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                            <span>{item.audienceType.toLowerCase()}</span>
                          </div>
                          <p>{item.textPreview}</p>
                        </article>
                      ))}
                    </section>
                  ) : null}

                  {tab === "map" ? (
                    <section className="profile-map-tab">
                      <div className="profile-section-head">
                        <strong>Memory map</strong>
                        <span>{totalMemories} total visible</span>
                      </div>
                      <div className="profile-mini-map">
                        <MapView
                          provider={mapProvider}
                          center={mapCenter}
                          pins={mapPins}
                          onPinClick={() => {}}
                          onHoldStart={() => {}}
                          onHoldEnd={() => {}}
                        />
                      </div>
                    </section>
                  ) : null}

                  {tab === "about" ? (
                    <section className="profile-about-tab">
                      {profile.about ? <p>{profile.about}</p> : <div className="profile-empty">No extended about section yet.</div>}
                      <div className="profile-about-grid">
                        {profile.locationLabel ? <div><strong>Location</strong><span>{profile.locationLabel}</span></div> : null}
                        {profile.pronouns ? <div><strong>Pronouns</strong><span>{profile.pronouns}</span></div> : null}
                        {profile.websiteUrl ? <div><strong>Website</strong><span>{profile.websiteUrl}</span></div> : null}
                      </div>
                    </section>
                  ) : null}
                </>
              ) : null}
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </>
  );
}
