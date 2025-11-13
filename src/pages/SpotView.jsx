import "../App.css";
import Sessionblock from "../components/Sessionblock";
import Parse from "../parse-init";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function SpotViewPage() {
  const { spotName } = useParams();
  const name = decodeURIComponent(spotName || "");
  const navigate = useNavigate();

  const [spot, setSpot] = useState(null);       
  const [comments, setComments] = useState([]); 
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null);     
  // Sessions for this spot (loaded from backend)
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    if (!name) {
      setLoading(false);
      return;
    }

    let isCancelled = false;

    async function fetchSpotAndComments() {
      try {
        setLoading(true);
        setError(null);

        // 1) Load the Spot by name
        const Spot = Parse.Object.extend("Spot");
        const spotQuery = new Parse.Query(Spot);
        spotQuery.equalTo("spotName", name);
        const spotObj = await spotQuery.first();

        if (!spotObj) {
          if (!isCancelled) {
            setError("Spot not found");
            setLoading(false);
          }
          return;
        }

        if (!isCancelled) {
          setSpot(spotObj);
        }

        // 2) Load upcoming sessions for this spot from Session_
        const Session = Parse.Object.extend("Session_");
        const sessionQuery = new Parse.Query(Session);
        sessionQuery.equalTo("spotId", spotObj); // pointer to this Spot
        // TODO: when there is future data, re-enable this filter to only show upcoming sessions
        // sessionQuery.greaterThanOrEqualTo("sessionDateTime", new Date());
        // sort by windPower (strongest first)
        sessionQuery.descending("windPower");
        sessionQuery.limit(3);
        const sessionResults = await sessionQuery.find();
        console.log("Loaded sessions for", name, "=", sessionResults.length);

        if (!isCancelled) {
          const mappedSessions = sessionResults.map((s) => {
            const dt = s.get("sessionDateTime");
            let dateLabel = "";
            let timeLabel = "";
            if (dt) {
              dateLabel = dt.toLocaleDateString("en-GB", {
                month: "short",
                day: "numeric",
              });
              timeLabel = dt.toLocaleTimeString("en-GB", {
                hour: "numeric",
                minute: "2-digit",
              });
            }

            return {
              id: s.id,
              spot: spotObj.get("spotName") || name,
              dateLabel,
              timeLabel,
              windKts: s.get("windPower"),
              tempC: s.get("temperature"),
              weather: s.get("weatherType"),
              windDir: s.get("windDirection"),
            };
          });

          setSessions(mappedSessions);
        }

        // 3) Load comments for this spot
        const Comment = Parse.Object.extend("comment");
        const commentQuery = new Parse.Query(Comment);
        commentQuery.equalTo("spotId", spotObj);  // pointer to this Spot
        commentQuery.include("userId");           // so we can show the user name
        commentQuery.descending("createdAt");     // newest first

        const results = await commentQuery.find();
        if (!isCancelled) {
          const mappedComments = results.map((c) => {
            const user = c.get("userId");
            const username =
              (user &&
                (user.get("username") ||
                  user.get("name") ||
                  user.get("firstName"))) ||
              "Unknown rider";

            const created = c.createdAt;
            let dateLabel = "";
            if (created) {
              dateLabel =
                created.toLocaleDateString("de-DE") +
                " " +
                created.toLocaleTimeString("de-DE", {
                  hour: "2-digit",
                  minute: "2-digit",
                });
            }

            return {
              id: c.id,
              name: username,
              date: dateLabel,
              text: c.get("message") || "",
            };
          });

          setComments(mappedComments);
          setLoading(false);
        }
      } catch (err) {
        console.error("Failed to load spot or comments", err);
        if (!isCancelled) {
          setError("Could not load this spot. Please try again.");
          setLoading(false);
        }
      }
    }

    fetchSpotAndComments();

    return () => {
      isCancelled = true;
    };
  }, [name]);

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
          <div className="page-title">{spot?.get("spotName") || name}</div>
          {spot?.get("mainText") && (
            <div className="spot-description">
              {spot.get("mainText")}
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
            spot={s.spot}
            dateLabel={s.dateLabel}
            timeLabel={s.timeLabel}
            windKts={s.windKts}
            tempC={s.tempC}
            weather={s.weather}
            windDir={s.windDir}
            onJoin={() => navigate(`/session/${s.id}`)}
          />
        ))}
      </div>
      {/* Comments section */}
      <div className="section-subtitle" style={{ marginTop: 16 }}>
        What others say about this place:
      </div>

      <div className="chat-list">
        {comments.length === 0 && (
          <div style={{ opacity: 0.7, fontSize: 14 }}>
            No comments yet. Be the first to share your experience.
          </div>
        )}
        {comments.map((c) => (
          <div key={c.id} className="chat-item">
            <strong>{c.name}</strong>
            <span style={{ opacity: 0.6, marginLeft: 8, fontSize: 12 }}>
              {c.date}
            </span>
            <div style={{ marginTop: 4 }}>{c.text}</div>
          </div>
        ))}
      </div>

      <div className="comment-bar">
        <div className="comment-inner">
          <input className="comment-input" placeholder="Add Comment" />
          <button className="send-btn">Send</button>
        </div>
      </div>
    </div>
  );
}
