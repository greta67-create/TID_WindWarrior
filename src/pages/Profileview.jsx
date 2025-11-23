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
  unjoinSession,
} from "../services/usersessionService";
import { getCurrentUserInfo } from "../services/userservice";
import LogOutButton from "../components/LogOutButton";
import "../styles/BrowseSessions.css";

const defaultAvatars = [ava1, ava2, ava3];

export default function ProfileView({ onLogout }) {
  const [user, setUser] = useState({});
  const [joinedSessions, setJoinedSessions] = useState([]);
  const [upcomingSessions, setUpcomingSessions] = useState([]);
  const [pastSessions, setPastSessions] = useState([]);

  // flow is fetchUserSessions → setJoinedSessions → effect runs → setUpcomingSessions + setPastSessions

  // load user info and stores in user state
  useEffect(() => {
    async function loadUser() {
      const info = await getCurrentUserInfo();
      setUser(info);
      console.log("User info from service:", info);
    }
    loadUser();
  }, []);

  // load current, joined user sessions
  useEffect(() => {
    const user = Parse.User.current();
    if (!user) return;
    //load Usersessions for specific user from backend
    async function loadUserSessions() {
      try {
        const sessions = await fetchUserSessions(user);
        console.log("Loaded user sessions in ProfileView:", sessions);
        setJoinedSessions(sessions); //stores in joinedSessions state
      } catch (err) {
        console.error("Error loading user sessions in ProfileView:", err);
      }
    }

    loadUserSessions();
  }, []);

  //split joinedSessions into past and future sessions whenever joinedSessions changes
  useEffect(() => {
    //split joinedSessions into past and future sessions
    const now = new Date();
    console.log("Now is:", now);
    const upcoming = joinedSessions.filter(
      (s) => s.sessionDateTime && s.sessionDateTime >= now
    );

    const past = joinedSessions.filter(
      (s) => s.sessionDateTime && s.sessionDateTime < now
    );
    setUpcomingSessions(upcoming);
    setPastSessions(past);
    console.log("Upcoming user sessions:", upcoming);
    console.log("Past user sessions:", past);
  }, [joinedSessions]);

  const handleUnjoin = (id) => async (e) => {
    if (e && e.preventDefault) {
      e.preventDefault();
      e.stopPropagation();
    }
    // In the profile view, all listed sessions are joined so clicking again unjoins them
    try {
      //call backend to unjoin
      await unjoinSession(id);
      console.log("Unjoined session from ProfileView:", id);

      // Remove the session  so it disappears from Planned/Past lists
      setJoinedSessions((prev) =>
        prev.filter(
          (s) =>
            // s.objectId !== id && // for raw Parse-style objects
            s.id !== id // in case fetchUserSessions maps id differently
        )
      );
    } catch (err) {
      console.error("Error unjoining session from ProfileView:", err);
    }
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
                <Link key={s.id} to={`/session/${s.id}`}>
                  <Sessionblock
                    key={s.id}
                    spot={s.spotName}
                    dateLabel={
                      s.sessionDateTime
                        ? s.sessionDateTime.toLocaleDateString()
                        : "-"
                    }
                    timeLabel={
                      s.sessionDateTime
                        ? s.sessionDateTime.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "-"
                    }
                    // please keep the following below
                    // dateLabel={s.dateLabel}
                    // timeLabel={s.timeLabel}
                    windKts={s.windPower}
                    tempC={s.temperature}
                    weather={s.weatherType}
                    windDir={s.windDirection}
                    avatars={defaultAvatars}
                    onJoin={handleUnjoin(s.id)}
                    isJoined={true}
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
            {pastSessions.length > 0 ? (
              pastSessions.map((s) => (
                <Link key={s.id} to={`/session/${s.id}`}>
                  <Sessionblock
                    spot={s.spotName}
                    dateLabel={
                      s.sessionDateTime
                        ? s.sessionDateTime.toLocaleDateString()
                        : "-"
                    }
                    timeLabel={
                      s.sessionDateTime
                        ? s.sessionDateTime.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "-"
                    }
                    // please keep the following below
                    // dateLabel={s.dateLabel}
                    // timeLabel={s.timeLabel}
                    windKts={s.windPower}
                    tempC={s.temperature}
                    weather={s.weatherType}
                    windDir={s.windDirection}
                    avatars={defaultAvatars}
                    showJoin={false} //no join needed as these are past sessions
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
