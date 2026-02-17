import { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { TopBar } from "./components/TopBar";
import { FAB } from "./components/FAB";
import { NavigationDrawer } from "./components/NavigationDrawer";
import { PinCreationModal } from "./components/PinCreationModal";
import MapView from "./components/MapView";
import AuthGate from "./components/AuthGate";
import { useCityTheme } from "./hooks/useCityTheme";
import { CITY_THEMES, applyTheme } from "./lib/theme";
import { fetchMapPins, createPin } from "./lib/api";
import type { AuthTokens, Coordinates, MapPin, PinForm, CityTheme } from "./lib/types";
import "./styles/AppRedesigned.css";

function formatCoord(value: number) {
  return value.toFixed(4);
}

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

  const locationLabel = location?.city ? `${location.city}${location.country ? `, ${location.country}` : ""}` : "Locating city";

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
          pins={pins}
          onDoubleClick={coords => {
            setCenter(coords);
            setIsModalOpen(true);
          }}
        />
        <section className="map-hud" aria-live="polite">
          <p className="eyebrow">City signal</p>
          <h2>{CITY_THEMES[currentTheme].label}</h2>
          <p className="map-hud-location">{locationLabel}</p>
          <div className="map-hud-stats">
            <div className="hud-stat">
              <span className="hud-label">Center</span>
              <strong>
                {formatCoord(center.lat)}, {formatCoord(center.lng)}
              </strong>
            </div>
            <div className="hud-stat">
              <span className="hud-label">Pins</span>
              <strong>{pins.length}</strong>
            </div>
            <div className="hud-stat">
              <span className="hud-label">Map</span>
              <strong>{mapProvider === "leaflet" ? "Leaflet" : "Google"}</strong>
            </div>
          </div>
        </section>
      </main>

      <FAB onClick={() => setIsModalOpen(true)} />

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
