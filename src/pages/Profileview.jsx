import "../App.css";
import Parse from "../parse-init";
import ProfileCard from "../components/Profilecard";
import SessionList from "../components/ProfileSessions";
import { useState, useEffect } from "react";
import { getCurrentUserInfo, updateUserProfile } from "../services/userservice";
import LogOutButton from "../components/LogOutButton";
import Page from "../components/Page";
import "../styles/BrowseSessions.css";
import TabNavigation from "../components/TabNavigation";
import { unjoinAndRemoveFromJoinedList } from "../utils/unjoinAndRemoveFromJoinedList"; //Helper function to unjoin a session and remove it from joinedSessions list

export default function ProfileView({ onLogout }) {
  const [user, setUser] = useState({});
  const [joinedSessions, setJoinedSessions] = useState([]);
  const [upcomingSessions, setUpcomingSessions] = useState([]);
  const [pastSessions, setPastSessions] = useState([]);
  const [activeTab, setActiveTab] = useState("planned");
  const [loading, setLoading] = useState(true);

  // Load user info and set user state (stores user information in the user state)
  useEffect(() => {
    async function loadUser() {
      const info = await getCurrentUserInfo();
      setUser(info || {});
    }
    loadUser();
  }, []);

  // Load user sessions for current user via cloud function
  useEffect(() => {
    const currentUser = Parse.User.current();
    if (!currentUser) return; // If no user is logged in, exit early (return)

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
    e.preventDefault();
    e.stopPropagation();
    await unjoinAndRemoveFromJoinedList(id, setJoinedSessions);
  };

  // Save profile
  const handleSaveProfile = async (updatedData) => {
    try {
      const updatedUser = await updateUserProfile(updatedData);
      if (updatedUser) {
        setUser(updatedUser);
        console.log("Profile updated successfully");
      }
    } catch (error) {
      console.error("Error saving profile:", error);

      // If error message from Parse server, display it to the user
      if (error.message) {
        alert(error.message);
      } else {
        alert("Failed to update profile. Please try again.");
      }
    }
  };

  if (loading) {
    return <div className="page">Loading profile...</div>;
  }

  return (
    <Page
      title="Profile"
      rightContent={<LogOutButton onLogout={onLogout} />}
    >
      <ProfileCard //passes props to Profilecard.jsx
        firstName={user.firstName}
        typeofSport={user.typeofSport}
        avatar={user.avatar}
        age={user.age}
        skillLevel={user.skillLevel}
        onSaveProfile={handleSaveProfile}
      />
      <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />{" "}
      {activeTab === "planned" && (
        <SessionList
          sessions={upcomingSessions}
          showJoin={true}
          onUnjoin={handleUnjoin}
        />
      )}
      {activeTab === "past" && (
        <SessionList sessions={pastSessions} showJoin={false} />
      )}
    </Page>
  );
}
