import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:8080/api", // Ensure this matches your backend URL
  headers: { "Content-Type": "application/json" },
});

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
    const response = await apiClient.get(`/categories/${category}/blogs`);
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

    const response = await apiClient.get(`/blogs/favorited/${userId}`);

    return Array.isArray(response.data) ? response.data : []; // ✅ Ensure it's an array
  } catch (error) {
    console.error("❌ Error fetching favorites:", error);
    return []; // ✅ Return an empty array on error
  }
};
// ✅ Toggle favorite status (Add/Remove)
export const toggleFavoriteBlog = async (blogId, userId) => {
  try {
    const response = await apiClient.post(`/blogs/${blogId}/favorite/${userId}`);
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

export default apiClient;
