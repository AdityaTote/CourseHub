import React, { useEffect, useState } from "react";
import axios from "axios";

function useAdminAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3030/api/v1/secure/admin",
          {
            withCredentials: true,
          }
        );

        if (response.status === 200 && response.data.user) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Authentication check failed:", error);
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, []);

  const logout = async () => {
    try {
      await axios.get("http://localhost:3030/api/v1/auth/admin/logout", {
        withCredentials: true,
      });
      setIsAuthenticated(false);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  if (isAuthenticated === null) {
    return { isAuthenticated: false, loading: true, logout };
  }

  return { isAuthenticated, loading: false, logout };
}

export default useAdminAuth;
