import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as solidHeart } from "@fortawesome/free-solid-svg-icons";
import { faHeart as regularHeart } from "@fortawesome/free-regular-svg-icons";

const BlogCard = ({ blog, isFavorite, onToggleFavorite }) => {
  const defaultImage = "https://picsum.photos/600/400";

  return (
    <div className="bg-white dark:bg-gray-800 shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 rounded-lg overflow-hidden">
      {/* Blog Image */}
      <img
        src={`data:image/jpeg;base64,${blog.image}` || defaultImage}
        alt={blog.title || "Blog Image"}
        className="w-full h-48 object-cover rounded-t-lg transition-transform duration-300 transform hover:scale-105"
        loading="lazy"
      />

      {/* Blog Content */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 truncate">
          {blog.title || "Untitled Blog"}
        </h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm mt-2 line-clamp-3">
          {blog.summary || "No summary available."}
        </p>
        <p className="text-gray-500 dark:text-gray-400 text-xs mt-4">
          By {blog.author || "Unknown Author"}
        </p>

        {/* Actions */}
        <div className="flex justify-between items-center mt-4">
          {/* Read More Button */}
          <Link to={`/blogs/${blog.slug}`} aria-label={`Read more about ${blog.title}`}>
            <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 transition duration-200">
              Read More
            </button>
          </Link>

          {/* Favorite Icon */}
          <button
            onClick={() => onToggleFavorite(blog)}
            className="focus:outline-none"
            aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
          >
            <FontAwesomeIcon
              icon={isFavorite ? solidHeart : regularHeart}
              className={`cursor-pointer transition-colors duration-300 text-xl ${
                isFavorite ? "text-red-500" : "text-gray-400 hover:text-red-500"
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default BlogCard;
