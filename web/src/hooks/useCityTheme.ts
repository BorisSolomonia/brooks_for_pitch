import { useEffect, useMemo, useState } from "react";
import { CityResult } from "../lib/types";
import { CityTheme, resolveTheme } from "../lib/theme";

const rawNominatimUrl =
  import.meta.env.VITE_NOMINATIM_URL || "https://nominatim.openstreetmap.org";
const NOMINATIM_URL = rawNominatimUrl.endsWith("/reverse")
  ? rawNominatimUrl
  : `${rawNominatimUrl.replace(/\/$/, "")}/reverse`;

type ThemeState = {
  city?: string;
  country?: string;
  lat: number;
  lng: number;
};

type ThemeStatus = "idle" | "locating" | "ready" | "error";

export function useCityTheme() {
  const [status, setStatus] = useState<ThemeStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [location, setLocation] = useState<ThemeState | null>(null);
  const [override, setOverride] = useState<CityTheme | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setStatus("error");
      setError("Geolocation is not supported in this browser.");
      return;
    }

    setStatus("locating");
    navigator.geolocation.getCurrentPosition(
      async position => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        try {
          const response = await fetch(
            `${NOMINATIM_URL}?format=jsonv2&lat=${lat}&lon=${lng}`
          );
          const data = await response.json();
          const address = data?.address ?? {};
          const city =
            address.city ||
            address.town ||
            address.village ||
            address.county ||
            address.state;
          const country = address.country;
          setLocation({ city, country, lat, lng });
          setStatus("ready");
        } catch (err) {
          setLocation({ lat, lng });
          setStatus("ready");
        }
      },
      failure => {
        setStatus("error");
        setError(failure.message);
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  }, []);

  const theme = useMemo<CityTheme>(() => {
    if (override) {
      return override;
    }
    return resolveTheme(location?.city);
  }, [location?.city, override]);

  return {
    status,
    error,
    location: location as CityResult | null,
    theme,
    setOverride,
    override
  };
}
