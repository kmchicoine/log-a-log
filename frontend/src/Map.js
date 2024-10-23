import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvent } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const MapComponent = () => {
    const [locations, setLocations] = useState([]);
    const [newMarker, setNewMarker] = useState(null);

    //get locations from backend
    const fetchLocations = async () => {
        try {
            const response = await fetch('/api/locations');
            if (!response.ok) {
                throw new Error('Fetch locations failed; response not ok.');
            }
            const data = await response.json();
            setLocations(data);
        } catch (error) {
            console.error('Error fetching locations:', error);
        }
    };

    //useEffect to load locations from backend
    useEffect(() => {
        fetchLocations();
    }, []);

    //add new location with map click
    const handleMapClick = async (e) => {
        console.log('Map click registered at:',  e);
        const { lat, lng } = e.latlng;
        const newLocation = { lat, lng }; //can add more fields here

        setNewMarker(e.latlng);

        try {
            const response = await fetch('/api/locations', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newLocation),
            });
            if (!response.ok) {
                throw new Error('Failed to add location.');
            }
            const savedLocation = await response.json();
            setLocations((prevLocations) => [...prevLocations, savedLocation]);
        } catch (error) {
            console.error('Error adding location:', error);
        }
    };

    const MapClickHandler = () => {
        useMapEvent('click', handleMapClick);
        return null;
    };

    // Set custom marker icon 
    const customIcon = new L.Icon({
        iconUrl: require('leaflet/dist/images/marker-icon.png'),
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
        shadowSize: [41, 41],
    });

    return (
        <MapContainer
        center={[44.0582, -121.3153]} // Default center (Bend, OR)
        zoom={13}
        style={{ height: '100vh', width: '100%' }}
        >
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {/* Handle map clicks */}
            <MapClickHandler />
            {locations.map((location) => (
                <Marker
                    key={location.id}
                    position={[location.lat, location.lng]}
                    icon={customIcon}
                    
                >
                    <Popup autoClose={true} closeOnClick={true} >
                        {/* Add any extra information about the location */}
                        <p>Location ID: {location.id}</p>
                        <p>Coordinates: {location.lat}, {location.lng}</p>
                    </Popup>
                </Marker>
            ))}
            {newMarker && (
                <Marker
                    position={[newMarker.lat, newMarker.lng]}
                    icon={customIcon}
                >
                    <Popup>
                        New location being added...
                    </Popup>
                </Marker>
            )}
        </MapContainer>
    );
};


export default MapComponent