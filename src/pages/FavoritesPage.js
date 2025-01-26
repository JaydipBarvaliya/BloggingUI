import React, { useEffect, useState } from "react";
import apiClient from "../api/axios";
import BlogCard from "../components/BlogCard";
import { Dialog } from "@headlessui/react"; // For modal dialogs
import { ExclamationIcon } from "@heroicons/react/outline"; // Optional icon for styling

const FavoritesPage = () => {
  const [favorites, setFavorites] = useState([]);
  const [showDialog, setShowDialog] = useState(false); // To show/hide the dialog
  const [selectedBlog, setSelectedBlog] = useState(null); // Currently selected blog for removal

  // Centralized function to fetch favorites
  const fetchFavorites = async () => {
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        console.error("User ID is not available. Please log in.");
        return;
      }

      const response = await apiClient.get("/favorites", {
        headers: { userId },
      });
      setFavorites(response.data);

      // Update `favoriteBlogIds` in localStorage for sync across all tabs
      const favoriteIds = response.data.map((blog) => blog.id);
      localStorage.setItem("favoriteBlogIds", JSON.stringify(favoriteIds));
      localStorage.setItem("favoritesSync", Date.now()); // Trigger sync
    } catch (error) {
      console.error("Error fetching favorites:", error);
    }
  };

  useEffect(() => {
    fetchFavorites();

    // Sync favorites across tabs
    const syncFavorites = (event) => {
      if (event.key === "favoritesSync" || event.key === "favoriteBlogIds") {
        fetchFavorites();
      }
    };

    window.addEventListener("storage", syncFavorites);

    return () => {
      window.removeEventListener("storage", syncFavorites);
    };
  }, []);

  const handleToggleFavorite = (blog) => {
    setSelectedBlog(blog); // Set the blog for removal
    setShowDialog(true); // Open the dialog
  };

  const confirmRemoveFavorite = async () => {
    if (!selectedBlog) return;

    try {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        console.error("User ID is not available. Please log in.");
        return;
      }

      // Remove from favorites
      await apiClient.delete(`/favorites/${selectedBlog.id}`, {
        headers: { userId },
      });

      // Update state to reflect the removed blog
      setFavorites((prev) => prev.filter((blog) => blog.id !== selectedBlog.id));

      // Trigger synchronization across tabs
      const updatedFavoriteIds = favorites
        .filter((blog) => blog.id !== selectedBlog.id)
        .map((blog) => blog.id);
      localStorage.setItem("favoriteBlogIds", JSON.stringify(updatedFavoriteIds));
      localStorage.setItem("favoritesSync", Date.now()); // Trigger sync

      setShowDialog(false); // Close the dialog
      setSelectedBlog(null); // Clear the selected blog
    } catch (error) {
      console.error("Error removing favorite:", error);
    }
  };

  const closeDialog = () => {
    setShowDialog(false);
    setSelectedBlog(null); // Clear the selected blog
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">My Favorite Blogs</h1>
      {favorites.length === 0 ? (
        <p className="text-gray-500">You have no favorite blogs yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {favorites.map((blog) => (
            <BlogCard
              key={blog.id}
              blog={blog || {}} // Ensure blog is defined to avoid errors
              isFavorite={true} // All blogs are marked as favorites by default
              onToggleFavorite={() => handleToggleFavorite(blog)}
            />
          ))}
        </div>
      )}

      {/* Confirmation Dialog */}
      {showDialog && (
        <Dialog
          open={showDialog}
          onClose={closeDialog}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
        >
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-md">
            <div className="flex items-center space-x-4">
              <ExclamationIcon className="h-6 w-6 text-red-500" />
              <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">
                Remove Favorite
              </h3>
            </div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">
              Are you sure you want to remove{" "}
              <span className="font-bold">{selectedBlog?.title}</span> from your
              favorites? This action cannot be undone.
            </p>
            <div className="mt-6 flex justify-end space-x-4">
              <button
                onClick={closeDialog}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={confirmRemoveFavorite}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Remove
              </button>
            </div>
          </div>
        </Dialog>
      )}
    </div>
  );
};

export default FavoritesPage;
