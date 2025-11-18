"use client";

import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import { useEffect, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { renderToString } from "react-dom/server";
import {
  Trash2,
  TrafficCone,
  LightbulbOff,
  Droplet,
  AlertTriangle,
  Car,
  CloudRain,
  Dog,
  ShieldAlert,
  MoreHorizontal,
} from "lucide-react";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

export default function MapViewClient({ onLocationSelect, issues = [] }) {
  const [isMobile, setIsMobile] = useState(false);
  const [categoryIcons, setCategoryIcons] = useState({});
  
  useEffect(() => {
    if (typeof window === "undefined") return;

    const makeCircleIcon = (svg, bgColor) =>
      L.divIcon({
        html: `
          <div style="
            width: 45px;
            height: 45px;
            border-radius: 50%;
            background: ${bgColor};
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 0 8px rgba(0,0,0,0.3);
            border: 2px solid white;
          ">
            ${svg}
          </div>
        `,
        className: "",
        iconSize: [45, 45],
        iconAnchor: [22.5, 45],
      });

    const icons = {
      "Garbage Dump": makeCircleIcon(renderToString(<Trash2 size={20} color="white" />), "rgba(34,197,94,0.9)"),
      "Pothole / Damaged Road": makeCircleIcon(renderToString(<TrafficCone size={20} color="white" />), "rgba(234,179,8,0.9)"),
      "Electricity Problem": makeCircleIcon(renderToString(<LightbulbOff size={20} color="white" />), "rgba(249,115,22,0.9)"),
      "Water Leakage": makeCircleIcon(renderToString(<Droplet size={20} color="white" />), "rgba(59,130,246,0.9)"),
      "Broken Drain / Sewer": makeCircleIcon(renderToString(<AlertTriangle size={20} color="white" />), "rgba(239,68,68,0.9)"),
      "Illegal Parking": makeCircleIcon(renderToString(<Car size={20} color="white" />), "rgba(107,114,128,0.9)"),
      "Flooding / Waterlogging": makeCircleIcon(renderToString(<CloudRain size={20} color="white" />), "rgba(56,189,248,0.9)"),
      "Animal Menace / Stray Dogs": makeCircleIcon(renderToString(<Dog size={20} color="white" />), "rgba(217,119,6,0.9)"),
      "Health / Sanitation Hazard": makeCircleIcon(renderToString(<ShieldAlert size={20} color="white" />), "rgba(244,63,94,0.9)"),
      "Other": makeCircleIcon(renderToString(<MoreHorizontal size={20} color="white" />), "rgba(156,163,175,0.9)"),
    };

    setCategoryIcons(icons);
  }, []);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerHeight < 650);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const center = [28.4728, 77.1322];
  const bounds = [
    [28.4728 - 0.045, 77.1322 - 0.045],
    [28.4728 + 0.045, 77.1322 + 0.045],
  ];

  const [position, setPosition] = useState(null);

  const LocationMarker = () => {
    useMapEvents({
      click(e) {
        const lat = Math.min(Math.max(e.latlng.lat, bounds[0][0]), bounds[1][0]);
        const lng = Math.min(Math.max(e.latlng.lng, bounds[0][1]), bounds[1][1]);
        setPosition([lat, lng]);
        onLocationSelect?.(lat, lng);
      },
    });
    if (!position) return null;
    return (
      <Marker position={position}>
        <Popup>
          📍 Lat: {position[0].toFixed(4)}, Lng: {position[1].toFixed(4)}
        </Popup>
      </Marker>
    );
  };

  if (!Object.keys(categoryIcons).length) {
    return (
      <div className="flex items-center justify-center h-[400px] text-gray-500">
        Loading map...
      </div>
    );
  }

  return (
    <div className="w-full h-full">
      <MapContainer
      className="h-[90%] md:h-full w-full rounded-xl shadow-lg"
        center={center}
        maxBounds={bounds}
        zoom={15}
        minZoom={14}
        maxZoom={18}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />

        {issues.map((i, ind) => {
          const icon = categoryIcons[i.category] || categoryIcons["Other"];
          return (
            <Marker
              key={ind}
              position={[Number(i.location.latitude), Number(i.location.longitude)]}
              icon={icon}
              className='text-sm'
            >
              <Popup>
                <strong className="capitalize">{i.title}</strong>
                <br />
                {i.category}
                <br />
                📍 {i.location.latitude.toFixed(4)}, {i.location.longitude.toFixed(4)}
                <br />
                Status: {i.Status}
              </Popup>
            </Marker>
          );
        })}

        <LocationMarker />
      </MapContainer>
    </div>
  );
}
