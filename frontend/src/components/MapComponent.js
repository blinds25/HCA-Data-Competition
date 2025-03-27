// frontend/src/components/MapComponent.js

import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for the Leaflet icon issue in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

// Custom marker icons for different types of facilities
const localFacilityIcon = new L.Icon({
  iconUrl:
    "https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const nearbyFacilityIcon = new L.Icon({
  iconUrl:
    "https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// ChangeView component to update map view when center/zoom props change
function ChangeView({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
}

function MapComponent({ data, zipCode, center, zoom }) {
  // If no data, show empty map centered on US
  if (!data || data.length === 0) {
    return (
      <MapContainer
        center={[center.lat, center.lon]}
        zoom={zoom}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
      </MapContainer>
    );
  }

  // Separate local and nearby facilities
  const localData = data.filter((facility) => facility.zip_code === zipCode);
  const nearbyData = data.filter((facility) => facility.zip_code !== zipCode);

  return (
    <MapContainer
      center={[center.lat, center.lon]}
      zoom={zoom}
      style={{ height: "100%", width: "100%" }}
    >
      {/* Use ChangeView to update map when center/zoom props change */}
      <ChangeView center={[center.lat, center.lon]} zoom={zoom} />

      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Map markers for local facilities with red icon */}
      {localData.map((facility, index) => (
        <Marker
          key={`local-${index}`}
          position={[
            parseFloat(facility.latitude) || center.lat,
            parseFloat(facility.longitude) || center.lon,
          ]}
          icon={localFacilityIcon}
        >
          <Popup>
            <div>
              <b>{facility.location || "Local Facility"}</b>
              <br />
              {facility.city}, {facility.state} {facility.zip_code}
              <br />
              <span style={{ color: "#FF6600", fontWeight: "bold" }}>
                Primary Facility (Entered ZIP Code)
              </span>
            </div>
          </Popup>
        </Marker>
      ))}

      {/* Map markers for nearby facilities with blue icon */}
      {nearbyData.map((facility, index) => (
        <Marker
          key={`nearby-${index}`}
          position={[
            parseFloat(facility.latitude) || center.lat,
            parseFloat(facility.longitude) || center.lon,
          ]}
          icon={nearbyFacilityIcon}
        >
          <Popup>
            <div>
              <b>{facility.location || "Nearby Facility"}</b>
              <br />
              {facility.city}, {facility.state} {facility.zip_code}
              <br />
              <span style={{ color: "#2196f3" }}>Nearby Facility</span>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}

export default MapComponent;
