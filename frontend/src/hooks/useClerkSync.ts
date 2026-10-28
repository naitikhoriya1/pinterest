import { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { api, setToken, getToken, clearToken } from "../lib/api";

export type SyncStatus = "idle" | "syncing" | "done" | "error";

interface ApiUser {
  _id: string;
  username: string;
  email: string;
  clerkId?: string;
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
 * 1. Checks if stored token matches the active Clerk user (user.id).
 * 2. If valid and matches current user, keeps it.
 * 3. Otherwise exchanges Clerk identity for a fresh backend JWT via POST /api/auth/clerk-sync.
 * 4. Cleans up token when user signs out or switches account.
 */
export function useClerkSync(): UseClerkSyncResult {
  const { user, isSignedIn, isLoaded } = useUser();
  const [status, setStatus] = useState<SyncStatus>("idle");
  const [apiUser, setApiUser] = useState<ApiUser | null>(null);
  const [isSynced, setIsSynced] = useState<boolean>(false);

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
      console.log("[useClerkSync] User is not signed in. Clearing local auth state...");
      clearToken();
      setApiUser(null);
      setIsSynced(false);
      setStatus("idle");
      return;
    }

    const sync = async () => {
      setStatus("syncing");
      console.log("[useClerkSync] Initiating sync with backend for clerkId:", user.id);

      try {
        const existingToken = getToken();

        // If an existing token is found, verify its validity AND ensure it belongs to the CURRENT Clerk user
        if (existingToken) {
          try {
            console.log("[useClerkSync] Validating existing token via GET /api/user/me...");
            const meRes = await api.get<{ success: boolean; data: ApiUser }>("/api/user/me");

            // Critical check: Ensure the stored token actually belongs to the active Clerk user
            if (meRes.data && meRes.data.clerkId === user.id) {
              console.log("[useClerkSync] Existing token matches current Clerk user:", meRes.data);
              setApiUser(meRes.data);
              setIsSynced(true);
              setStatus("done");
              return;
            } else {
              console.warn(
                `[useClerkSync] ⚠️ Stored token belongs to a different user (${meRes.data?.clerkId} !== ${user.id}). Clearing token and re-syncing...`
              );
              clearToken();
              setIsSynced(false);
              setApiUser(null);
            }
          } catch (tokenErr: any) {
            console.warn(
              "[useClerkSync] ⚠️ Stored token invalid or expired. Clearing token and re-authenticating with Clerk...",
              tokenErr?.message
            );
            clearToken();
            setIsSynced(false);
            setApiUser(null);
          }
        }

        // Exchange Clerk session for a fresh backend JWT
        const primaryEmail = user.primaryEmailAddress?.emailAddress ?? "";
        const payload = {
          clerkId: user.id,
          email: primaryEmail,
          username: user.username ?? user.firstName ?? primaryEmail.split("@")[0] ?? "user",
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
