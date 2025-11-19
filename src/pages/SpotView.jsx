import "../App.css";
import Sessionblock from "../components/Sessionblock";
import Parse from "../parse-init";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Chat from "../components/Chat";
import { fetchSpotByName, fetchCommentsToSpotId, fetchUpcomingSessionsToSpotId } from "../services/spotService";

export default function SpotViewPage() {
  const { spotName } = useParams();
  const name = decodeURIComponent(spotName || "");
  const navigate = useNavigate();

  const [spot, setSpot] = useState(null);       
  const [comments, setComments] = useState([]); 
  const [loading, setLoading] = useState(true); 
  const [error, ] = useState(null);     
  // Sessions for this spot (loaded from backend)
  const [sessions, setSessions] = useState([]);



  useEffect(() => {
    const loadSpot = async () => {
      try {
        fetchSpotByName(spotName)
          .then((spot) => {
            
            fetchCommentsToSpotId(spot.id)
            .then((loadedComments) => {
            console.log("Loaded comments:", loadedComments);
            setComments(loadedComments);
            })

            fetchUpcomingSessionsToSpotId(spot.id)
            .then((loadedSessions) => {
            console.log("Loaded sessions:", loadedSessions);
              setSessions(loadedSessions);
            })
          
            setSpot(spot);
            setLoading(false);
          })
        } catch (error) {
            console.error("Error:", error);
            setComments([]);
        }
      };
    loadSpot();
  }, []);


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

  if (error) {
    return (
      <div className="page">
        <div className="page-header">
          <div className="page-title">{name || "Spot"}</div>
        </div>
        <div className="section-subtitle">{error}</div>
      </div>
    );
  }

  return (
    <div className="page">
      {/* Header */}
      <div className="page-header">
        <div>
          <div className="page-title">{spot?.name || name}</div>
          {spot?.mainText && (
            <div className="spot-description">
              {spot.mainText}
            </div>
          )}
          <div className="section-subtitle" style={{ marginTop: 12 }}>
            Top sessions for the next days
          </div>
        </div>
      </div>

      {/* Sessions list */}
      <div className="stack" style={{ marginTop: 12 }}>
        {sessions.map((s) => (
          <Sessionblock
            key={s.id}
            spot={s.spotName}
            dateLabel={s.dateLabel}
            timeLabel={s.timeLabel}
            windKts={s.windPower}
            tempC={s.temperature}
            weather={s.weatherType}
            windDir={s.windDirection}
            onJoin={() => navigate(`/session/${s.id}`)}
          />
        ))}
      </div>
      {/* Comments section */}
      <div className="section-subtitle" style={{ marginTop: 16 }}>
        What others say about this place:
      </div>
      <Chat 
        comments={comments} 
        currentUser={Parse.User.current()} 
        setComments={setComments} 
        session={null}
        spot={spot} />
    </div>
  );
}
