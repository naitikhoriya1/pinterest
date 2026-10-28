import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaBell } from "react-icons/fa";
import { useNotifications } from "../context/NotificationsContext";
import type { Notification } from "../types/notification";

function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "just now";
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays}d ago`;
  return date.toLocaleDateString();
}

const NotificationBell = () => {
  const navigate = useNavigate();
  const {
    notifications,
    unreadCount,
    loading,
    markAllRead,
    markLocalRead,
    decreaseUnreadCount,
  } = useNotifications();

  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIds, setHighlightedIds] = useState<Set<string>>(new Set());
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleClose = () => {
    setIsOpen(false);
    markLocalRead();
    setHighlightedIds(new Set());
  };

  const handleToggle = () => {
    if (!isOpen) {
      const unread = new Set(
        notifications.filter((n) => !n.isRead).map((n) => n._id)
      );
      setHighlightedIds(unread);
      // Clicking the bell to see notifications decreases the count
      markAllRead();
      setIsOpen(true);
    } else {
      handleClose();
    }
  };

  // Close dropdown on outside click or Escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClose();
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        handleClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleItemClick = (n: Notification) => {
    handleClose();
    // Decrease unread count by 1 and mark as read
    decreaseUnreadCount(n._id);
    // Open the pin in view pin modal
    navigate(`/dashboard?pinId=${n.pin}`);
  };

  return (
    <div className="relative" ref={dropdownRef} title="Notifications">
      {/* Bell Button styled for Sidebar */}
      <button
        type="button"
        onClick={handleToggle}
        aria-label="Notifications"
        aria-expanded={isOpen}
        className="relative w-12 h-12 cursor-pointer p-3 rounded-full hover:bg-gray-100 transition flex items-center justify-center focus:outline-none"
      >
        <FaBell className="w-full h-full text-gray-700 hover:text-black transition" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 min-w-[18px] h-[18px] px-1 bg-red-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center pointer-events-none ring-2 ring-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Menu - opens to the right of the sidebar */}
      {isOpen && (
        <div className="absolute left-full ml-3 top-0 w-80 sm:w-96 max-h-[460px] bg-white rounded-2xl shadow-2xl border border-gray-200/80 z-50 flex flex-col overflow-hidden animate-in fade-in duration-150">
          <div className="px-5 py-3.5 border-b border-gray-100 flex items-center justify-between bg-white">
            <h3 className="font-semibold text-gray-900 text-base">Notifications</h3>
          </div>

          <div className="overflow-y-auto flex-1 divide-y divide-gray-100">
            {loading ? (
              <div className="p-8 text-center text-sm text-gray-500 font-medium">
                Loading notifications...
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-8 text-center text-sm text-gray-500 font-medium">
                No notifications yet
              </div>
            ) : (
              notifications.map((n) => {
                const isHighlighted = highlightedIds.has(n._id);
                return (
                  <div
                    key={n._id}
                    onClick={() => handleItemClick(n)}
                    className={`px-4 py-3 flex items-start gap-3.5 transition cursor-pointer select-none ${
                      isHighlighted
                        ? "bg-red-50/70 hover:bg-red-50"
                        : "bg-white hover:bg-gray-50"
                    }`}
                  >
                    <img
                      src={n.pinImageUrl}
                      alt={n.pinTitle}
                      className="w-11 h-11 rounded-xl object-cover flex-shrink-0 bg-gray-100 mt-0.5"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-900 leading-snug">
                        <span className="font-semibold">{n.actorName}</span>{" "}
                        uploaded a new pin:{" "}
                        <span className="text-gray-700 font-medium">
                          "{n.pinTitle}"
                        </span>
                      </p>
                      <span className="text-[11px] text-gray-400 mt-1 block">
                        {formatRelativeTime(n.createdAt)}
                      </span>
                    </div>
                    {isHighlighted && (
                      <span className="w-2 h-2 rounded-full bg-red-600 mt-2 flex-shrink-0" />
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
