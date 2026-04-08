/**
 * Generic fetch hook with loading/error state and AbortController cancellation.
 * Replaces repeated useState/useEffect/fetch patterns in components.
 *
 * @param url - Endpoint to fetch
 * @returns { data, loading, error }
 */

import { useState, useEffect } from "react";

export function useFetchData<T>(url: string): { data: T | null; loading: boolean; error: boolean } {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    fetch(url, { signal: controller.signal })
      .then((r) => r.json())
      .then((d: T) => { setData(d); setLoading(false); })
      .catch((e) => { if (e.name !== "AbortError") { setError(true); setLoading(false); } });
    return () => controller.abort();
  }, [url]);

  return { data, loading, error };
}
