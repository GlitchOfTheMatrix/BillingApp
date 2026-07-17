import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./app/App.tsx";
import AuthProvider from "./app/providers/AuthProvider.tsx";
import "./api/interceptors";

import "./styles/globals.css";
import "./styles/reset.css";
import "./styles/variables.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
);
