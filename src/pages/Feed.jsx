import "../App.css";

//import SessionBlock from "../components/Sessionblock";
import { useState, useEffect } from "react";
import Sessionblock from "../components/Sessionblock";


import { Link } from "react-router-dom";
import ava1 from "../assets/avatar1.png";
import ava2 from "../assets/avatar2.png";
import ava3 from "../assets/avatar3.png";
import Parse from "../parse-init";
import loadSurfSessions from "../services/getParseFunctions";

import {
  joinSession,
  unjoinSession,
} from "../services/usersessionService";


import { BsFilterSquare } from "react-icons/bs";
const defaultAvatars = [ava1, ava2, ava3];


// function SessionFeedPage() {


function SessionFeedPage() {
  const [surfSessions, setSurfSessions] = useState([]);
  const user = Parse.User.current();
// Load sessions from Parse Cloud Function
  useEffect(() => {
    async function fetchData() {
      const futureSessions = await Parse.Cloud.run("loadSessions", { 
        user: user.id,
        filters:{}
      });
      console.log("Loaded sessions in Feed:", futureSessions);
      setSurfSessions(futureSessions);
    }
    fetchData();
  }, []);


// Toggle join/unjoin session
  const onJoin = (id) => async (e) => {
    if (e && e.preventDefault) {
      e.preventDefault();
      e.stopPropagation();
    }
    console.log("Join button clicked", id);
    const currentlyJoined = surfSessions.some(s => s.id === id && s.isJoined);
    // UI Toggle 
    setSurfSessions(prev => 
      prev.map(s => s.id === id ? { ...s, isJoined: !s.isJoined } : s)
    );
    try {
      if (currentlyJoined) {
        await unjoinSession(id);
      } else {
        await joinSession(id);
      }  
    } catch (error) {
      console.error("Error toggling user session in feed:", error);
      // UI Toggle back on error
      setSurfSessions(prev => 
        prev.map(s => s.id === id ? { ...s, isJoined: !s.isJoined } : s)
      );
    }
  };

  // Render session feed
  return (
    <div className="page">
      <div className="page-header">
        <div className="page-title">Your Session Feed</div>
      </div>
      <div className="section-subtitle">
        Top sessions based on the weather forecast
      </div>
      <div className="stack">
        {/* {sessions.map((s) => (
          <Link key={s.id} to={`/session/${s.id}`}> */}
        {surfSessions.map((s) => (
          <Link
            key={s.id}
            to={`/session/${s.id}`}
            style={{ textDecoration: "none" }}
          >
            <Sessionblock
              spot={s.spotName}
              dateLabel={s.dateLabel}
              timeLabel={s.timeLabel}
              windKts={s.windPower}
              tempC={s.temperature}
              weather={s.weatherType}
              windDir={s.windDirection}
              coastDirection={s.coastDirection}
              avatars={defaultAvatars}
              onJoin={onJoin(s.id)}
              isJoined={s.isJoined}
            />
          </Link>
        ))}
      </div>
    </div>
  );
}

export default SessionFeedPage;
