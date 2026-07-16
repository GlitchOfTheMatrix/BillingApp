import React, { StrictMode } from "react";
import ReactDOM, { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./app/App.tsx";
import "./api/interceptors";

import "./styles/globals.css";
import "./styles/reset.css";
import "./styles/variables.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
