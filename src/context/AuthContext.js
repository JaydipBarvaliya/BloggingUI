// src/context/AuthContext.js
import React, { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(() => !!localStorage.getItem("authToken")); // Check if token exists
  const [userId, setUserId] = useState(() => localStorage.getItem("userId")); // Retrieve userId from localStorage
  const [userDetails, setUserDetails] = useState({
    firstName: localStorage.getItem("firstName"),
    lastName: localStorage.getItem("lastName"),
  }); // Retrieve firstName and lastName as a single object

  useEffect(() => {
    // Ensure state is in sync with localStorage on mount
    const storedToken = localStorage.getItem("authToken");
    const storedUserId = localStorage.getItem("userId");
    const storedFirstName = localStorage.getItem("firstName");
    const storedLastName = localStorage.getItem("lastName");

    if (storedToken && storedUserId) {
      setIsLoggedIn(true);
      setUserId(storedUserId);
      setUserDetails({ firstName: storedFirstName, lastName: storedLastName });
    }
  }, []); // Run only on mount

  const login = (token, userId, firstName, lastName) => {
    localStorage.setItem("authToken", token); // Store the token
    localStorage.setItem("userId", userId); // Store the userId
    localStorage.setItem("firstName", firstName); // Store the firstName
    localStorage.setItem("lastName", lastName); // Store the lastName

    setIsLoggedIn(true);
    setUserId(userId);
    setUserDetails({ firstName, lastName });
  };

  const logout = () => {
    localStorage.removeItem("authToken"); // Remove token
    localStorage.removeItem("userId"); // Remove userId
    localStorage.removeItem("firstName"); // Remove firstName
    localStorage.removeItem("lastName"); // Remove lastName

    setIsLoggedIn(false);
    setUserId(null);
    setUserDetails({ firstName: "", lastName: "" }); // Clear state
  };

  return (
    <AuthContext.Provider
      value={{ isLoggedIn, userId, userDetails, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for using auth context
export const useAuth = () => useContext(AuthContext);
