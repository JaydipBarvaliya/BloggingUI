import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation 
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
import Unauthorized from "./pages/Unauthorized.js";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ToastContainer } from "react-toastify";
import BlogEditor from "./components/BlogEditor";
import "./App.css";

const AppRoutes = () => {
  const { isLoggedIn } = useAuth(); // Get auth status from context
  const location = useLocation(); // Use the hook to access location

  return (
    <Routes>
      {/* Public routes */}
      <Route
        path="/login"
        element={
          isLoggedIn && !location.state?.from ? <Navigate to="/" /> : <Login />
        }
      />

      <Route path="/register" element={<RegistrationPage />} />
      <Route path="/" element={<Homepage />} />
      <Route path="/blogs/:slug" element={<BlogDetails />} />
      <Route path="/categories/:category" element={<CategoryBlogsPage />} />

      {/* Private routes for restricted activities */}
      <Route
        path="/favorites"
        element={
          <PrivateRoute allowedRoles={["USER", "ADMIN"]}>
            <FavoritesPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <PrivateRoute allowedRoles={["USER", "ADMIN"]}>
            <ProfilePage />
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/create-blog"
        element={
          <PrivateRoute allowedRoles={["ADMIN"]}>
            <BlogEditor />
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/create-blog/:blogId"
        element={
          <PrivateRoute allowedRoles={["ADMIN"]}>
            <BlogEditor />
          </PrivateRoute>
        }
      />

      {/* Unauthorized and not found pages */}
      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route path="/page-not-found" element={<NotFoundPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

const App = () => {
  // Manage dark mode state and apply the appropriate class to the document
  const [isDarkMode, setIsDarkMode] = useState(
    () => localStorage.getItem("darkMode") === "true"
  );

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem("darkMode", newMode);
    document.documentElement.classList.toggle("dark", newMode);
  };

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
          <main className="flex-grow bg-gray-100 dark:bg-gray-900 ">
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
