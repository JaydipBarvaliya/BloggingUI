import React from "react";
import { useNavigate } from "react-router-dom";

const LoginModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate("/login"); // Redirect to the login page
    onClose(); // Close the modal
  };

  return (
    isOpen && (
      <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md max-w-sm w-full">
          <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-200">
            Login Required
          </h2>
          <p className="mb-4 text-gray-700 dark:text-gray-300">
            You must log in to favorite this blog!
          </p>
          <div className="flex justify-end space-x-4">
            <button
              className="px-4 py-2 bg-gray-300 dark:bg-gray-700 rounded-md text-gray-800 dark:text-gray-200"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded-md"
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
