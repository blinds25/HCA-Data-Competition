import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

function MapComponent({ data }) {
  const defaultPosition = [37.773972, -122.431297]; // Fallback position
  // Use the first available valid coordinate as center
  const center = data.find(person => person.latitude && person.longitude)
    ? [data.find(person => person.latitude && person.longitude).latitude,
       data.find(person => person.latitude && person.longitude).longitude]
    : defaultPosition;

  return (
    <MapContainer center={center} zoom={12} style={{ height: '300px', width: '100%' }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {data.map((person) => {
        if (person.latitude && person.longitude) {
          return (
            <Marker key={person.id} position={[person.latitude, person.longitude]}>
              <Popup>
                <strong>{person.first_name} {person.last_name}</strong><br />
                {person.email}<br />
                {person.phone}
              </Popup>
            </Marker>
          );
        }
        return null;
      })}
    </MapContainer>
  );
}

export default MapComponent;
