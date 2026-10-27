import { useCallback } from "react";
import { useUser } from "@clerk/clerk-react";
import { api } from "../lib/api";

type BumpAction = "view" | "click" | "save";

/**
 * Returns a `bump(tags, action)` function.
 * Silently fires and forgets — never throws in the UI layer.
 *
 * Usage:
 *   const bump = useInterestBump();
 *   bump(["nature", "landscape"], "view");
 */
export function useInterestBump() {
  const { isSignedIn } = useUser();

  const bump = useCallback(
    (tags: string[], action: BumpAction) => {
      if (!isSignedIn || tags.length === 0) return;
      api
        .post("/api/user/interests/bump", { tags, action })
        .catch((err) => console.warn("[useInterestBump] failed:", err));
    },
    [isSignedIn]
  );

  return bump;
}
