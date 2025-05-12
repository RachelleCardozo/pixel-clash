"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export default function MapView({ tournaments }: { tournaments: any[] }) {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (mapRef.current && tournaments.length > 0) {
      const map = L.map(mapRef.current).setView([51.5246, -0.1340], 15);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
      }).addTo(map);

      // custom joystick icon
      const customIcon = new L.Icon({
        iconUrl: "/marker.png",
        iconSize: [40, 40],
        iconAnchor: [20, 40],
        popupAnchor: [0, -40],
      });

      const addedMarkers = new Set<string>();
      const markers: L.Marker[] = []; // Save all markers in an array

      tournaments.forEach((tournament) => {
        if (tournament.locationLat && tournament.locationLng) {
          let lat = tournament.locationLat;
          let lng = tournament.locationLng;

          const key = `${lat}_${lng}`;

          if (addedMarkers.has(key)) {
            lat = lat + (Math.random() * 0.0002 - 0.0001);
            lng = lng + (Math.random() * 0.0002 - 0.0001);
          }

          addedMarkers.add(`${lat}_${lng}`);

          const marker = L.marker([lat, lng], { icon: customIcon }).addTo(map);

          marker.bindPopup(`
            <div style="
              background-color: #1f2937;
              color: white;
              padding: 12px;
              border-radius: 8px;
              box-shadow: 0 2px 8px rgba(0,0,0,0.3);
              text-align: center;
              font-family: 'Poppins', sans-serif;
              font-size: 14px;
            ">
              <b style="font-size:16px;">${tournament.title}</b><br/>
              ${tournament.location}<br/>
              ${new Date(tournament.date).toLocaleDateString()}<br/>
              <a href="/events/${tournament.id}" style="color: #38bdf8; text-decoration: underline; font-weight: bold; display: inline-block; margin-top: 8px;">
                View Details
              </a>
            </div>
          `);

          markers.push(marker);

          // Simulate a bounce effect
          marker.openPopup();
          setTimeout(() => {
            marker.closePopup();
          }, 800);
        }
      });

      // If only 1 tournament found, zoom and open its popup
      if (markers.length === 1) {
        map.setView(markers[0].getLatLng(), 18); // Zoom in closer
        markers[0].openPopup(); // Open its popup
      }

      return () => {
        map.remove();
      };
    }
  }, [tournaments]);

  return <div ref={mapRef} className="w-full h-[600px] rounded shadow"></div>;
}
