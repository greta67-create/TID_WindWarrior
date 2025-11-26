import "../App.css";
import "../styles/SpotView.css";
import Sessionblock from "../components/Sessionblock";
import Parse from "../parse-init";
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Chat from "../components/Chat";
import {
  fetchSpotByName,
  fetchCommentsToSpotId,
  fetchUpcomingSessionsToSpotId,
} from "../services/spotService";
import {
  joinSession,
  unjoinSession,
  fetchUserSessions,
} from "../services/usersessionService";
import Map from "react-map-gl/mapbox";
import MapMarker from "../components/MapMarker";
import "mapbox-gl/dist/mapbox-gl.css";
import getWindfinderlink from "../utils/getWindfinderlink";

export default function SpotViewPage() {
  const { spotName } = useParams();
  const name = decodeURIComponent(spotName || "");
  const [spot, setSpot] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [user, setUser] = useState(Parse.User.current());
  const [joinedSessions, setJoinedSessions] = useState([]);
  const [upcomingSessions, setUpcomingSessions] = useState([]);
  const [viewState, setViewState] = useState({
    longitude: spot?.longitude || 12.568,
    latitude: spot?.latitude || 55.65,
    zoom: 13,
  });
  const [activeTab, setActiveTab] = useState('sessions');

  const proposedComments = [
    { id: 100, text: "I can recommend this spot, nice conditions!" },
    { id: 101, text: "Pay attention with" },
  ];

  //load spot information
  useEffect(() => {
    const loadSpot = async () => {
      try {
        fetchSpotByName(spotName).then((spot) => {
          fetchCommentsToSpotId(spot.id).then((loadedComments) => {
            console.log("Loaded comments:", loadedComments);
            setComments(loadedComments);
          });

          fetchUpcomingSessionsToSpotId(spot.id).then((loadedSessions) => {
            console.log("Loaded sessions:", loadedSessions);
            setSessions(loadedSessions);
          });

          setSpot(spot);
          setLoading(false);
        });
      } catch (error) {
        console.error("Error:", error);
        setComments([]);
      }
    };
    loadSpot();
  }, []);

  //load current, joined user sessions
  useEffect(() => {
    const user = Parse.User.current();
    if (!user) return;
    //load Usersessions for specific user from backend
    async function loadUserSessions() {
      try {
        const sessions = await fetchUserSessions(user);
        console.log("Loaded user sessions in SpotView:", sessions);
        const ids = sessions.map((s) => s.id); // 👈 keep only ids
        setJoinedSessions(ids);
      } catch (err) {
        console.error("Error loading user sessions in SpotView:", err);
      }
    }

    loadUserSessions();
  }, []);

  // keep only upcoming sessions for the feed
  useEffect(() => {
    const now = new Date();

    const upcoming = sessions
      .filter((s) => s.sessionDateTime && s.sessionDateTime >= now)
      .sort((a, b) => a.sessionDateTime - b.sessionDateTime); // earliest → latest

    setUpcomingSessions(upcoming);
    console.log("Upcoming sessions in spot view:", upcoming);
  }, [sessions]);

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

  //hande join/unjoin and add usersession to DB
  const handleJoin = (id) => async (e) => {
    if (e && e.preventDefault) {
      e.preventDefault();
      e.stopPropagation();
    }

    console.log("Join button clicked", id);

    const currentlyJoined = joinedSessions.includes(id);

    // optimistic UI: toggle locally
    setJoinedSessions((prev) =>
      currentlyJoined ? prev.filter((sid) => sid !== id) : [...prev, id]
    );

    try {
      if (currentlyJoined) {
        await unjoinSession(id);
      } else {
        await joinSession(id);
        console.log("(Un-)oined session from ProfileView:", id);
      }
    } catch (error) {
      console.error("Error toggling user session in feed:", error);
      setJoinedSessions((prev) =>
        currentlyJoined ? [...prev, id] : prev.filter((sid) => sid !== id)
      );
    }
  };

  //Is the part below with error handling necessary or overengineered?
  // Error handling
  if (loading) {
    return (
      <div className="page">
        <div className="page-header">
          <div className="page-title">{name || "Loading spot..."}</div>
        </div>
        <div className="section-subtitle">Loading data…</div>
      </div>
    );
  }

  return (
    <div className="page">
      <div style={{ fontSize: '0.85rem', color: 'var(--sub)', marginBottom: 8 }}> 
        Spot / {spot?.name || name}
      </div>
      {/* Header */}
      <div className="page-header">
        <div className="page-title">{spot?.name || name}</div>
      </div>

      {spot?.mainText && (
        <div className="spot-view-description">
          {spot.mainText}
        </div>
      )}

{/* Activities, Levels, Amenities */}
<div className="spot-details">
  {spot?.activities && spot.activities.length > 0 && (
    <div className="spot-detail-item">
      <strong style={{ color: 'var(--text)' }}>Activities:</strong>{' '}
      <span style={{ color: 'var(--sub)' }}>
        {spot.activities.join(', ')}
      </span>
    </div>
  )}
  
  {spot?.skillLevel && spot.skillLevel.length > 0 && (
    <div className="spot-detail-item">
      <strong style={{ color: 'var(--text)' }}>Levels:</strong>{' '}
      <span style={{ color: 'var(--sub)' }}>
        {spot.skillLevel.join(', ')}
      </span>
    </div>
  )}
  
  {spot?.amenities && spot.amenities.length > 0 && (
    <div className="spot-detail-item">
      <strong style={{ color: 'var(--text)' }}>Amenities:</strong>{' '}
      <span style={{ color: 'var(--sub)' }}>
        {spot.amenities.join(', ')}
      </span>
    </div>
  )}
</div>

{/* Spot Image */}
{spot?.spotImage && (
  <div className="spot-image-container">
    <img 
      src={spot.spotImage.url()} 
      alt={spot.name}
    />
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
        <div>
          <div className="page-title">{spot?.name || name}</div>
          {spot?.mainText && (
            <div className="spot-description">{spot.mainText}</div>
          )}
          <div className="info-buttons">
            <a
              href={getWindfinderlink(spot.name)}
              target="_blank"
              className="info-btn info-btn-secondary"
            >
              <span>Get more info about the weather</span>
              <span className="external-icon">↗</span>
            </a>
          </div>

          <div className="section-subtitle">Top sessions for the next days</div>
        </div>
      </div>

      {/* Sessions list */}
      <div className="stack">
        {upcomingSessions.map((s) => (
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
              onJoin={handleJoin(s.id)}
              isJoined={joinedSessions.includes(s.id)}
            />
          </Link>
        ))}
      </div>
      {/* Comments section */}
      <div className="section-subtitle">What others say about this place:</div>
      <Chat
        comments={comments}
        currentUser={Parse.User.current()}
        setComments={setComments}
        session={null}
        spot={spot}
        proposedComments={proposedComments}
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
    View live wind forecast on Windfinder →
  </a>
)}

{/* Tab Navigation */}
<div className="tab-navigation">
  <button
    onClick={() => setActiveTab('sessions')}
    className={`tab-button ${activeTab === 'sessions' ? 'active' : ''}`}
  >
    Top Sessions
  </button>
  <button
    onClick={() => setActiveTab('comments')}
    className={`tab-button ${activeTab === 'comments' ? 'active' : ''}`}
  >
    Comments
  </button>
</div>

{activeTab === 'sessions' ? (
  <div className="sessions-container">
    {upcomingSessions.map((s) => (
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
          onJoin={handleJoin(s.id)}
          isJoined={joinedSessions.includes(s.id)}
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
  />
)}
    </div>
  );
}