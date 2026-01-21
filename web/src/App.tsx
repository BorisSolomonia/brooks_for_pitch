import { useEffect, useMemo, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import MapView from "./components/MapView";
import PinForm from "./components/PinForm";
import PinList from "./components/PinList";
import AuthGate from "./components/AuthGate";
import { useCityTheme } from "./hooks/useCityTheme";
import { applyTheme, CITY_THEMES, CityTheme } from "./lib/theme";
import { createPin, fetchMapPins } from "./lib/api";
import type { Coordinates, MapPin, PinForm as PinFormState } from "./lib/types";

const DEFAULT_CENTER: Coordinates = { lat: 41.9028, lng: 12.4964 };

type MapProvider = "leaflet" | "google";

const DEFAULT_PROVIDER = (import.meta.env.VITE_MAP_PROVIDER || "leaflet") as MapProvider;
const AUTH0_AUDIENCE = import.meta.env.VITE_AUTH0_AUDIENCE as string | undefined;

function bboxFromCenter(center: Coordinates, delta = 0.04) {
  const minLng = center.lng - delta;
  const minLat = center.lat - delta;
  const maxLng = center.lng + delta;
  const maxLat = center.lat + delta;
  return `${minLng},${minLat},${maxLng},${maxLat}`;
}

export default function App() {
  const { status, error, location, theme, setOverride, override } = useCityTheme();
  const {
    isAuthenticated,
    isLoading: authLoading,
    user,
    loginWithRedirect,
    logout,
    getAccessTokenSilently
  } = useAuth0();
  const [mapProvider, setMapProvider] = useState<MapProvider>(DEFAULT_PROVIDER);
  const [pins, setPins] = useState<MapPin[]>([]);
  const [pinsLoading, setPinsLoading] = useState(false);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("brooks.token"));
  const [authError, setAuthError] = useState<string | null>(null);

  const center = useMemo<Coordinates>(() => {
    if (location) {
      return { lat: location.lat, lng: location.lng };
    }
    return DEFAULT_CENTER;
  }, [location]);

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  useEffect(() => {
    if (!isAuthenticated) {
      setToken(null);
      localStorage.removeItem("brooks.token");
      return;
    }

    let isActive = true;
    setAuthError(null);
    const loadToken = async () => {
      try {
        const accessToken = await getAccessTokenSilently({
          authorizationParams: {
            audience: AUTH0_AUDIENCE,
            scope: "openid profile email offline_access"
          }
        });
        if (isActive) {
          setToken(accessToken);
          localStorage.setItem("brooks.token", accessToken);
        }
      } catch (err) {
        if (isActive) {
          setAuthError(err instanceof Error ? err.message : "Failed to load session.");
        }
      }
    };

    loadToken();
    return () => {
      isActive = false;
    };
  }, [getAccessTokenSilently, isAuthenticated]);

  const refreshPins = async () => {
    if (!token) {
      return;
    }
    setPinsLoading(true);
    try {
      const results = await fetchMapPins(token, bboxFromCenter(center));
      setPins(results);
    } catch (err) {
      setPins([]);
    } finally {
      setPinsLoading(false);
    }
  };

  useEffect(() => {
    refreshPins();
  }, [token, center]);

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem("brooks.token");
    logout({ logoutParams: { returnTo: window.location.origin } });
  };

  const handleCreatePin = async (form: PinFormState) => {
    if (!token) {
      throw new Error("Sign in first.");
    }
    await createPin(token, form, center);
    await refreshPins();
  };

  const themeOptions = Object.entries(CITY_THEMES).map(([key, value]) => ({
    value: key as CityTheme,
    label: value.label
  }));
  const themeSelectValue = override ?? "auto";

  if (authLoading) {
    return (
      <div className="auth-gate">
        <div className="auth-panel">
          <p className="eyebrow">Brooks</p>
          <h1>Loading your session...</h1>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <AuthGate
        isLoading={authLoading}
        error={authError}
        onLogin={() => loginWithRedirect()}
        onRegister={() =>
          loginWithRedirect({
            authorizationParams: {
              screen_hint: "signup"
            }
          })
        }
      />
    );
  }

  if (!token) {
    return (
      <div className="auth-gate">
        <div className="auth-panel">
          <p className="eyebrow">Brooks</p>
          <h1>Securing your session...</h1>
          {authError && <p className="error">{authError}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="top-bar">
        <div>
          <p className="eyebrow">Brooks</p>
          <h1>Proximity notes for the city you are in.</h1>
        </div>
        <div className="top-actions">
          <div className="pill user-pill">
            <span className="label">Signed in</span>
            <span>{user?.email ?? user?.name ?? "Authenticated"}</span>
            <button className="ghost" type="button" onClick={handleLogout}>
              Sign out
            </button>
          </div>
          <div className="pill">
            <span className="label">Theme</span>
            <select
              value={themeSelectValue}
              onChange={event => {
                const next = event.target.value;
                if (next === "auto") {
                  setOverride(null);
                } else {
                  setOverride(next as CityTheme);
                }
              }}
            >
              <option value="auto">Auto (location)</option>
              {themeOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div className="pill">
            <span className="label">Map</span>
            <div className="segmented">
              <button
                type="button"
                className={mapProvider === "leaflet" ? "active" : ""}
                onClick={() => setMapProvider("leaflet")}
              >
                Leaflet
              </button>
              <button
                type="button"
                className={mapProvider === "google" ? "active" : ""}
                onClick={() => setMapProvider("google")}
              >
                Google
              </button>
            </div>
          </div>
        </div>
      </header>

      <section className="hero">
        <div className="hero-card">
          <div className="hero-meta">
            <span className="badge">{CITY_THEMES[theme].label}</span>
            <span className="muted">
              {status === "ready" && location?.city ? location.city : "Locating you"}
            </span>
          </div>
          <p>
            Drop a pin, set who can see it, and let the city reveal the rest.
            Colors shift with your location so the interface feels like the place.
          </p>
          {status === "error" && <span className="error">{error}</span>}
        </div>
        <div className="hero-map">
          <MapView provider={mapProvider} center={center} pins={pins} />
          <div className="map-overlay">
            <div>
              <span className="label">Center</span>
              <strong>
                {center.lat.toFixed(4)}, {center.lng.toFixed(4)}
              </strong>
            </div>
            <div>
              <span className="label">Pins</span>
              <strong>{pins.length}</strong>
            </div>
          </div>
        </div>
      </section>

      <section className="grid">
        <div className="stack">
          <PinForm onSubmit={handleCreatePin} disabled={!token} />
        </div>
        <div className="stack">
          <PinList pins={pins} loading={pinsLoading} onRefresh={refreshPins} />
          <div className="card insight">
            <h3>Reality check</h3>
            <p>
              Pins are only visible when access rules pass: timing, relationships,
              lists, and proximity. No live tracking, no ambient exposure.
            </p>
            <ul>
              <li>Proximity-only discovery</li>
              <li>Privacy-first defaults</li>
              <li>Map precision controls</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
