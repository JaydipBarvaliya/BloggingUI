import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import apiClient from "../api/axios";
import BlogCard from "../components/BlogCard";
import { Dialog } from "@headlessui/react";
import { ExclamationIcon } from "@heroicons/react/outline";

const CategoryBlogsPage = () => {
  const { category } = useParams();
  const [blogs, setBlogs] = useState([]);
  const [favoriteBlogIds, setFavoriteBlogIds] = useState(new Set());
  const [showDialog, setShowDialog] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const userId = localStorage.getItem("userId");

  // ✅ Fetch blogs and favorite statuses
  const fetchBlogsAndFavorites = useCallback(async () => {
    if (!userId) {
      console.error("User ID is not available. Please log in.");
      return;
    }

    try {
      const [blogsResponse, favoritesResponse] = await Promise.all([
        apiClient.get(`/categories/${category}/blogs`),
        apiClient.get(`/blogs/favorited/${userId}`)
      ]);

      setBlogs(blogsResponse.data);
      setFavoriteBlogIds(new Set(favoritesResponse.data.map((fav) => fav.id))); // ✅ Use Set for fast lookup
    } catch (error) {
      console.error("Error fetching blogs or favorites:", error);
    }
  }, [category, userId]);

  useEffect(() => {
    fetchBlogsAndFavorites();

    // ✅ Sync favorites across browser tabs
    const syncFavorites = (event) => {
      if (event.key === "favoritesSync") {
        fetchBlogsAndFavorites();
      }
    };

    window.addEventListener("storage", syncFavorites);
    return () => window.removeEventListener("storage", syncFavorites);
  }, [fetchBlogsAndFavorites]);

  // ✅ Toggle favorite status
  const toggleFavorite = async (blog) => {
    if (favoriteBlogIds.has(blog.id)) {
      setSelectedBlog(blog);
      setShowDialog(true);
    } else {
      await updateFavoriteStatus(blog.id);
    }
  };

  // ✅ Handles add/remove from favorites and updates state/UI instantly
  const updateFavoriteStatus = async (blogId) => {
    try {
      const response = await apiClient.post(`/blogs/${blogId}/favorite/${userId}`);
      const isFavorited = response.data.isFavorited; // ✅ Ensure backend returns correct status

      setFavoriteBlogIds((prev) => {
        const updatedFavorites = new Set(prev);
        if (isFavorited) {
          updatedFavorites.add(blogId); // Add to favorites
        } else {
          updatedFavorites.delete(blogId); // Remove from favorites
        }

        // ✅ Sync localStorage across tabs
        localStorage.setItem("favoriteBlogIds", JSON.stringify([...updatedFavorites]));
        localStorage.setItem("favoritesSync", Date.now());

        return updatedFavorites;
      });

      setShowDialog(false);
      setSelectedBlog(null);
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 dark:bg-gray-900 dark:text-gray-200">
      <h1 className="text-3xl font-bold mb-6">Blogs in {category}</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogs.map((blog) => (
          <BlogCard
            key={blog.id}
            blog={blog}
            isFavorite={favoriteBlogIds.has(blog.id)} // ✅ Ensures UI updates correctly
            onToggleFavorite={() => toggleFavorite(blog)}
          />
        ))}
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={showDialog} onClose={() => setShowDialog(false)} className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-md">
          <div className="flex items-center space-x-4">
            <ExclamationIcon className="h-6 w-6 text-red-500" />
            <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">Remove Favorite</h3>
          </div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            Are you sure you want to remove <span className="font-bold">{selectedBlog?.title}</span> from your favorites?
          </p>
          <div className="mt-6 flex justify-end space-x-4">
            <button onClick={() => setShowDialog(false)} className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded hover:bg-gray-300 dark:hover:bg-gray-600">Cancel</button>
            <button onClick={() => updateFavoriteStatus(selectedBlog.id)} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">Remove</button>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default CategoryBlogsPage;
