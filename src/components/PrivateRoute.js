import React from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const isLoggedIn = !!localStorage.getItem("authToken"); // Check if the user is logged in
  return isLoggedIn ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
