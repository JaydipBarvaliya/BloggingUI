import React, { useState } from "react";
import { Link } from "react-router-dom";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai"; // Icons for heart
import apiClient from "../api/axios"; // Assuming you use Axios for API requests

const BlogCard = ({ blog, isFavorite, onToggleFavorite }) => {
  const defaultImage = "https://picsum.photos/600/400";
  const [favorite, setFavorite] = useState(isFavorite);

  const handleFavoriteToggle = async () => {
    try {
      if (favorite) {
        // Remove from favorites
        await apiClient.delete(`/favorites/${blog.id}`, {
          headers: { userId: localStorage.getItem("userId") },
        });
      } else {
        // Add to favorites
        await apiClient.post(`/favorites/${blog.id}`, {}, {
          headers: { userId: localStorage.getItem("userId") },
        });
      }

      // Update local state and notify parent component
      setFavorite(!favorite);
      if (onToggleFavorite) {
        onToggleFavorite(blog.id, !favorite);
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow duration-200 rounded-lg overflow-hidden">
      <img
        src={blog.image || defaultImage}
        alt={blog.title || "Blog Image"}
        className="w-full h-48 object-cover rounded-t-lg"
      />
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 truncate">
          {blog.title || "Untitled Blog"}
        </h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm mt-2">
          {blog.summary || "No summary available."}
        </p>
        <p className="text-gray-500 dark:text-gray-400 text-xs mt-4">
          By {blog.author || "Unknown Author"}
        </p>
        <div className="flex justify-between items-center mt-4">
          <Link to={`/blogs/${blog.id}`}>
            <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 transition duration-200">
              Read More
            </button>
          </Link>
          <button
            onClick={handleFavoriteToggle}
            className="focus:outline-none transition duration-200"
          >
            {favorite ? (
              <AiFillHeart className="text-red-500 text-2xl" /> // Filled red heart
            ) : (
              <AiOutlineHeart className="text-gray-500 text-2xl" /> // Outlined heart
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BlogCard;
