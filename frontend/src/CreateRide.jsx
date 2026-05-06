import React, { useState } from 'react';
import { SearchBox } from '@mapbox/search-js-react';

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

function CreateRide({ mapSelection, onStartPicking, activePickingField }) {
    const [formData, setFormData] = useState({
        source: null,
        destination: null,
        price: '',
        date_time: '',
        seats_available: 4
    });

    // Update state when map selection changes
    React.useEffect(() => {
        if (mapSelection && activePickingField) {
            const newLoc = {
                name: "Dropped Pin",
                coordinates: { latitude: mapSelection.lat, longitude: mapSelection.lng }
            };
            setFormData(prev => ({ ...prev, [activePickingField]: newLoc }));
        }
    }, [mapSelection, activePickingField]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.source || !formData.destination) {
            alert("Please select both pickup and drop location");
            return;
        }

        const rideData = {
            host_user_id: 1,
            source_lat: formData.source.coordinates.latitude,
            source_lng: formData.source.coordinates.longitude,
            destination_lat: formData.destination.coordinates.latitude,
            destination_lng: formData.destination.coordinates.longitude,
            date_time: formData.date_time,
            price: formData.price,
            seats_available: formData.seats_available
        };

        try {
            const response = await fetch('http://localhost:3000/api/rides', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(rideData)
            });

            if (response.ok) {
                alert("Ride Posted Successfully!");
            } else {
                alert("Server error.");
            }
        } catch (err) {
            console.error(err);
            alert("Connection failed.");
        }
    };

    const inputStyle = {
        padding: '12px',
        borderRadius: '8px',
        border: '1px solid #444',
        backgroundColor: '#2d2d2d',
        color: 'white',
        fontSize: '14px',
        width: '100%'
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
                onRetrieve={(res) => setFormData({ ...formData, [field]: res.features[0].properties })}
                placeholder={placeholder}
                value={formData[field]?.name || ''}
            />
        </div>
    );

    return (
        <div className='create-ride-container' style={{ color: 'white' }}>
            <h3 style={{ color: '#007bff', marginBottom: '20px' }}>Post a New Ride</h3>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

                {renderLocationInput("Where from?", "source", "Search for pickup...")}
                {renderLocationInput("Where to?", "destination", "Search for destination...")}

                <div style={{ display: 'flex', gap: '10px' }}>
                    <input
                        type="datetime-local"
                        style={{ ...inputStyle, flex: 2 }}
                        onChange={(e) => setFormData({ ...formData, date_time: e.target.value })}
                    />
                    <input
                        type="number"
                        placeholder="Price"
                        style={{ ...inputStyle, flex: 1 }}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    />
                </div>

                <input
                    type="number"
                    placeholder="Seats Available"
                    defaultValue="4"
                    style={inputStyle}
                    onChange={(e) => setFormData({ ...formData, seats_available: e.target.value })}
                />

                <button type="submit" style={{
                    padding: '14px',
                    backgroundColor: '#007bff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    marginTop: '10px'
                }}>
                    Create Ride
                </button>
            </form>
        </div>
    );
}

export default CreateRide;
