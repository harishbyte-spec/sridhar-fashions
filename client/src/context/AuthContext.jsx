// src/context/AuthContext.jsx
import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // Load saved user from storage
  useEffect(() => {
    const saved = localStorage.getItem("authUser");
    if (saved) setUser(JSON.parse(saved));
  }, []);

  // Login
  const loginUser = (data) => {
    setUser(data);
    localStorage.setItem("authUser", JSON.stringify(data));
  };

  // Logout
  const logoutUser = () => {
    setUser(null);
    localStorage.removeItem("authUser");
    localStorage.removeItem("authToken");
    localStorage.removeItem("role");

  };

  // Update user data (for profile changes)
  const updateUser = (data) => {
    setUser((prev) => {
      const updated = { ...prev, ...data };
      localStorage.setItem("authUser", JSON.stringify(updated));
      return updated;
    });
  };

  // Derived admin check
  const isAdmin = user?.role === "admin";

  return (
    <AuthContext.Provider value={{ user, isAdmin, loginUser, logoutUser, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}
