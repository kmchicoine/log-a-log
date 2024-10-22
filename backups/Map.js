import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import axios from 'axios';

function Map() {
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    axios.get('/locations').then((response) => {
      setLocations(response.data);
    });
  }, []);

  const markerIcon = new L.Icon({
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  });

  return (
    <MapContainer center={[44.0, -121.0]} zoom={10} style={{ height: '400px', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />
      {locations.map((location) => (
        <Marker key={location.id} position={[location.lat, location.lng]} icon={markerIcon}>
          <Popup>
            {location.name} <br /> Rating: {location.rating}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}

export default Map;
