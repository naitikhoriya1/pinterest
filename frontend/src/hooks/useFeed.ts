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
    console.log("[useFeed] fetchPage called with targetCursor:", targetCursor, {
      currentlyLoading: loadingRef.current,
      hasMore: hasMoreRef.current,
    });

    if (loadingRef.current) {
      console.warn("[useFeed] ⚠️ Skipping fetchPage: already loading.");
      return;
    }
    if (targetCursor !== null && !hasMoreRef.current) {
      console.log("[useFeed] ℹ️ Skipping fetchPage: no more pins (hasMore is false).");
      return;
    }

    loadingRef.current = true;
    setLoading(true);
    setError(null);

    try {
      const url = targetCursor
        ? `/api/pins/feed?limit=20&cursor=${encodeURIComponent(targetCursor)}`
        : "/api/pins/feed?limit=20";

      console.log("[useFeed] Fetching feed from API:", url);
      const res = await apiFetch<FeedResponse>(url);

      console.log("[useFeed] API returned feed response:", {
        pinCount: res.data?.length ?? 0,
        nextCursor: res.nextCursor,
      });

      setPins((prev) => {
        const existingIds = new Set(prev.map((p) => p._id));
        const fresh = (res.data || []).filter((p) => !existingIds.has(p._id));
        console.log(`[useFeed] Deduplication: ${prev.length} existing + ${fresh.length} fresh pins (${res.data.length - fresh.length} duplicates filtered).`);
        return targetCursor ? [...prev, ...fresh] : fresh;
      });

      const nextHasMore = res.nextCursor !== null;
      cursorRef.current = res.nextCursor;
      hasMoreRef.current = nextHasMore;
      setHasMore(nextHasMore);

      console.log("[useFeed] State updated: hasMore =", nextHasMore, "nextCursor =", res.nextCursor);
    } catch (err: any) {
      const msg = err?.message ?? "Failed to load feed";
      console.error("[useFeed] ❌ ERROR fetching feed page:", {
        error: msg,
        targetCursor,
      });
      setError(msg);
    } finally {
      loadingRef.current = false;
      setLoading(false);
    }
  }, []);

  // Loads the first page only when enabled is true and no pins are loaded yet
  useEffect(() => {
    console.log("[useFeed] enabled effect triggered:", {
      enabled,
      pinsCount: pins.length,
      loading: loadingRef.current,
      hasMore: hasMoreRef.current,
    });

    if (enabled && pins.length === 0 && !loadingRef.current && hasMoreRef.current) {
      console.log("[useFeed] Loading initial feed page (cursor = null)...");
      fetchPage(null);
    }
  }, [enabled, pins.length, fetchPage]);

  /** Call this to fetch the next batch of pins */
  const loadMore = useCallback(() => {
    console.log("[useFeed] loadMore() triggered:", {
      cursor: cursorRef.current,
      loading: loadingRef.current,
      hasMore: hasMoreRef.current,
    });
    if (!loadingRef.current && hasMoreRef.current) {
      fetchPage(cursorRef.current);
    } else {
      console.log("[useFeed] loadMore() bypassed (already loading or no more items).");
    }
  }, [fetchPage]);

  /** Retry fetching after error (either first page or next page) */
  const retry = useCallback(() => {
    console.log("[useFeed] retry() triggered with cursor:", cursorRef.current);
    if (!loadingRef.current) {
      fetchPage(cursorRef.current);
    }
  }, [fetchPage]);

  const removePin = useCallback((id: string) => {
    setPins((prev) => prev.filter((p) => p._id !== id));
  }, []);

  return { pins, setPins, loading, error, hasMore, loadMore, retry, removePin };
}