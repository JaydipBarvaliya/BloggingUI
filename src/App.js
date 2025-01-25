import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Homepage from "./pages/Homepage";
import BlogDetails from "./pages/BlogDetails";
import Header from "./components/Header";
import Footer from "./components/Footer";

const App = () => {
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
    <Router>
      <div className={`${isDarkMode ? "dark" : ""} flex flex-col min-h-screen`}>
        <Header toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />
        <main className="flex-grow bg-gray-100 dark:bg-gray-900">
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/blogs/:id" element={<BlogDetails />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
