import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvent } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import Modal from 'react-modal';
import StarRatings from 'react-star-ratings';
import './App.css'

const MapComponent = () => {
    const [locations, setLocations] = useState([]);
    const [newMarker, setNewMarker] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [newLocationDetails, setNewLocationDetails] = useState({ name: '', rating: 0 });
    const [addingLocation, setAddingLocation] = useState(false);

    // Set the app element for react-modal (for accessibility)
    // useEffect(() => {
    //     Modal.setAppElement('#root'); // Assuming your root element is <div id="root">
    // }, []);

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
        if (!addingLocation) {
            return;
        }
        console.log('Map click registered at:', e);
        const { lat, lng } = e.latlng;

        setNewMarker({ lat, lng });
        setModalOpen(true);
        setAddingLocation(false);
    };

    const handleSubmitLocation = async () => {
        const { name, rating } = newLocationDetails;
        //TODO: make locations.length a get call
        const locationTitle = name || 'Location ${locations.length + 1}';
        const newLocation = { lat: newMarker.lat, lng: newMarker.lng, title: locationTitle, rating };

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
            setModalOpen(false);
        } catch (error) {
            console.error('Error adding location:', error);
        }
    };

    const MapClickHandler = () => {
        useMapEvent('click', handleMapClick);
        return null;
    };

    const handleNewLocation = () => {
        setAddingLocation(true);
    }

    const handleNameChange = (e) => {
        setNewLocationDetails((prevDetails) => ({ ...prevDetails, name: e.target.value }));
    }

    const handleRatingChange = (newRating) => {
        setNewLocationDetails((prevDetails) => ({ ...prevDetails, rating: newRating }));
    }

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
        <div>
            <header className="header">
                <button onClick={handleNewLocation}>Add new location</button>
            </header>
            {/* Modal for adding new location */}
            <Modal
                isOpen={modalOpen}
                onRequestClose={() => setModalOpen(false)}
                contentLabel="Create new location"
                style={{
                    content: {
                        zIndex: 1000,  // Make sure this is higher than the map's z-index
                        position: 'relative',  // Keep modal in relative position
                        top: '50%',
                        // left: '50%',
                        // right: 'auto',
                        // bottom: 'auto',
                        // marginRight: '-50%',
                        // transform: 'translate(-50%, -50%)',
                    },
                    overlay: {
                        zIndex: 1000,  // Also set z-index for the overlay
                    }
                }}
            >
                <h2>Adding new location</h2>
                <label>
                    Name:
                    <input
                        type="text"
                        value={newLocationDetails.name}
                        onChange={handleNameChange}
                    />
                </label>
                <div>
                    <StarRatings
                        rating={newLocationDetails.rating}
                        starRatedColor="gold"
                        changeRating={handleRatingChange}
                        numberOfStars={5}
                        name="rating"
                    />
                </div>
                <button onClick={handleSubmitLocation}>Submit</button>
            </Modal>
            
            {/* Map Display */}
            <MapContainer
                className="MapContainer"
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
                            <p>Location Title: {location.title}</p>
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
        </div>
    );
};


export default MapComponent