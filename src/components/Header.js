import React from "react";
import { Link } from "react-router-dom";

const Header = ({ toggleDarkMode, isDarkMode }) => {
  return (
    <header className="bg-gray-100 dark:bg-gray-900 py-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center px-4">
      <Link to="/">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
          Blogging Platform
        </h1>
        </Link>
        <div className="space-x-4">
          <button
            onClick={toggleDarkMode}
            className="bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 px-4 py-2 rounded-lg"
          >
            {isDarkMode ? "Light Mode" : "Dark Mode"}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
