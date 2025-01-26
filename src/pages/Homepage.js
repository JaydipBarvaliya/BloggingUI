import React, { useEffect, useState } from "react";
import apiClient from "../api/axios";
import BlogCard from "../components/BlogCard";

const Homepage = () => {
  const [blogs, setBlogs] = useState([]);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await apiClient.get("/blogs"); // Fetch all blogs
        setBlogs(response.data);
      } catch (error) {
        console.error("Error fetching blogs:", error);
      }
    };

    const fetchFavorites = async () => {
      try {
        const userId = localStorage.getItem("userId"); // Fetch userId from localStorage
        if (!userId) return;

        const response = await apiClient.get("/favorites", {
          headers: { userId },
        });
        setFavorites(response.data.map((fav) => fav.blogId)); // Assuming favorite blogs return `blogId`
      } catch (error) {
        console.error("Error fetching favorites:", error);
      }
    };

    fetchBlogs();
    fetchFavorites();
  }, []);

  const handleToggleFavorite = async (blogId, isFavorite) => {
    try {
      const userId = localStorage.getItem("userId");
      if (isFavorite) {
        // Remove from favorites
        await apiClient.delete(`/favorites/${blogId}`, {
          headers: { userId },
        });
        setFavorites((prev) => prev.filter((id) => id !== blogId));
      } else {
        // Add to favorites
        await apiClient.post(
          `/favorites`,
          { blogId },
          {
            headers: { userId },
          }
        );
        setFavorites((prev) => [...prev, blogId]);
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">All Blogs</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {blogs.map((blog) => (
          <BlogCard
            key={blog.id}
            blog={blog}
            isFavorite={favorites.includes(blog.id)} // Check if blog is favorite
            onToggleFavorite={handleToggleFavorite}
          />
        ))}
      </div>
    </div>
  );
};

export default Homepage;
