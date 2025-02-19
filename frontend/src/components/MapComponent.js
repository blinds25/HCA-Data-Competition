// frontend/src/components/MapComponent.js

import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Custom icons
const redIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
  iconRetinaUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
  shadowSize: [41, 41],
});

const blueIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png',
  iconRetinaUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
  shadowSize: [41, 41],
});

// Helper component to update map view on center/zoom change.
function ChangeView({ center, zoom }) {
  const map = useMap();
  map.setView(center, zoom);
  return null;
}

function MapComponent({ data, zipCode, center, zoom }) {
  const mapCenter = center ? [center.lat, center.lon] : [39.8283, -98.5795];
  const mapZoom = zoom || 4;

  // Marker for entered zip code.
  const enteredZipMarker = (
    <Marker position={mapCenter} icon={redIcon}>
      <Popup>Entered Zip Code: {zipCode}</Popup>
    </Marker>
  );

  // Build unique markers for each nearby zip.
  const uniqueNearby = {};
  data.forEach(person => {
    if (person.zip_code !== zipCode && person.latitude && person.longitude) {
      if (!uniqueNearby[person.zip_code]) {
        uniqueNearby[person.zip_code] = {
          lat: parseFloat(person.latitude),
          lon: parseFloat(person.longitude),
        };
      }
    }
  });

  const uniqueMarkers = Object.entries(uniqueNearby).map(([zip, coords]) => (
    <Marker key={zip} position={[coords.lat, coords.lon]} icon={blueIcon}>
      <Popup>Nearby Zip: {zip}</Popup>
    </Marker>
  ));

  return (
    <MapContainer center={mapCenter} zoom={mapZoom} style={{ height: '400px', width: '100%' }}>
      <ChangeView center={mapCenter} zoom={mapZoom} />
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {enteredZipMarker}
      {uniqueMarkers}
    </MapContainer>
  );
}

export default MapComponent;
