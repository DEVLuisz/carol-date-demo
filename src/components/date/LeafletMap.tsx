import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { DATE_SPOTS, type DateSpot } from "./spots";

interface LeafletMapProps {
  selected: DateSpot | null;
  onSelect: (spot: DateSpot) => void;
}

function pinHtml(spot: DateSpot, active: boolean) {
  return `<div class="sp-pin${active ? " sp-pin-active" : ""}"><span>${spot.emoji}</span></div>`;
}

export default function LeafletMap({ selected, onSelect }: LeafletMapProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<Record<string, L.Marker>>({});
  const onSelectRef = useRef(onSelect);
  onSelectRef.current = onSelect;

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      center: [-23.5735, -46.6685],
      zoom: 12,
      scrollWheelZoom: false,
      zoomControl: true,
      attributionControl: true,
    });
    mapRef.current = map;

    L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
      attribution: '&copy; OpenStreetMap &copy; CARTO',
      maxZoom: 19,
      subdomains: "abcd",
    }).addTo(map);

    DATE_SPOTS.forEach((spot) => {
      const marker = L.marker([spot.lat, spot.lng], {
        title: `${spot.name} — ${spot.area}`,
        icon: L.divIcon({
          className: "sp-pin-wrap",
          html: pinHtml(spot, false),
          iconSize: [38, 38],
          iconAnchor: [19, 38],
          popupAnchor: [0, -36],
        }),
      })
        .addTo(map)
        .bindPopup(`<strong>${spot.name}</strong><br/>${spot.area}<br/><em>${spot.vibe}</em>`);

      marker.on("click", () => onSelectRef.current(spot));
      markersRef.current[spot.id] = marker;
    });

    return () => {
      map.remove();
      mapRef.current = null;
      markersRef.current = {};
    };
  }, []);

  useEffect(() => {
    DATE_SPOTS.forEach((spot) => {
      const marker = markersRef.current[spot.id];
      if (!marker) return;
      const active = selected?.id === spot.id;
      marker.setIcon(
        L.divIcon({
          className: "sp-pin-wrap",
          html: pinHtml(spot, active),
          iconSize: [38, 38],
          iconAnchor: [19, 38],
          popupAnchor: [0, -36],
        }),
      );
      marker.setZIndexOffset(active ? 1000 : 0);
    });

    if (selected && mapRef.current) {
      mapRef.current.flyTo([selected.lat, selected.lng], 14, { duration: 0.9 });
      markersRef.current[selected.id]?.openPopup();
    }
  }, [selected]);

  return <div ref={containerRef} className="h-full w-full" />;
}
