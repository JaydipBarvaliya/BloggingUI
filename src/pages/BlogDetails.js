import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import apiClient from "../api/axios"; // Axios instance for backend requests

const BlogDetails = () => {
  const { id } = useParams(); // Blog ID from the URL
  const [blog, setBlog] = useState(null);
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const fetchBlogDetails = async () => {
      try {
        const response = await apiClient.get(`/blogs/${id}`);
        setBlog(response.data); // Fetch blog details
      } catch (error) {
        console.error("Error fetching blog details:", error);
      }
    };

    const fetchComments = async () => {
      try {
        const response = await apiClient.get(`/blogs/${id}/comments`);
        setComments(response.data);
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };
    
    fetchBlogDetails();
    fetchComments();
  }, [id]);

  if (!blog) {
    return <p>Loading...</p>;
  }

  return (
    <div className="container mx-auto py-8 px-4 dark:bg-gray-900 dark:text-gray-200">
      {/* Blog Details */}
      <img
        src={blog.image}
        alt={blog.title}
        className="w-full h-64 object-cover rounded-lg"
      />
      <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-200 mt-6">
        {blog.title}
      </h1>
      <p className="text-gray-500 dark:text-gray-400 mt-2">By {blog.author}</p>
      <div className="mt-4 text-gray-700 dark:text-gray-300 leading-relaxed">
        {blog.content}
      </div>

      {/* Comments Section */}
      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Comments</h2>
        {comments.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-400">No comments yet.</p>
        ) : (
          comments.map((comment, index) => (
            <div
              key={comment.id || `comment-${index}`} // Ensure a unique fallback key
              className="mb-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg"
            >
              <p className="font-semibold">{comment.name || "Anonymous"}</p>
              <p className="text-gray-600 dark:text-gray-400">
                {comment.comment || "No content provided."}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default BlogDetails;
