import { useState } from "react"; // saves the state of the input fields - what the user types in
import { useNavigate } from "react-router-dom"; // A hook from a React Router library that allows navigation between different pages
import { logInB4A } from "../services/authService"; // import the logIn function from authService.js

//receives the prop onLogin from the parent App.jsx
export default function LogOn({ onLogin }) {
  const navigate = useNavigate(); // Initializes navigate function to be able to navigate the user to different pages
  const [username, setUsername] = useState(""); // creates a state variable for username input
  const [password, setPassword] = useState(""); // creates a state variable for password input
  const [error, setError] = useState(""); // creates a state variable for error messages

  // function that handles the login process when the form is submitted
  const handleLogin = async (e) => {
    e.preventDefault(); // prevents the default form submission behavior - which means that the page won't reload when the form is submitted
    setError(""); // resets any previous error messages

    try {
      const userData = await logInB4A(username, password); // calls the logInB4A function with the provided username and password. If login succeeds, userData will get the info that authService.js returns
      onLogin(userData); // gives userdata to App.jsx and tells it that the user is logged in and saves the user info in App.jsx state
      navigate("/"); // navigates the user to the home page after successful login
      // if login fails, an error is thrown and caught in the catch block
    } catch (err) {
      if (err.code === 101) {
        setError("Wrong username or password");
      } else {
        setError("An error occurred – please try again");
      }
    }
  };

  return (
    <div className="auth-page">
      <h1>Wind Warrior Login</h1>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">Log In</button>
      </form>
    </div>
  );
}
