import React, { useEffect, useState, useCallback } from "react";
import BlogCard from "../components/BlogCard";
import ConfirmationDialog from "../pages/ConfirmationDialog"; // Confirmation dialog for removal
import LoginModal from "../components/LoginModal"; // Import the LoginModal component
import { useAuth } from "../context/AuthContext";
import { getAllBlogs, getUserFavorites, toggleFavoriteBlog } from "../api/axios";
import "react-toastify/dist/ReactToastify.css";

const Homepage = () => {
  const [blogs, setBlogs] = useState([]);
  const [favoriteBlogIds, setFavoriteBlogIds] = useState(new Set());
  const [modalOpen, setModalOpen] = useState(false); // Controls confirmation dialog visibility (for removal)
  const [loginModalOpen, setLoginModalOpen] = useState(false); // Controls login modal visibility
  const [selectedBlog, setSelectedBlog] = useState(null); // Stores the selected blog for removal
  const { userId, isLoggedIn } = useAuth();

  // Fetch blogs and favorites
  const fetchBlogsAndFavorites = useCallback(async () => {
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

    // Sync favorites when updated in another tab
    const syncFavorites = (event) => {
      if (event.key === "favoritesSync") fetchBlogsAndFavorites();
    };
    window.addEventListener("storage", syncFavorites);
    return () => window.removeEventListener("storage", syncFavorites);
  }, [fetchBlogsAndFavorites]);

  // Handle favorite toggle
  const handleToggleFavorite = async (blog) => {
    if (!isLoggedIn) {
      // If not logged in, open the login modal
      setLoginModalOpen(true);
      return;
    }
    if (!blog || !userId) return;

    const isCurrentlyFavorited = favoriteBlogIds.has(blog.id);

    if (isCurrentlyFavorited) {
      // Open confirmation dialog ONLY when removing from favorites
      setSelectedBlog(blog);
      setModalOpen(true);
    } else {
      // Directly add to favorites without confirmation
      try {
        await toggleFavoriteBlog(blog.id, userId);
        setFavoriteBlogIds((prev) => {
          const updatedFavorites = new Set(prev);
          updatedFavorites.add(blog.id);
          return updatedFavorites;
        });
        localStorage.setItem("favoritesSync", Date.now());
      } catch (error) {
        console.error("Error toggling favorite:", error);
      }
    }
  };

  // Confirm removal of favorite (turns heart gray)
  const handleConfirmRemove = async () => {
    if (!selectedBlog || !userId) return;

    try {
      const isFavorited = await toggleFavoriteBlog(selectedBlog.id, userId);
      setFavoriteBlogIds((prev) => {
        const updatedFavorites = new Set(prev);
        isFavorited
          ? updatedFavorites.add(selectedBlog.id)
          : updatedFavorites.delete(selectedBlog.id);
        return updatedFavorites;
      });
      localStorage.setItem("favoritesSync", Date.now());
    } catch (error) {
      console.error("Error toggling favorite:", error);
    } finally {
      setModalOpen(false);
      setSelectedBlog(null);
    }
  };

  // Cancel removal: Keep the heart red
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
            const isFavorite = favoriteBlogIds.has(blog.id);
            return (
              <BlogCard
                key={blog.id}
                blog={blog}
                isFavorite={isFavorite}
                onToggleFavorite={() => handleToggleFavorite(blog)}
              />
            );
          })}
        </div>
      )}

      {/* Confirmation dialog (only when removing a favorite) */}
      <ConfirmationDialog
        isOpen={modalOpen}
        onClose={handleCancelRemove}
        onConfirm={handleConfirmRemove}
        blogTitle={selectedBlog?.title}
      />

      {/* Login modal (shown when a non-logged in user tries to favorite) */}
      <LoginModal
        isOpen={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
      />
    </div>
  );
};

export default Homepage;
