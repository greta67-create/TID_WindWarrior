import "../App.css";
import Parse from "../parse-init";
import ProfileCard from "../components/Profilecard";
import Sessionblock from "../components/Sessionblock";
import { Link } from "react-router-dom";
import ava1 from "../assets/avatar1.png";
import ava2 from "../assets/avatar2.png";
import ava3 from "../assets/avatar3.png";
import { useState, useEffect } from "react";
import {
  fetchUserSessions,
  joinSession,
  unjoinSession,
} from "../services/usersessionService";
import { getCurrentUserInfo } from "../services/userservice";
import LogOutButton from "../components/LogOutButton";
import "../styles/BrowseSessions.css";

const defaultAvatars = [ava1, ava2, ava3];

export default function ProfileView({
  onJoinSession,
  joinedSessions = [],
  onLogout,
}) {
  const [user, setUser] = useState({});
  const [upcomingSessions, setUpcomingSessions] = useState([]);
  const [pastSessions, setPastSessions] = useState([]);

  useEffect(() => {
    async function loadUser() {
      const info = await getCurrentUserInfo();
      setUser(info);
      console.log("User info from service:", info);
    }
    loadUser();
    document.title = "Profile";
  }, []);

  useEffect(() => {
    //split joinedSessions into past and future sessions
    const now = new Date();
    // console.log("Now is:", now);
    const upcoming = joinedSessions.filter(
      (s) => Date.parse(s.sessionDateTime.iso) >= now
    );
    const past = joinedSessions.filter(
      (s) => Date.parse(s.sessionDateTime.iso) < now
    );
    setUpcomingSessions(upcoming);
    setPastSessions(past);
  }, [joinedSessions]);

  const handleJoin = (id) => (e) => {
    if (e && e.preventDefault) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (onJoinSession) onJoinSession(id);
  };

  return (
    <div className="page">
      <div className="page-header">
        <div className="page-title">Profile</div>
        <LogOutButton onLogout={onLogout} />
      </div>
      <div className="page-content">
        <ProfileCard
          firstName={user.firstName}
          lastName={user.lastName}
          avatar={user.avatar}
          age={user.age}
          skillLevel={user.skillLevel}
        />

        <div className="section-subtitle--spaced">
          <h2 className="page-title">Planned Sessions</h2>
          <div className="stack">
            {upcomingSessions.length > 0 ? (
              upcomingSessions.map((s) => (
                <Link
                  key={s.objectId}
                  to={`/session/${s.objectId}`}
                  style={{ textDecoration: "none" }}
                >
                  <Sessionblock
                    key={s.objectId}
                    spot={s.spotId.spotName}
                    dateLabel={s.dateLabel}
                    timeLabel={s.timeLabel}
                    windKts={s.windPower}
                    tempC={s.temperature}
                    weather={s.weatherType}
                    windDir={s.windDirection}
                    avatars={defaultAvatars}
                    onJoin={handleJoin(s.id)}
                    isJoined={joinedSessions.includes(s.id)}
                  />
                </Link>
              ))
            ) : (
              <div className="profile-text">
                <p>No Planned Sessions</p>
                <Link to="/">
                  <button className="browse-button">
                    Click to see upcoming Sessions
                  </button>
                </Link>
              </div>
            )}
          </div>
        </div>

        <div className="section-subtitle--spaced">
          <h2 className="page-title">Past Sessions</h2>
          <div className="stack">
            {upcomingSessions.length > 0 ? (
              pastSessions.map((s) => (
                <Link
                  key={s.objectId}
                  to={`/session/${s.objectId}`}
                  style={{ textDecoration: "none" }}
                >
                  <Sessionblock
                    spot={s.spotId.spotName}
                    dateLabel={s.dateLabel}
                    timeLabel={s.timeLabel}
                    windKts={s.windPower}
                    tempC={s.temperature}
                    weather={s.weatherType}
                    windDir={s.windDirection}
                    avatars={defaultAvatars}
                    onJoin={handleJoin(s.id)}
                    isJoined={joinedSessions.includes(s.id)}
                  />
                </Link>
              ))
            ) : (
              <div className="profile-text">
                <p>Join a Session to Build Your History</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
