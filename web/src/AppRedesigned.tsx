import { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { TopBar } from './components/TopBar';
import { FAB } from './components/FAB';
import { NavigationDrawer } from './components/NavigationDrawer';
import { PinCreationModal } from './components/PinCreationModal';
import MapView from './components/MapView';
import AuthGate from './components/AuthGate';
import { useCityTheme } from './hooks/useCityTheme';
import { fetchMapPins, createPin } from './lib/api';
import { applyTheme } from './lib/theme';
import type { AuthTokens, Coordinates, MapPin, PinForm, CityTheme } from './lib/types';
import './styles/AppRedesigned.css';

export default function AppRedesigned() {
  const {
    isLoading,
    isAuthenticated,
    logout,
    user,
    getAccessTokenSilently,
    loginWithRedirect,
    error: authError,
  } = useAuth0();
  const [token, setToken] = useState<AuthTokens | null>(null);
  const defaultCenterLat = Number(import.meta.env.VITE_DEFAULT_CENTER_LAT);
  const defaultCenterLng = Number(import.meta.env.VITE_DEFAULT_CENTER_LNG);
  if (Number.isNaN(defaultCenterLat) || Number.isNaN(defaultCenterLng)) {
    throw new Error('VITE_DEFAULT_CENTER_LAT and VITE_DEFAULT_CENTER_LNG are required');
  }
  const [center, setCenter] = useState<Coordinates>({ lat: defaultCenterLat, lng: defaultCenterLng });
  const [pins, setPins] = useState<MapPin[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const mapProvider = import.meta.env.VITE_MAP_PROVIDER as 'leaflet' | 'google' | undefined;
  if (!mapProvider) {
    throw new Error('VITE_MAP_PROVIDER is required');
  }

  const { location, theme, setOverride, override } = useCityTheme();
  const currentTheme = (override || theme || 'default') as CityTheme;

  useEffect(() => {
    applyTheme(currentTheme);
  }, [currentTheme]);

  // Update center when location is detected
  useEffect(() => {
    if (location) {
      setCenter({ lat: location.lat, lng: location.lng });
    }
  }, [location]);

  // Get auth token
  useEffect(() => {
    if (!isAuthenticated) return;

    const getToken = async () => {
      try {
        const accessToken = await getAccessTokenSilently();
        setToken({ accessToken, refreshToken: '', expiresIn: 3600 });
      } catch (error) {
        console.error('Failed to get token:', error);
      }
    };

    getToken();
  }, [isAuthenticated, getAccessTokenSilently]);

  // Fetch pins when center changes
  useEffect(() => {
    if (!token) return;

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
        console.error('Failed to fetch pins:', error);
      }
    };

    refreshPins();
  }, [center, token]);

  const handleCreatePin = async (form: PinForm) => {
    if (!token) return;

    try {
      await createPin(token.accessToken, form, center);
      // Refresh pins
      const minLat = center.lat - 0.05;
      const maxLat = center.lat + 0.05;
      const minLng = center.lng - 0.05;
      const maxLng = center.lng + 0.05;
      const bboxString = `${minLat},${minLng},${maxLat},${maxLng}`;
      const fetchedPins = await fetchMapPins(token.accessToken, bboxString);
      setPins(fetchedPins);
    } catch (error) {
      console.error('Failed to create pin:', error);
      throw error;
    }
  };

  const handleSignOut = () => {
    logout({
      logoutParams: {
        returnTo: window.location.origin,
      },
    });
  };

  const handleThemeChange = (themeId: string) => {
    if (themeId === 'auto') {
      setOverride(null);
    } else {
      setOverride(themeId as CityTheme);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="app-loading">
        <div className="spinner-large" />
        <p>Loading Brooks...</p>
      </div>
    );
  }

  // Not authenticated
  if (!isAuthenticated) {
    return (
      <AuthGate
        isLoading={isLoading}
        error={authError?.message ?? null}
        onLogin={() => loginWithRedirect()}
        onRegister={() =>
          loginWithRedirect({
            authorizationParams: {
              screen_hint: 'signup',
            },
          })
        }
      />
    );
  }

  // Authenticated but no token yet
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
          pins={pins}
        />
      </main>

      <FAB onClick={() => setIsModalOpen(true)} />

      <NavigationDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        currentTheme={currentTheme}
        onThemeChange={handleThemeChange}
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
