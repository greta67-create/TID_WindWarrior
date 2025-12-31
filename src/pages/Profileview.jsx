import "../App.css";
import Parse from "../parse-init"; //initializes Parse for API calls
import ProfileCard from "../components/Profilecard";
import Sessionblock from "../components/Sessionblock";
import { Link } from "react-router-dom"; //enables navigation with client-side routing
import ava1 from "../assets/avatar1.png";
import ava2 from "../assets/avatar2.png";
import ava3 from "../assets/avatar3.png";
import { useState, useEffect } from "react"; // enables you to manage state and side effects in functional components
import { getCurrentUserInfo, updateUserProfile } from "../services/userservice"; // fetches current user info from Parse backend
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
      setUser(info || {}); // Use empty object if null to prevent crashes
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
      (s) => s.sessionDateTime && s.sessionDateTime >= now // sessiondatetime needs to be defined (not null) and now or later than now
    );
    const past = joinedSessions.filter(
      (s) => s.sessionDateTime && s.sessionDateTime < now
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
      // Update profile in backend via service
      const updatedUser = await updateUserProfile(updatedData);

      // Update local state with new data from backend
      if (updatedUser) {
        setUser(updatedUser);
        console.log("Profile updated successfully");
      }
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

      <ProfileCard //passes props to Profilecard.jsx
        firstName={user.firstName}
        typeofSport={user.typeofSport}
        avatar={user.avatar}
        age={user.age}
        skillLevel={user.skillLevel}
        onSaveProfile={handleSaveProfile}
      />

      <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

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
