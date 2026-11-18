"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import YouTubeLite from "@/components/YouTubeLite";
import type { VideoMapPin } from "@/lib/placeVideos";

const DENVER: [number, number] = [39.7392, -104.9903];
const CLUSTER_PX = 44;

const PLAY_SVG =
  '<svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true"><path d="M8 5v14l11-7z" fill="currentColor"/></svg>';

function pinIcon(count: number, active: boolean): L.DivIcon {
  const badge = count > 1 ? `<span class="vm-badge">${count}</span>` : "";
  return L.divIcon({
    className: "",
    html: `<div class="vm-pin${active ? " vm-pin--active" : ""}">${PLAY_SVG}${badge}</div>`,
    iconSize: [34, 34],
    iconAnchor: [17, 17],
  });
}

function clusterIcon(count: number): L.DivIcon {
  return L.divIcon({
    className: "",
    html: `<div class="vm-cluster">${count}</div>`,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
  });
}

/**
 * Map of places Dave has filmed. One pin per place; pins that overlap at the
 * current zoom are grouped into a numbered cluster that zooms in on click.
 * Clicking a pin opens a panel with the place and its videos.
 */
export default function VideoMap({
  pins,
  center,
  zoom = 11,
  fitToPins = false,
}: {
  pins: VideoMapPin[];
  center?: [number, number];
  zoom?: number;
  fitToPins?: boolean;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const layerRef = useRef<L.LayerGroup | null>(null);
  const [selected, setSelected] = useState<VideoMapPin | null>(null);
  const selectedRef = useRef<string | null>(null);
  selectedRef.current = selected?.placeId ?? null;

  // Create the map once.
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    const map = L.map(containerRef.current, {
      center: center ?? DENVER,
      zoom,
      scrollWheelZoom: false,
      zoomControl: true,
    });
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(map);
    layerRef.current = L.layerGroup().addTo(map);
    mapRef.current = map;

    if (fitToPins && pins.length > 1) {
      map.fitBounds(L.latLngBounds(pins.map((p) => [p.lat, p.lng] as [number, number])), { padding: [40, 40], maxZoom: 15 });
    } else if (fitToPins && pins.length === 1) {
      map.setView([pins[0].lat, pins[0].lng], 15);
    }

    // Scroll-zoom only after the reader engages with the map, so the page still scrolls past it.
    map.once("focus", () => map.scrollWheelZoom.enable());
    map.on("click", () => map.scrollWheelZoom.enable());

    return () => {
      map.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // (Re)draw pins and clusters whenever the view or selection changes.
  useEffect(() => {
    const map = mapRef.current;
    const layer = layerRef.current;
    if (!map || !layer) return;

    const draw = () => {
      layer.clearLayers();
      const groups: { pins: VideoMapPin[]; x: number; y: number }[] = [];
      for (const pin of pins) {
        const pt = map.latLngToLayerPoint([pin.lat, pin.lng]);
        const g = groups.find((gr) => Math.abs(gr.x - pt.x) < CLUSTER_PX && Math.abs(gr.y - pt.y) < CLUSTER_PX);
        if (g) g.pins.push(pin);
        else groups.push({ pins: [pin], x: pt.x, y: pt.y });
      }

      for (const g of groups) {
        if (g.pins.length === 1 || map.getZoom() >= 17) {
          for (const pin of g.pins) {
            const marker = L.marker([pin.lat, pin.lng], {
              icon: pinIcon(pin.videos.length, selectedRef.current === pin.placeId),
              title: pin.name,
              keyboard: true,
            });
            marker.on("click", () => setSelected(pin));
            marker.addTo(layer);
          }
        } else {
          const bounds = L.latLngBounds(g.pins.map((p) => [p.lat, p.lng] as [number, number]));
          const marker = L.marker(bounds.getCenter(), {
            icon: clusterIcon(g.pins.length),
            title: `${g.pins.length} places`,
            keyboard: true,
          });
          marker.on("click", () => map.fitBounds(bounds, { padding: [60, 60], maxZoom: 17 }));
          marker.addTo(layer);
        }
      }
    };

    draw();
    map.on("zoomend", draw);
    return () => {
      map.off("zoomend", draw);
    };
  }, [pins, selected]);

  return (
    <div className="relative w-full h-full">
      <style>{`
        .vm-pin { position: relative; width: 34px; height: 34px; border-radius: 9999px; background: #fff; color: #111;
          border: 2px solid #111; display: flex; align-items: center; justify-content: center; padding-left: 2px;
          box-shadow: 0 2px 6px rgba(0,0,0,.3); cursor: pointer; transition: transform .12s; }
        .vm-pin:hover { transform: scale(1.1); }
        .vm-pin--active { background: var(--denver-amber); color: #fff; border-color: var(--denver-amber); transform: scale(1.15); }
        .vm-badge { position: absolute; top: -6px; right: -8px; min-width: 18px; height: 18px; padding: 0 4px;
          border-radius: 9999px; background: var(--denver-amber); color: #fff; font: 700 11px/18px system-ui, sans-serif;
          text-align: center; border: 2px solid #fff; }
        .vm-cluster { width: 40px; height: 40px; border-radius: 9999px; background: #111; color: #fff;
          font: 700 14px/40px system-ui, sans-serif; text-align: center; border: 3px solid #fff;
          box-shadow: 0 2px 8px rgba(0,0,0,.35); cursor: pointer; }
        .vm-tiles .leaflet-tile-pane { filter: grayscale(1) contrast(.95) brightness(1.04); }
      `}</style>

      <div ref={containerRef} className="vm-tiles w-full h-full" />

      {selected && (
        <aside
          className="absolute z-[1000] bg-white dark:bg-slate-900 shadow-xl overflow-y-auto
            inset-x-0 bottom-0 max-h-[70%] rounded-t-2xl
            sm:inset-x-auto sm:left-3 sm:top-3 sm:bottom-3 sm:max-h-none sm:w-80 sm:rounded-2xl"
          aria-label={selected.name}
        >
          <div className="p-4 space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-lg font-bold leading-tight">{selected.name}</h3>
                {selected.rating != null && (
                  <p className="text-sm text-slate-500">{selected.rating.toFixed(1)} ★ on Google</p>
                )}
              </div>
              <button
                type="button"
                onClick={() => setSelected(null)}
                aria-label="Close"
                className="shrink-0 w-8 h-8 rounded-full border border-slate-300 dark:border-slate-700 text-slate-600 hover:text-denver-amber"
              >
                ×
              </button>
            </div>

            <Link
              href={selected.href}
              className="flex items-center justify-center w-full bg-denver-amber text-white font-semibold py-2.5 rounded-sm hover:bg-[#8c2b17] transition-colors text-sm"
            >
              See the full page &rarr;
            </Link>

            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 pt-1">
              {selected.videos.length === 1 ? "My video" : `In ${selected.videos.length} of my videos`}
            </p>
            <ul className="space-y-4">
              {selected.videos.map((v) => (
                <li key={v.id} className="space-y-2">
                  <div
                    className={
                      v.isShort
                        ? "aspect-[9/16] w-full max-w-[200px] mx-auto rounded-lg overflow-hidden bg-black"
                        : "aspect-video w-full rounded-lg overflow-hidden bg-black"
                    }
                  >
                    <YouTubeLite key={v.id} videoId={v.id} title={v.title} />
                  </div>
                  <p className="text-sm font-medium leading-snug">{v.title}</p>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      )}
    </div>
  );
}
