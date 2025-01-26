import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // Importing the AuthContext
import apiClient from "../api/axios"; // Axios instance for API requests
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";

const Header = ({ toggleDarkMode, isDarkMode }) => {
  const { isLoggedIn, logout } = useAuth(); // Accessing isLoggedIn and logout from AuthContext
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]); // Local state for categories

  const handleLogout = () => {
    logout(); // Log out the user and update the global state
    navigate("/login"); // Redirect to login page
  };

  useEffect(() => {
    // Fetch categories from API
    const fetchCategories = async () => {
      try {
        const response = await apiClient.get("/categories");
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  return (
    <header className="sticky top-0 bg-gray-100 dark:bg-gray-900 py-4 shadow-md z-50">
      <div className="container mx-auto flex justify-between items-center px-4">
        {/* Logo */}
        <Link to="/">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
            Data Engineering
          </h1>
        </Link>

        {/* Categories */}
        <nav className="flex space-x-4">
          {categories.map((category, index) => (
            <Link
              key={index}
              to={`/categories/${category}`}
              className="text-gray-800 dark:text-gray-200 hover:text-blue-500"
            >
              {category}
            </Link>
          ))}
        </nav>

        <div className="flex space-x-4 items-center">
          {/* Favorite Icon */}
          {isLoggedIn && (
            <button
              onClick={() => navigate("/favorites")}
              className="bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 px-4 py-2 rounded hover:bg-gray-300 dark:hover:bg-gray-700 transition"
            >
              <FontAwesomeIcon icon={faHeart} className="mr-2" />
              Favorites
            </button>
          )}

          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className="bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 px-4 py-2 rounded-lg"
          >
            {isDarkMode ? "Light Mode" : "Dark Mode"}
          </button>

          {/* Logout Button */}
          {isLoggedIn && (
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
