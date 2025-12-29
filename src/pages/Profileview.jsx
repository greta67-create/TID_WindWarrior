import "../App.css";
import Parse from "../parse-init"; //initializes Parse for API calls
import ProfileCard from "../components/Profilecard";
import Sessionblock from "../components/Sessionblock";
import { Link } from "react-router-dom"; //enables navigation with client-side routing
import ava1 from "../assets/avatar1.png";
import ava2 from "../assets/avatar2.png";
import ava3 from "../assets/avatar3.png";
import { useState, useEffect } from "react"; // enables you to manage state and side effects in functional components
import { getCurrentUserInfo } from "../services/userService"; // fetches current user info from Parse backend
import LogOutButton from "../components/LogOutButton";
import "../styles/BrowseSessions.css";
import TabNavigation from "../components/TabNavigation";
import { unjoinAndRemoveFromJoinedList } from "../utils/unjoinAndRemoveFromJoinedList"; //Helper function to unjoin a session and remove it from joinedSessions list

const defaultAvatars = [ava1, ava2, ava3];

export default function ProfileView({ onLogout }) {
  const [user, setUser] = useState({});
  const [joinedSessions, setJoinedSessions] = useState([]); // list of sessions the current user has joined
  const [upcomingSessions, setUpcomingSessions] = useState([]); // list of sessions the current user has joined in the future
  const [pastSessions, setPastSessions] = useState([]); // list of sessions the current user has joined in the past
  const [activeTab, setActiveTab] = useState("planned"); // current active tab in the profile view
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
    if (!user) return; // If no user is logged in, exit early (return)

    async function loadUserSessions() {
      // if user is logged in, load sessions
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
        setLoading(false); // Removes the loading overlay when the fetch is complete or has failed
      }
    }

    loadUserSessions();
  }, []);

  //split joinedSessions into past and future sessions whenever joinedSessions changes
  useEffect(() => {
    console.log("Joined sessions:", joinedSessions);
    const now = new Date();
    console.log("Now is:", now);

    const upcoming = joinedSessions.filter(
      (s) => s.sessionDateTime !== null && s.sessionDateTime >= now // sessiondatetime needs to be defined (not null) and now or later than now
    );
    const past = joinedSessions.filter(
      (s) => s.sessionDateTime !== null && s.sessionDateTime < now
    );
    setUpcomingSessions(upcoming);
    setPastSessions(past);
    console.log("Upcoming user sessions:", upcoming);
    console.log("Past user sessions:", past);
  }, [joinedSessions]);

  // Passes a session ID to unjoinAndRemoveFromJoinedList function to remove it from joinedSessions list
  const handleUnjoin = (id) => async (e) => {
    await unjoinAndRemoveFromJoinedList(id, setJoinedSessions);
  };

  // Handles saving the profile
  const handleSaveProfile = async (updatedData) => {
    try {
      const currentUser = Parse.User.current();
      if (!currentUser) return;

      // Saves updated data to Parse backend
      currentUser.set("firstName", updatedData.firstName);
      currentUser.set("typeofSport", updatedData.typeofSport);
      currentUser.set("age", parseInt(updatedData.age));
      currentUser.set("skillLevel", updatedData.skillLevel);
      if (updatedData.avatar) {
        currentUser.set("avatar", updatedData.avatar);
      }

      await currentUser.save();

      // Update local state to reflect changes in the profile card
      setUser(updatedData);
      console.log("Profile updated successfully");
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

      <ProfileCard
        firstName={user.firstName}
        typeofSport={user.typeofSport}
        avatar={user.avatar}
        age={user.age}
        skillLevel={user.skillLevel}
        onSaveProfile={handleSaveProfile}
      />

      <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

      {activeTab !== null && activeTab === "planned" && (
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

      {activeTab !== null && activeTab === "past" && (
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
