import "../App.css";
import SessionBlock from "../components/Sessionblock";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ava1 from "../assets/avatar1.png";
import ava2 from "../assets/avatar2.png";
import ava3 from "../assets/avatar3.png";
import {
  joinSession,
  unjoinSession,
  fetchUserSessions,
} from "../services/usersessionService";

const defaultAvatars = [ava1, ava2, ava3];

function SessionFeedPage({ sessions = [] }) {
  const [joinedSessions, setJoinedSessions] = useState([]);
  const user = Parse.User.current();

  //load joined sessions by user once
  useEffect(() => {
    if (!user) return;

    async function loadJoinedSessions() {
      try {
        const userSessions = await fetchUserSessions(user);
        // assuming fetchUserSessions returns array of session objects
        const ids = userSessions.map((s) => s.id);
        setJoinedSessions(ids);
      } catch (error) {
        console.error("Error loading joined sessions in feed:", error);
      }
    }

    loadJoinedSessions();
  }, [user]);

  const onJoin = (id) => async (e) => {
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
      }
    } catch (error) {
      console.error("Error toggling user session in feed:", error);
      setJoinedSessions((prev) =>
        currentlyJoined ? [...prev, id] : prev.filter((sid) => sid !== id)
      );
    }
  };

  console.log("Rendering SessionFeedPage with sessions:", sessions);

  return (
    <div className="page">
      <div className="page-header">
        <div className="page-title">Your Session Feed</div>
      </div>
      <div className="section-subtitle">
        Top sessions based on the weather forecast
      </div>
      <div className="stack">
        {sessions.map((s) => (
          <Link key={s.id} to={`/session/${s.id}`}>
            <SessionBlock
              spot={s.spotName}
              dateLabel={
                s.sessionDateTime ? s.sessionDateTime.toLocaleDateString() : "-"
              }
              timeLabel={
                s.sessionDateTime
                  ? s.sessionDateTime.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "-"
              }
              windKts={s.windPower}
              tempC={s.temperature}
              weather={s.weatherType}
              windDir={s.windDirection}
              avatars={defaultAvatars}
              onJoin={onJoin(s.id)}
              isJoined={joinedSessions.includes(s.id)}
            />
          </Link>
        ))}
      </div>
    </div>
  );
}

export default SessionFeedPage;
