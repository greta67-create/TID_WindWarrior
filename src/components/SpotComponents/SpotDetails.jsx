import "../../styles/SpotView.css";

function SpotDetails({ spot, name }) {
  return (
    <>
      <div className="spot-breadcrumb">
        Spot / {spot?.name || name}
      </div>

      {spot?.mainText && (
        <div className="spot-view-description">{spot.mainText}</div>
      )}

      {/* Activities, Levels, Amenities */}
      <div className="spot-details">
        {spot?.activities && spot.activities.length > 0 && (
          <div className="spot-detail-item">
            <strong>Activities:</strong>{" "}
            <span>{spot.activities.join(", ")}</span>
          </div>
        )}

        {spot?.skillLevel && spot.skillLevel.length > 0 && (
          <div className="spot-detail-item">
            <strong>Levels:</strong>{" "}
            <span>{spot.skillLevel.join(", ")}</span>
          </div>
        )}

        {spot?.amenities && spot.amenities.length > 0 && (
          <div className="spot-detail-item">
            <strong>Amenities:</strong>{" "}
            <span>{spot.amenities.join(", ")}</span>
          </div>
        )}
      </div>

      {/* Spot Image */}
      {spot?.spotImage && (
        <div className="spot-image-container">
          <img src={spot.spotImage.url()} alt={spot.name} />
        </div>
      )}
    </>
  );
}

export default SpotDetails;
