import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Lottie from "lottie-react";
import clapAnimation from "../animations/clap.json";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {
  getBlogBySlug,
  getComments,
  getClapsCount,
  hasUserClapped,
  sendClap,
  postComment,
  editComment,
  deleteComment,
  deleteBlog, // API for deleting a blog
} from "../api/axios";
import LoginModal from "../components/LoginModal"; // Import the LoginModal

const BlogDetails = () => {
  const { slug } = useParams(); // Extract slug from the URL
  const navigate = useNavigate(); // For redirect after deletion
  const { userId, isLoggedIn, userDetails, role } = useAuth(); // Include role from context

  const [blog, setBlog] = useState({});
  const [comments, setComments] = useState([]);
  const [clapsCount, setClapsCount] = useState(0);
  const [isClapped, setIsClapped] = useState(null);
  const [newComment, setNewComment] = useState("");
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editedCommentContent, setEditedCommentContent] = useState("");
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false); // Controls the login modal

  // Function to fetch comments based on blogId
  const fetchComments = async (blogId) => {
    const data = await getComments(blogId);
    setComments(data);
  };

  // Function to fetch claps count based on blogId
  const fetchClapsCount = async (blogId) => {
    const data = await getClapsCount(blogId);
    setClapsCount(data);
  };

  useEffect(() => {
    const fetchBlogDetails = async () => {
      try {
        // Fetch blog data based on slug
        const blogData = await getBlogBySlug(slug);

        if (
          blogData.response &&
          blogData.response.status === 404 &&
          blogData.response.data === "Slug not found for requested URL"
        ) {
          navigate("page-not-found");
        }

        const blogId = blogData.id;
        // Fetch comments and claps based on the blog ID
        await Promise.all([fetchComments(blogId), fetchClapsCount(blogId)]);
        setBlog(blogData);

        // Check if the user has clapped
        if (isLoggedIn && userId) {
          const userHasClapped = await hasUserClapped(blogId, userId);
          setIsClapped(userHasClapped);
        } else {
          setIsClapped(false);
        }
      } catch (error) {
        console.error("Error fetching blog details:", error);
        setIsClapped(false);
      }
    };

    fetchBlogDetails();
  }, [slug, isLoggedIn, userId, navigate]);

  const handleClap = async () => {
    if (!isLoggedIn) {
      // Open the login modal if user is not logged in
      setLoginModalOpen(true);
      return;
    }
    const action = isClapped ? "remove" : "add";
    const success = await sendClap(blog.id, userId, action);
    if (success) {
      setClapsCount((prev) => (isClapped ? prev - 1 : prev + 1));
      setIsClapped(!isClapped);
    }
  };

  const handleDeleteBlog = async () => {
    if (role === "ADMIN") {
      try {
        const response = await deleteBlog(blog.id);
        if (response) {
          navigate("/"); // Redirect to the homepage after deletion
        }
      } catch (error) {
        console.error("Error deleting the blog:", error);
        if (error.response && error.response.data) {
          toast.error(error.response.data.message);
        }
      }
    }
  };

  const handleEditBlog = () => {
    // Navigate to the BlogEditor with pre-populated blog data
    if (role === "ADMIN") {
      navigate(`/admin/create-blog/${blog.id}`, { state: { blog } });
    }
  };

  const handleDeleteConfirmation = () => {
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    setDeleteModalOpen(false);
    await handleDeleteBlog();
  };

  const handleCancelDelete = () => {
    setDeleteModalOpen(false);
  };

  const handlePostComment = async () => {
    if (!isLoggedIn) {
      // Open the login modal if user is not logged in
      setLoginModalOpen(true);
      return;
    }
    if (!newComment.trim()) return;

    const name = `${userDetails.firstName || "Unknown"} ${
      userDetails.lastName || "Unknown"
    }`;

    const success = await postComment(blog.id, newComment, userId, name);
    if (success) {
      setNewComment("");
      fetchComments(blog.id);
    }
  };

  const handleEditComment = async (commentId) => {
    const success = await editComment(commentId, editedCommentContent, userId);
    if (success) {
      setEditingCommentId(null);
      setEditedCommentContent("");
      fetchComments(blog.id);
      localStorage.removeItem("editingCommentId");
    }
  };

  const handleDeleteComment = async (commentId) => {
    const success = await deleteComment(commentId, userId);
    if (success) {
      fetchComments(blog.id);
    }
  };

  const handleEditButtonClick = (commentId, commentContent) => {
    setEditingCommentId(commentId);
    setEditedCommentContent(commentContent);
    localStorage.setItem("editingCommentId", commentId);
  };

  // Function to fix the links in the content
  const handleLinks = (htmlContent) => {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = htmlContent;
    const anchorTags = tempDiv.getElementsByTagName("a");
    for (let i = 0; i < anchorTags.length; i++) {
      const link = anchorTags[i];
      const href = link.getAttribute("href");
      if (href && !href.startsWith("http")) {
        link.setAttribute("href", `http://${href}`);
      }
    }
    return tempDiv.innerHTML;
  };

  // Return early if isClapped is still null (loading state)
  if (isClapped === null) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 relative">
      {/* Conditionally render Edit and Delete Buttons only for Admin users */}
      {role === "ADMIN" && (
        <div className="absolute top-8 right-4 space-x-4 z-10">
          <button
            onClick={handleEditBlog}
            className="bg-yellow-500 text-white px-4 py-2 rounded"
          >
            Edit Blog
          </button>
          <button
            onClick={handleDeleteConfirmation}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Delete Blog
          </button>
        </div>
      )}

      {blog.image && (
        <div className="relative mb-6 flex justify-center w-full">
          <img
            src={`data:image/jpeg;base64,${blog.image}`}
            alt={blog.title}
            className="w-full h-auto rounded-2xl shadow-2xl border-4 border-gray-300 dark:border-gray-700"
          />
          <div className="absolute bottom-4 bg-white/70 dark:bg-gray-800/70 text-gray-800 dark:text-gray-200 px-4 py-2 rounded-lg shadow-lg">
            {blog.title}
          </div>
        </div>
      )}

      <div className="blog-details-content">
        <div
          className={`text-gray-700 dark:text-gray-300 mb-8 ${
            blog.content ? "prose" : ""
          }`}
          dangerouslySetInnerHTML={{ __html: handleLinks(blog.content) }}
        />
      </div>

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-md shadow-md">
            <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-200">
              Are you sure you want to delete this blog?
            </h2>
            <div className="flex justify-between">
              <button
                onClick={handleCancelDelete}
                className="bg-gray-500 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mb-8 flex items-center space-x-4">
        <button onClick={handleClap} className="focus:outline-none relative">
          <Lottie
            animationData={clapAnimation}
            loop={false}
            className={`w-16 h-16 ${
              isClapped ? "opacity-100" : "opacity-50"
            } hover:opacity-100 hover:scale-125 hover:rotate-12 hover:translate-y-1 transform transition-all duration-500 ease-in-out`}
          />
        </button>
        <span className="text-gray-800 dark:text-gray-200">
          {clapsCount} {clapsCount === 1 ? "Clap" : "Claps"}
        </span>
      </div>

      <div className="comments-section">
        <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">
          Comments
        </h2>
        {/* Always render the comment form so that the user can type a comment */}
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
        {comments.length > 0 ? (
          comments.map((comment) => {
            const normalizedCommentUserId = Number(comment.userId);
            const normalizedUserId = Number(userId);
            return (
              <div
                key={comment.id}
                className="comment bg-gray-100 dark:bg-gray-800 p-4 rounded mb-4"
              >
                <p className="text-gray-800 dark:text-gray-200">
                  {comment.content}
                </p>
                <small className="text-gray-600 dark:text-gray-400">
                  By:{" "}
                  {comment.name
                    ? comment.name
                    : `${userDetails.firstName} ${userDetails.lastName}`}
                </small>
                {isLoggedIn && normalizedCommentUserId === normalizedUserId && (
                  <div className="mt-2">
                    {editingCommentId === comment.id ? (
                      <div>
                        <textarea
                          value={editedCommentContent}
                          onChange={(e) =>
                            setEditedCommentContent(e.target.value)
                          }
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
                          onClick={() =>
                            handleEditButtonClick(comment.id, comment.content)
                          }
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

      {/* Render the LoginModal for posting comments or clapping when not logged in */}
      <LoginModal
        isOpen={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
      />
    </div>
  );
};

export default BlogDetails;
