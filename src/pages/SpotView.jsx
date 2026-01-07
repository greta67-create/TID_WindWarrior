import "../styles/SpotView.css";
import Sessionblock from "../components/Sessionblock";
import Parse from "../parse-init";
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Chat from "../components/Chat";
import {
  fetchSpotByName,
} from "../services/spotService";
import { setupCommentsPolling } from "../utils/setupCommentsPolling";
import { toggleJoinInSessionList } from "../utils/toggleJoinInList";
import Map from "react-map-gl/mapbox";
import MapMarker from "../components/MapMarker";
import "mapbox-gl/dist/mapbox-gl.css";

export default function SpotViewPage() {
  const { spotName } = useParams();
  const name = decodeURIComponent(spotName || "");
  const [spot, setSpot] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [surfSessions, setSurfSessions] = useState([]);
  const user = Parse.User.current();
  const [viewState, setViewState] = useState({
    longitude: spot?.longitude || 12.568,
    latitude: spot?.latitude || 55.65,
    zoom: 13,
  });
  const [activeTab, setActiveTab] = useState("sessions");

  //load spot information and session information via cloud function
  useEffect(() => {
    const loadSpot = async () => {
      setLoading(true); // start loading
      try {
        const spot = await fetchSpotByName(spotName);
  
        const futureSessions = await Parse.Cloud.run("loadSessions", {
          filters: { spotIds: [spot.id] },
        });
        console.log("Loaded sessions in Spotfeed:", futureSessions);
        setSurfSessions(futureSessions);
  
        setSpot(spot);
      } catch (error) {
        console.error("Error fetching spot by name:", error);
        setSpot(null);
        setSurfSessions([]);
      } finally {
        setLoading(false); // stop loading notification
      }
    };
  
    loadSpot();
  }, [spotName]);

  // updates the map center once the spot data loads
  useEffect(() => {
    if (spot?.latitude && spot?.longitude) {
      setViewState({
        longitude: spot.longitude,
        latitude: spot.latitude,
        zoom: 13,
      });
    }
  }, [spot]);

  // Load comments with polling using utility function
  useEffect(() => {
    return setupCommentsPolling(null, spot?.id, setComments);
  }, [spot?.id]);

  //handle join/unjoin session in spotview
  const onJoin = (id) => async (e) => {
    e.preventDefault();
    e.stopPropagation();
    await toggleJoinInSessionList(id, surfSessions, setSurfSessions);
  };


  if (loading) {
    return <div className="page">Loading spot...</div>;
  }

  // render spot view
  return (
    <div className="page">
      <div
        style={{ fontSize: "0.85rem", color: "var(--sub)", marginBottom: 8 }}
      >
        Spot / {spot?.name || name}
      </div>
      {/* Header */}
      <div className="page-header">
        <div className="page-title">{spot?.name || name}</div>
      </div>

      {spot?.mainText && (
        <div className="spot-view-description">{spot.mainText}</div>
      )}

      {/* Activities, Levels, Amenities */}
      <div className="spot-details">
        {spot?.activities && spot.activities.length > 0 && (
          <div className="spot-detail-item">
            <strong style={{ color: "var(--text)" }}>Activities:</strong>{" "}
            <span style={{ color: "var(--sub)" }}>
              {spot.activities.join(", ")}
            </span>
          </div>
        )}

        {spot?.skillLevel && spot.skillLevel.length > 0 && (
          <div className="spot-detail-item">
            <strong style={{ color: "var(--text)" }}>Levels:</strong>{" "}
            <span style={{ color: "var(--sub)" }}>
              {spot.skillLevel.join(", ")}
            </span>
          </div>
        )}

        {spot?.amenities && spot.amenities.length > 0 && (
          <div className="spot-detail-item">
            <strong style={{ color: "var(--text)" }}>Amenities:</strong>{" "}
            <span style={{ color: "var(--sub)" }}>
              {spot.amenities.join(", ")}
            </span>
          </div>
        )}
      </div>

      {/* Spot Image */}
      {spot?.spotImage && (
        <div className="spot-image-container">
          <img src={spot.spotImage.url()} alt={spot.name} />
        </div>
      )}

      {/* Map Section */}
      <div className="section-subtitle">On the Map</div>
      <div className="spot-map-container">
        {spot?.latitude && spot?.longitude && (
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
        )}
      </div>

      {/* Windfinder Link */}
      {spot?.windfinderLink && (
        <a
          href={spot.windfinderLink}
          target="_blank"
          rel="noopener noreferrer"
          className="windfinder-link"
        >
          Get more information about the weather →
        </a>
      )}

      {/* Tab Navigation */}
      <div className="tab-navigation">
        <button
          onClick={() => setActiveTab("sessions")}
          className={`tab-button ${activeTab === "sessions" ? "active" : ""}`}
        >
          Top Sessions
        </button>
        <button
          onClick={() => setActiveTab("comments")}
          className={`tab-button ${activeTab === "comments" ? "active" : ""}`}
        >
          Comments
        </button>
      </div>

      {activeTab === "sessions" ? (
        <div className="stack">
          {surfSessions.map((s) => (
            <Link key={s.id} to={`/session/${s.id}`} className="session-link">
              <Sessionblock
                key={s.id}
                spot={s.spotName}
                dateLabel={s.dateLabel}
                timeLabel={s.timeLabel}
                windKts={s.windPower}
                tempC={s.temperature}
                weather={s.weatherType}
                windDir={s.windDirection}
                coastDirection={s.coastDirection}
                onJoin={onJoin(s.id)}
                isJoined={s.isJoined}
              />
            </Link>
          ))}
        </div>
      ) : (
        <Chat
          comments={comments}
          currentUser={Parse.User.current()}
          setComments={setComments}
          session={null}
          spot={spot}
          showProposedComments={false}
        />
      )}
    </div>
  );
}
