import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:8080/api", // Ensure this matches your backend URL
  headers: { "Content-Type": "application/json"},
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // Get JWT token from localStorage
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;  // Attach JWT token to header
    }
    return config;
  },
  (error) => Promise.reject(error)
);


// ✅ Fetch all blogs
export const getAllBlogs = async () => {
  try {
    const response = await apiClient.get("/blogs");
    return response.data || [];
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return [];
  }
};

// ✅ Fetch blogs by category
export const getBlogsByCategory = async (category) => {
  try {
    const response = await apiClient.get(`/blogs/${category}/blogs`);
    return response.data;
  } catch (error) {
    console.error("Error fetching category blogs:", error);
    return [];
  }
};

// ✅ Fetch user favorite blogs
export const getUserFavorites = async (userId) => {
  try {
    if (!userId) return [];

    const response = await apiClient.get(`/favorites/${userId}`);

    return Array.isArray(response.data) ? response.data : []; // ✅ Ensure it's an array
  } catch (error) {
    console.error("❌ Error fetching favorites:", error);
    return []; // ✅ Return an empty array on error
  }
};
// ✅ Toggle favorite status (Add/Remove)
export const toggleFavoriteBlog = async (blogId, userId) => {
  try {
    const response = await apiClient.post(`/favorites/${blogId}/${userId}`);
    return response.data.isFavorited;
  } catch (error) {
    console.error("Error toggling favorite:", error);
    return false;
  }
};

// ✅ Function to update favorites in state & localStorage
export const updateFavorites = (favoriteBlogIds, isFavorited, blogId) => {
  const updatedFavorites = new Set(favoriteBlogIds);

  if (isFavorited) {
    updatedFavorites.add(blogId);
  } else {
    updatedFavorites.delete(blogId);
  }

  // ✅ Sync localStorage
  localStorage.setItem("favoriteBlogIds", JSON.stringify([...updatedFavorites]));
  localStorage.setItem("favoritesSync", Date.now());

  return updatedFavorites; // Return updated state
};

// ✅ Fetch user profile
export const getUserProfile = async (userId) => {
  try {
    if (!userId) throw new Error("User ID is missing");
    const response = await apiClient.get(`/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return null;
  }
};

// ✅ Update user profile
export const updateUserProfile = async (userId, profile) => {
  try {
    if (!userId) throw new Error("User ID is missing");
    await apiClient.put(`/users/${userId}`, profile);
    return true;
  } catch (error) {
    console.error("Error updating profile:", error);
    return false;
  }
};

// ✅ Update user password
export const updateUserPassword = async (userId, password) => {
  try {
    if (!userId) throw new Error("User ID is missing");
    await apiClient.put(`/users/${userId}/password`, { password });
    return true;
  } catch (error) {
    console.error("Error updating password:", error);
    return false;
  }
};

// ✅ Register a new user
export const registerUser = async (userData) => {
  try {
    await apiClient.post("/auth/register", userData);
    return { success: true, message: "Registration successful! Please log in." };
  } catch (error) {
    console.error("Error during registration:", error);
    return { success: false, message: error.response?.data?.details || "Registration failed." };
  }
};


// ✅ Fetch a single blog by ID
export const getBlogBySlug = async (slug) => {
  try {
    const response = await apiClient.get(`/blogs/${slug}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching blog:", error);
    return error;
  }
};

// ✅ Fetch comments for a blog
export const getComments = async (blogId) => {
  try {
    const response = await apiClient.get(`/comments/${blogId}`);
    return response.data || [];
  } catch (error) {
    console.error("Error fetching comments:", error);
    return [];
  }
};

// ✅ Fetch claps count
export const getClapsCount = async (blogId) => {
  try {
    const response = await apiClient.get(`/claps/${blogId}/claps-count`);
    return response.data.count || 0;
  } catch (error) {
    console.error("Error fetching claps count:", error);
    return 0;
  }
};

// ✅ Check if the user has clapped
export const hasUserClapped = async (blogId, userId) => {
  try {
    const response = await apiClient.get(`/claps/${blogId}/clapped/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error checking if user clapped:", error);
    return false;
  }
};

//✅ Send a clap
export const sendClap = async (blogId, userId) => {
  try {
    await apiClient.post(`/claps/${blogId}/clap/${userId}`);
    return true;
  } catch (error) {
    console.error("Error sending clap:", error);
    return false;
  }
};


// ✅ Post a new comment
export const postComment = async (blogId, content, userId, name) => {
  try {
    await apiClient.post("/comments", {
      blogId,
      content,
      userId,
      name,
      timestamp: new Date().toISOString(),
    });
    return true;
  } catch (error) {
    console.error("Error posting comment:", error);
    return false;
  }
};

// ✅ Edit an existing comment
export const editComment = async (commentId, content, userId) => {
  try {
    await apiClient.put(`/comments/${commentId}`, { content, userId });
    return true;
  } catch (error) {
    console.error("Error editing comment:", error);
    return false;
  }
};

// ✅ Delete a comment
export const deleteComment = async (commentId, userId) => {
  try {
    await apiClient.delete(`/comments/${commentId}`, { params: { userId } });
    return true;
  } catch (error) {
    console.error("Error deleting comment:", error);
    return false;
  }
};

// API call for deleting a blog and its associated data
export const deleteBlog = async (blogId) => {
  try {
    const response = await apiClient.delete(`/blogs/${blogId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};



// Function to create a new blog
export const createBlog = async (formData) => {
  try {
    const response = await apiClient.post(`/blogs`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data', // Set content type to multipart
      },
    });
    return response.data; // Return the blog data (for redirecting or other purposes)
  } catch (error) {
    console.error('Error creating blog:', error);
    throw error; // Rethrow to be handled in the component
  }
};


export const updateBlog = async (blogId, formData) => {
  try {
    const response = await apiClient.put(`/blogs/${blogId}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data", // Set correct content type
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error updating blog:", error);
    throw error;
  }
};

export const loginUser = (email, password) => {
  return apiClient.post('/auth/login', { email, password });
};

export const loginViaGoogle = (email, firstName, lastName, authType ) => {
  return apiClient.post('/auth/loginViaGoogle', { email, firstName, lastName, authType });
};

export const registerUserWithGoogle = (email) => {
  return apiClient.post('/auth/register', { email, googleAuth: true });
};

// Fetch categories
export const fetchCategories = async () => {
  try {
    const response = await apiClient.get("/categories");
    return response.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};

// Fetch user details
export const fetchUserDetails = async (userId) => {
  try {
    const response = await apiClient.get(`/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching user details:", error);
    throw error;
  }
};


export default apiClient;
