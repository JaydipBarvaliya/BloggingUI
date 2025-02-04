import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useMemo,
  useCallback
} from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState(null);
  const [userDetails, setUserDetails] = useState({ firstName: "", lastName: "" });
  const [role, setRole] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");

    if (storedToken) {
      setToken(storedToken);
      setIsLoggedIn(true);

      const storedUserId = localStorage.getItem("userId");
      const storedUserDetails = localStorage.getItem("userDetails");
      const storedRole = localStorage.getItem("role");

    if (storedUserId) setUserId(storedUserId);
    if (storedUserDetails) setUserDetails(JSON.parse(storedUserDetails));
    if (storedRole) setRole(storedRole);
    }
  }, []); // Only runs on mount

  // Wrap login in useCallback so its identity remains stable
  const login = useCallback(
    (token, firstName, lastName, role, authType, userId) => {
      localStorage.setItem("token", token);
      localStorage.setItem("userId", userId);
      localStorage.setItem("userDetails", JSON.stringify({ firstName, lastName }));
      localStorage.setItem("role", role);

      setToken(token);
      setIsLoggedIn(true);
      setUserId(userId);
      setUserDetails({ firstName, lastName });
      setRole(role); // Update role state as well
    },
    []
  );

  // Wrap logout in useCallback for stability
  const logout = useCallback(() => {
    localStorage.removeItem("token");

    setToken(null);
    setIsLoggedIn(false);
    setUserId(null);
    setUserDetails({ firstName: "", lastName: "" });
    setRole(null);
  }, []);

  // Memoize the context value including the stable login and logout functions.
  const authValue = useMemo(
    () => ({
      token,
      isLoggedIn,
      userId,
      userDetails,
      role,
      login,
      logout
    }),
    [token, isLoggedIn, userId, userDetails, role, login, logout]
  );

  return (
    <AuthContext.Provider value={authValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for using auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
