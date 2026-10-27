import { useEffect, useRef, useState } from "react";
import { Plus } from "lucide-react";
import { useClerkSync } from "../hooks/useClerkSync";
import { useFeed } from "../hooks/useFeed";
import MasonryGrid1 from "../Components/MasonryGrid1";
import CreatePinModal from "../Components/CreatePinModal";
import PinDetailModal from "../Components/PinDetailModal";
import EditPinModal from "../Components/EditPinModal";
import type { Pin } from "../types/pin";

// ── Dashboard Page ────────────────────────────────────────────────────────────
// Renders the global reverse-chronological pin feed (GET /api/pins/feed) inside DashboardLayout.
// Provides full CRUD operations with Cloudinary image upload and infinite scroll.

const Dashboard = () => {
  const { isSynced, apiUser } = useClerkSync();
  const { pins, setPins, loading, error, hasMore, loadMore, retry } = useFeed(isSynced);
  const sentinelRef = useRef<HTMLDivElement>(null);

  // Modal states
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedPin, setSelectedPin] = useState<Pin | null>(null);
  const [editingPin, setEditingPin] = useState<Pin | null>(null);

  // Infinite scroll: trigger loadMore when sentinel enters viewport
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading && !error) {
          loadMore();
        }
      },
      { rootMargin: "400px" } // trigger 400px before user hits bottom
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, loading, error, loadMore]);

  // Listen for open-create-pin-modal event from sidebar or header
  useEffect(() => {
    const handler = () => setIsCreateOpen(true);
    window.addEventListener("open-create-pin-modal", handler);
    return () => window.removeEventListener("open-create-pin-modal", handler);
  }, []);

  // CRUD Handlers
  const handlePinCreated = (newPin: Pin) => {
    // Optimistically prepend newly created pin to top of feed
    setPins((prev) => [newPin, ...prev.filter((p) => p._id !== newPin._id)]);
  };

  const handlePinUpdated = (updatedPin: Pin) => {
    setPins((prev) =>
      prev.map((p) => (p._id === updatedPin._id ? updatedPin : p))
    );
    if (selectedPin?._id === updatedPin._id) {
      setSelectedPin(updatedPin);
    }
  };

  const handlePinDeleted = (deletedPinId: string) => {
    setPins((prev) => prev.filter((p) => p._id !== deletedPinId));
    if (selectedPin?._id === deletedPinId) {
      setSelectedPin(null);
    }
  };

  // ── Initial loading state ──────────────────────────────────────────────────
  if (loading && pins.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#e60023]" />
        <p className="text-gray-500 text-sm font-medium">Loading your feed…</p>
      </div>
    );
  }

  // ── Error state (when no pins loaded yet) ──────────────────────────────────
  if (error && pins.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center px-6">
        <span className="text-4xl">😕</span>
        <p className="text-gray-700 font-semibold text-lg">Couldn't load your feed</p>
        <p className="text-gray-400 text-sm">{error}</p>
        <button
          onClick={retry}
          className="mt-2 px-6 py-2 bg-[#e60023] hover:bg-[#c9001e] text-white font-semibold rounded-full transition-colors"
        >
          Try again
        </button>
      </div>
    );
  }

  // ── Empty state (feed has no pins in database) ────────────────────────────
  if (!loading && pins.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center px-6">
        <span className="text-5xl">🌱</span>
        <p className="text-gray-700 font-semibold text-xl">No pins yet</p>
        <p className="text-gray-400 text-sm max-w-sm">
          Be the first to upload an image from your device and share it on Pinterest!
        </p>
        <button
          onClick={() => setIsCreateOpen(true)}
          className="mt-4 inline-flex items-center gap-2 px-6 py-3 bg-[#e60023] hover:bg-[#c9001e] text-white font-semibold rounded-full shadow-md transition"
        >
          <Plus size={18} />
          <span>Create Pin</span>
        </button>

        <CreatePinModal
          isOpen={isCreateOpen}
          onClose={() => setIsCreateOpen(false)}
          onPinCreated={handlePinCreated}
        />
      </div>
    );
  }

  // ── Feed with infinite scroll & CRUD Modals ────────────────────────────────
  return (
    <div className="pb-10 relative">
      {/* Top Action Bar */}
      <div className="flex items-center justify-between mb-6 px-1">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Explore Feed</h1>
          <p className="text-xs text-gray-500 mt-0.5">Discover the newest visual ideas</p>
        </div>
        <button
          onClick={() => setIsCreateOpen(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#e60023] hover:bg-[#c9001e] text-white font-semibold text-sm rounded-full shadow-sm hover:shadow transition"
        >
          <Plus size={18} />
          <span>Create Pin</span>
        </button>
      </div>

      {/* Masonry pin grid */}
      <MasonryGrid1 pins={pins} onPinClick={(pin) => setSelectedPin(pin)} />

      {/* Infinite-scroll sentinel — when it enters view, loadMore fires */}
      <div ref={sentinelRef} className="h-1" />

      {/* Loading more state for subsequent pages */}
      {loading && pins.length > 0 && (
        <div className="flex flex-col items-center justify-center py-8 gap-2">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#e60023]" />
          <p className="text-gray-500 text-sm font-medium">Loading more...</p>
        </div>
      )}

      {/* Inline retry on load-more error */}
      {error && pins.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 py-6 text-center">
          <p className="text-sm text-red-600">Failed to load more pins: {error}</p>
          <button
            onClick={retry}
            className="px-4 py-1.5 bg-[#e60023] hover:bg-[#c9001e] text-white text-sm font-semibold rounded-full transition-colors"
          >
            Retry
          </button>
        </div>
      )}

      {/* End of feed indicator */}
      {!hasMore && pins.length > 0 && (
        <p className="text-center text-gray-500 text-sm py-8 font-medium">
          You've reached the end
        </p>
      )}

      {/* Create Pin Modal */}
      <CreatePinModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onPinCreated={handlePinCreated}
      />

      {/* Pin Detail Modal */}
      <PinDetailModal
        pin={selectedPin}
        currentUserId={apiUser?._id}
        isOpen={Boolean(selectedPin)}
        onClose={() => setSelectedPin(null)}
        onEdit={(pin) => {
          setEditingPin(pin);
        }}
        onDelete={handlePinDeleted}
      />

      {/* Edit Pin Modal */}
      <EditPinModal
        pin={editingPin}
        isOpen={Boolean(editingPin)}
        onClose={() => setEditingPin(null)}
        onPinUpdated={handlePinUpdated}
      />
    </div>
  );
};

export default Dashboard;
