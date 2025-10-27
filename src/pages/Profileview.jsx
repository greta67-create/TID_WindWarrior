import "../App.css";
import ProfileCard from "../components/Profilecard";
import Sessionblock from "../components/Sessionblock";

export default function ProfileView() {
  return (
    <div className="page">
      <div className="page-header">
        <div className="page-title">Profile</div>
      </div>
      <div className="page-content">
        <ProfileCard />
        <div style={{ marginTop: "2rem" }}>
          <h2 style={{ marginBottom: "1rem" }}>Planned Sessions</h2>
          <Sessionblock />
        </div>
      </div>
      <div style={{ marginTop: "2rem" }}>
        <h2 style={{ marginBottom: "1rem" }}>Past Sessions</h2>
        <div>
          <Sessionblock />
          <Sessionblock />
        </div>
      </div>
    </div>
  );
}
