import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Homepage from "./pages/Homepage";
import BlogDetails from "./pages/BlogDetails";
import Header from "./components/Header";
import Footer from "./components/Footer";
import CategoryBlogsPage from "./components/CategoryBlogsPage";
import PrivateRoute from "./components/PrivateRoute";
import Login from "./components/Login";
import RegistrationPage from "./pages/RegistrationPage";
import FavoritesPage from "./pages/FavoritesPage";
import ProfilePage from "./pages/ProfilePage";
import NotFoundPage from "./pages/NotFoundPage";
import Unauthorized from "./pages/Unauthorized.js"; 
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ToastContainer } from "react-toastify";
import BlogEditor from "./components/BlogEditor";
import "./App.css";

const AppRoutes = () => {
  const { isLoggedIn } = useAuth(); // Fetch isLoggedIn status from context

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={isLoggedIn ? <Navigate to="/" /> : <Login />} />
      <Route path="/register" element={<RegistrationPage />} />

      {/* Private routes */}
      <Route path="/" element={<PrivateRoute allowedRoles={["USER", "ADMIN"]}><Homepage /></PrivateRoute>} />
      <Route path="/blogs/:slug" element={<BlogDetails />} />
      <Route path="/categories/:category" element={<PrivateRoute allowedRoles={["USER", "ADMIN"]}><CategoryBlogsPage /></PrivateRoute>} />
      <Route path="/favorites" element={<PrivateRoute allowedRoles={["USER", "ADMIN"]}><FavoritesPage /></PrivateRoute>} />
      <Route path="/profile" element={<PrivateRoute allowedRoles={["USER", "ADMIN"]}><ProfilePage /></PrivateRoute>} />

      {/* Admin route for blog creation */}
      <Route path="/admin/create-blog" element={<PrivateRoute allowedRoles={["ADMIN"]}><BlogEditor /></PrivateRoute>} />

      {/* Unauthorized page */}
      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* Not found routes */}
      <Route path="*" element={<NotFoundPage />} />
      <Route path="/page-not-found" element={<NotFoundPage />} />
      <Route path="/admin/create-blog/:blogId" element={<PrivateRoute allowedRoles={["ADMIN"]}><BlogEditor /></PrivateRoute>} />
    </Routes>
  );
};

const App = () => {
  // Dark mode state management
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem("darkMode") === "true";
  });

  // Toggle dark mode and save to localStorage
  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem("darkMode", newMode);
    document.documentElement.classList.toggle("dark", newMode);
  };

  // Apply dark mode class on mount/update
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  return (
    <AuthProvider>
      <Router>
        <div className={`${isDarkMode ? "dark" : ""} flex flex-col min-h-screen`}>
          <Header toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />
          <main className="flex-grow bg-gray-100 dark:bg-gray-900">
            <ToastContainer position="top-center" autoClose={3000} />
            <AppRoutes />
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
