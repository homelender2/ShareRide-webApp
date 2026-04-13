import './App.css'
import React from 'react';
import RideMap from './Map';
import CreateRide from './CreateRide'

function App() {
  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden' }}>
      {/* Left Side: Form */}
      <div style={{ 
        width: '400px', 
        padding: '40px', 
        backgroundColor: '#1a1a1a', 
        color: 'white',
        boxShadow: '2px 0 10px rgba(0,0,0,0.5)',
        zIndex: 10 
      }}>
        <h1 style={{ marginBottom: '20px', color: '#007bff' }}>ShareRide 🚗</h1>
        <CreateRide />
      </div>

      {/* Right Side: Map */}
      <div style={{ flex: 1 }}>
        <RideMap />
      </div>
    </div>
  );
}
export default App;
