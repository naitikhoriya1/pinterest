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
 * 3. Checks whether the user has completed interest onboarding (dormant).
 */
export function useClerkSync(): UseClerkSyncResult {
  const { user, isSignedIn, isLoaded } = useUser();
  const [status, setStatus] = useState<SyncStatus>("idle");
  const [apiUser, setApiUser] = useState<ApiUser | null>(null);
  const [isSynced, setIsSynced] = useState<boolean>(() => Boolean(getToken()));

  useEffect(() => {
    if (!isLoaded || !isSignedIn || !user) {
      setIsSynced(false);
      return;
    }

    const existingToken = getToken();
    if (existingToken) {
      setIsSynced(true);
    }

    const sync = async () => {
      setStatus("syncing");
      try {
        // Step 1 — get / create backend user and receive JWT
        if (!existingToken) {
          const primaryEmail = user.primaryEmailAddress?.emailAddress ?? "";
          const syncRes = await api.post<{ success: boolean; token: string; data: ApiUser }>(
            "/api/auth/clerk-sync",
            {
              clerkId: user.id,
              email: primaryEmail,
              username: user.username ?? user.firstName ?? primaryEmail.split("@")[0],
              avatarUrl: user.imageUrl,
            }
          );
          setToken(syncRes.token);
          setIsSynced(true);
        }

        // Step 2 — fetch user profile
        const meRes = await api.get<{ success: boolean; data: ApiUser }>("/api/user/me");
        setApiUser(meRes.data);
        setStatus("done");
      } catch (err) {
        console.error("[useClerkSync] sync failed:", err);
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
