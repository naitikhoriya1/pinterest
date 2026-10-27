import { useState, useEffect, useCallback } from "react";
import { api } from "../lib/api";

// ── Types ─────────────────────────────────────────────────────────────────────
export interface Pin {
  _id: string;
  title: string;
  description: string;
  imageUrl: string;
  width: number;
  height: number;
  tags: string[];
  saveCount: number;
  createdAt: string;
}

interface FeedResponse {
  success: boolean;
  data: Pin[];
  nextCursor: string | null;
}

// ── Hook ──────────────────────────────────────────────────────────────────────
/**
 * useFeed — fetches the personalised pin feed from GET /api/pins/feed.
 *
 * Uses cursor-based pagination keyed on `createdAt` (ISO string).
 * Call `loadMore()` to fetch the next page. Deduplicates by `_id`.
 */
export function useFeed() {
  const [pins, setPins] = useState<Pin[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPage = useCallback(async (nextCursor: string | null = null) => {
    setLoading(true);
    setError(null);
    try {
      const qs = nextCursor ? `?cursor=${encodeURIComponent(nextCursor)}` : "";
      const res = await api.get<FeedResponse>(`/api/pins/feed${qs}`);

      setPins((prev) => {
        // Deduplicate by _id in case of concurrent calls
        const existingIds = new Set(prev.map((p) => p._id));
        const fresh = res.data.filter((p) => !existingIds.has(p._id));
        return nextCursor ? [...prev, ...fresh] : fresh;
      });

      setCursor(res.nextCursor);
      setHasMore(res.nextCursor !== null);
    } catch (err: any) {
      setError(err.message ?? "Failed to load feed");
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load on mount
  useEffect(() => {
    fetchPage(null);
  }, [fetchPage]);

  /** Call this to fetch the next batch of pins */
  const loadMore = useCallback(() => {
    if (!loading && hasMore) fetchPage(cursor);
  }, [loading, hasMore, cursor, fetchPage]);

  /** Reset and reload from the top (e.g. pull-to-refresh) */
  const refresh = useCallback(() => {
    setPins([]);
    setCursor(null);
    setHasMore(true);
    fetchPage(null);
  }, [fetchPage]);

  return { pins, loading, hasMore, error, loadMore, refresh };
}
 