import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
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
import { AuthProvider } from "./context/AuthContext";
import { ToastContainer } from "react-toastify";
import BlogEditor from "./components/BlogEditor"; // Import the new BlogEditor component

import "./App.css";

const App = () => {
  const isLoggedIn = !!localStorage.getItem("authToken"); // Check if user is logged in

  // Retrieve initial mode from local storage or default to false
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem("darkMode") === "true";
  });

  // Toggle dark mode and save it to local storage
  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem("darkMode", newMode);
    document.documentElement.classList.toggle("dark", newMode);
  };

  // Apply the mode from local storage on initial load
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
        <div
          className={`${isDarkMode ? "dark" : ""} flex flex-col min-h-screen`}
        >
          <Header toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />
          <main className="flex-grow bg-gray-100 dark:bg-gray-900">
            <ToastContainer position="top-center" autoClose={3000} />

            <Routes>
              {/* Public route for Login */}
              <Route
                path="/login"
                element={isLoggedIn ? <Navigate to="/" /> : <Login />}
              />
              <Route path="/register" element={<RegistrationPage />} />

              {/* Private routes */}
              <Route path="/" element={<PrivateRoute><Homepage /></PrivateRoute>} />
              <Route path="/blogs/:slug" element={<BlogDetails />} />
              <Route
                path="/categories/:category"
                element={<PrivateRoute><CategoryBlogsPage /></PrivateRoute>}
              />
              <Route
                path="/favorites"
                element={<PrivateRoute><FavoritesPage /></PrivateRoute>}
              />
              <Route
                path="/profile"
                element={<PrivateRoute><ProfilePage /></PrivateRoute>}
              />

              {/* Admin route for blog creation */}
              <Route
                path="/admin/create-blog"
                element={isLoggedIn ? <BlogEditor /> : <Navigate to="/login" />}
              />

              {/* Not found route */}
              <Route path="*" element={<NotFoundPage />} />
              <Route path="/page-not-found" element={<NotFoundPage />} />
              <Route path="/admin/create-blog/:blogId" element={<BlogEditor />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
