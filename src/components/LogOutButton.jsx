import "../styles/Logoutbutton.css";

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
