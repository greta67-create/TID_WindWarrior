import { Link } from "react-router-dom";
import { Marker } from "react-map-gl/mapbox";

function getArrowRotation(direction) {
  switch (direction) {
    case "N":
      return 90;
    case "NE":
      return 135;
    case "E":
      return 180;
    case "SE":
      return 225;
    case "S":
      return 270;
    case "SW":
      return 315;
    case "W":
      return 0;
    case "NW":
      return 45;
    default:
      return 0;
  }
}

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
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                transform: `rotate(${getArrowRotation(wind_direction)}deg)`,
                padding: "0 8px",
              }}
            >
              ➤
            </div>
            <span> {wind_power} knts</span>
          </div>
        </div>
      </Marker>
    </Link>
  );
}

export default MapMarker;
