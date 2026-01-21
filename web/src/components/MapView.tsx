import { useEffect, useMemo, useRef } from "react";
import { MapContainer, Marker, TileLayer, useMap } from "react-leaflet";
import type { Coordinates, MapPin } from "../lib/types";
import { Loader } from "@googlemaps/js-api-loader";
import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

type MapProvider = "leaflet" | "google";

type MapViewProps = {
  provider: MapProvider;
  center: Coordinates;
  pins: MapPin[];
};

const GOOGLE_MAPS_KEY = import.meta.env.VITE_GOOGLE_MAPS_KEY || "";

delete (L.Icon.Default.prototype as { _getIconUrl?: string })._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow
});

function Recenter({ center }: { center: Coordinates }) {
  const map = useMap();
  useEffect(() => {
    map.setView([center.lat, center.lng]);
  }, [center, map]);
  return null;
}

function LeafletMap({ center, pins }: { center: Coordinates; pins: MapPin[] }) {
  return (
    <MapContainer
      center={[center.lat, center.lng]}
      zoom={13}
      scrollWheelZoom={false}
      className="map-canvas"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Recenter center={center} />
      {pins.map(pin => (
        <Marker key={pin.id} position={[pin.location.lat, pin.location.lng]} />
      ))}
    </MapContainer>
  );
}

function GoogleMap({ center, pins }: { center: Coordinates; pins: MapPin[] }) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const loader = useMemo(() => new Loader({ apiKey: GOOGLE_MAPS_KEY }), []);

  useEffect(() => {
    if (!GOOGLE_MAPS_KEY || !containerRef.current || mapRef.current) {
      return;
    }
    loader.load().then(() => {
      mapRef.current = new google.maps.Map(containerRef.current as HTMLElement, {
        center: { lat: center.lat, lng: center.lng },
        zoom: 13,
        disableDefaultUI: true,
        clickableIcons: false
      });
    });
  }, [center.lat, center.lng, loader]);

  useEffect(() => {
    if (!mapRef.current) {
      return;
    }
    mapRef.current.setCenter({ lat: center.lat, lng: center.lng });
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = pins.map(
      pin =>
        new google.maps.Marker({
          position: { lat: pin.location.lat, lng: pin.location.lng },
          map: mapRef.current
        })
    );
  }, [center, pins]);

  if (!GOOGLE_MAPS_KEY) {
    return (
      <div className="map-google-fallback">
        <p>Google Maps is not configured.</p>
        <p>Add <span className="mono">VITE_GOOGLE_MAPS_KEY</span> to enable it.</p>
      </div>
    );
  }

  return <div ref={containerRef} className="map-canvas" />;
}

export default function MapView({ provider, center, pins }: MapViewProps) {
  if (provider === "google") {
    return <GoogleMap center={center} pins={pins} />;
  }
  return <LeafletMap center={center} pins={pins} />;
}
