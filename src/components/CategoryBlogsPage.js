import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import apiClient from "../api/axios"; // Axios instance for backend requests
import BlogCard from "../components/BlogCard"; // Reuse BlogCard component

const CategoryBlogsPage = () => {
  const { category } = useParams();
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    const fetchBlogsByCategory = async () => {
      try {
        const response = await apiClient.get(`/categories/${category}/blogs`);
        setBlogs(response.data);
      } catch (error) {
        console.error("Error fetching category blogs:", error);
      }
    };

    fetchBlogsByCategory();
  }, [category]);

  return (
    <div className="container mx-auto py-8 px-4 dark:bg-gray-900 dark:text-gray-200">
      <h1 className="text-3xl font-bold mb-6">Blogs in {category}</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogs.map((blog) => (
          <BlogCard key={blog.id} blog={blog} />
        ))}
      </div>
    </div>
  );
};

export default CategoryBlogsPage;
