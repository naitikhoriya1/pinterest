import { useState, useEffect, useCallback, useRef } from "react";
import { apiFetch } from "../lib/api";
import type { Pin } from "../types/pin";

export type { Pin };

interface FeedResponse {
  success: boolean;
  data: Pin[];
  nextCursor: string | null;
}

/**
 * useFeed(enabled: boolean)
 *
 * Fetches the global reverse-chronological pin feed from GET /api/pins/feed.
 * Uses cursor-based pagination keyed on `<ISO createdAt>_<ObjectId>`.
 * Double-fetch protection via refs for React 18 StrictMode and observer firing.
 */
export function useFeed(enabled: boolean) {
  const [pins, setPins] = useState<Pin[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);

  const cursorRef = useRef<string | null>(null);
  const loadingRef = useRef(false);
  const hasMoreRef = useRef(true);

  const fetchPage = useCallback(async (targetCursor: string | null) => {
    if (loadingRef.current) return;
    if (targetCursor !== null && !hasMoreRef.current) return;

    loadingRef.current = true;
    setLoading(true);
    setError(null);

    try {
      const url = targetCursor
        ? `/api/pins/feed?limit=20&cursor=${encodeURIComponent(targetCursor)}`
        : "/api/pins/feed?limit=20";

      const res = await apiFetch<FeedResponse>(url);

      setPins((prev) => {
        const existingIds = new Set(prev.map((p) => p._id));
        const fresh = res.data.filter((p) => !existingIds.has(p._id));
        return targetCursor ? [...prev, ...fresh] : fresh;
      });

      const nextHasMore = res.nextCursor !== null;
      cursorRef.current = res.nextCursor;
      hasMoreRef.current = nextHasMore;
      setHasMore(nextHasMore);
    } catch (err: any) {
      setError(err?.message ?? "Failed to load feed");
    } finally {
      loadingRef.current = false;
      setLoading(false);
    }
  }, []);

  // Loads the first page only when enabled is true and no pins are loaded yet
  useEffect(() => {
    if (enabled && pins.length === 0 && !loadingRef.current && hasMoreRef.current) {
      fetchPage(null);
    }
  }, [enabled, pins.length, fetchPage]);

  /** Call this to fetch the next batch of pins */
  const loadMore = useCallback(() => {
    if (!loadingRef.current && hasMoreRef.current) {
      fetchPage(cursorRef.current);
    }
  }, [fetchPage]);

  /** Retry fetching after error (either first page or next page) */
  const retry = useCallback(() => {
    if (!loadingRef.current) {
      fetchPage(cursorRef.current);
    }
  }, [fetchPage]);

  return { pins, setPins, loading, error, hasMore, loadMore, retry };
}