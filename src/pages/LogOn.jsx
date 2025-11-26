import { useState } from "react";
import Parse from "parse";
import { useNavigate } from "react-router-dom";

function Auth({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const user = await Parse.User.logIn(username, password);
      onLogin(user);
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  };

  // This doesn't have any styling right now - don't know if that's needed?
  return (
    <div>
      <h1>Welcome to Wind Warrior!</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <form>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleLogin}>Log In</button>
      </form>
    </div>
  );
}

export default Auth;
