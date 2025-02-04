import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { GoogleOAuthProvider } from "@react-oauth/google";

const root = ReactDOM.createRoot(document.getElementById("root")); // Initialize root
root.render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId="945775136627-k0hu3p186etic88bgfhi3snvhagelaqp.apps.googleusercontent.com">
      <App />
    </GoogleOAuthProvider>
  </React.StrictMode>
);
