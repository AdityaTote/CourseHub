import axios, { AxiosError } from "axios";
import { useEffect, useState } from "react";

export function useFetch(url: string, auth: boolean = false) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
      const fetchData = async () => {
      try {
        if (auth === true) {
          const response = await axios.get(url, { withCredentials: true });
          if (response) {
            setData(response.data.data);
          } else {
            if (error) {
              setError(response);
            }
          }
        } else {
          const response = await axios.get(url);
          if (response) {
            setData(response.data.data);
          } else {
            setError(response);
          }
        }
      } catch (e) {
        if (e instanceof AxiosError) {
          setError(e.response?.data.error || "An error occurred.");
        } else {
          setError("An error occurred.");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [url, auth, error]);
  return { data, loading, error };
}
