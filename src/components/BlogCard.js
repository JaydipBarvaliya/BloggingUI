import React from 'react';
import { Link } from 'react-router-dom';

const BlogCard = ({ blog }) => {
  const defaultImage = 'https://picsum.photos/600/400';

  return (
    <div className="bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow duration-200 rounded-lg overflow-hidden">
      <img
        src={blog.image || defaultImage}
        alt={blog.title || 'Blog Image'}
        className="w-full h-48 object-cover rounded-t-lg"
      />
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 truncate">
          {blog.title || 'Untitled Blog'}
        </h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm mt-2">
          {blog.summary || 'No summary available.'}
        </p>
        <p className="text-gray-500 dark:text-gray-400 text-xs mt-4">
          By {blog.author || 'Unknown Author'}
        </p>
        <Link to={`/blogs/${blog.id}`}>
          <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 transition duration-200">
            Read More
          </button>
        </Link>
      </div>
    </div>
  );
};


export default BlogCard;