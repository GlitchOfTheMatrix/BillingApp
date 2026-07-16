import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./app/App.tsx";

import "./styles/globals.css";
import "./styles/reset.css";
import "./styles/variables.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
