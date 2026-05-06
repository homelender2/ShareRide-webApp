import React from 'react';

function RideList({ rides, onBack, onRedirectToPost }) {
    const handleJoin = (rideId) => {
        alert(`Joined ride ${rideId}! (Backend integration for joining coming soon)`);
    };

    return (
        <div style={{ color: 'white' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                <button 
                    onClick={onBack}
                    style={{
                        backgroundColor: 'transparent',
                        border: '1px solid #444',
                        color: 'white',
                        padding: '5px 10px',
                        borderRadius: '4px',
                        cursor: 'pointer'
                    }}
                >
                    ← Back
                </button>
                <h3 style={{ margin: 0, color: '#007bff' }}>Available Rides</h3>
            </div>

            {rides.length === 0 ? (
                <div style={{ textAlign: 'center', marginTop: '40px' }}>
                    <div style={{ color: '#888', marginBottom: '20px' }}>No rides found for this route.</div>
                    <button 
                        onClick={onRedirectToPost}
                        style={{
                            padding: '12px 20px',
                            backgroundColor: '#007bff',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            fontWeight: 'bold',
                            cursor: 'pointer'
                        }}
                    >
                        Post your own ride
                    </button>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    {rides.map(ride => (
                        <div key={ride.id} style={{ 
                            padding: '15px', 
                            backgroundColor: '#2d2d2d', 
                            borderRadius: '12px', 
                            border: '1px solid #444',
                            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                <span style={{ fontWeight: 'bold', fontSize: '18px' }}>💰 ${ride.price}</span>
                                <span style={{ color: '#aaa', fontSize: '14px' }}>💺 {ride.seats_available} seats left</span>
                            </div>
                            
                            <div style={{ fontSize: '14px', marginBottom: '15px', color: '#ccc' }}>
                                📅 {new Date(ride.date_time).toLocaleString()}
                            </div>

                            <button 
                                onClick={() => handleJoin(ride.id)}
                                style={{
                                    width: '100%',
                                    padding: '10px',
                                    backgroundColor: '#28a745',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '6px',
                                    fontWeight: 'bold',
                                    cursor: 'pointer',
                                    transition: 'background-color 0.2s'
                                }}
                                onMouseOver={(e) => e.target.style.backgroundColor = '#218838'}
                                onMouseOut={(e) => e.target.style.backgroundColor = '#28a745'}
                            >
                                Join Ride
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default RideList;
