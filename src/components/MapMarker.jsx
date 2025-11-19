import { Link } from "react-router-dom";
import { Marker } from "react-map-gl/mapbox";
import getArrowRotation from "../utils/getArrowRotation";

function MapMarker({
  spot_id,
  spot_name,
  wind_direction,
  wind_power,
  latitude,
  longitude,
}) {
  const borderColor =
    wind_power > 25 ? "red" : wind_power > 15 ? "green" : "blue";

  return (
    <Link
      key={spot_id}
      to={`/spot/${spot_name}`}
      style={{ textDecoration: "none" }}
    >
      <Marker latitude={latitude} longitude={longitude}>
        <div
          className="map-marker"
          style={{ border: `2px solid ${borderColor}` }}
        >
          <strong>{spot_name}</strong>
          <br />
          <div className="map-marker-arrowbox" >
              <div className="map-marker-arrow" style={{transform: `rotate(${getArrowRotation(wind_direction)}deg)`}}>
                  <FaLocationArrow />
              </div>
              <span> {wind_power} knts</span>
          </div>
        </div>
      </Marker>
    </Link>
  );
}

export default MapMarker;
