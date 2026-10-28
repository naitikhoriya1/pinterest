import { useCallback, useRef } from "react";
import { apiFetch } from "../lib/api";
import type { Pin } from "../types/pin";

interface LikeResponse {
  success: boolean;
  liked: boolean;
  likeCount: number;
}

/**
 * Hook to toggle likes optimistically on pins.
 * - In-flight protection via ref
 * - Immediate optimistic flip of likedByMe and likeCount
 * - Reconciles with server values on success
 * - Reverts on failure
 */
export function useLikeToggle(
  updatePin: (id: string, patch: Partial<Pin>) => void
) {
  const inFlightRef = useRef<Set<string>>(new Set());

  const toggleLike = useCallback(
    async (pin: Pin) => {
      const pinId = pin._id;

      // Ignore rapid taps if a request for this pin is already in flight
      if (inFlightRef.current.has(pinId)) {
        return;
      }

      inFlightRef.current.add(pinId);

      const prevLiked = Boolean(pin.likedByMe);
      const prevCount = pin.likeCount ?? 0;

      const nextLiked = !prevLiked;
      const nextCount = Math.max(0, prevCount + (nextLiked ? 1 : -1));

      // 1. Optimistic update
      updatePin(pinId, {
        likedByMe: nextLiked,
        likeCount: nextCount,
      });

      try {
        // 2. Network request (PUT to like, DELETE to unlike)
        const res = await apiFetch<LikeResponse>(`/api/pins/${pinId}/like`, {
          method: nextLiked ? "PUT" : "DELETE",
        });

        // 3. Overwrite with server truth
        updatePin(pinId, {
          likedByMe: res.liked,
          likeCount: res.likeCount,
        });
      } catch (err: any) {
        console.error(`[useLikeToggle] ❌ Failed to ${nextLiked ? "like" : "unlike"} pin:`, err);
        // 4. Rollback to original state on failure
        updatePin(pinId, {
          likedByMe: prevLiked,
          likeCount: prevCount,
        });
      } finally {
        inFlightRef.current.delete(pinId);
      }
    },
    [updatePin]
  );

  return { toggleLike };
}
