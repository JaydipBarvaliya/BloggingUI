import React, { useEffect, useState } from "react";
import apiClient from "../api/axios";
import BlogCard from "../components/BlogCard";

const Homepage = () => {
  const [blogs, setBlogs] = useState([]);
  const [favoriteBlogIds, setFavoriteBlogIds] = useState([]);

  useEffect(() => {
    const fetchBlogsAndFavorites = async () => {
      try {
        const userId = localStorage.getItem("userId");
        if (!userId) {
          console.error("User ID is not available. Please log in.");
          return;
        }

        // Fetch all blogs
        const blogsResponse = await apiClient.get("/blogs");
        setBlogs(blogsResponse.data);

        // Fetch favorite blogs for the logged-in user
        const favoritesResponse = await apiClient.get("/favorites", {
          headers: { userId },
        });

        // Extract favorite blog IDs from the response
        const favoriteIds = favoritesResponse.data.map((fav) => fav.id);
        setFavoriteBlogIds(favoriteIds);
      } catch (error) {
        console.error("Error fetching blogs or favorites:", error);
      }
    };

    fetchBlogsAndFavorites();

    // Listen for localStorage changes
    const syncFavorites = (event) => {
      if (event.key === "favoritesSync") {
        fetchBlogsAndFavorites(); // Re-fetch blogs and favorites
      }
    };

    window.addEventListener("storage", syncFavorites);

    return () => {
      window.removeEventListener("storage", syncFavorites);
    };
  }, []);

  const handleToggleFavorite = async (blogId, isFavorite) => {
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        console.error("User ID is not available. Please log in.");
        return;
      }

      if (isFavorite) {
        // Remove blog from favorites
        await apiClient.delete(`/favorites/${blogId}`, {
          headers: { userId },
        });

        // Update local state
        setFavoriteBlogIds((prev) => prev.filter((id) => id !== blogId));

        // Update localStorage to trigger sync
        localStorage.setItem("favoritesSync", Date.now()); // Use timestamp to ensure a unique value
      } else {
        // Add blog to favorites
        await apiClient.post(
          `/favorites/${blogId}`,
          {},
          {
            headers: { userId },
          }
        );

        // Update local state
        setFavoriteBlogIds((prev) => [...prev, blogId]);

        // Update localStorage to trigger sync
        localStorage.setItem("favoritesSync", Date.now());
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">All Blogs</h1>
      {blogs.length === 0 ? (
        <p className="text-gray-500">No blogs available.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {blogs.map((blog) => (
            <BlogCard
              key={blog.id}
              blog={blog}
              isFavorite={favoriteBlogIds.includes(blog.id)}
              onToggleFavorite={handleToggleFavorite}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Homepage;
