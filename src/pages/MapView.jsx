import { useEffect, useState } from "react";
import Map from "react-map-gl/mapbox";
import MapMarker from "../components/MapMarker";
import "mapbox-gl/dist/mapbox-gl.css";
import "/src/styles/Map.css";
import { fetchSpots } from "../services/spotService";

function MapView() {
  const [viewState, setViewState] = useState({
    longitude: 12.568,
    latitude: 55.65,
    zoom: 10,
  });
  const [spots, setSpots] = useState(null);

  const token = import.meta.env.VITE_MAPBOX_TOKEN;

  

  useEffect(() => {
    const loadSpots = async () => {
      try {
        const spots = await fetchSpots();
        setSpots(spots);
      } catch (error) {
        console.error("Error loading Spots:", error);
        setSpots([]);
      }
    };
    loadSpots();
  }, []);

  return (
    <>
      <div className="page map-header">
        <div className="page-header">
          <div className="page-title">Live Map</div>
        </div>
        <div className="section-subtitle">
          Check the wind right now and find new spots
        </div>
      </div>

      <div className="page" style={{padding: 0}}>  {/* need to modify to remove padding */}
        {spots && 
        <Map
          {...viewState}
          onMove={(evt) => setViewState(evt.viewState)}
          style={{ width: "100%", height: "100vh" }} // couldnt extract to css as map wouldnt load without styling here
          mapStyle="mapbox://styles/mapbox/streets-v12"
          mapboxAccessToken={token}
        >
          {spots.map((spot) => (
            <MapMarker
              key={spot.id}
              spot_id={spot.id}
              spot_name={spot.name}
              wind_direction={spot.currentWindDirection}
              wind_power={spot.currentWindKnts}
              latitude={spot.latitude}
              longitude={spot.longitude}
            />
          ))}
        </Map>
        }
      </div>
    </>
  );
}

export default MapView;
