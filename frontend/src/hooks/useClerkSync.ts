import { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { api, setToken, getToken } from "../lib/api";

export type SyncStatus = "idle" | "syncing" | "done" | "error";

interface ApiUser {
  _id: string;
  username: string;
  email: string;
  interests: Record<string, number>;
  avatarUrl?: string;
}

interface UseClerkSyncResult {
  status: SyncStatus;
  apiUser: ApiUser | null;
  hasInterests: boolean;
  isSynced: boolean;
}

/**
 * Called once the Clerk session is active.
 * 1. Exchanges Clerk identity for a backend JWT via POST /api/auth/clerk-sync.
 * 2. Stores the token in localStorage and sets isSynced = true.
 * 3. Checks whether the user has completed interest onboarding.
 */
export function useClerkSync(): UseClerkSyncResult {
  const { user, isSignedIn, isLoaded } = useUser();
  const [status, setStatus] = useState<SyncStatus>("idle");
  const [apiUser, setApiUser] = useState<ApiUser | null>(null);
  const [isSynced, setIsSynced] = useState<boolean>(() => Boolean(getToken()));

  useEffect(() => {
    console.log("[useClerkSync] Auth State Changed:", {
      isLoaded,
      isSignedIn,
      clerkUserId: user?.id,
      clerkEmail: user?.primaryEmailAddress?.emailAddress,
    });

    if (!isLoaded) {
      console.log("[useClerkSync] Clerk is still loading, waiting...");
      return;
    }

    if (!isSignedIn || !user) {
      console.log("[useClerkSync] User is not signed in.");
      setIsSynced(false);
      return;
    }

    const existingToken = getToken();
    if (existingToken) {
      console.log("[useClerkSync] Found existing backend JWT in localStorage. isSynced = true");
      setIsSynced(true);
    } else {
      console.log("[useClerkSync] No backend JWT found in localStorage. Need to sync with backend.");
    }

    const sync = async () => {
      setStatus("syncing");
      console.log("[useClerkSync] Initiating sync with backend...");

      try {
        // Step 1 — get / create backend user and receive JWT
        if (!existingToken) {
          const primaryEmail = user.primaryEmailAddress?.emailAddress ?? "";
          const payload = {
            clerkId: user.id,
            email: primaryEmail,
            username: user.username ?? user.firstName ?? primaryEmail.split("@")[0],
            avatarUrl: user.imageUrl,
          };

          console.log("[useClerkSync] Step 1: Sending POST /api/auth/clerk-sync with payload:", payload);
          const syncRes = await api.post<{ success: boolean; token: string; data: ApiUser }>(
            "/api/auth/clerk-sync",
            payload
          );

          console.log("[useClerkSync] Step 1 Success: Received JWT token from backend. Setting token and isSynced=true.");
          setToken(syncRes.token);
          setIsSynced(true);
        }

        // Step 2 — fetch user profile
        console.log("[useClerkSync] Step 2: Fetching user profile via GET /api/user/me...");
        const meRes = await api.get<{ success: boolean; data: ApiUser }>("/api/user/me");
        console.log("[useClerkSync] Step 2 Success: User profile received:", meRes.data);

        setApiUser(meRes.data);
        setStatus("done");
        console.log("[useClerkSync] Full sync cycle completed successfully!");
      } catch (err: any) {
        console.error("[useClerkSync] ❌ Sync failed:", {
          error: err?.message || err,
          clerkId: user.id,
        });
        setStatus("error");
      }
    };

    sync();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded, isSignedIn, user?.id]);

  const hasInterests =
    apiUser !== null && Object.keys(apiUser.interests ?? {}).length > 0;

  return { status, apiUser, hasInterests, isSynced };
}
