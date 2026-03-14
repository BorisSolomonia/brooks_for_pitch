import { useEffect, useState } from "react";
import { CityResult } from "../lib/types";
import { env } from "../lib/env";

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
            `${env.reverseGeocodeUrl}?latitude=${lat}&longitude=${lng}&localityLanguage=en`
          );
          const data = await response.json();
          const city =
            data.city ||
            data.locality ||
            data.principalSubdivision;
          const country = data.countryName;
          setLocation({ city, country, lat, lng });
          setStatus("ready");
        } catch {
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

  return {
    status,
    error,
    location: location as CityResult | null,
  };
}
