import "../../styles/Map.css";

function MapLegend() {
  return (
    <div className="map-legend">
      <div className="map-legend-title">knts</div>
      <div className="map-legend-gradient">
        <div className="map-legend-gradient-bar"></div>
        <div className="map-legend-labels">
          <div className="map-legend-label">25+</div>
          <div className="map-legend-label">15</div>
          <div className="map-legend-label">0</div>
        </div>
      </div>
    </div>
  );
}

export default MapLegend;
