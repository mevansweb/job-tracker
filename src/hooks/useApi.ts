import { useState } from "react";

const useApi = (url: string) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const postData = async (method: 'POST' | 'GET' | 'PUT' | 'DELETE', body: unknown) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const result = await response.json();
      setData(result);
    } catch (err) {
      const error = err as Error
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return { data, error, loading, postData };
};

export default useApi;
