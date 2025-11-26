import "../App.css";
import Parse from "../parse-init";
import ProfileCard from "../components/Profilecard";
import "../styles/Logoutbutton.css";
import Sessionblock from "../components/Sessionblock";
import { Link } from "react-router-dom";
import ava1 from "../assets/avatar1.png";
import ava2 from "../assets/avatar2.png";
import ava3 from "../assets/avatar3.png";
import { useState, useEffect } from "react";

const defaultAvatars = [ava1, ava2, ava3];

export default function ProfileView({
  sessions = [],
  onJoinSession,
  joinedSessions = [],
  onLogout,
}) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [avatar, setAvatar] = useState(ava1);
  const [age, setAge] = useState(null);
  const [skillLevel, setSkillLevel] = useState("");

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
            {sessions.map((s) => (
              <Link
                key={s.id}
                to={`/session/${s.id}`}
                style={{ textDecoration: "none" }}
              >
                <Sessionblock
                  spot={s.spot}
                  dateLabel={s.dateLabel}
                  timeLabel={s.timeLabel}
                  windKts={s.windKts}
                  tempC={s.tempC}
                  weather={s.weather}
                  windDir={s.windDir}
                  avatars={defaultAvatars}
                  onJoin={handleJoin(s.id)}
                  isJoined={joinedSessions.includes(s.id)}
                />
              </Link>
            ))}
          </div>
        </div>
      </div>
      <div className="section-subtitle">
        <h2 className="page-title">Past Sessions</h2>
        <div className="stack">
          <Sessionblock isJoined={true} joinedText={"Joined"} />
        </div>
      </div>
    </div>
  );
}
