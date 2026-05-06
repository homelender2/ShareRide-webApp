import './App.css'
import React, { useState } from 'react';
import RideMap from './Map';
import CreateRide from './CreateRide';
import FindRide from './FindRide';
import RideList from './RideList';

function App() {
  const [activeTab, setActiveTab] = useState('find'); // 'find' or 'post'
  const [foundRides, setFoundRides] = useState([]);
  const [view, setView] = useState('form'); // 'form' or 'results'
  
  // New state for map picking
  const [mapSelection, setMapSelection] = useState(null);
  const [activePickingField, setActivePickingField] = useState(null);

  const tabStyle = (tabName) => ({
    padding: '10px 20px',
    cursor: 'pointer',
    borderBottom: activeTab === tabName ? '3px solid #007bff' : 'none',
    color: activeTab === tabName ? '#007bff' : '#aaa',
    fontWeight: 'bold',
    transition: 'all 0.3s'
  });

  const handleRidesFound = (rides) => {
    setFoundRides(rides);
    setView('results');
  };

  const handleRedirectToPost = () => {
    setActiveTab('post');
    setView('form');
  };

  const handleMapClick = (lngLat) => {
    if (activePickingField) {
      setMapSelection(lngLat);
      // Optional: Clear picking field after selection
      setTimeout(() => setActivePickingField(null), 500);
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden' }}>
      {/* Left Side: Sidebar */}
      <div style={{ 
        width: '400px', 
        padding: '20px', 
        backgroundColor: '#1a1a1a', 
        color: 'white',
        boxShadow: '2px 0 10px rgba(0,0,0,0.5)',
        zIndex: 10,
        display: 'flex',
        flexDirection: 'column'
      }}>
        <h1 style={{ marginBottom: '10px', color: '#007bff' }}>ShareRide 🚗</h1>
        
        {view === 'form' ? (
          <>
            {/* Tabs for toggling */}
            <div style={{ display: 'flex', marginBottom: '20px', borderBottom: '1px solid #333' }}>
              <div style={tabStyle('find')} onClick={() => { setActiveTab('find'); setActivePickingField(null); }}>Find Ride</div>
              <div style={tabStyle('post')} onClick={() => { setActiveTab('post'); setActivePickingField(null); }}>Post Ride</div>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', paddingRight: '5px' }}>
              {activeTab === 'find' ? (
                <FindRide 
                  onRidesFound={handleRidesFound} 
                  mapSelection={mapSelection}
                  activePickingField={activePickingField}
                  onStartPicking={(field) => setActivePickingField(field)}
                />
              ) : (
                <CreateRide 
                  mapSelection={mapSelection}
                  activePickingField={activePickingField}
                  onStartPicking={(field) => setActivePickingField(field)}
                />
              )}
            </div>
          </>
        ) : (
          <div style={{ flex: 1, overflowY: 'auto' }}>
            <RideList 
              rides={foundRides} 
              onBack={() => setView('form')} 
              onRedirectToPost={handleRedirectToPost}
            />
          </div>
        )}
      </div>

      {/* Right Side: Map */}
      <div style={{ flex: 1 }}>
        <RideMap 
          rides={foundRides} 
          onMapClick={handleMapClick}
          activeMarker={mapSelection}
        />
      </div>
    </div>
  );
}
export default App;
