import React from "react";

const ConfirmationDialog = ({ isOpen, onClose, onConfirm, blogTitle }) => {
  if (!isOpen) return null; // ✅ Prevent rendering when not needed

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
          Remove Favorite
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Are you sure you want to remove <strong>{blogTitle || "this blog"}</strong> from your favorites?
        </p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose} // ✅ Properly closes the dialog
            className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm} // ✅ Calls confirm action
            className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationDialog;
