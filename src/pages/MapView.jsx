
import React, { useState } from 'react';
import Map from 'react-map-gl/mapbox';
import MapMarker from '../components/MapMarker';
import 'mapbox-gl/dist/mapbox-gl.css';

function MapView() {
  const [viewState, setViewState] = useState({
    longitude:12.568, 
    latitude: 55.65,
    zoom: 10
  });


  const token = import.meta.env.VITE_MAPBOX_TOKEN;

  const markers = [
    { spot_name: 'Amager Strand', wind_direction: 'N', wind_power: 26, latitude: 55.66, longitude: 12.64 },
    { spot_name: 'Dragør', wind_direction: 'NW', wind_power: 19, latitude: 55.58, longitude: 12.66 },
    { spot_name: 'Sydvestpynten', wind_direction: 'NW', wind_power: 9, latitude: 55.560, longitude: 12.56 },
    { spot_name: 'Sydhavn', wind_direction: 'NE', wind_power: 17, latitude: 55.63, longitude: 12.51 }
  ];

  return (
    <>
    <div className="page" style={{position: 'absolute', top: 0, left: 0, zIndex: 1, width: '100%', paddingBottom: 0, backgroundColor: 'white', opacity: 0.9 }}>
        <div className="page-header">
            <div className="page-title">Live Map</div>
        </div>
        <div className="section-subtitle">
            Check the wind right now and find new spots
        </div>
    </div>
    <Map
      {...viewState}
      onMove={(evt) => setViewState(evt.viewState)}
      style={{ width: '100vw', height: '100vh' }}
      mapStyle="mapbox://styles/mapbox/streets-v12"
      mapboxAccessToken={token}
    >
      {markers.map((marker, index) => (
        <MapMarker
          key={index}
          spot_name={marker.spot_name}
          wind_direction={marker.wind_direction}
          wind_power={marker.wind_power}
          latitude={marker.latitude}
          longitude={marker.longitude}
        />
      ))}
    </Map>
    </>
  );
}

export default MapView;


