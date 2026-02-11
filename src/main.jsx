import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import ScrollToTop from "./components/router/ScrollToTop.jsx";

import "./styles/variables.css";
import "./styles/globals.css";
import App from "./components/App/App.jsx"; // <-- correct path

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <ScrollToTop behavior="smooth" />
      <App />
    </BrowserRouter>
  </StrictMode>
);
