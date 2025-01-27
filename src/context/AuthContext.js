// src/context/AuthContext.js
import React, { createContext, useState, useContext } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return !!localStorage.getItem("authToken"); // Check if the token exists
  });

  const [userId, setUserId] = useState(() => {
    return localStorage.getItem("userId"); // Retrieve userId from localStorage
  });

  const login = (token, userId) => {
    localStorage.setItem("authToken", token); // Store the token
    localStorage.setItem("userId", userId); // Store the userId
    setIsLoggedIn(true);
    setUserId(userId); // Update state
  };

  const logout = () => {
    localStorage.removeItem("authToken"); // Remove token
    localStorage.removeItem("userId"); // Remove userId
    setIsLoggedIn(false);
    setUserId(null); // Clear state
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, userId, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for using auth context
export const useAuth = () => useContext(AuthContext);
