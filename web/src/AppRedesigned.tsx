import { lazy, Suspense, useState, useEffect, useRef } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { AnimatePresence, motion } from "framer-motion";
import { TopBar } from "./components/TopBar";
import { FAB } from "./components/FAB";
import { NavigationDrawer } from "./components/NavigationDrawer";
import { PinCreationModal } from "./components/PinCreationModal";
import { PinDetailModal } from "./components/PinDetailModal";
import { MapChargeRing } from "./components/MapChargeRing";
import { SketchOverlay } from "./components/SketchOverlay";
import { GrainOverlay } from "./components/GrainOverlay";
import AuthGate from "./components/AuthGate";
import { useCityTheme } from "./hooks/useCityTheme";
import { env } from "./lib/env";
import { buildActiveBbox, type MapProvider } from "./lib/frontendConfig";
import { applyTheme } from "./lib/theme";
import { getDefaultFontId, applyFont } from "./lib/fonts";
import type { FontSlot } from "./lib/fonts";
import { fetchMapPins, createPin, checkPinsHealth } from "./lib/api";
import type { AuthTokens, Coordinates, MapPin, PinForm, PinViewScope } from "./lib/types";
import "./styles/AppRedesigned.css";

const MapView = lazy(() => import("./components/MapView"));
const FontSelector = lazy(() =>
  import("./components/FontSelector").then(module => ({ default: module.FontSelector }))
);

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
  const [center, setCenter] = useState<Coordinates>({ lat: env.defaultCenterLat, lng: env.defaultCenterLng });
  const [pins, setPins] = useState<MapPin[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [chargeTarget, setChargeTarget] = useState<{ coords: Coordinates; x: number; y: number } | null>(null);
  const ringCompletedRef = useRef(false);
  const [showPins, setShowPins] = useState(true);
  const [selectedPin, setSelectedPin] = useState<MapPin | null>(null);
  const [pinViewScope, setPinViewScope] = useState<PinViewScope>("home");

  const [fontSelections, setFontSelections] = useState<Record<FontSlot, string>>({
    display: getDefaultFontId("display"),
    body: getDefaultFontId("body"),
    mono: getDefaultFontId("mono"),
  });

  const [mapProvider, setMapProvider] = useState<MapProvider>(env.mapProvider);
  const { location } = useCityTheme();

  useEffect(() => {
    applyTheme("default");
  }, []);

  useEffect(() => {
    applyFont("display", fontSelections.display);
    applyFont("body", fontSelections.body);
    applyFont("mono", fontSelections.mono);
  }, [fontSelections]);

  const handleFontChange = (slot: FontSlot, fontId: string) => {
    setFontSelections(prev => ({ ...prev, [slot]: fontId }));
  };

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
        const fetchedPins = await fetchMapPins(token.accessToken, buildActiveBbox(center), pinViewScope);
        setPins(fetchedPins);
      } catch (error) {
        console.error("Failed to fetch pins:", error);
      }
    };

    refreshPins();
  }, [center, pinViewScope, token]);

  const handleCreatePin = async (form: PinForm) => {
    if (!token) {
      return;
    }

    try {
      await createPin(token.accessToken, form, center);
      const fetchedPins = await fetchMapPins(token.accessToken, buildActiveBbox(center), pinViewScope);
      setPins(fetchedPins);
    } catch (error) {
      console.error("Failed to create pin:", error);
      throw error;
    }
  };

  const handlePinViewChange = (scope: PinViewScope) => {
    setPinViewScope(scope);
    setIsDrawerOpen(false);
    setSelectedPin(null);
  };

  const handleSignOut = () => {
    logout({
      logoutParams: {
        returnTo: window.location.origin
      }
    });
  };

  const cityLabel = location?.city ?? "Your city";
  const countryLabel = location?.country ?? "Nearby";
  const pinViewLabel = pinViewScope === "home"
    ? "Home"
    : pinViewScope === "mine"
      ? "My pins"
      : "Friends";

  if (isLoading) {
    return (
      <motion.div
        className="app-loading"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="spinner-large" />
        <p>Loading Brooks...</p>
      </motion.div>
    );
  }

  if (!isAuthenticated) {
    return (
      <>
        <GrainOverlay />
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
      </>
    );
  }

  if (!token) {
    return (
      <motion.div
        className="app-loading"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <div className="spinner-large" />
        <p>Securing your session...</p>
      </motion.div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <div className="app-redesigned">
        <GrainOverlay />
        <SketchOverlay />
        <TopBar
          onMenuClick={() => setIsDrawerOpen(true)}
          userName={user?.name}
          userEmail={user?.email}
          onSignOut={handleSignOut}
        />

        <main className="map-container">
          <Suspense
            fallback={
              <div className="map-google-fallback">
                <p>Loading map surface...</p>
                <p>The atlas is assembling your city view.</p>
              </div>
            }
          >
            <MapView
              provider={mapProvider}
              center={center}
              pins={showPins ? pins : []}
              onPinClick={pin => setSelectedPin(pin)}
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
          </Suspense>
        </main>

        <section className="hero-shell">
          <motion.div
            className="hero-panel"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
          >
            <div className="hero-copy">
              <p className="hero-kicker">BROOKS</p>
              <h1 className="hero-title">
                Leave a memory in {cityLabel}.
              </h1>
              <p className="hero-lead">
                Pin a memory anywhere on the map. Choose who discovers it and when.
              </p>
            </div>

            <div className="hero-actions">
              <button
                type="button"
                className="hero-cta"
                onClick={() => setIsModalOpen(true)}
              >
                Leave a memory
              </button>
              <p className="hero-caption">
                Hold anywhere on the map or tap the button to start.
              </p>
            </div>

            <div className="hero-meta" aria-label="Atlas summary">
              <div className="hero-chip">
                <span className="hero-chip-label">City</span>
                <strong>{cityLabel}</strong>
              </div>
              <div className="hero-chip">
                <span className="hero-chip-label">Region</span>
                <strong>{countryLabel}</strong>
              </div>
              <div className="hero-chip">
                <span className="hero-chip-label">Pins</span>
                <strong>{pins.length}</strong>
              </div>
              <div className="hero-chip">
                <span className="hero-chip-label">View</span>
                <strong>{pinViewLabel}</strong>
              </div>
              <div className="hero-chip">
                <span className="hero-chip-label">Map</span>
                <strong>{mapProvider === "google" ? "Google" : "Leaflet"}</strong>
              </div>
            </div>
          </motion.div>
        </section>

        <FAB onClick={() => setIsModalOpen(true)} />

        <div className="bottom-action-bar">
          <button type="button" className="bottom-bar-primary" onClick={() => setIsModalOpen(true)}>
            Leave Memory
          </button>
          <button type="button" className="bottom-bar-outline" onClick={() => setIsDrawerOpen(true)}>
            Explore
          </button>
        </div>

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
          currentMapProvider={mapProvider}
          onMapProviderChange={provider => {
            setMapProvider(provider);
            setTimeout(() => setIsDrawerOpen(false), 220);
          }}
          currentPinView={pinViewScope}
          onPinViewChange={handlePinViewChange}
          onSignOut={handleSignOut}
        />

        <PinCreationModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleCreatePin}
          location={center}
        />

        <PinDetailModal
          pin={selectedPin}
          onClose={() => setSelectedPin(null)}
        />

        <Suspense fallback={null}>
          <FontSelector
            selections={fontSelections}
            onChange={handleFontChange}
          />
        </Suspense>
      </div>
    </AnimatePresence>
  );
}
