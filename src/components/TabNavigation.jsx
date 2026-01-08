import "../styles/TabNavigation.css";

// TabNavigation component (exactly 2 tabs)
// defaults to Profile tabs if tabs prop not provided
export default function TabNavigation({ activeTab, onTabChange, tabs }) {
  const defaultTabs = [
    { id: "planned", label: "Planned Sessions" },
    { id: "past", label: "Past Sessions" },
  ];
  
  // take props if provided 
  const tabsToRender = tabs || defaultTabs;

  return (
    <div className="tab-navigation">
      <button
        onClick={() => onTabChange(tabsToRender[0].id)}
        className={`tab-button ${activeTab === tabsToRender[0].id ? "active" : ""}`}
      >
        {tabsToRender[0].label}
      </button>
      <button
        onClick={() => onTabChange(tabsToRender[1].id)}
        className={`tab-button ${activeTab === tabsToRender[1].id ? "active" : ""}`}
      >
        {tabsToRender[1].label}
      </button>
    </div>
  );
}
