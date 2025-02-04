import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import BlogCard from "../components/BlogCard";
import ConfirmationDialog from "../pages/ConfirmationDialog";
import { getBlogsByCategory, getUserFavorites, toggleFavoriteBlog } from "../api/axios";
import { useAuth } from "../context/AuthContext";


const CategoryBlogsPage = () => {
  const { category } = useParams();
  const [blogs, setBlogs] = useState([]);
  const [favoriteBlogIds, setFavoriteBlogIds] = useState(new Set());
  const [showDialog, setShowDialog] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const { userId } = useAuth();

  // ✅ Fetch blogs & favorites
  const fetchBlogsAndFavorites = useCallback(async () => {
    if (!userId) {
      console.warn("User ID is not available. Please log in.");
      return;
    }

    try {
      const [blogsData, favoriteBlogsData] = await Promise.all([
        getBlogsByCategory(category),
        getUserFavorites(userId),
      ]);

      setBlogs(blogsData.length > 0 ? blogsData : []);
      setFavoriteBlogIds(new Set(favoriteBlogsData.map((blog) => blog.id)));
    } catch (error) {
      console.error("Error fetching blogs or favorites:", error);
    }
  }, [category, userId]);

  useEffect(() => {
    fetchBlogsAndFavorites();

    // ✅ Sync favorites across tabs
    const syncFavorites = (event) => {
      if (event.key === "favoritesSync") fetchBlogsAndFavorites();
    };

    window.addEventListener("storage", syncFavorites);
    return () => window.removeEventListener("storage", syncFavorites);
  }, [fetchBlogsAndFavorites]);

  // ✅ Toggle Favorite
  const handleToggleFavorite = async (blog) => {
    if (!blog) return;

    if (favoriteBlogIds.has(blog.id)) {
      setSelectedBlog(blog);
      setShowDialog(true);
    } else {
      await handleConfirmFavoriteToggle(blog.id);
    }
  };

  // ✅ Confirm Favorite Toggle
  const handleConfirmFavoriteToggle = async (blogId) => {
    if (!blogId) return;
  
    try {
      await toggleFavoriteBlog(blogId, userId); // ✅ Make API call
  
      setFavoriteBlogIds((prev) => {
        const updatedFavorites = new Set(prev);
  
        if (updatedFavorites.has(blogId)) {
          updatedFavorites.delete(blogId); // ✅ Remove from favorites
        } else {
          updatedFavorites.add(blogId); // ✅ Add to favorites
        }
  
        return new Set(updatedFavorites); // ✅ Create a new Set to trigger re-render
      });
  
      setShowDialog(false);
      setSelectedBlog(null);
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };
  

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
        Blogs in {category}
      </h1>

      {blogs.length === 0 ? (
        <p className="text-gray-500">No blogs available.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {blogs.map((blog) => (
            <BlogCard
              key={blog.id}
              blog={blog}
              isFavorite={favoriteBlogIds.has(blog.id)}
              onToggleFavorite={() => handleToggleFavorite(blog)}
            />
          ))}
        </div>
      )}

      {/* ✅ Only show dialog if selectedBlog is not null */}
      {selectedBlog && (
        <ConfirmationDialog
          isOpen={showDialog}
          onClose={() => setShowDialog(false)}
          onConfirm={() => handleConfirmFavoriteToggle(selectedBlog?.id)}
          blogTitle={selectedBlog?.title || "Unknown Blog"}
        />
      )}
    </div>
  );
};

export default CategoryBlogsPage;
