import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserCircle,
  faHeart,
  faPen,
} from "@fortawesome/free-solid-svg-icons";
import { fetchCategories, fetchUserDetails } from "../api/axios";
import LoginModal from "../components/LoginModal";
import { ReactComponent as Logo } from "../assests/Logo.svg";

const Header = ({ toggleDarkMode, isDarkMode }) => {
  const { userId, role, isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [firstName, setFirstName] = useState("Profile");
  const [loginModalOpen, setLoginModalOpen] = useState(false); // New state for LoginModal
  const dropdownRef = useRef(null);

  // Handle logout: clear context and optionally localStorage, then navigate to the login page.
  const handleLogout = () => {
    logout();
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("role");
    localStorage.removeItem("userDetails");
    localStorage.removeItem("redirectAfterLogin");
    setProfileMenuOpen(false);
    navigate("/login");
  };

  // Fetch categories on mount (public content)
  useEffect(() => {
    fetchCategories()
      .then((data) => setCategories(data))
      .catch((error) => console.error("Error fetching categories:", error));
  }, []);

  // Fetch user details if logged in
  useEffect(() => {
    if (isLoggedIn && userId) {
      fetchUserDetails(userId)
        .then((data) => setFirstName(data.firstName || "Profile"))
        .catch((error) => console.error("Error fetching user details:", error));
    }
  }, [isLoggedIn, userId]);

  // Close dropdown if clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setProfileMenuOpen(false);
      }
    };

    if (profileMenuOpen) {
      window.addEventListener("click", handleClickOutside);
    }
    return () => {
      window.removeEventListener("click", handleClickOutside);
    };
  }, [profileMenuOpen]);

  // Handler for Favorites click. If not logged in, open the LoginModal.
  const handleFavoritesClick = () => {
    if (isLoggedIn) {
      navigate("/favorites");
    } else {
      localStorage.setItem("redirectAfterLogin", window.location.pathname);
      setLoginModalOpen(true);
    }
  };

  return (
    <header className="bg-gray-100 dark:bg-gray-900 py-2 shadow-md sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center px-4 h-16">
        <Link to="/" className="flex items-center space-x-2">
          <Logo className="w-12 h-12" /> {/* Reduce from w-16 h-16 */}
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
            Data Blogs
          </h1>
        </Link>

        {/* Categories navigation styled as pill links with active state */}
        <nav className="flex space-x-2">
          {categories.map((category) => {
            const isActive = location.pathname === `/categories/${category}`;
            return (
              <Link
                key={category}
                to={`/categories/${category}`}
                className={`px-3 py-1 rounded-full transition duration-300 
                  ${
                    isActive
                      ? "bg-blue-300 dark:bg-blue-700 text-blue-900 dark:text-blue-100"
                      : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 hover:bg-blue-200 dark:hover:bg-blue-800"
                  }`}
              >
                {category}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center space-x-4">
          {isLoggedIn && role === "ADMIN" && (
            <button
              onClick={() => navigate("/admin/create-blog")}
              className="flex items-center bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-700"
            >
              <FontAwesomeIcon icon={faPen} className="mr-2" />
              Editor
            </button>
          )}

          {/* Favorites button is always visible. */}
          <button
            onClick={handleFavoritesClick}
            className="flex items-center bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-700"
          >
            <FontAwesomeIcon icon={faHeart} className="mr-2 text-red-500" />
            Favorites
          </button>

          <button
            onClick={toggleDarkMode}
            className="bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 px-4 py-2 rounded-lg"
          >
            {isDarkMode ? "Light Mode" : "Dark Mode"}
          </button>

          {/* Show profile dropdown if logged in; otherwise show Login button */}
          {isLoggedIn ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setProfileMenuOpen((prev) => !prev)}
                className="flex items-center space-x-2 bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 px-4 py-2 rounded-lg"
              >
                <FontAwesomeIcon icon={faUserCircle} size="lg" />
                <span>{firstName}</span>
              </button>
              {profileMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 shadow-md rounded-lg">
                  <button
                    onClick={() => navigate("/profile")}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200"
                  >
                    Profile
                  </button>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 hover:bg-red-200 dark:hover:bg-red-600 text-red-600 dark:text-red-400 font-semibold rounded-lg transition duration-300 ease-in-out"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="flex items-center space-x-2 bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 px-4 py-2 rounded-lg"
            >
              <FontAwesomeIcon icon={faUserCircle} size="lg" />
              <span>Login</span>
            </button>
          )}
        </div>
      </div>

      {/* Render the LoginModal when required */}
      {loginModalOpen && (
        <LoginModal
          isOpen={loginModalOpen}
          onClose={() => setLoginModalOpen(false)}
        />
      )}
    </header>
  );
};

export default Header;
