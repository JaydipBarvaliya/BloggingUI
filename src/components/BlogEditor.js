import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill'; 
import 'react-quill/dist/quill.snow.css'; // Import Quill styles
import { createBlog } from '../api/axios'; // Import the createBlog function
import './BlogEditor.css';  // Import your custom styles
import Prism from 'prismjs'; // Import Prism for syntax highlighting
import 'prismjs/themes/prism.css'; // Import default Prism theme
import 'prismjs/components/prism-javascript.min.js'; // Example language, you can add more

const BlogEditor = () => {
  const navigate = useNavigate(); // Hook to navigate
  const [editorContent, setEditorContent] = useState('');  
  const [authorName, setAuthorName] = useState('');
  const [category, setCategory] = useState('');
  const [image, setImage] = useState(null); // Changed to handle file input
  const [summary, setSummary] = useState('');
  const [blogTitle, setBlogTitle] = useState('');

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
    formData.append('author', authorName);
    formData.append('category', category);
    formData.append('summary', summary);
    formData.append('title', blogTitle);
    formData.append('content', editorContent);
    if (image) {
      formData.append('image', image); // Append the image file
    }

    try {
      const blogData = await createBlog(formData);
      // Navigate to the created blog's page after successful creation
      navigate(`/blogs/${blogData.id}`);
    } catch (error) {
      console.error('Error creating blog:', error);
    }
  };

  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];  // Get the first file uploaded
    if (file) {
      setImage(file);  // Set the selected file
    }
  };

  return (
    <div className="editor-container">
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
              onChange={(e) => setBlogTitle(e.target.value)} 
              required 
            />
          </div>
        </div>

        {/* Quill Editor */}
        <div className="editor-section">
          <ReactQuill 
            value={editorContent}
            onChange={handleEditorChange}
            modules={{
              toolbar: [
                [{ 'header': '1' }, { 'header': '2' }],
                [{ 'font': [] }],
                [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                ['bold', 'italic', 'underline'],
                ['link', 'image'],
                [{ 'align': [] }],
                ['blockquote', 'code-block'],
              ],
            }}
          />
        </div>

        {/* Submit Button */}
        <button type="submit">Create Blog</button>
      </form>
    </div>
  );
};

export default BlogEditor;
