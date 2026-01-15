// src/main.jsx  (or src/index.jsx – keep the same filename you already use)
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { WishlistProvider } from "./context/WishlistContext";
import AuthProvider from "./context/AuthContext";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AuthProvider>
      <WishlistProvider>
        <App />
      </WishlistProvider>
    </AuthProvider>
  </BrowserRouter>
);
