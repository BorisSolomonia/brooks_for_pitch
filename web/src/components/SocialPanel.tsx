import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  acceptFriend,
  declineFriend,
  fetchFollowers,
  fetchFollowing,
  fetchFriends,
  fetchIncomingFriendRequests,
  fetchSentFriendRequests,
  fetchUserSummaries,
  followUser,
  removeFriend,
  requestFriend,
  searchUsers,
  unfollowUser
} from "../lib/api";
import { ICON_SIZES, ICON_STROKES, MOTION_SETTINGS } from "../lib/frontendConfig";
import type { FollowRecord, FriendRequestRecord, FriendshipRecord, UserSummary } from "../lib/types";
import "../styles/SocialPanel.css";

type SocialTab = "people" | "friends" | "requests" | "following";

type SocialPanelProps = {
  isOpen: boolean;
  token: string | null;
  onClose: () => void;
  onUseFriendsPins: () => void;
};

type RelationMap = Record<string, UserSummary>;

function uniqIds(ids: string[]) {
  return Array.from(new Set(ids.filter(Boolean)));
}

export function SocialPanel({ isOpen, token, onClose, onUseFriendsPins }: SocialPanelProps) {
  const [tab, setTab] = useState<SocialTab>("people");
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState<UserSummary[]>([]);
  const [friends, setFriends] = useState<FriendshipRecord[]>([]);
  const [incoming, setIncoming] = useState<FriendRequestRecord[]>([]);
  const [sent, setSent] = useState<FriendRequestRecord[]>([]);
  const [following, setFollowing] = useState<FollowRecord[]>([]);
  const [followers, setFollowers] = useState<FollowRecord[]>([]);
  const [users, setUsers] = useState<RelationMap>({});
  const [loading, setLoading] = useState(false);
  const [actionId, setActionId] = useState<string | null>(null);

  const hydrateUsers = async (accessToken: string, ids: string[]) => {
    const uniqueIds = uniqIds(ids);
    if (!uniqueIds.length) {
      return;
    }
    const summaries = await fetchUserSummaries(accessToken, uniqueIds);
    setUsers(prev => ({
      ...prev,
      ...Object.fromEntries(summaries.map(user => [user.userId, user]))
    }));
  };

  const loadRelationships = async () => {
    if (!isOpen || !token) {
      return;
    }
    setLoading(true);
    try {
      const [friendsData, incomingData, sentData, followingData, followersData] = await Promise.all([
        fetchFriends(token),
        fetchIncomingFriendRequests(token),
        fetchSentFriendRequests(token),
        fetchFollowing(token),
        fetchFollowers(token)
      ]);
      setFriends(friendsData);
      setIncoming(incomingData);
      setSent(sentData);
      setFollowing(followingData);
      setFollowers(followersData);
      await hydrateUsers(token, [
        ...friendsData.map(item => item.userId),
        ...incomingData.map(item => item.userId),
        ...sentData.map(item => item.userId),
        ...followingData.map(item => item.userId),
        ...followersData.map(item => item.userId)
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRelationships();
  }, [isOpen, token]);

  useEffect(() => {
    if (!isOpen || !token) {
      return;
    }
    const normalized = query.trim();
    if (!normalized) {
      setSearchResults([]);
      return;
    }

    const timeoutId = window.setTimeout(async () => {
      const results = await searchUsers(token, normalized);
      setSearchResults(results);
    }, 220);

    return () => window.clearTimeout(timeoutId);
  }, [isOpen, query, token]);

  const friendIds = useMemo(() => new Set(friends.map(item => item.userId)), [friends]);
  const followingIds = useMemo(() => new Set(following.map(item => item.userId)), [following]);
  const incomingIds = useMemo(() => new Set(incoming.map(item => item.userId)), [incoming]);
  const sentIds = useMemo(() => new Set(sent.map(item => item.userId)), [sent]);

  const handleAction = async (id: string, action: () => Promise<void>) => {
    setActionId(id);
    try {
      await action();
      await loadRelationships();
    } finally {
      setActionId(null);
    }
  };

  const renderUserName = (userId: string) => {
    const user = users[userId];
    return user ? `${user.displayName} @${user.handle}` : userId;
  };

  const renderSearchAction = (user: UserSummary) => {
    if (friendIds.has(user.userId)) {
      return <span className="social-badge">Friend</span>;
    }
    if (incomingIds.has(user.userId)) {
      const request = incoming.find(item => item.userId === user.userId);
      return (
        <div className="social-actions-row">
          <button
            type="button"
            className="social-mini primary"
            disabled={actionId === request?.requestId}
            onClick={() => request && handleAction(request.requestId, () => acceptFriend(token!, request.requestId))}
          >
            Accept
          </button>
          <button
            type="button"
            className="social-mini"
            disabled={actionId === request?.requestId}
            onClick={() => request && handleAction(request.requestId, () => declineFriend(token!, request.requestId))}
          >
            Decline
          </button>
        </div>
      );
    }
    if (sentIds.has(user.userId)) {
      return <span className="social-badge muted">Requested</span>;
    }
    return (
      <div className="social-actions-row">
        <button
          type="button"
          className="social-mini primary"
          disabled={actionId === user.userId}
          onClick={() => handleAction(user.userId, () => requestFriend(token!, user.userId))}
        >
          Add friend
        </button>
        {followingIds.has(user.userId) ? (
          <button
            type="button"
            className="social-mini"
            disabled={actionId === `${user.userId}-follow`}
            onClick={() => handleAction(`${user.userId}-follow`, () => unfollowUser(token!, user.userId))}
          >
            Unfollow
          </button>
        ) : (
          <button
            type="button"
            className="social-mini"
            disabled={actionId === `${user.userId}-follow`}
            onClick={() => handleAction(`${user.userId}-follow`, () => followUser(token!, user.userId))}
          >
            Follow
          </button>
        )}
      </div>
    );
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="modal-backdrop open"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: MOTION_SETTINGS.backdropDuration }}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {isOpen && (
          <motion.section
            className="social-panel open"
            role="dialog"
            aria-modal="true"
            aria-label="People"
            initial={{ y: "102%" }}
            animate={{ y: 0 }}
            exit={{ y: "102%" }}
            transition={{ duration: MOTION_SETTINGS.drawerDuration, ease: MOTION_SETTINGS.easeEmphasized }}
          >
            <div className="modal-handle" />
            <header className="modal-header social-header">
              <div>
                <p className="eyebrow">Social</p>
                <h2>People</h2>
              </div>
              <button className="modal-close" onClick={onClose} aria-label="Close" type="button">
                <svg width={ICON_SIZES.shell} height={ICON_SIZES.shell} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={ICON_STROKES.shell}>
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </header>

            <div className="social-tabs" role="tablist" aria-label="People tabs">
              {([
                ["people", "Find people"],
                ["friends", "Friends"],
                ["requests", "Requests"],
                ["following", "Following"]
              ] as [SocialTab, string][]).map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  className={`social-tab ${tab === value ? "active" : ""}`}
                  onClick={() => setTab(value)}
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="social-body">
              {tab === "people" ? (
                <div className="social-section">
                  <div className="social-search-shell">
                    <input
                      className="form-input"
                      placeholder="Search by name, handle, or email"
                      value={query}
                      onChange={event => setQuery(event.target.value)}
                    />
                    <p className="form-hint">Find people first. Friends power the Friends&apos; pins view.</p>
                  </div>
                  <div className="social-list">
                    {query.trim() && searchResults.length === 0 ? <div className="social-empty">No people matched your search.</div> : null}
                    {searchResults.map(user => (
                      <div key={user.userId} className="social-card">
                        <div>
                          <strong>{user.displayName}</strong>
                          <span>@{user.handle}</span>
                        </div>
                        {renderSearchAction(user)}
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}

              {tab === "friends" ? (
                <div className="social-section">
                  <div className="social-section-head">
                    <div>
                      <strong>Your friends</strong>
                      <span>{friends.length ? `${friends.length} connected` : "No friends yet"}</span>
                    </div>
                    <button type="button" className="social-mini primary" onClick={onUseFriendsPins} disabled={!friends.length}>
                      Friends' pins
                    </button>
                  </div>
                  <div className="social-list">
                    {!friends.length ? <div className="social-empty">No friends yet. Use Find people to send requests.</div> : null}
                    {friends.map(item => (
                      <div key={item.friendshipId} className="social-card">
                        <div>
                          <strong>{renderUserName(item.userId)}</strong>
                          <span>Friend</span>
                        </div>
                        <button
                          type="button"
                          className="social-mini"
                          disabled={actionId === item.userId}
                          onClick={() => handleAction(item.userId, () => removeFriend(token!, item.userId))}
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}

              {tab === "requests" ? (
                <div className="social-section split">
                  <div>
                    <div className="social-section-head inline-head">
                      <strong>Incoming</strong>
                      <span>{incoming.length}</span>
                    </div>
                    <div className="social-list compact">
                      {!incoming.length ? <div className="social-empty">No incoming requests.</div> : null}
                      {incoming.map(item => (
                        <div key={item.requestId} className="social-card compact-card">
                          <div>
                            <strong>{renderUserName(item.userId)}</strong>
                            <span>Wants to be friends</span>
                          </div>
                          <div className="social-actions-row">
                            <button type="button" className="social-mini primary" disabled={actionId === item.requestId} onClick={() => handleAction(item.requestId, () => acceptFriend(token!, item.requestId))}>Accept</button>
                            <button type="button" className="social-mini" disabled={actionId === item.requestId} onClick={() => handleAction(item.requestId, () => declineFriend(token!, item.requestId))}>Decline</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="social-section-head inline-head">
                      <strong>Sent</strong>
                      <span>{sent.length}</span>
                    </div>
                    <div className="social-list compact">
                      {!sent.length ? <div className="social-empty">No pending requests sent.</div> : null}
                      {sent.map(item => (
                        <div key={item.requestId} className="social-card compact-card">
                          <div>
                            <strong>{renderUserName(item.userId)}</strong>
                            <span>Pending</span>
                          </div>
                          <span className="social-badge muted">Waiting</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : null}

              {tab === "following" ? (
                <div className="social-section split">
                  <div>
                    <div className="social-section-head inline-head">
                      <strong>Following</strong>
                      <span>{following.length}</span>
                    </div>
                    <div className="social-list compact">
                      {!following.length ? <div className="social-empty">You are not following anyone yet.</div> : null}
                      {following.map(item => (
                        <div key={item.followId} className="social-card compact-card">
                          <div>
                            <strong>{renderUserName(item.userId)}</strong>
                            <span>Following</span>
                          </div>
                          <button type="button" className="social-mini" disabled={actionId === item.followId} onClick={() => handleAction(item.followId, () => unfollowUser(token!, item.userId))}>Unfollow</button>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="social-section-head inline-head">
                      <strong>Followers</strong>
                      <span>{followers.length}</span>
                    </div>
                    <div className="social-list compact">
                      {!followers.length ? <div className="social-empty">No followers yet.</div> : null}
                      {followers.map(item => (
                        <div key={item.followId} className="social-card compact-card">
                          <div>
                            <strong>{renderUserName(item.userId)}</strong>
                            <span>Follows you</span>
                          </div>
                          {friendIds.has(item.userId)
                            ? <span className="social-badge">Friend</span>
                            : <button type="button" className="social-mini primary" disabled={actionId === item.userId} onClick={() => handleAction(item.userId, () => requestFriend(token!, item.userId))}>Add friend</button>}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : null}

              {loading ? <div className="social-loading">Refreshing relationships…</div> : null}
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </>
  );
}
