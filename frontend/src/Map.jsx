import Map, { Marker } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

function RideMap({ rides = [], onMapClick, activeMarker = null }) {
    return (
        <div style={{ width: '100%', height: '100vh', position: 'relative' }}> 
            <Map
                initialViewState={{
                    longitude: 72.8777,
                    latitude: 19.0760,
                    zoom: 11
                }}
                style={{ width: '100%', height: '100%' }}
                mapStyle="mapbox://styles/mapbox/streets-v11"
                mapboxAccessToken={MAPBOX_TOKEN}
                onClick={(e) => onMapClick && onMapClick(e.lngLat)}
                cursor={onMapClick ? 'crosshair' : 'grab'}
            >
                {/* Search Result Markers */}
                {rides.map(ride => (
                    <Marker 
                        key={ride.id} 
                        longitude={ride.source.coordinates[0]} 
                        latitude={ride.source.coordinates[1]} 
                        anchor="bottom"
                    >
                        <div style={{ 
                            fontSize: '24px', 
                            cursor: 'pointer',
                            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))' 
                        }}>
                            🚗
                        </div>
                    </Marker>
                ))}

                {/* Active Selection Marker (Pin Drop) */}
                {activeMarker && (
                    <Marker 
                        longitude={activeMarker.lng} 
                        latitude={activeMarker.lat} 
                        anchor="bottom"
                    >
                        <div style={{ fontSize: '30px', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))' }}>
                            📍
                        </div>
                    </Marker>
                )}
            </Map>
        </div>
    );
}

export default RideMap;