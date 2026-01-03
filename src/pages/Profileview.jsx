import "../App.css";
import Parse from "../parse-init";
import ProfileCard from "../components/Profilecard";
import Sessionblock from "../components/Sessionblock";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { getCurrentUserInfo, updateUserProfile } from "../services/userservice";
import LogOutButton from "../components/LogOutButton";
import "../styles/BrowseSessions.css";
import TabNavigation from "../components/TabNavigation";
import { unjoinAndRemoveFromJoinedList } from "../utils/unjoinAndRemoveFromJoinedList";

export default function ProfileView({ onLogout }) {
  const [user, setUser] = useState({});
  const [joinedSessions, setJoinedSessions] = useState([]);
  const [upcomingSessions, setUpcomingSessions] = useState([]);
  const [pastSessions, setPastSessions] = useState([]);
  const [activeTab, setActiveTab] = useState("planned");
  const [loading, setLoading] = useState(true);

  // Load user info
  useEffect(() => {
    async function loadUser() {
      const info = await getCurrentUserInfo();
      setUser(info || {});
    }
    loadUser();
  }, []);

  // Load user sessions via cloud function
  useEffect(() => {
    const currentUser = Parse.User.current();
    if (!currentUser) return;

    async function loadUserSessions() {
      setLoading(true);
      try {
        const sessions = await Parse.Cloud.run("loadSessions", {
          filters: { joinedByCurrentUser: true },
        });
        console.log("Loaded user sessions in ProfileView:", sessions);
        setJoinedSessions(sessions);
      } catch (err) {
        console.error("Error loading user sessions:", err);
        setJoinedSessions([]);
      } finally {
        setLoading(false);
      }
    }

    loadUserSessions();
  }, []);

  // Split joinedSessions into past and future
  useEffect(() => {
    const now = new Date();
    const upcoming = joinedSessions.filter(
      (s) => s.sessionDateTime && s.sessionDateTime >= now
    );
    const past = joinedSessions.filter(
      (s) => s.sessionDateTime && s.sessionDateTime < now
    );
    setUpcomingSessions(upcoming);
    setPastSessions(past);
  }, [joinedSessions]);

  // Unjoin and remove from list
  const handleUnjoin = (id) => async (e) => {
    await unjoinAndRemoveFromJoinedList(id, setJoinedSessions, e);
  };

  // Save profile
  const handleSaveProfile = async (updatedData) => {
    try {
      const updatedUser = await updateUserProfile(updatedData);
      if (updatedUser) {
        setUser(updatedUser);
        console.log("Profile updated successfully");
      }
    } catch (err) {
      console.error("Error saving profile:", err);
    }
  };

  if (loading) {
    return <div className="page">Loading profile...</div>;
  }

  return (
    <div className="page">
      <div className="page-header">
        <div className="page-title">Profile</div>
        <LogOutButton onLogout={onLogout} />
      </div>
      <ProfileCard //passes props to Profilecard.jsx
        firstName={user.firstName}
        typeofSport={user.typeofSport}
        avatar={user.avatar}
        age={user.age}
        skillLevel={user.skillLevel}
        onSaveProfile={handleSaveProfile}
      />
      <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />{" "}
      {/* function passed down to TabNavigation.jsx */}
      {activeTab === "planned" && ( //conditional rendering of planned sessions - if true, render the following JSX
        <>
          <div className="stack">
            {upcomingSessions.length > 0 ? ( //conditional rendering of upcoming sessions - if true, render the following JSX
              upcomingSessions.map(
                (
                  s //map through upcomingSessions array
                ) => (
                  <Link //links to session view page are created here
                    key={s.id} //key is used to uniquely identify the session in the array
                    to={`/session/${s.id}`} //links to session view page are created here
                    className="session-link"
                  >
                    <Sessionblock //renders a Sessionblock component for each session
                      key={s.id} //key is used to uniquely identify the session in the array
                      spot={s.spotName}
                      dateLabel={s.dateLabel}
                      timeLabel={s.timeLabel}
                      windKts={s.windPower}
                      tempC={s.temperature}
                      weather={s.weatherType}
                      windDir={s.windDirection}
                      coastDirection={s.coastDirection}
                      avatars={defaultAvatars}
                      onJoin={handleUnjoin(s.id)} //onJoin is set to the handleUnjoin function for each session
                      isJoined={true} //isJoined is set to true for all sessions in the upcomingSessions array
                    />
                  </Link>
                )
              )
            ) : (
              <div className="empty-profileview">
                <p>No Planned Sessions</p>
                <Link to="/">
                  <button className="browse-button">
                    Click to see Upcoming Sessions
                  </button>
                </Link>
              </div>
            )}
          </div>
        </>
      )}
      {activeTab === "past" && ( //conditional rendering of past sessions - if true, render the following JSX
        <>
          <div className="stack">
            {pastSessions.length > 0 ? (
              pastSessions.map((s) => (
                <Link
                  key={s.id}
                  to={`/session/${s.id}`}
                  className="session-link"
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
                    showJoin={false}
                  />
                </Link>
              ))
            ) : (
              <div className="empty-profileview">
                <p>Join a Session to Build Your History</p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
