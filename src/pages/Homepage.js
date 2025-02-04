import React, { useEffect, useState, useCallback } from "react";
import BlogCard from "../components/BlogCard";
import ConfirmationDialog from "../pages/ConfirmationDialog"; // ✅ Import the confirmation modal
import { useAuth } from "../context/AuthContext";
import {
  getAllBlogs,
  getUserFavorites,
  toggleFavoriteBlog,
} from "../api/axios"; // ✅ Use only available functions

const Homepage = () => {
  const [blogs, setBlogs] = useState([]);
  const [favoriteBlogIds, setFavoriteBlogIds] = useState(new Set());
  const [modalOpen, setModalOpen] = useState(false); // ✅ Controls dialog visibility
  const [selectedBlog, setSelectedBlog] = useState(null); // ✅ Stores the selected blog for removal
  const { userId } = useAuth();

  // ✅ Fetch blogs and favorites
  const fetchBlogsAndFavorites = useCallback(async () => {
    if (!userId) {
      console.warn("User ID is not available. Please log in.");
      return;
    }

    try {
      const [blogsData, favoriteBlogsData] = await Promise.all([
        getAllBlogs(),
        getUserFavorites(userId),
      ]);

      setBlogs(Array.isArray(blogsData) ? blogsData : []);

      const favoriteIds = new Set(
        Array.isArray(favoriteBlogsData)
          ? favoriteBlogsData.map((blog) => blog.id)
          : []
      );

      setFavoriteBlogIds(favoriteIds);
    } catch (error) {
      console.error("❌ Error fetching blogs or favorites:", error);
    }
  }, [userId]);

  useEffect(() => {
    fetchBlogsAndFavorites();

    // ✅ Sync favorites when updated in another tab
    const syncFavorites = (event) => {
      if (event.key === "favoritesSync") fetchBlogsAndFavorites();
    };

    window.addEventListener("storage", syncFavorites);
    return () => window.removeEventListener("storage", syncFavorites);
  }, [fetchBlogsAndFavorites]);

  // ✅ Handle favorite toggle
  const handleToggleFavorite = async (blog) => {
    if (!blog || !userId) return;
  
    const isCurrentlyFavorited = favoriteBlogIds.has(blog.id);
  
    if (isCurrentlyFavorited) {
      // ✅ Open confirmation dialog ONLY when removing from favorites
      setSelectedBlog(blog);
      setModalOpen(true);
    } else {
      // ✅ Directly add to favorites without confirmation
      try {
        await toggleFavoriteBlog(blog.id, userId); // ✅ Call API
        
        setFavoriteBlogIds((prev) => {
          const updatedFavorites = new Set(prev);
          updatedFavorites.add(blog.id); // ✅ Add blog to favorites
          return new Set(updatedFavorites); // ✅ Force React to re-render
        });
      
        localStorage.setItem("favoritesSync", Date.now());
      } catch (error) {
        console.error("Error toggling favorite:", error);
      }
    }
  };
  

  // ✅ Confirm removal of favorite (turns heart gray)
  const handleConfirmRemove = async () => {
    if (!selectedBlog || !userId) return;

    try {
      const isFavorited = await toggleFavoriteBlog(selectedBlog.id, userId);

      setFavoriteBlogIds((prev) => {
        const updatedFavorites = new Set(prev);
        isFavorited ? updatedFavorites.add(selectedBlog.id) : updatedFavorites.delete(selectedBlog.id);
        return new Set(updatedFavorites);
      });

      localStorage.setItem("favoritesSync", Date.now());
    } catch (error) {
      console.error("Error toggling favorite:", error);
    } finally {
      setModalOpen(false);
      setSelectedBlog(null);
    }
  };

  // ✅ Cancel removal: Keep the heart red
  const handleCancelRemove = () => {
    setModalOpen(false);
    setSelectedBlog(null);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
        All Blogs
      </h1>

      {blogs.length === 0 ? (
        <p className="text-gray-500">No blogs available.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {blogs.map((blog) => {
            const isFavorite = favoriteBlogIds.has(blog.id); // ✅ Controls UI state
            return (
              <BlogCard
                key={blog.id}
                blog={blog}
                isFavorite={isFavorite}
                onToggleFavorite={() => handleToggleFavorite(blog)} // ✅ Pass blog object
              />
            );
          })}
        </div>
      )}

      {/* ✅ Beautiful confirmation modal (only when removing a favorite) */}
      <ConfirmationDialog
        isOpen={modalOpen}
        onClose={handleCancelRemove} // ✅ Keep heart red on cancel
        onConfirm={handleConfirmRemove} // ✅ Remove only on confirmation
        blogTitle={selectedBlog?.title}
      />
    </div>
  );
};

export default Homepage;
