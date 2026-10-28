import {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
  type ReactNode,
} from "react";
import { api } from "../lib/api";
import type { Notification } from "../types/notification";

interface NotificationsResponse {
  success: boolean;
  data: Notification[];
  nextCursor?: string | null;
  unreadCount: number;
  serverTime: string;
}

interface ReadResponse {
  success: boolean;
  unreadCount: number;
  serverTime: string;
}

interface NotificationsContextValue {
  notifications: Notification[];
  unreadCount: number;
  toasts: Notification[];
  loading: boolean;
  error: string | null;
  markAllRead: () => Promise<void>;
  markLocalRead: () => void;
  decreaseUnreadCount: (notificationId?: string) => void;
  dismissToast: (id: string) => void;
}

const STORAGE_KEY = "pinterest_seen_toast_ids";

const getPersistedSeenIds = (): Set<string> => {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch {
    return new Set();
  }
};

const persistSeenId = (id: string) => {
  try {
    const set = getPersistedSeenIds();
    set.add(id);
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(set)));
  } catch {
    // Ignore storage errors
  }
};

const NotificationsContext = createContext<NotificationsContextValue | undefined>(
  undefined
);

interface NotificationsProviderProps {
  children: ReactNode;
  enabled: boolean;
}

export const NotificationsProvider = ({
  children,
  enabled,
}: NotificationsProviderProps) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [toasts, setToasts] = useState<Notification[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const sinceRef = useRef<string | null>(null);
  const isPollingRef = useRef<boolean>(false);
  const seenIdsRef = useRef<Set<string>>(getPersistedSeenIds());

  // Dismiss a toast by id (ensures it is never shown again)
  const dismissToast = useCallback((id: string) => {
    persistSeenId(id);
    seenIdsRef.current.add(id);
    setToasts((prev) => prev.filter((t) => t._id !== id));
  }, []);

  // Decrease unread notification count by 1 and mark local notification as read
  const decreaseUnreadCount = useCallback((notificationId?: string) => {
    setUnreadCount((prev) => Math.max(0, prev - 1));
    if (notificationId) {
      persistSeenId(notificationId);
      seenIdsRef.current.add(notificationId);
      setNotifications((prev) =>
        prev.map((n) =>
          n._id === notificationId ? { ...n, isRead: true } : n
        )
      );
    }
    api.post<ReadResponse>("/api/notifications/read", {}).catch(() => {});
  }, []);

  // Poll function to check for new notifications
  const pollNewNotifications = useCallback(async () => {
    if (!sinceRef.current || isPollingRef.current) return;
    if (typeof document !== "undefined" && document.hidden) return;

    isPollingRef.current = true;
    try {
      const res = await api.get<NotificationsResponse>(
        `/api/notifications/new?since=${encodeURIComponent(sinceRef.current)}`
      );

      if (res.success) {
        // Adjust sinceRef to serverTime - 2 seconds (overlap window)
        const serverTimestamp = new Date(res.serverTime).getTime();
        sinceRef.current = new Date(serverTimestamp - 2000).toISOString();

        setUnreadCount(res.unreadCount);

        const persistedSeen = getPersistedSeenIds();
        // Find truly new notifications not seen before so each toast shows only once
        const freshItems = (res.data || []).filter(
          (item) => !seenIdsRef.current.has(item._id) && !persistedSeen.has(item._id)
        );

        if (freshItems.length > 0) {
          // Record seen IDs
          freshItems.forEach((item) => {
            seenIdsRef.current.add(item._id);
            persistSeenId(item._id);
          });

          // Prepend to notifications list capped at 50
          setNotifications((prev) => {
            const existingIds = new Set(prev.map((n) => n._id));
            const uniqueFresh = freshItems.filter((n) => !existingIds.has(n._id));
            return [...uniqueFresh, ...prev].slice(0, 50);
          });

          // Add only fresh unseen notifications to toasts
          setToasts((prev) => [...prev, ...freshItems]);
        }
      }
    } catch {
      // Swallowed silently during polling
    } finally {
      isPollingRef.current = false;
    }
  }, []);

  // Initial fetch and 20s polling interval
  useEffect(() => {
    if (!enabled) {
      setLoading(false);
      return;
    }

    let isMounted = true;
    setLoading(true);
    setError(null);

    // Initial load: fetch existing notifications
    const fetchInitial = async () => {
      try {
        const res = await api.get<NotificationsResponse>(
          "/api/notifications?limit=20"
        );
        if (!isMounted) return;

        if (res.success) {
          const items = res.data || [];
          items.forEach((item) => {
            seenIdsRef.current.add(item._id);
            persistSeenId(item._id);
          });

          setNotifications(items);
          setUnreadCount(res.unreadCount);

          // Store initial serverTime in sinceRef (no toasts for initial load)
          sinceRef.current = res.serverTime;
        }
      } catch (err: any) {
        if (!isMounted) return;
        setError(err?.message || "Failed to load notifications");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchInitial();

    // 20-second polling interval
    const intervalId = setInterval(() => {
      pollNewNotifications();
    }, 20000);

    // Visibility change handler: poll immediately when coming back to visible
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        pollNewNotifications();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      isMounted = false;
      clearInterval(intervalId);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [enabled, pollNewNotifications]);

  // Mark notifications as read and decrease count
  const markAllRead = useCallback(async () => {
    setUnreadCount((prev) => Math.max(0, prev - 1));

    try {
      await api.post<ReadResponse>("/api/notifications/read", {});
    } catch (err) {
      console.error("[NotificationsContext:markAllRead] Failed:", err);
    }
  }, []);

  // Flips isRead locally on notifications
  const markLocalRead = useCallback(() => {
    setNotifications((prev) =>
      prev.map((n) => (n.isRead ? n : { ...n, isRead: true }))
    );
  }, []);

  return (
    <NotificationsContext.Provider
      value={{
        notifications,
        unreadCount,
        toasts,
        loading,
        error,
        markAllRead,
        markLocalRead,
        decreaseUnreadCount,
        dismissToast,
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
};

export const useNotifications = (): NotificationsContextValue => {
  const context = useContext(NotificationsContext);
  if (!context) {
    throw new Error(
      "useNotifications must be used within a NotificationsProvider"
    );
  }
  return context;
};
