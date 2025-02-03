import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // Import Quill styles
import { createBlog, updateBlog } from "../api/axios"; // Import updateBlog function
import "./BlogEditor.css"; // Import custom styles
import Prism from "prismjs"; // Import Prism for syntax highlighting
import "prismjs/themes/prism.css"; // Import default Prism theme
import "prismjs/components/prism-javascript.min.js"; // Example language, you can add more
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const BlogEditor = () => {
  const navigate = useNavigate(); // Hook to navigate
  const location = useLocation(); // To access the state passed from BlogDetails
  const blogData = location.state?.blog; // Get the blog details passed from BlogDetails

  const [editorContent, setEditorContent] = useState(blogData?.content || "");
  const [authorName, setAuthorName] = useState(blogData?.author || "James Bond");
  const [category, setCategory] = useState(blogData?.category || "Finance");
  const [image, setImage] = useState(null);
  const [summary, setSummary] = useState(blogData?.summary || " In 2025, web development is evolving rapidly with new technologies and trends. From AI-powered development tools to the rise of serverless architecture, this blog explores the top trends shaping the future of web development. Whether you're a seasoned developer or just starting, staying ahead of these trends will ensure your skills remain relevant in the ever-changing tech landscape.");
  const [blogTitle, setBlogTitle] = useState(blogData?.title || "The Future of Web Development: Trends to Watch in 2025");
  const [slug, setSlug] = useState(blogData?.slug || "");
  const [imageError, setImageError] = useState(""); // Error message for image validation

  // Handle title change and generate slug
  const handleTitleChange = (e) => {
    setBlogTitle(e.target.value);
    const generatedSlug = generateSlug(e.target.value);
    setSlug(generatedSlug);
  };

  // Function to generate a slug from the title
  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "") // Remove special characters
      .replace(/\s+/g, "-") // Replace spaces with hyphens
      .replace(/-+/g, "-"); // Replace multiple hyphens with a single hyphen
  };

  // Handle editor content change
  const handleEditorChange = (value) => {
    setEditorContent(value);
  };

  // Apply syntax highlighting to code blocks
  const applyPrismHighlighting = () => {
    Prism.highlightAll();
  };

  useEffect(() => {
    // Apply Prism highlighting after content is updated
    applyPrismHighlighting();
  }, [editorContent]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("author", authorName);
    formData.append("category", category);
    formData.append("summary", summary);
    formData.append("title", blogTitle);
    formData.append("slug", slug);
    formData.append("content", editorContent);
    formData.append("image", image); // Append the image file

    try {
      if (blogData?.id) {
        // If the blog has an ID, update the existing blog
        const updatedBlog = await updateBlog(blogData.id, formData);
        navigate(`/blogs/${updatedBlog.slug}`);
      } else {
        // If no ID, create a new blog
        const newBlog = await createBlog(formData);
        navigate(`/blogs/${newBlog.slug}`);
      }
    } catch (error) {
      console.error("Error saving the blog:", error);
      if (error.response && error.response.data) {
        toast.error(error.response.data);
      }
    }
  };

  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0]; // Get the first file uploaded
    if (file) {
      // Validate file type (only images)
      if (!file.type.startsWith("image/")) {
        setImageError("Please upload a valid image file.");
        setImage(null);
      } else if (file.size > 5000000) {
        // 5MB limit
        setImageError("The image file size is too large. Please upload a file smaller than 5MB.");
        setImage(null);
      } else {
        setImage(file); // Set the selected file
        setImageError(""); // Clear error
      }
    }
  };

  return (
    <div className="editor-container">
      {/* Show notification if error occurs */}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <div>
            {/* Author Name */}
            <label htmlFor="authorName">Author Name</label>
            <input
              id="authorName"
              type="text"
              placeholder="Author Name"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              required
            />
          </div>

          <div>
            {/* Category */}
            <label htmlFor="category">Category</label>
            <input
              id="category"
              type="text"
              placeholder="Category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <div>
            {/* Image Upload */}
            <label htmlFor="image">Upload Image</label>
            <input
              id="image"
              type="file"
              onChange={handleImageUpload}
              accept="image/*"
            />
            {imageError && <p className="text-red-500 text-sm">{imageError}</p>} {/* Display error message */}
          </div>

          <div>
            {/* Summary */}
            <label htmlFor="summary">Summary</label>
            <textarea
              id="summary"
              placeholder="Summary"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
            />
          </div>
        </div>

        <div className="form-group">
          <div>
            {/* Blog Title */}
            <label htmlFor="blogTitle">Blog Title</label>
            <input
              id="blogTitle"
              type="text"
              placeholder="Blog Title"
              value={blogTitle}
              onChange={handleTitleChange} 
              required
            />
          </div>
        </div>

        {/* Slug (hidden field) */}
        <input type="hidden" value={slug} name="slug" />

        {/* Quill Editor */}
        <div className="editor-section">
          <ReactQuill
            value={editorContent}
            onChange={handleEditorChange}
            modules={{
              toolbar: [
                [{ header: "1" }, { header: "2" }],
                [{ font: [] }],
                [{ list: "ordered" }, { list: "bullet" }],
                ["bold", "italic", "underline"],
                ["link", "image"],
                [{ align: [] }],
                ["blockquote", "code-block"],
              ],
            }}
          />
        </div>

        {/* Submit Button */}
        <button type="submit">Save Blog</button>
      </form>
    </div>
  );
};

export default BlogEditor;
