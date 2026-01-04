import "../styles/Logoutbutton.css";

// LogOutButton component that renders a logout button - calls onLogout when clicked
export default function LogOutButton({ onLogout }) {
  return (
    onLogout && (
      <button
        className="logout-button logout-button--top-right"
        onClick={onLogout}
      >
        Log Out
      </button>
    )
  );
}
