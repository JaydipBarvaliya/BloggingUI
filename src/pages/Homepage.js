import React, { useEffect, useState } from "react";
import BlogCard from "./../components/BlogCard";
import apiClient from "./../api/axios"; // Axios instance for backend requests

const Homepage = () => {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await apiClient.get("/blogs");
        setBlogs(response.data); // Assuming response.data contains the blogs array
      } catch (error) {
        console.error("Error fetching blogs:", error);
      }
    };

    fetchBlogs();
  }, []);

  return (
    <div className="container mx-auto py-8 px-4 dark:bg-gray-900 dark:text-gray-200">
      <h1 className="text-4xl font-bold mb-8">Trending Blogs</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogs.map((blog) => (
          <BlogCard key={blog.id} blog={blog} />
        ))}
      </div>
    </div>
  );
};

export default Homepage;
