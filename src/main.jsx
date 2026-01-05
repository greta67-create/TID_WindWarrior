import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./parse-init.js";
// import "./testParseConnection";
import "./index.css";
import App from "./App.jsx";

/* PARSE API */
/*Parse.initialize();*/
/*Parse.serverURL=""*/

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
