import React from "react";
import { useNavigate } from "react-router-dom";

const LoginModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    const redirectUrl = localStorage.getItem("redirectAfterLogin") || "/";
    // localStorage.removeItem("redirectAfterLogin"); // Clear stored URL after use
    navigate("/login", { state: { from: redirectUrl } }); // Pass redirect path to Login Page
    onClose(); // Close the modal
  };

  return (
    isOpen && (
      <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
        <div className="bg-white p-6 rounded-lg shadow-md max-w-sm w-full dark:bg-gray-800">
          <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">Login Required</h2>
          <p className="mb-4 text-gray-700 dark:text-gray-300">
            You must log in to perform this action!
          </p>
          <div className="flex justify-end space-x-4">
            <button
              className="px-4 py-2 bg-gray-300 rounded-md dark:bg-gray-700 dark:text-gray-200"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded-md dark:bg-blue-500"
              onClick={handleLoginClick}
            >
              Login
            </button>
          </div>
        </div>
      </div>
    )
  );
};

export default LoginModal;
