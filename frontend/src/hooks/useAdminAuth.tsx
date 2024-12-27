import { useEffect, useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "@/utils";

function useAdminAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get(
          `${BACKEND_URL}/api/v1/secure/admin`,
          {
            withCredentials: true,
          }
        );

        if (response) {
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
      await axios.get(`${BACKEND_URL}/api/v1/admin/logout`, {
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
