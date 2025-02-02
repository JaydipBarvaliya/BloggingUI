import React, { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState(null);
  const [userDetails, setUserDetails] = useState({ firstName: "", lastName: "" });

  // Sync state with localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem("authToken");
    const storedUserId = localStorage.getItem("userId");
    const storedFirstName = localStorage.getItem("firstName");
    const storedLastName = localStorage.getItem("lastName");

    if (storedToken && storedUserId) {
      setIsLoggedIn(true);
      setUserId(storedUserId);
      setUserDetails({ firstName: storedFirstName || "", lastName: storedLastName || "" });
    }
  }, []); // Dependency array ensures this runs only once on mount

  const login = (token, userId, firstName, lastName) => {
    // Update localStorage
    localStorage.setItem("authToken", token);
    localStorage.setItem("userId", userId);
    localStorage.setItem("firstName", firstName);
    localStorage.setItem("lastName", lastName);

    // Update state
    setIsLoggedIn(true);
    setUserId(userId);
    setUserDetails({ firstName, lastName });
  };

  const logout = () => {
    // Clear localStorage
    localStorage.removeItem("authToken");
    localStorage.removeItem("userId");
    localStorage.removeItem("firstName");
    localStorage.removeItem("lastName");

    // Reset state
    setIsLoggedIn(false);
    setUserId(null);
    setUserDetails({ firstName: "", lastName: "" });
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
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
