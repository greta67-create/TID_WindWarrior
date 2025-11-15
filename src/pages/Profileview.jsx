import "../App.css";
import Parse from "../parse-init";
import ProfileCard from "../components/Profilecard";
import "../styles/Logoutbutton.css";
import Sessionblock from "../components/Sessionblock";
import { Link } from "react-router-dom";
import ava1 from "../assets/avatar1.png";
import ava2 from "../assets/avatar2.png";
import ava3 from "../assets/avatar3.png";
import { useState, useEffect, use } from "react";

const defaultAvatars = [ava1, ava2, ava3];

export default function ProfileView({
  onJoinSession,
  joinedSessions = [],
  onLogout,
}) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [avatar, setAvatar] = useState(ava1);
  const [age, setAge] = useState(null);
  const [skillLevel, setSkillLevel] = useState("");
  const [upcomingSessions, setUpcomingSessions] = useState([]);
  const [pastSessions, setPastSessions] = useState([]);

  useEffect(() => {
    document.title = "Profile";
    // Get info from db
    const current = Parse.User.current();
    if (!current) return;

    current
      .fetch()
      .then((user) => {
        // Get name fields
        const nm = user.get("name") || user.get("username") || "";
        const fn = user.get("firstName") || nm;
        const ln = user.get("lastName") || "";
        setFirstName(fn);
        setLastName(ln);

        // Get avatar
        let url = ava1;
        const avatarField = user.get("avatar");
        const avatarUrlField = user.get("avatarUrl");
        if (avatarField && typeof avatarField.url === "function") {
          url = avatarField.url();
        } else if (typeof avatarField === "string" && avatarField) {
          url = avatarField;
        } else if (typeof avatarUrlField === "string" && avatarUrlField) {
          url = avatarUrlField;
        }
        setAvatar(url);

        // Get age and skill level
        const ageVal = user.get("age");
        const levelVal = user.get("skillLevel") || user.get("level");
        if (ageVal !== undefined && ageVal !== null) setAge(ageVal);
        if (levelVal) setSkillLevel(levelVal);
      })
      .catch((e) => console.warn("Failed to fetch user:", e));
  }, []);

  useEffect(() => {
    //split joinedSessions into past and future sessions
    const now = new Date();
    console.log("Now is:", now);
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
        {onLogout && (
          <button
            className="logout-button logout-button--top-right"
            onClick={onLogout}
          >
            Log Out
          </button>
        )}
      </div>
      <div className="page-content">
        <ProfileCard
          firstName={firstName}
          lastName={lastName}
          avatar={avatar}
          age={age}
          skillLevel={skillLevel}
        />

        <div className="section-subtitle">
          <h2 className="page-title">Planned Sessions</h2>
          <div className="stack">
            {upcomingSessions.map((s) => (
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
            ))}
          </div>
        </div>

        <div className="section-subtitle">
          <h2 className="page-title">Past Sessions</h2>
          <div className="stack">
            {pastSessions.map((s) => (
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
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
