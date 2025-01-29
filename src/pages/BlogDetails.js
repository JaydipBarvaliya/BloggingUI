import React, { useEffect, useState } from "react"; 
import { useParams } from "react-router-dom"; 
import { useAuth } from "../context/AuthContext"; 
import Lottie from "lottie-react"; 
import clapAnimation from "../animations/clap.json"; 
import {
  getBlogById,
  getComments,
  getClapsCount,
  hasUserClapped,
  sendClap,
  postComment,
  editComment,
  deleteComment,
} from "../api/axios"; 

const BlogDetails = () => {
  const { blogId } = useParams();
  const { userId, isLoggedIn, userDetails } = useAuth();

  const [blog, setBlog] = useState({});
  const [comments, setComments] = useState([]);
  const [clapsCount, setClapsCount] = useState(0);
  const [isClapped, setIsClapped] = useState(null); 
  const [newComment, setNewComment] = useState("");
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editedCommentContent, setEditedCommentContent] = useState("");

  const fetchComments = async () => {
    const data = await getComments(blogId);
    setComments(data);
  };

  useEffect(() => {
    const fetchBlogDetails = async () => {
      try {
        const [blogData, commentsData, clapsData] = await Promise.all([
          getBlogById(blogId),
          getComments(blogId),
          getClapsCount(blogId),
        ]);

        setBlog(blogData);
        setComments(commentsData);
        setClapsCount(clapsData);

        if (isLoggedIn && userId) {
          const userHasClapped = await hasUserClapped(blogId, userId);
          setIsClapped(userHasClapped); // Set the clapped state
        } else {
          setIsClapped(false); // Default to false if user is not logged in
        }
      } catch (error) {
        console.error("Error fetching blog details:", error);
        setIsClapped(false); // Default to false in case of error
      }
    };

    fetchBlogDetails();
  }, [blogId, isLoggedIn, userId]);

  useEffect(() => {
    const storedEditingCommentId = localStorage.getItem("editingCommentId");
    if (storedEditingCommentId) {
      setEditingCommentId(storedEditingCommentId);
    }
  }, []);

  const handleClap = async () => {
    const action = isClapped ? "remove" : "add"; 

    const success = await sendClap(blogId, userId, action);
    
    if (success) {
      setClapsCount((prev) => (isClapped ? prev - 1 : prev + 1)); // Update the clap count
      setIsClapped(!isClapped); // Toggle the clapped state
    }
  };

  const handlePostComment = async () => {
    if (!newComment.trim()) return;

    const name = `${userDetails.firstName || "Unknown"} ${userDetails.lastName || "Unknown"}`;

    const success = await postComment(blogId, newComment, userId, name);
    if (success) {
      setNewComment("");
      fetchComments();
    }
  };

  const handleEditComment = async (commentId) => {
    const success = await editComment(commentId, editedCommentContent, userId);
    if (success) {
      setEditingCommentId(null);
      setEditedCommentContent("");
      fetchComments();
      localStorage.removeItem("editingCommentId");
    }
  };

  const handleDeleteComment = async (commentId) => {
    const success = await deleteComment(commentId, userId);
    if (success) {
      fetchComments();
    }
  };

  const handleEditButtonClick = (commentId, commentContent) => {
    setEditingCommentId(commentId);
    setEditedCommentContent(commentContent);
    localStorage.setItem("editingCommentId", commentId);
  };

  // Return early if `isClapped` is still null (loading state)
  if (isClapped === null) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {blog.image && (
        <div className="relative mb-6 flex justify-center">
          <img
            src={blog.image}
            alt={blog.title}
            className="w-full h-auto max-w-7xl rounded-2xl shadow-2xl border-4 border-gray-300 dark:border-gray-700"
          />
          <div className="absolute bottom-4 bg-white/70 dark:bg-gray-800/70 text-gray-800 dark:text-gray-200 px-4 py-2 rounded-lg shadow-lg">
            {blog.title}
          </div>
        </div>
      )}

      <p className="text-gray-700 dark:text-gray-300 mb-8">{blog.content}</p>

      {/* Clap Button */}
      <div className="mb-8 flex items-center space-x-4">
        <button onClick={handleClap} className="focus:outline-none relative">
          <Lottie
            animationData={clapAnimation}
            loop={false}
            className={`w-16 h-16 ${isClapped ? "opacity-100" : "opacity-50"} 
              hover:opacity-100 hover:scale-125 hover:rotate-12 hover:translate-y-1 transform transition-all duration-500 ease-in-out`}
          />
        </button>

        <span className="text-gray-800 dark:text-gray-200">
          {clapsCount} {clapsCount === 1 ? "Clap" : "Claps"}
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

        {/* Render Comments */}
        {comments.length > 0 ? (
          comments.map((comment) => {
            const normalizedCommentUserId = Number(comment.userId);
            const normalizedUserId = Number(userId);

            return (
              <div key={comment.id} className="comment bg-gray-100 dark:bg-gray-800 p-4 rounded mb-4">
                <p className="text-gray-800 dark:text-gray-200">{comment.content}</p>
                <small className="text-gray-600 dark:text-gray-400">
                  By: {comment.name ? comment.name : `${userDetails.firstName} ${userDetails.lastName}`}
                </small>

                {isLoggedIn && normalizedCommentUserId === normalizedUserId && (
                  <div className="mt-2">
                    {editingCommentId === comment.id ? (
                      <div>
                        <textarea
                          value={editedCommentContent}
                          onChange={(e) => setEditedCommentContent(e.target.value)}
                          className="w-full p-2 border rounded text-gray-800 dark:text-gray-200 bg-gray-100 dark:bg-gray-800"
                        />
                        <button
                          onClick={() => handleEditComment(comment.id)}
                          className="mt-2 bg-yellow-500 text-white px-4 py-2 rounded"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingCommentId(null)}
                          className="ml-2 mt-2 bg-gray-500 text-white px-4 py-2 rounded"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div>
                        <button
                          onClick={() => handleEditButtonClick(comment.id, comment.content)}
                          className="bg-yellow-500 text-white px-3 py-1 rounded"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteComment(comment.id)}
                          className="ml-2 bg-red-500 text-white px-3 py-1 rounded"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <p className="text-gray-500 dark:text-gray-400">
            No comments yet. Be the first to comment!
          </p>
        )}
      </div>
    </div>
  );
};

export default BlogDetails;
