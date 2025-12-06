import "../styles/TabNavigation.css";

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
