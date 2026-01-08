import Map from "react-map-gl/mapbox";
import MapMarker from "../MapComponents/MapMarker";
import "../../styles/SpotView.css";
import "mapbox-gl/dist/mapbox-gl.css";

function SpotMap({ spot, viewState, setViewState }) {
  if (!spot?.latitude || !spot?.longitude) {
    return null;
  }

  return (
    <>
      <div className="section-subtitle">On the Map</div>
      <div className="spot-map-container">
        <Map
          {...viewState}
          onMove={(evt) => setViewState(evt.viewState)}
          style={{ width: "100%", height: "100%" }}
          mapStyle="mapbox://styles/mapbox/streets-v12"
          mapboxAccessToken={import.meta.env.VITE_MAPBOX_TOKEN}
        >
          <MapMarker
            spot_id={spot.id}
            spot_name={spot.name}
            wind_direction={spot.currentWindDirection}
            wind_power={spot.currentWindKnts}
            latitude={spot.latitude}
            longitude={spot.longitude}
          />
        </Map>
      </div>
    </>
  );
}

export default SpotMap;
