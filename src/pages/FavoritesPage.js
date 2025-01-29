import React, { useEffect, useState, useCallback } from "react";
import BlogCard from "../components/BlogCard";
import ConfirmationDialog from "../pages/ConfirmationDialog";
import { getUserFavorites, toggleFavoriteBlog } from "../api/axios";

const FavoritesPage = () => {
  const [favorites, setFavorites] = useState([]);
  const [favoriteBlogIds, setFavoriteBlogIds] = useState(new Set());
  const [showDialog, setShowDialog] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const userId = localStorage.getItem("userId");

  // ✅ Fetch favorites from API
  const fetchFavorites = useCallback(async () => {
    if (!userId) {
      console.warn("User ID is not available. Please log in.");
      return;
    }

    try {
      const favoriteBlogsData = await getUserFavorites(userId);
      setFavorites(Array.isArray(favoriteBlogsData) ? favoriteBlogsData : []);
      setFavoriteBlogIds(
        new Set(Array.isArray(favoriteBlogsData) ? favoriteBlogsData.map((blog) => blog.id) : [])
      );
    } catch (error) {
      console.error("❌ Error fetching favorites:", error);
      setFavorites([]);
    }
  }, [userId]);

  useEffect(() => {
    fetchFavorites();

    // ✅ Sync favorites across tabs
    const syncFavorites = (event) => {
      if (event.key === "favoritesSync") fetchFavorites();
    };

    window.addEventListener("storage", syncFavorites);
    return () => window.removeEventListener("storage", syncFavorites);
  }, [fetchFavorites]);

  // ✅ Handle Favorite Toggle
  const handleToggleFavorite = (blog) => {
    if (!blog) return;
    setSelectedBlog(blog);
    setShowDialog(true);
  };

  // ✅ Confirm Remove Favorite
  const handleConfirmRemoveFavorite = async () => {
    if (!selectedBlog || !userId) return;

    try {
      await toggleFavoriteBlog(selectedBlog.id, userId);

      setFavoriteBlogIds((prev) => {
        const updatedFavorites = new Set(prev);
        updatedFavorites.delete(selectedBlog.id);
        return updatedFavorites;
      });

      setFavorites((prev) => prev.filter((blog) => blog.id !== selectedBlog.id));

      setShowDialog(false); // ✅ Ensure it closes the dialog
      setSelectedBlog(null);
    } catch (error) {
      console.error("Error removing favorite:", error);
    }
  };

  // ✅ Close Dialog
  const handleCloseDialog = () => {
    setShowDialog(false); // ✅ Ensure this works
    setSelectedBlog(null);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
        My Favorite Blogs
      </h1>

      {favorites.length === 0 ? (
        <p className="text-gray-500">You have no favorite blogs yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {favorites.map((blog) => (
            <BlogCard
              key={blog.id}
              blog={blog}
              isFavorite={favoriteBlogIds.has(blog.id)}
              onToggleFavorite={() => handleToggleFavorite(blog)}
            />
          ))}
        </div>
      )}

      {/* ✅ Only show dialog if `showDialog` is TRUE */}
      <ConfirmationDialog
        isOpen={showDialog}
        onClose={handleCloseDialog} // ✅ Fix: Closes dialog properly
        onConfirm={handleConfirmRemoveFavorite}
        blogTitle={selectedBlog?.title || "Unknown Blog"} // ✅ Ensures title is displayed
      />
    </div>
  );
};

export default FavoritesPage;
