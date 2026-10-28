import { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { api, setToken, getToken, clearToken } from "../lib/api";

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
  currentUserId?: string;
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

    const sync = async () => {
      setStatus("syncing");
      console.log("[useClerkSync] Initiating sync with backend...");

      try {
        const existingToken = getToken();

        // If an existing token is found, verify its validity via GET /api/user/me
        if (existingToken) {
          try {
            console.log("[useClerkSync] Validating existing token via GET /api/user/me...");
            const meRes = await api.get<{ success: boolean; data: ApiUser }>("/api/user/me");
            console.log("[useClerkSync] Existing token is valid:", meRes.data);
            setApiUser(meRes.data);
            setIsSynced(true);
            setStatus("done");
            return;
          } catch (tokenErr: any) {
            console.warn(
              "[useClerkSync] ⚠️ Stored token invalid or expired. Clearing token and re-authenticating with Clerk...",
              tokenErr?.message
            );
            clearToken();
            setIsSynced(false);
          }
        }

        // Exchange Clerk session for a fresh backend JWT
        const primaryEmail = user.primaryEmailAddress?.emailAddress ?? "";
        const payload = {
          clerkId: user.id,
          email: primaryEmail,
          username: user.username ?? user.firstName ?? primaryEmail.split("@")[0],
          avatarUrl: user.imageUrl,
        };

        console.log("[useClerkSync] Sending POST /api/auth/clerk-sync with payload:", payload);
        const syncRes = await api.post<{ success: boolean; token: string; data: ApiUser }>(
          "/api/auth/clerk-sync",
          payload
        );

        console.log("[useClerkSync] Successfully authenticated with backend:", syncRes.data);
        setToken(syncRes.token);
        setIsSynced(true);
        setApiUser(syncRes.data);
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

  return {
    status,
    apiUser,
    hasInterests,
    isSynced,
    currentUserId: apiUser?._id,
  };
}
