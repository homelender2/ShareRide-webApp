import Map from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

function RideMap() {
    return (
        
        <div style={{ width: '100%', height: '100vh', position: 'relative' }}> 
          <Map
            initialViewState={{
              longitude: -73.9352,
              latitude: 40.7306,
              zoom: 10
            }}
            style={{ width: '100%', height: '100%' }} // Map fills the 100vh container
            mapStyle="mapbox://styles/mapbox/streets-v11" // Changed to Dark mode to match your UI
            mapboxAccessToken={MAPBOX_TOKEN}
          />
  </div>
);
}

export default RideMap;