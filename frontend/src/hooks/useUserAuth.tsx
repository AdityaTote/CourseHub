import { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import { BACKEND_URL } from "@/utils";

function useUserAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get(
          `${BACKEND_URL}/api/v1/secure/user`,
          {
            withCredentials: true,
          }
        );
        if (response.status === 200) {
        console.log(response)
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        if (error instanceof AxiosError) {
          const errorMessage = error.response?.data?.error || "An error occurred.";
          console.log(errorMessage);
          setError(errorMessage);
        } else if (error instanceof Error) {
          // Generic Error handling
          console.log(error.message);
          setError(error.message);
        } else {
          // Fallback for unknown error types
          console.log("Unexpected error", error);
          setError("An unexpected error occurred.");
        }
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const logout = async () => {
    try {
      await axios.get(`${BACKEND_URL}/api/v1/user/logout`, {
        withCredentials: true,
      });
      setIsAuthenticated(false);
    } catch (error) {
      if (error instanceof AxiosError) {
        const errorMessage = error.response?.data?.error || "An error occurred.";
        console.log(errorMessage);
        setError(errorMessage);
      } else if (error instanceof Error) {
        // Generic Error handling
        console.log(error.message);
        setError(error.message);
      } else {
        // Fallback for unknown error types
        console.log("Unexpected error", error);
        setError("An unexpected error occurred.");
      }
    }
  };

  return { isAuthenticated, loading, logout, error };
}

export default useUserAuth;