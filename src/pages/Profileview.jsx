import Parse from "../parse-init";
import ProfileCard from "../components/Profilecard";
import Sessionblock from "../components/Sessionblock";
import { Link } from "react-router-dom";
import ava1 from "../assets/avatar1.png";
import ava2 from "../assets/avatar2.png";
import ava3 from "../assets/avatar3.png";
import { useState, useEffect } from "react";
import { getCurrentUserInfo } from "../services/userservice";
import LogOutButton from "../components/LogOutButton";
import "../styles/BrowseSessions.css";
import TabNavigation from "../components/TabNavigation";
import { unjoinAndRemoveFromJoinedList } from "../utils/unjoinAndRemoveFromJoinedList";

const defaultAvatars = [ava1, ava2, ava3];

export default function ProfileView({ onLogout }) {
  const [user, setUser] = useState({});
  const [joinedSessions, setJoinedSessions] = useState([]);
  const [upcomingSessions, setUpcomingSessions] = useState([]);
  const [pastSessions, setPastSessions] = useState([]);
  const [activeTab, setActiveTab] = useState("planned");
  const [loading, setLoading] = useState(true); //loading notification pattern

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

  //load usersessions for current user via cloud function
  useEffect(() => {
    const user = Parse.User.current();
    if (!user) return;
  
    async function loadUserSessions() {
      setLoading(true);
      try {
        const sessions = await Parse.Cloud.run("loadSessions", {
          filters: { joinedOnly: true },
        });
        console.log("Loaded user sessions in ProfileView via cloud:", sessions);
        setJoinedSessions(sessions);
      } catch (err) {
        console.error("Error loading user sessions in ProfileView:", err);
        setJoinedSessions([]);
      } finally {
        setLoading(false);
      }
    }
  
    loadUserSessions();
  }, []);


  //split joinedSessions into past and future sessions whenever joinedSessions changes
  useEffect(() => {
    console.log("Joined sessions:", joinedSessions);
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
    await unjoinAndRemoveFromJoinedList(id, setJoinedSessions);
  };

  const handleSaveProfile = async (updatedData) => {
    try {
      const currentUser = Parse.User.current();
      if (!currentUser) return;

      // Update Parse backend
      currentUser.set("firstName", updatedData.firstName);
      currentUser.set("typeofSport", updatedData.typeofSport);
      currentUser.set("age", parseInt(updatedData.age));
      currentUser.set("skillLevel", updatedData.skillLevel);
      if (updatedData.avatar) {
        currentUser.set("avatar", updatedData.avatar);
      }

      await currentUser.save();

      // Update local state to reflect changes immediately
      setUser(updatedData);
      console.log("Profile updated successfully");
    } catch (err) {
      console.error("Error saving profile:", err);
    }
  };

  //loading notification pattern
  if (loading) {
    return <div className="page">Loading profile...</div>;
  }

  // render profile view
  return (
    <div className="page">
      <div className="page-header">
        <div className="page-title">Profile</div>
        <LogOutButton onLogout={onLogout} />
      </div>

      <ProfileCard
        firstName={user.firstName}
        typeofSport={user.typeofSport}
        avatar={user.avatar}
        age={user.age}
        skillLevel={user.skillLevel}
        onSaveProfile={handleSaveProfile}
      />

      <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

      {activeTab === "planned" && (
        <>
          <div className="stack">
            {upcomingSessions.length > 0 ? (
              upcomingSessions.map((s) => (
                <Link
                  key={s.id}
                  to={`/session/${s.id}`}
                  className="session-link"
                >
                  <Sessionblock
                    key={s.id}
                    spot={s.spotName}
                    dateLabel={s.dateLabel}
                    timeLabel={s.timeLabel}
                    windKts={s.windPower}
                    tempC={s.temperature}
                    weather={s.weatherType}
                    windDir={s.windDirection}
                    coastDirection={s.coastDirection}
                    avatars={defaultAvatars}
                    onJoin={handleUnjoin(s.id)}
                    isJoined={true}
                  />
                </Link>
              ))
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

      {activeTab === "past" && (
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
