import { useEffect, useState } from "react";
import axios from "axios";

function useUserAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3030/api/v1/secure/user",
          {
            withCredentials: true,
          }
        );

        if (response.status === 200) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error: any) {
        console.error("Authentication check failed:", error);
        setIsAuthenticated(false);
        setError(error.message || "Network Error");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const logout = async () => {
    try {
      await axios.get("http://localhost:3030/api/v1/auth/user/logout", {
        withCredentials: true,
      });
      setIsAuthenticated(false);
    } catch (error: any) {
      console.error("Logout failed:", error);
      setError(error.message || "Network Error");
    }
  };

  return { isAuthenticated, loading, logout, error };
}

export default useUserAuth;