import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/variables.css";
import "./styles/globals.css";
import App from "./components/App/App.jsx"; // <-- correct path

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
