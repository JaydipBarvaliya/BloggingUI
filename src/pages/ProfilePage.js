import React, { useState, useEffect } from "react";
import { getUserProfile, updateUserProfile, updateUserPassword } from "../api/axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ProfilePage = () => {
  const [profile, setProfile] = useState({ firstName: "", lastName: "", email: "" });
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const userId = localStorage.getItem("userId");

  // ✅ Fetch user details on component mount
  useEffect(() => {
    if (!userId) {
      console.warn("User ID is not available. Please log in.");
      return;
    }

    const fetchUserProfile = async () => {
      const userData = await getUserProfile(userId);
      if (userData) setProfile(userData);
    };

    fetchUserProfile();
  }, [userId]);

  // ✅ Handle profile update
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    if (!userId) return;

    const success = await updateUserProfile(userId, profile);
    if (success) {
      toast.success("Profile updated successfully!");
    } else {
      toast.error("Failed to update profile. Please try again.");
    }
  };

  // ✅ Handle password update
  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setPasswordError("Passwords do not match.");
      return;
    }

    if (!userId) return;

    const success = await updateUserPassword(userId, password);
    if (success) {
      setPassword("");
      setConfirmPassword("");
      setPasswordError("");
      toast.success("Password updated successfully!");
    } else {
      toast.error("Failed to update password. Please try again.");
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
              <label className="block text-gray-800 dark:text-gray-200 mb-1">
                First Name
              </label>
              <input
                type="text"
                value={profile.firstName}
                onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                className="w-full px-4 py-2 border rounded dark:bg-gray-700 dark:text-gray-200"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-800 dark:text-gray-200 mb-1">
                Last Name
              </label>
              <input
                type="text"
                value={profile.lastName}
                onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                className="w-full px-4 py-2 border rounded dark:bg-gray-700 dark:text-gray-200"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-800 dark:text-gray-200 mb-1">
                Email
              </label>
              <input
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                className="w-full px-4 py-2 border rounded dark:bg-gray-700 dark:text-gray-200"
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
              <label className="block text-gray-800 dark:text-gray-200 mb-1">
                New Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border rounded dark:bg-gray-700 dark:text-gray-200"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-800 dark:text-gray-200 mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setPasswordError(e.target.value !== password ? "Passwords do not match." : "");
                }}
                className={`w-full px-4 py-2 border rounded dark:bg-gray-700 ${
                  passwordError ? "border-red-500" : ""
                }`}
                required
              />
              {passwordError && <p className="text-red-500 text-sm mt-1">{passwordError}</p>}
            </div>
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
              Update Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
