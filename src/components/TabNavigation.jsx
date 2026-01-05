import "../styles/TabNavigation.css";

// TabNavigation component for switching between Planned and Past Sessions tabs
export default function TabNavigation({ activeTab, onTabChange }) {
  return (
    <div className="tab-navigation">
      <button
        onClick={() => onTabChange("planned")}
        className={`tab-button ${activeTab === "planned" ? "active" : ""}`}
      >
        Planned Sessions
      </button>
      <button
        onClick={() => onTabChange("past")}
        className={`tab-button ${activeTab === "past" ? "active" : ""}`}
      >
        Past Sessions
      </button>
    </div>
  );
}
