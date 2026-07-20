import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./app/App.tsx";
import AuthProvider from "./app/providers/AuthProvider.tsx";
import "./api/interceptors";

import "./styles/reset.css";
import "./styles/variables.css";
import "./styles/globals.css";

import { Toaster } from "react-hot-toast";
import { LoaderProvider } from "./contexts/LoaderContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <LoaderProvider>
        <AuthProvider>
          <App />
          <Toaster position="top-right" />
        </AuthProvider>
      </LoaderProvider>
    </BrowserRouter>
  </StrictMode>,
);
