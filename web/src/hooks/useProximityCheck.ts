import { useCallback, useEffect, useRef, useState } from "react";
import { proximityCheck } from "../lib/api";
import { PROXIMITY_SETTINGS } from "../lib/frontendConfig";
import type { Coordinates, RevealedPin } from "../lib/types";

type UseProximityCheckOptions = {
  token: string | null;
  onPinsRevealed?: (pins: RevealedPin[]) => void;
};

export function useProximityCheck({ token, onPinsRevealed }: UseProximityCheckOptions) {
  const [revealedPins, setRevealedPins] = useState<RevealedPin[]>([]);
  const [isWatching, setIsWatching] = useState(false);
  const lastCheckRef = useRef(0);
  const watchIdRef = useRef<number | null>(null);
  const onPinsRevealedRef = useRef(onPinsRevealed);
  onPinsRevealedRef.current = onPinsRevealed;

  const checkProximity = useCallback(async (location: Coordinates) => {
    if (!token) return;

    const now = Date.now();
    if (now - lastCheckRef.current < PROXIMITY_SETTINGS.pollIntervalMs) return;
    lastCheckRef.current = now;

    try {
      const response = await proximityCheck(token, location);
      if (response.revealed.length > 0) {
        setRevealedPins(prev => [...prev, ...response.revealed]);
        onPinsRevealedRef.current?.(response.revealed);
      }
    } catch (error) {
      console.error("[ProximityCheck] failed:", error);
    }
  }, [token]);

  useEffect(() => {
    if (!token || !navigator.geolocation) return;

    setIsWatching(true);
    watchIdRef.current = navigator.geolocation.watchPosition(
      (position) => {
        checkProximity({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => {
        console.warn("[ProximityCheck] geolocation error:", error.message);
      },
      {
        enableHighAccuracy: true,
        maximumAge: PROXIMITY_SETTINGS.pollIntervalMs,
        timeout: PROXIMITY_SETTINGS.geolocationTimeoutMs,
      }
    );

    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
      setIsWatching(false);
    };
  }, [token, checkProximity]);

  return { revealedPins, isWatching };
}
