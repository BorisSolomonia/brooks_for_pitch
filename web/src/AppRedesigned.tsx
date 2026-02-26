import { useState, useEffect, useRef } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { TopBar } from "./components/TopBar";
import { FAB } from "./components/FAB";
import { NavigationDrawer } from "./components/NavigationDrawer";
import { PinCreationModal } from "./components/PinCreationModal";
import { MapChargeRing } from "./components/MapChargeRing";
import MapView from "./components/MapView";
import AuthGate from "./components/AuthGate";
import { useCityTheme } from "./hooks/useCityTheme";
import { applyTheme } from "./lib/theme";
import { fetchMapPins, createPin, checkPinsHealth } from "./lib/api";
import type { AuthTokens, Coordinates, MapPin, PinForm, CityTheme } from "./lib/types";
import "./styles/AppRedesigned.css";


export default function AppRedesigned() {
  const {
    isLoading,
    isAuthenticated,
    logout,
    user,
    getAccessTokenSilently,
    loginWithRedirect,
    error: authError
  } = useAuth0();

  const [token, setToken] = useState<AuthTokens | null>(null);
  const defaultCenterLat = Number(import.meta.env.VITE_DEFAULT_CENTER_LAT);
  const defaultCenterLng = Number(import.meta.env.VITE_DEFAULT_CENTER_LNG);
  if (Number.isNaN(defaultCenterLat) || Number.isNaN(defaultCenterLng)) {
    throw new Error("VITE_DEFAULT_CENTER_LAT and VITE_DEFAULT_CENTER_LNG are required");
  }

  const [center, setCenter] = useState<Coordinates>({ lat: defaultCenterLat, lng: defaultCenterLng });
  const [pins, setPins] = useState<MapPin[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [chargeTarget, setChargeTarget] = useState<{ coords: Coordinates; x: number; y: number } | null>(null);
  const ringCompletedRef = useRef(false);
  const [showPins, setShowPins] = useState(true);

  const mapProviderEnv = import.meta.env.VITE_MAP_PROVIDER as "leaflet" | "google" | undefined;
  if (!mapProviderEnv) {
    throw new Error("VITE_MAP_PROVIDER is required");
  }

  const [mapProvider, setMapProvider] = useState<"leaflet" | "google">(mapProviderEnv);
  const { location, theme, setOverride, override } = useCityTheme();
  const currentTheme = (override || theme || "default") as CityTheme;

  useEffect(() => {
    applyTheme(currentTheme);
  }, [currentTheme]);

  useEffect(() => {
    if (location) {
      setCenter({ lat: location.lat, lng: location.lng });
    }
  }, [location]);

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    const getToken = async () => {
      try {
        const accessToken = await getAccessTokenSilently();
        setToken({ accessToken, refreshToken: "", expiresIn: 3600 });
        checkPinsHealth();
      } catch (error) {
        console.error("Failed to get token:", error);
      }
    };

    getToken();
  }, [isAuthenticated, getAccessTokenSilently]);

  useEffect(() => {
    if (!token) {
      return;
    }

    const refreshPins = async () => {
      try {
        const minLat = center.lat - 0.05;
        const maxLat = center.lat + 0.05;
        const minLng = center.lng - 0.05;
        const maxLng = center.lng + 0.05;
        const bboxString = `${minLat},${minLng},${maxLat},${maxLng}`;
        const fetchedPins = await fetchMapPins(token.accessToken, bboxString);
        setPins(fetchedPins);
      } catch (error) {
        console.error("Failed to fetch pins:", error);
      }
    };

    refreshPins();
  }, [center, token]);

  const handleCreatePin = async (form: PinForm) => {
    if (!token) {
      return;
    }

    try {
      await createPin(token.accessToken, form, center);
      const minLat = center.lat - 0.05;
      const maxLat = center.lat + 0.05;
      const minLng = center.lng - 0.05;
      const maxLng = center.lng + 0.05;
      const bboxString = `${minLat},${minLng},${maxLat},${maxLng}`;
      const fetchedPins = await fetchMapPins(token.accessToken, bboxString);
      setPins(fetchedPins);
    } catch (error) {
      console.error("Failed to create pin:", error);
      throw error;
    }
  };

  const handleSignOut = () => {
    logout({
      logoutParams: {
        returnTo: window.location.origin
      }
    });
  };

  const handleThemeChange = (themeId: string) => {
    if (themeId === "auto") {
      setOverride(null);
      return;
    }
    setOverride(themeId as CityTheme);
  };

  if (isLoading) {
    return (
      <div className="app-loading">
        <div className="spinner-large" />
        <p>Loading Brooks...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <AuthGate
        isLoading={isLoading}
        error={authError?.message ?? null}
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
      <div className="app-loading">
        <div className="spinner-large" />
        <p>Securing your session...</p>
      </div>
    );
  }

  return (
    <div className="app-redesigned">
      <TopBar
        onMenuClick={() => setIsDrawerOpen(true)}
        userName={user?.name}
        userEmail={user?.email}
        onSignOut={handleSignOut}
        currentTheme={currentTheme}
      />

      <main className="map-container">
        <MapView
          provider={mapProvider}
          center={center}
          pins={showPins ? pins : []}
          onHoldStart={(coords, x, y) => {
            ringCompletedRef.current = false;
            setChargeTarget({ coords, x, y });
          }}
          onHoldEnd={() => {
            if (!ringCompletedRef.current) {
              setChargeTarget(null);
            }
          }}
        />
      </main>

      <FAB onClick={() => setIsModalOpen(true)} />

      <button
        className={`pins-toggle${showPins ? "" : " pins-off"}`}
        onClick={() => setShowPins(v => !v)}
        title={showPins ? "Hide pins" : "Show pins"}
        aria-pressed={showPins}
      >
        {showPins ? (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        ) : (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
            <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
            <line x1="1" y1="1" x2="23" y2="23" />
          </svg>
        )}
        <span>{showPins ? "Pins" : "Hidden"}</span>
      </button>

      {chargeTarget && (
        <MapChargeRing
          x={chargeTarget.x}
          y={chargeTarget.y}
          active={!!chargeTarget}
          onComplete={() => {
            ringCompletedRef.current = true;
            const coords = chargeTarget.coords;
            setChargeTarget(null);
            setCenter(coords);
            setIsModalOpen(true);
          }}
          onCancel={() => {
            setChargeTarget(null);
          }}
        />
      )}

      <NavigationDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        currentTheme={currentTheme}
        onThemeChange={themeId => {
          handleThemeChange(themeId);
          setTimeout(() => setIsDrawerOpen(false), 220);
        }}
        currentMapProvider={mapProvider}
        onMapProviderChange={provider => {
          setMapProvider(provider);
          setTimeout(() => setIsDrawerOpen(false), 220);
        }}
        onSignOut={handleSignOut}
      />

      <PinCreationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreatePin}
        location={center}
      />
    </div>
  );
}
