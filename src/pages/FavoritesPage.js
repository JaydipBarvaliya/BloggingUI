import React, { useEffect, useState } from "react";
import apiClient from "../api/axios";
import BlogCard from "../components/BlogCard";

const FavoritesPage = () => {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const userId = localStorage.getItem("userId"); // Fetch userId from localStorage
        if (!userId) {
          console.error("User ID is not available. Please log in.");
          return;
        }

        const response = await apiClient.get("/favorites", {
          headers: { userId },
        });
        setFavorites(response.data); // Assuming the backend returns complete blog data
      } catch (error) {
        console.error("Error fetching favorites:", error);
      }
    };

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
        setFavorites((prev) => prev.filter((blog) => blog.id !== blogId));
      } else {
        // Add back to favorites (if needed in a different scenario)
        console.warn("Adding back to favorites is not implemented.");
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
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
              blog={blog} // Blog object fetched from backend
              isFavorite={true}
              onToggleFavorite={handleToggleFavorite}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default FavoritesPage;
