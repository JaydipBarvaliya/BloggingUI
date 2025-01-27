import React, { useState, useEffect } from "react";
import apiClient from "../api/axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ProfilePage = () => {
  const [profile, setProfile] = useState({ firstName: "", lastName: "", email: "" });
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // Fetch user details on component mount
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const userId = localStorage.getItem("userId");
        if (!userId) {
          console.error("User ID is not available. Please log in.");
          return;
        }

        const response = await apiClient.get(`/users/${userId}`);
        setProfile(response.data);
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchUserProfile();
  }, []);

  // Handle profile update
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        console.error("User ID is not available. Please log in.");
        return;
      }

      await apiClient.put(`/users/${userId}`, profile);
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error("Failed to update profile. Please try again.");
      console.error("Error updating profile:", error);
    }
  };

  // Handle password update
  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setPasswordError("Passwords do not match.");
      return;
    }

    try {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        console.error("User ID is not available. Please log in.");
        return;
      }

      await apiClient.put(`/users/${userId}/password`, { password });
      setPassword("");
      setConfirmPassword("");
      setPasswordError("");
      toast.success("Password updated successfully!");
    } catch (error) {
      toast.error("Failed to update password. Please try again.");
      console.error("Error updating password:", error);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <ToastContainer position="top-center" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* My Profile Section */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded shadow-lg">
          <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">
            My Profile
          </h2>
          <form onSubmit={handleProfileUpdate}>
            <div className="mb-4">
              <label
                htmlFor="firstName"
                className="block text-gray-800 dark:text-gray-200 mb-1"
              >
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                value={profile.firstName}
                onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                className="w-full px-4 py-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                required
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="lastName"
                className="block text-gray-800 dark:text-gray-200 mb-1"
              >
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                value={profile.lastName}
                onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                className="w-full px-4 py-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                required
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-gray-800 dark:text-gray-200 mb-1"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                className="w-full px-4 py-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                required
              />
            </div>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Update Profile
            </button>
          </form>
        </div>

        {/* Update Password Section */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded shadow-lg">
          <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">
            Update Password
          </h2>
          <form onSubmit={handlePasswordUpdate}>
            <div className="mb-4">
              <label
                htmlFor="password"
                className="block text-gray-800 dark:text-gray-200 mb-1"
              >
                New Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                required
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="confirmPassword"
                className="block text-gray-800 dark:text-gray-200 mb-1"
              >
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setPasswordError(e.target.value !== password ? "Passwords do not match." : "");
                }}
                className={`w-full px-4 py-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 ${
                  passwordError ? "border-red-500" : ""
                }`}
                required
              />
              {passwordError && (
                <p className="text-red-500 text-sm mt-1">{passwordError}</p>
              )}
            </div>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Update Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
