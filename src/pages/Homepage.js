import React, { useEffect, useState, useCallback } from "react";
import apiClient from "../api/axios";
import BlogCard from "../components/BlogCard";
import { Dialog } from "@headlessui/react"; // For modal dialogs
import { ExclamationIcon } from "@heroicons/react/outline"; // Optional icon for styling

const Homepage = () => {
  const [blogs, setBlogs] = useState([]);
  const [favoriteBlogIds, setFavoriteBlogIds] = useState([]);
  const [showDialog, setShowDialog] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState(null);

  // Fetch blogs and user favorites
  const fetchBlogsAndFavorites = useCallback(async () => {
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        console.warn("User ID is not available. Please log in.");
        return;
      }

      // Fetch all blogs
      const blogsResponse = await apiClient.get("/blogs");
      setBlogs(blogsResponse.data);

      // Fetch favorite blogs for the logged-in user
      const favoritesResponse = await apiClient.get(`/blogs/favorited/${userId}`);

      // Extract favorite blog IDs
      setFavoriteBlogIds(favoritesResponse.data.map((fav) => fav.id));
    } catch (error) {
      console.error("Error fetching blogs or favorites:", error);
    }
  }, []);

  useEffect(() => {
    fetchBlogsAndFavorites();

    // Sync favorites across tabs
    const syncFavorites = (event) => {
      if (event.key === "favoritesSync" || event.key === "favoriteBlogIds") {
        fetchBlogsAndFavorites();
      }
    };

    window.addEventListener("storage", syncFavorites);

    return () => {
      window.removeEventListener("storage", syncFavorites);
    };
  }, [fetchBlogsAndFavorites]);

  // Handle favorite toggle action
  const handleToggleFavorite = (blog) => {
    if (favoriteBlogIds.includes(blog.id)) {
      setSelectedBlog(blog);
      setShowDialog(true);
    } else {
      toggleFavorite(blog.id);
    }
  };

  // Function to add/remove favorites
  const toggleFavorite = async (blogId) => {
    try {
      const userId = localStorage.getItem("userId");

      const isFavorite = favoriteBlogIds.includes(blogId);
      await apiClient.post(`/blogs/${blogId}/favorite/${userId}`);

      // Update local state and sync across tabs
      setFavoriteBlogIds((prev) =>
        isFavorite ? prev.filter((id) => id !== blogId) : [...prev, blogId]
      );

      localStorage.setItem(
        "favoriteBlogIds",
        JSON.stringify(
          isFavorite ? favoriteBlogIds.filter((id) => id !== blogId) : [...favoriteBlogIds, blogId]
        )
      );
      localStorage.setItem("favoritesSync", Date.now());

      setShowDialog(false);
      setSelectedBlog(null);
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  const closeDialog = () => {
    setShowDialog(false);
    setSelectedBlog(null);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">All Blogs</h1>
      {blogs.length === 0 ? (
        <p className="text-gray-500">No blogs available.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {blogs.map((blog) => (
            <BlogCard
              key={blog.id}
              blog={blog}
              isFavorite={favoriteBlogIds.includes(blog.id)}
              onToggleFavorite={() => handleToggleFavorite(blog)}
            />
          ))}
        </div>
      )}

      {/* Confirmation Dialog */}
      {showDialog && selectedBlog && (
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
                onClick={() => toggleFavorite(selectedBlog.id)}
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

export default Homepage;
