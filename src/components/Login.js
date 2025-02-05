import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  loginUser,
  loginViaGoogle,
  registerUserWithGoogle,
} from "../api/axios";
import { GoogleLogin } from "@react-oauth/google";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();


  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Email and password are required");
      return;
    }

    try {
      const response = await loginUser(email, password);
      const token = response.data;

      const { userId, firstName, lastName, role, authType } = parseJwt(token);

      //eslint-disable-next-line
      const cleanedRole = role.replace(/[\[\]]/g, "");

      // Call the context login function (which updates localStorage and state)
      login(token, firstName, lastName, cleanedRole, authType, userId);
      toast.success(`Welcome back, ${firstName}!`);


      const redirectPath  =location.state?.from || localStorage.getItem("redirectAfterLogin") || "/";
      localStorage.removeItem("redirectAfterLogin"); // ✅ Clear the stored path
      navigate(redirectPath, { replace: true }); // ✅ Redirect back to where user was

    } catch (err) {
      setError("Invalid email or password");
      console.error("Login error:", err);
    }
  };

  const handleGoogleLoginSuccess = async (response) => {
    try {
      const { given_name, family_name, email } = parseJwt(response.credential);

      // Check if user already exists
      const userResponse = await loginViaGoogle(email, given_name, family_name, "Google");
      if (userResponse.data) {
        
        const token = userResponse.data;
        const { userId, firstName, lastName, role, authType } = parseJwt(token);

        //eslint-disable-next-line
        const cleanedRole = role.replace(/[\[\]]/g, "");

        login(token, firstName, lastName, cleanedRole, authType, userId);
        toast.success(`Welcome back, ${firstName}!`);
        navigate("/");
      } else {
        // User doesn't exist, create a new user
        await registerUserWithGoogle(email);
        toast.success(`Account created with Google!`);
        navigate("/");
      }
    } catch (err) {
      console.error("Google login error:", err);
    }
  };

  const parseJwt = (token) => {
    const base64Url = token.split(".")[1];
    const base64 = decodeURIComponent(
      atob(base64Url)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(base64);
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-md p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200 text-center">
          Login
        </h2>

        {error && (
          <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
        )}

        <form onSubmit={handleLogin}>
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
              className="w-full px-4 py-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-gray-800 dark:text-gray-200 mb-1"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              className="w-full px-4 py-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition duration-200"
          >
            Login
          </button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-gray-400">Don't have an account?</p>
          <button
            className="text-blue-500 hover:underline mt-2"
            onClick={() => navigate("/register")}
          >
            Register
          </button>
        </div>
        <div className="mt-4 text-center">
          <p className="text-gray-400">Or</p>
          <GoogleLogin
            onSuccess={handleGoogleLoginSuccess}
            onError={(err) => console.log(err)}
            useOneTap
            className="mt-4 mb-4" // Added margin-bottom for space below the button
          />
        </div>
      </div>
    </div>
  );
};

export default Login;
