import { useState, useEffect, useCallback, useRef } from "react";
import { apiFetch } from "../lib/api";
import type { Pin } from "../types/pin";

interface SearchResponse {
  success: boolean;
  data: Pin[];
  nextCursor: string | null;
  query?: string;
}

/**
 * useSearch(query: string, enabled: boolean)
 *
 * Searches pins by title with case-insensitive partial match and cursor pagination.
 * Includes race-condition guard (requestId + AbortController) and StrictMode double-fetch protection.
 */
export function useSearch(query: string, enabled: boolean) {
  const [pins, setPins] = useState<Pin[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);

  const trimmedQuery = query.trim();

  const cursorRef = useRef<string | null>(null);
  const loadingRef = useRef(false);
  const hasMoreRef = useRef(true);
  const currentQueryRef = useRef(trimmedQuery);
  const requestIdRef = useRef(0);
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchPage = useCallback(
    async (targetCursor: string | null, targetQuery: string, reqId: number) => {
      if (!targetQuery) return;
      if (loadingRef.current) return;
      if (targetCursor !== null && !hasMoreRef.current) return;

      loadingRef.current = true;
      setLoading(true);
      setError(null);

      const controller = new AbortController();
      abortControllerRef.current = controller;

      try {
        const qs = targetCursor
          ? `?q=${encodeURIComponent(targetQuery)}&limit=20&cursor=${encodeURIComponent(targetCursor)}`
          : `?q=${encodeURIComponent(targetQuery)}&limit=20`;

        console.log(`[useSearch] Fetching search page (reqId: ${reqId}):`, `/api/pins/search${qs}`);
        const res = await apiFetch<SearchResponse>(`/api/pins/search${qs}`, {
          signal: controller.signal,
        });

        // Ignore stale response if user initiated a newer search
        if (reqId !== requestIdRef.current || targetQuery !== currentQueryRef.current) {
          console.log(`[useSearch] Ignoring stale response for query "${targetQuery}" (reqId: ${reqId})`);
          return;
        }

        setPins((prev) => {
          const existingIds = new Set(prev.map((p) => p._id));
          const fresh = (res.data || []).filter((p) => !existingIds.has(p._id));
          console.log(`[useSearch] Deduplication: ${prev.length} existing + ${fresh.length} fresh results.`);
          return targetCursor ? [...prev, ...fresh] : fresh;
        });

        const nextHasMore = res.nextCursor !== null;
        cursorRef.current = res.nextCursor;
        hasMoreRef.current = nextHasMore;
        setHasMore(nextHasMore);
      } catch (err: any) {
        if (err?.name === "AbortError" || controller.signal.aborted) {
          console.log(`[useSearch] Request aborted for query "${targetQuery}"`);
          return;
        }
        if (reqId !== requestIdRef.current || targetQuery !== currentQueryRef.current) {
          return;
        }
        const msg = err?.message ?? "Failed to search pins";
        console.error("[useSearch] ❌ ERROR searching pins:", {
          error: msg,
          query: targetQuery,
          targetCursor,
        });
        setError(msg);
      } finally {
        if (reqId === requestIdRef.current) {
          loadingRef.current = false;
          setLoading(false);
        }
      }
    },
    []
  );

  // When query or enabled changes: reset state and fetch page 1
  useEffect(() => {
    currentQueryRef.current = trimmedQuery;
    requestIdRef.current += 1;
    const currentReqId = requestIdRef.current;

    // Abort any ongoing search request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }

    setPins([]);
    setError(null);
    setLoading(false);
    setHasMore(true);
    cursorRef.current = null;
    loadingRef.current = false;
    hasMoreRef.current = true;

    if (!enabled || !trimmedQuery) {
      return;
    }

    console.log(`[useSearch] Starting new search for "${trimmedQuery}" (reqId: ${currentReqId})`);
    fetchPage(null, trimmedQuery, currentReqId);
  }, [trimmedQuery, enabled, fetchPage]);

  /** Call this to fetch the next batch of search results */
  const loadMore = useCallback(() => {
    if (!loadingRef.current && hasMoreRef.current && trimmedQuery && enabled) {
      fetchPage(cursorRef.current, trimmedQuery, requestIdRef.current);
    }
  }, [fetchPage, trimmedQuery, enabled]);

  /** Retry fetching after error */
  const retry = useCallback(() => {
    if (!loadingRef.current && trimmedQuery && enabled) {
      fetchPage(cursorRef.current, trimmedQuery, requestIdRef.current);
    }
  }, [fetchPage, trimmedQuery, enabled]);

  const removePin = useCallback((id: string) => {
    setPins((prev) => prev.filter((p) => p._id !== id));
  }, []);

  return { pins, loading, error, hasMore, loadMore, retry, removePin };
}
