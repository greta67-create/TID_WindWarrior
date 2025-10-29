import React from 'react';
import Map, {Marker} from 'react-map-gl/mapbox';

function MapMarker({ spot_name, wind_direction, wind_power, latitude, longitude }) {
  const borderColor = wind_power >25 ? 'red' : wind_power > 15 ? 'green' : 'blue';
  return (    
    <Marker latitude={latitude} longitude={longitude}>
      <div style={{
        backgroundColor: 'white',
        padding: '5px',
        borderRadius: '20px',
        border: `2px solid ${borderColor}`,
        textAlign: 'center',
        boxShadow: '0 0 5px rgba(0,0,0,0.3)'
      }}>
        <strong>{spot_name}</strong>
        <div>{wind_direction} {wind_power} knts</div>
      </div>
    </Marker>
  );
}

export default MapMarker;