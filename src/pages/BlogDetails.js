import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import apiClient from "../api/axios";
import { useAuth } from "../context/AuthContext";

const BlogDetails = () => {
  const { blogId } = useParams();
  const { firstName, lastName, userId, isLoggedIn } = useAuth();

  const [blog, setBlog] = useState({});
  const [comments, setComments] = useState([]);
  const [likesCount, setLikesCount] = useState(0);
  const [isLikedByUser, setIsLikedByUser] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editedCommentContent, setEditedCommentContent] = useState("");

  useEffect(() => {
    const fetchBlogDetails = async () => {
      try {
        const [blogRes, commentsRes, likeRes] = await Promise.all([
          apiClient.get(`/blogs/${blogId}`),
          apiClient.get(`/comments/${blogId}`),
          apiClient.get(`/blogs/${blogId}/likes-count`)
        ]);

        setBlog(blogRes.data);
        setComments(commentsRes.data || []);
        setLikesCount(likeRes.data.count || 0); // ✅ Ensure likes count is set correctly

        if (isLoggedIn && userId) {
          const userLikeRes = await apiClient.get(`/blogs/${blogId}/liked/${userId}`);
          setIsLikedByUser(userLikeRes.data.liked); // ✅ Check if user has liked the blog
        }
      } catch (error) {
        console.error("Error fetching blog details:", error);
      }
    };

    fetchBlogDetails();
  }, [blogId, isLoggedIn, userId]);

  const fetchComments = async () => {
    try {
      const res = await apiClient.get(`/comments/${blogId}`);
      setComments(res.data);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  const toggleLike = async () => {
    try {
      await apiClient.post(`/blogs/${blogId}/like/${userId}`);

      setIsLikedByUser((prev) => !prev);
      setLikesCount((prev) => (isLikedByUser ? prev - 1 : prev + 1)); // ✅ Ensure likes update correctly
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  const handlePostComment = async () => {
    if (!newComment.trim()) return;

    try {
      const res = await apiClient.post("/comments", {
        blogId,
        content: newComment,
        userId,
        name: `${firstName} ${lastName}`, // ✅ Ensure correct name is used
        timestamp: new Date().toISOString(),
      });

      setNewComment("");
      fetchComments();
    } catch (error) {
      console.error("Error posting comment:", error);
    }
  };

  const handleEditComment = async (commentId) => {
    try {
      await apiClient.put(`/comments/${commentId}`, {
        content: editedCommentContent,
        userId,
      });

      setEditingCommentId(null);
      setEditedCommentContent("");
      fetchComments();
    } catch (error) {
      console.error("Error editing comment:", error);
    }
  };

  const handleCancelEdit = () => {
    setEditingCommentId(null);
    setEditedCommentContent("");
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await apiClient.delete(`/comments/${commentId}`, { params: { userId } });
      fetchComments();
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Blog Content */}
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
      <div className="mb-8 flex items-center space-x-4">
        <button onClick={toggleLike} className="focus:outline-none">
          <span className="text-2xl">{isLikedByUser ? "👍" : "👎"}</span>
        </button>
        <span className="text-gray-800 dark:text-gray-200">
          {likesCount} {likesCount === 1 ? "Like" : "Likes"}
        </span>
      </div>

      {/* Comments Section */}
      <div className="comments-section">
        <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">Comments</h2>

        {/* Comment Form */}
        {isLoggedIn && (
          <div className="comment-form mb-6">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              className="w-full p-2 border rounded text-gray-800 dark:text-gray-200 bg-gray-100 dark:bg-gray-800"
            />
            <button onClick={handlePostComment} className="mt-2 bg-blue-500 text-white px-4 py-2 rounded">
              Post Comment
            </button>
          </div>
        )}

        {comments.map((comment) => (
          <div key={comment.id} className="comment bg-gray-100 dark:bg-gray-800 p-4 rounded mb-4">
            <p className="text-gray-800 dark:text-gray-200">{comment.content}</p>
            <small className="text-gray-600 dark:text-gray-400">By: {comment.name || "Unknown"}</small>

            {isLoggedIn && comment.userId === userId && (
              <div className="mt-2">
                <button onClick={() => handleEditComment(comment.id)} className="bg-yellow-500 text-white px-3 py-1 rounded">
                  Edit
                </button>
                <button onClick={() => handleDeleteComment(comment.id)} className="ml-2 bg-red-500 text-white px-3 py-1 rounded">
                  Delete
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlogDetails;
