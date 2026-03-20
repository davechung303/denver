"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix Leaflet default icon paths broken by webpack/Next.js bundling
const icon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const amberIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
  className: "hue-rotate-[30deg] saturate-200",
});

interface PlacePin {
  name: string;
  lat: number;
  lng: number;
  slug: string;
  rating?: number | null;
}

interface Props {
  centerLat: number;
  centerLng: number;
  neighborhoodSlug: string;
  categorySlug: string;
  places: PlacePin[];
}

export default function NeighborhoodMap({
  centerLat,
  centerLng,
  neighborhoodSlug,
  categorySlug,
  places,
}: Props) {
  return (
    <MapContainer
      center={[centerLat, centerLng]}
      zoom={14}
      style={{ height: "100%", width: "100%" }}
      scrollWheelZoom={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {places.map((place) => (
        <Marker key={place.slug} position={[place.lat, place.lng]} icon={amberIcon}>
          <Popup>
            <div className="text-sm">
              <p className="font-semibold">{place.name}</p>
              {place.rating && <p className="text-slate-500">{place.rating.toFixed(1)} ★</p>}
              <a
                href={`/denver/${neighborhoodSlug}/${categorySlug}/${place.slug}`}
                className="text-amber-600 font-medium"
              >
                View details →
              </a>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
