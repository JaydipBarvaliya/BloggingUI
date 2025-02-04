import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserCircle, faHeart, faPen } from "@fortawesome/free-solid-svg-icons";
import { fetchCategories, fetchUserDetails } from "../api/axios";

const Header = ({ toggleDarkMode, isDarkMode }) => {
  const { userId, role, isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [firstName, setFirstName] = useState("Profile");
  const dropdownRef = useRef(null);
  const handleLogout = () => {
    logout();
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("role");
    setProfileMenuOpen(false); // Close the dropdown when logging out
    navigate("/login");
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchCategories()
        .then((data) => setCategories(data))
        .catch((error) => console.error("Error fetching categories:", error));
    }
  }, [isLoggedIn]);

  useEffect(() => {
    if (isLoggedIn && userId) {
        fetchUserDetails(userId)
          .then((data) => setFirstName(data.firstName || "Profile"))
          .catch((error) => console.error("Error fetching user details:", error));
    }
  }, [isLoggedIn, userId]);

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

  return (
    <header className="bg-gray-100 dark:bg-gray-900 py-4 shadow-md sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center px-4">
        <Link to="/">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
            Data Engineering
          </h1>
        </Link>

        {isLoggedIn && (
          <nav className="flex space-x-4">
            {categories.map((category) => (
              <Link
                key={category}
                to={`/categories/${category}`}
                className="text-gray-800 dark:text-gray-200 hover:text-blue-500"
              >
                {category}
              </Link>
            ))}
          </nav>
        )}

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

          {isLoggedIn && (
            <button
              onClick={() => navigate("/favorites")}
              className="flex items-center bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-700"
            >
              <FontAwesomeIcon icon={faHeart} className="mr-2 text-red-500" />
              Favorites
            </button>
          )}

          <button
            onClick={toggleDarkMode}
            className="bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 px-4 py-2 rounded-lg"
          >
            {isDarkMode ? "Light Mode" : "Dark Mode"}
          </button>

          {isLoggedIn && (
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
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
