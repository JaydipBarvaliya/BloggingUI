import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import apiClient from "../api/axios"; // Ensure axios is configured properly
import { useAuth } from "../context/AuthContext";

const BlogDetails = () => {
  const { blogId } = useParams();
  const { isLoggedIn, userId } = useAuth();
  const [blog, setBlog] = useState({});
  const [comments, setComments] = useState([]);
  const [likesCount, setLikesCount] = useState(0);
  const [isLikedByUser, setIsLikedByUser] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [editingComment, setEditingComment] = useState(null);
  const [editedCommentContent, setEditedCommentContent] = useState("");

  useEffect(() => {
    const fetchBlogDetails = async () => {
      try {
        const [blogRes, commentsRes, likesRes, isLikedRes] = await Promise.all([
          apiClient.get(`/blogs/${blogId}`),
          apiClient.get(`/comments/${blogId}`),
          apiClient.get(`/likes/${blogId}`),
          apiClient.get(`/likes/isLiked`, { params: { blogId, userId } }),
        ]);

        setBlog(blogRes.data);
        setComments(commentsRes.data);
        setLikesCount(likesRes.data || 0);
        setIsLikedByUser(isLikedRes.data);
      } catch (error) {
        console.error("Error fetching blog details:", error);
      }
    };

    if (isLoggedIn && userId) fetchBlogDetails();
  }, [blogId, isLoggedIn, userId]);

  const toggleLike = async () => {
    try {
      if (isLikedByUser) {
        await apiClient.delete("/likes", { params: { blogId, userId } });
        setLikesCount((prev) => Math.max(prev - 1, 0));
      } else {
        await apiClient.post("/likes", null, { params: { blogId, userId } });
        setLikesCount((prev) => prev + 1);
      }
      setIsLikedByUser(!isLikedByUser);
    } catch (error) {
      console.error(
        "Error toggling like:",
        error.response?.data || error.message
      );
    }
  };

  const handlePostComment = async () => {
    if (!newComment.trim()) return;
    try {
      await apiClient.post("/comments", { blogId, content: newComment });
      setNewComment("");
      const res = await apiClient.get(`/comments/${blogId}`);
      setComments(res.data);
    } catch (error) {
      console.error("Error posting comment:", error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await apiClient.delete(`/comments/${commentId}`);
      const res = await apiClient.get(`/comments/${blogId}`);
      setComments(res.data);
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  const handleEditComment = async (commentId) => {
    try {
      await apiClient.put(`/comments/${commentId}`, {
        content: editedCommentContent,
      });
      setEditingComment(null);
      setEditedCommentContent("");
      const res = await apiClient.get(`/comments/${blogId}`);
      setComments(res.data);
    } catch (error) {
      console.error("Error editing comment:", error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Blog Content */}
      {/* <h1 className="text-3xl font-bold mb-4 text-gray-800 dark:text-gray-200">
        {blog.title}
      </h1> */}
      {blog.image && (
        <div className="relative mb-6 flex justify-center">
          <img
            src={blog.image}
            alt={blog.title}
            className="w-full max-w-7xl h-auto rounded-2xl shadow-2xl border-4 border-gray-300 dark:border-gray-700"
          />
          <div className="absolute bottom-4 bg-white/70 dark:bg-gray-800/70 text-gray-800 dark:text-gray-200 px-4 py-2 rounded-lg shadow-lg">
            {blog.title}
          </div>
        </div>
      )}

      <p className="text-gray-700 dark:text-gray-300 mb-8">{blog.content}</p>

      {/* Like Button */}
      <div className="mb-8 flex items-center">
        <button
          onClick={toggleLike}
          className="focus:outline-none"
          title={isLikedByUser ? "Unlike this blog" : "Like this blog"}
        >
          <span className="text-2xl">
            {isLikedByUser ? "❤️" : "🤍"} {/* Filled or outlined heart */}
          </span>
        </button>
        <span className="ml-2 text-gray-800 dark:text-gray-200">
          {likesCount} {likesCount === 1 ? "Like" : "Likes"}
        </span>
      </div>

      {/* Comments Section */}
      <div className="comments-section">
        <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">
          Comments
        </h2>

        {/* Comment Form */}
        {isLoggedIn && (
          <div className="comment-form mb-6">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              className="w-full p-2 border rounded text-gray-800 dark:text-gray-200 bg-gray-100 dark:bg-gray-800"
            />
            <button
              onClick={handlePostComment}
              className="mt-2 bg-blue-500 text-white px-4 py-2 rounded"
            >
              Post Comment
            </button>
          </div>
        )}

        {/* Comments List */}
        {comments.map((comment) => (
          <div
            key={comment.id}
            className="comment bg-gray-100 dark:bg-gray-800 p-4 rounded mb-4"
          >
            {editingComment === comment.id ? (
              <div>
                <textarea
                  value={editedCommentContent}
                  onChange={(e) => setEditedCommentContent(e.target.value)}
                  className="w-full p-2 border rounded text-gray-800 dark:text-gray-200 bg-gray-100 dark:bg-gray-800"
                />
                <button
                  onClick={() => handleEditComment(comment.id)}
                  className="mt-2 bg-green-500 text-white px-4 py-2 rounded"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditingComment(null)}
                  className="mt-2 ml-2 bg-gray-500 text-white px-4 py-2 rounded"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div>
                <p className="text-gray-800 dark:text-gray-200">
                  {comment.content}
                </p>
                <small className="text-gray-600 dark:text-gray-400">
                  By: {comment.name}
                </small>
                {comment.userId === userId && (
                  <div className="mt-2">
                    <button
                      onClick={() => {
                        setEditingComment(comment.id);
                        setEditedCommentContent(comment.content);
                      }}
                      className="text-blue-500"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteComment(comment.id)}
                      className="text-red-500 ml-4"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlogDetails;
