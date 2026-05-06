import React, { useState } from 'react';
import { SearchBox } from '@mapbox/search-js-react';

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

function FindRide({ onRidesFound, mapSelection, onStartPicking, activePickingField }) {
    const [search, setSearch] = useState({ 
        source: null, 
        destination: null,
        sRad: 500, // Default 500m
        dRad: 1000 // Default 1km
    });

    // Update state when map selection changes
    React.useEffect(() => {
        if (mapSelection && activePickingField) {
            const newLoc = {
                name: "Dropped Pin",
                coordinates: { latitude: mapSelection.lat, longitude: mapSelection.lng }
            };
            setSearch(prev => ({ ...prev, [activePickingField]: newLoc }));
        }
    }, [mapSelection, activePickingField]);

    const handleSearch = async () => {
        if (!search.source || !search.destination) {
            alert("Please select both Pickup and Drop-off locations from the suggestions.");
            return;
        }

        const sLat = search.source.coordinates.latitude;
        const sLng = search.source.coordinates.longitude;
        const dLat = search.destination.coordinates.latitude;
        const dLng = search.destination.coordinates.longitude;

        // Construct the dynamic URL
        const url = `http://localhost:3000/api/rides/search?sLat=${sLat}&sLng=${sLng}&sRad=${search.sRad}&dLat=${dLat}&dLng=${dLng}&dRad=${search.dRad}`;
        
        try {
            const resp = await fetch(url);
            if (!resp.ok) throw new Error("Search failed");
            const data = await resp.json();
            onRidesFound(data.rides);
        } catch (err) {
            console.error(err);
            alert("Failed to find rides. Is the backend running?");
        }
    };

    const renderLocationInput = (label, field, placeholder) => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label style={{ fontSize: '12px', color: '#aaa' }}>{label}</label>
                <button 
                    type="button"
                    onClick={() => onStartPicking(field)}
                    style={{ 
                        fontSize: '11px', 
                        backgroundColor: activePickingField === field ? '#28a745' : '#444',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        padding: '2px 8px',
                        cursor: 'pointer'
                    }}
                >
                    {activePickingField === field ? '📍 Clicking Map...' : '📍 Pick on Map'}
                </button>
            </div>
            <SearchBox 
                accessToken={MAPBOX_TOKEN}
                onRetrieve={(res) => setSearch({ ...search, [field]: res.features[0].properties })}
                placeholder={placeholder}
                value={search[field]?.name || ''}
            />
        </div>
    );

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            
            {renderLocationInput("Pickup Location", "source", "Search for pickup...")}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <label>Pickup Radius: {search.sRad}m</label>
                <input type="range" min="100" max="5000" step="100" value={search.sRad} 
                       onChange={(e) => setSearch({...search, sRad: parseInt(e.target.value)})} />
            </div>

            {renderLocationInput("Drop-off Location", "destination", "Search for destination...")}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <label>Drop-off Radius: {search.dRad}m</label>
                <input type="range" min="100" max="5000" step="100" value={search.dRad} 
                       onChange={(e) => setSearch({...search, dRad: parseInt(e.target.value)})} />
            </div>

            <button 
                onClick={handleSearch}
                style={{
                    padding: '12px',
                    backgroundColor: '#007bff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    marginTop: '10px'
                }}
            >
                Find Matching Rides
            </button>
        </div>
    );
}

export default FindRide;
