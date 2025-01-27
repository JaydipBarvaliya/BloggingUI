import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import apiClient from "../api/axios"; // Ensure axios is configured properly
import { useAuth } from "../context/AuthContext";

const BlogDetails = () => {
  const { blogId } = useParams();
  const { isLoggedIn, userId } = useAuth(); // Get user info from context
  const [blog, setBlog] = useState({});
  const [comments, setComments] = useState([]);
  const [likesCount, setLikesCount] = useState(0);
  const [isLikedByUser, setIsLikedByUser] = useState(false); // Tracks if the user has liked the blog
  const [newComment, setNewComment] = useState("");
  const [editingComment, setEditingComment] = useState(null);
  const [editedCommentContent, setEditedCommentContent] = useState("");

  // Fetch blog details, comments, likes, and user's like status
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
        setLikesCount(likesRes.data?.count || 0);
        setIsLikedByUser(isLikedRes.data); // True if user has liked the blog
      } catch (error) {
        console.error("Error fetching blog details:", error);
      }
    };

    if (isLoggedIn && userId) fetchBlogDetails();
  }, [blogId, isLoggedIn, userId]);

  // Toggle like status
  const toggleLike = async () => {
    if (!isLoggedIn || !userId) {
      console.error("User must be logged in to like a blog.");
      return;
    }

    try {
      if (isLikedByUser) {
        // Remove like
        await apiClient.delete("/likes", { params: { blogId, userId } });
        setLikesCount((prev) => Math.max(prev - 1, 0)); // Decrement like count
      } else {
        // Add like
        await apiClient.post("/likes", null, { params: { blogId, userId } });
        setLikesCount((prev) => prev + 1); // Increment like count
      }
      setIsLikedByUser(!isLikedByUser); // Toggle like status
    } catch (error) {
      console.error("Error toggling like:", error.response?.data || error.message);
    }
  };

  // Post a new comment
  const handlePostComment = async () => {
    if (!newComment.trim()) return;
    try {
      await apiClient.post("/comments", {
        blogId,
        content: newComment,
      });
      setNewComment("");
      const res = await apiClient.get(`/comments/${blogId}`);
      setComments(res.data); // Refresh comments
    } catch (error) {
      console.error("Error posting comment:", error);
    }
  };

  // Delete a comment
  const handleDeleteComment = async (commentId) => {
    try {
      await apiClient.delete(`/comments/${commentId}`);
      const res = await apiClient.get(`/comments/${blogId}`);
      setComments(res.data); // Refresh comments
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  // Edit a comment
  const handleEditComment = async (commentId) => {
    try {
      await apiClient.put(`/comments/${commentId}`, { content: editedCommentContent });
      setEditingComment(null);
      setEditedCommentContent("");
      const res = await apiClient.get(`/comments/${blogId}`);
      setComments(res.data); // Refresh comments
    } catch (error) {
      console.error("Error editing comment:", error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Blog Content */}
      <h1 className="text-3xl font-bold mb-4">{blog.title}</h1>
      <p className="text-gray-700 mb-8">{blog.content}</p>

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
        <span className="ml-2 text-gray-700">{likesCount} {likesCount === 1 ? "Like" : "Likes"}</span>
      </div>

      {/* Comments Section */}
      <div className="comments-section">
        <h2 className="text-2xl font-bold mb-4">Comments</h2>

        {/* Comment Form */}
        {isLoggedIn && (
          <div className="comment-form mb-6">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              className="w-full p-2 border rounded"
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
                  className="w-full p-2 border rounded"
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
                <p>{comment.content}</p>
                <small>By: {comment.name}</small>
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
