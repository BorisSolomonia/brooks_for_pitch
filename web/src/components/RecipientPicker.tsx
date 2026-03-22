import { useEffect, useState } from "react";
import { fetchFriends, fetchFollowers, fetchUserSummaries, searchUsers } from "../lib/api";
import type { UserSummary } from "../lib/types";
import "../styles/RecipientPicker.css";

type RecipientPickerProps = {
  token: string;
  audienceType: "FRIENDS" | "FOLLOWERS";
  selectedIds: string[];
  onChange: (ids: string[]) => void;
};

export function RecipientPicker({ token, audienceType, selectedIds, onChange }: RecipientPickerProps) {
  const [mode, setMode] = useState<"all" | "specific">(selectedIds.length > 0 ? "specific" : "all");
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState<UserSummary[]>([]);
  const [relationUsers, setRelationUsers] = useState<UserSummary[]>([]);
  const [loading, setLoading] = useState(false);

  // Load friends or followers list
  useEffect(() => {
    if (mode !== "specific") return;
    setLoading(true);
    const load = async () => {
      try {
        const records = audienceType === "FRIENDS"
          ? await fetchFriends(token)
          : await fetchFollowers(token);
        const ids = records.map(r => r.userId ?? (r as { followId: string; userId: string }).userId);
        if (ids.length > 0) {
          const summaries = await fetchUserSummaries(token, ids);
          setRelationUsers(summaries);
        }
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [token, audienceType, mode]);

  // Search debounce
  useEffect(() => {
    if (mode !== "specific" || !query.trim()) {
      setSearchResults([]);
      return;
    }
    const timeoutId = window.setTimeout(async () => {
      try {
        const results = await searchUsers(token, query.trim());
        setSearchResults(results);
      } catch {
        // ignore
      }
    }, 250);
    return () => window.clearTimeout(timeoutId);
  }, [token, query, mode]);

  const handleModeChange = (newMode: "all" | "specific") => {
    setMode(newMode);
    if (newMode === "all") {
      onChange([]);
    }
  };

  const toggleUser = (userId: string) => {
    if (selectedIds.includes(userId)) {
      onChange(selectedIds.filter(id => id !== userId));
    } else {
      onChange([...selectedIds, userId]);
    }
  };

  const selectedSet = new Set(selectedIds);

  // Combine relation users and search results, deduped
  const displayUsers = mode === "specific"
    ? [...relationUsers, ...searchResults.filter(u => !relationUsers.some(r => r.userId === u.userId))]
    : [];

  return (
    <div className="recipient-picker">
      <div className="recipient-mode-toggle">
        <button
          type="button"
          className={`pill ${mode === "all" ? "active" : ""}`}
          onClick={() => handleModeChange("all")}
        >
          All {audienceType === "FRIENDS" ? "friends" : "followers"}
        </button>
        <button
          type="button"
          className={`pill ${mode === "specific" ? "active" : ""}`}
          onClick={() => handleModeChange("specific")}
        >
          Specific people
        </button>
      </div>

      {mode === "specific" && (
        <>
          {selectedIds.length > 0 && (
            <div className="recipient-chips">
              {displayUsers
                .filter(u => selectedSet.has(u.userId))
                .map(u => (
                  <span key={u.userId} className="recipient-chip">
                    <span className="recipient-chip-name">@{u.handle}</span>
                    <button
                      type="button"
                      className="recipient-chip-remove"
                      onClick={() => toggleUser(u.userId)}
                      aria-label={`Remove ${u.handle}`}
                    >
                      &times;
                    </button>
                  </span>
                ))}
            </div>
          )}

          <input
            className="form-input recipient-search"
            placeholder="Search by name or handle..."
            value={query}
            onChange={e => setQuery(e.target.value)}
          />

          <div className="recipient-results">
            {loading && <div className="recipient-loading">Loading...</div>}
            {!loading && displayUsers.length === 0 && (
              <div className="recipient-empty">
                {query.trim() ? "No matches" : `No ${audienceType === "FRIENDS" ? "friends" : "followers"} yet`}
              </div>
            )}
            {displayUsers.map(user => (
              <button
                key={user.userId}
                type="button"
                className={`recipient-row${selectedSet.has(user.userId) ? " selected" : ""}`}
                onClick={() => toggleUser(user.userId)}
              >
                <span className="recipient-info">
                  <strong>{user.displayName}</strong>
                  <span>@{user.handle}</span>
                </span>
                <span className={`recipient-check${selectedSet.has(user.userId) ? " checked" : ""}`}>
                  {selectedSet.has(user.userId) ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  ) : null}
                </span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
