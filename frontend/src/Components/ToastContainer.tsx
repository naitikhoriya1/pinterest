import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import { useNotifications } from "../context/NotificationsContext";
import type { Notification } from "../types/notification";

interface ToastItemProps {
  toast: Notification;
  onDismiss: (id: string) => void;
  onToastClick: (toast: Notification) => void;
}

const ToastItem = ({ toast, onDismiss, onToastClick }: ToastItemProps) => {
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (isHovered) return;
    const timer = setTimeout(() => {
      onDismiss(toast._id);
    }, 6000);

    return () => clearTimeout(timer);
  }, [isHovered, onDismiss, toast._id]);

  const handleClick = () => {
    onToastClick(toast);
  };

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
      className="pointer-events-auto flex items-center justify-between w-full max-w-sm bg-white/95 backdrop-blur border border-gray-200/80 rounded-2xl p-3 shadow-xl hover:shadow-2xl transition-all duration-200 gap-3 cursor-pointer select-none"
    >
      <img
        src={toast.pinImageUrl}
        alt={toast.pinTitle}
        className="w-12 h-12 rounded-xl object-cover flex-shrink-0 bg-gray-100"
      />
      <div className="flex-1 min-w-0 pr-1">
        <p className="text-xs text-gray-800 leading-snug">
          <span className="font-semibold text-gray-900">{toast.actorName}</span>{" "}
          uploaded a new pin
        </p>
        <p className="text-xs text-gray-500 truncate mt-0.5 font-medium">
          "{toast.pinTitle}"
        </p>
      </div>
      <button
        type="button"
        aria-label="Dismiss toast"
        onClick={(e) => {
          e.stopPropagation();
          onDismiss(toast._id);
        }}
        className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition flex-shrink-0"
      >
        <X size={15} />
      </button>
    </div>
  );
};

const ToastContainer = () => {
  const navigate = useNavigate();
  const { toasts, dismissToast, decreaseUnreadCount } = useNotifications();

  // Max 3 visible; the rest stay queued
  const visibleToasts = toasts.slice(0, 3);

  if (visibleToasts.length === 0) return null;

  const handleToastClick = (toast: Notification) => {
    dismissToast(toast._id);
    decreaseUnreadCount(toast._id);
    navigate(`/dashboard?pinId=${toast.pin}`);
  };

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed top-5 right-5 z-50 flex flex-col gap-2.5 max-w-[calc(100vw-2.5rem)] sm:w-96 pointer-events-none"
    >
      {visibleToasts.map((toast) => (
        <ToastItem
          key={toast._id}
          toast={toast}
          onDismiss={dismissToast}
          onToastClick={handleToastClick}
        />
      ))}
    </div>
  );
};

export default ToastContainer;
