import React from 'react';
import Map, {Marker} from 'react-map-gl/mapbox';

function getArrowRotation(direction)  {
    switch(direction) {
        case 'N': return 90;
        case 'NE': return 135;
        case 'E': return 180;
        case 'SE': return 225;
        case 'S': return 270;
        case 'SW': return 315;
        case 'W': return 0;
        case 'NW': return 45;
        default: return 0;
    }
}


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
        <br />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ transform: `rotate(${getArrowRotation(wind_direction)}deg)`, padding: '0 8px' }}>
                ➤
            </div>
            <span> {wind_power} knts</span>
        </div>
      </div>
    </Marker>
  );
}

export default MapMarker;