import React from "react";
import { Link } from "react-router-dom";

const Unauthorized = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="text-center bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-3xl font-semibold text-red-500 dark:text-red-400 mb-4">
          You do not have permission to access this page.
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          It seems like you are trying to access a restricted page. Please contact an administrator if you believe this is a mistake.
        </p>
        <Link
          to="/"
          className="inline-block bg-blue-500 hover:bg-blue-600 text-white py-2 px-6 rounded-lg shadow-md transition duration-300"
        >
          Go back to Homepage
        </Link>
      </div>
    </div>
  );
};

export default Unauthorized;
