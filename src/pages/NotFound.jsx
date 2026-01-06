import { Link } from "react-router-dom";
import "../styles/NotFound.css";

export default function NotFound() {
  return (
    <div className="page not-found">
      <h1>404</h1>
      <p>Page not found</p>
      <Link to="/">
        <button className="browse-button">Return to Feed</button>
      </Link>
    </div>
  );
}

