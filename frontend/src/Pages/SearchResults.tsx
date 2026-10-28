import { useEffect, useRef, useState } from "react";
import { useSearchParams, Navigate, Link } from "react-router-dom";
import { ArrowLeft, Search } from "lucide-react";
import { useClerkSync } from "../hooks/useClerkSync";
import { useSearch } from "../hooks/useSearch";
import { useLikeToggle } from "../hooks/useLikeToggle";
import { apiFetch } from "../lib/api";
import MasonryGrid1 from "../Components/MasonryGrid1";
import PinDetailModal from "../Components/PinDetailModal";
import EditPinModal from "../Components/EditPinModal";
import type { Pin } from "../types/pin";

// ── Search Results Page ───────────────────────────────────────────────────────
// Renders pins matching the `q` search query inside DashboardLayout.
// Uses cursor-based infinite scroll with MasonryGrid1.

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const rawQ = searchParams.get("q") ?? "";
  const q = rawQ.trim();

  // If query is missing or empty, redirect to /dashboard
  if (!q) {
    return <Navigate to="/dashboard" replace />;
  }

  const { isSynced, apiUser, currentUserId } = useClerkSync();
  const { pins, loading, error, hasMore, loadMore, retry, removePin, updatePin } = useSearch(q, isSynced, currentUserId);
  const { toggleLike } = useLikeToggle(updatePin);
  const sentinelRef = useRef<HTMLDivElement>(null);

  // Modal states for pin viewing / editing
  const [selectedPinId, setSelectedPinId] = useState<string | null>(null);
  const [editingPin, setEditingPin] = useState<Pin | null>(null);

  // Derive selected pin from hook's pins list so counts stay synchronized and modal auto-closes if deleted
  const selectedPin = pins.find((p) => p._id === selectedPinId) || null;

  // Infinite scroll: trigger loadMore when sentinel enters viewport
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading && !error) {
          console.log("[SearchResults] Sentinel intersected. Loading more results for:", q);
          loadMore();
        }
      },
      { rootMargin: "400px" } // trigger 400px before user reaches bottom
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, loading, error, loadMore, q]);

  // Handle edit / delete in search results
  const handlePinUpdated = (updatedPin: Pin) => {
    updatePin(updatedPin._id, updatedPin);
  };

  const handlePinDeleted = (deletedPinId: string) => {
    removePin(deletedPinId);
    if (selectedPinId === deletedPinId) {
      setSelectedPinId(null);
    }
  };

  const handleDeletePin = async (pinId: string) => {
    try {
      console.log("[SearchResults] Deleting pin:", pinId);
      await apiFetch(`/api/pins/${pinId}`, { method: "DELETE" });
      removePin(pinId);
      if (selectedPinId === pinId) {
        setSelectedPinId(null);
      }
    } catch (err: any) {
      if (err?.status === 404 || err?.message?.includes("404") || err?.message === "Pin not found") {
        console.warn("[SearchResults] Pin was already deleted (404), removing locally:", pinId);
        removePin(pinId);
        if (selectedPinId === pinId) {
          setSelectedPinId(null);
        }
        return;
      }
      console.error("[SearchResults] Failed to delete pin:", err);
      throw err;
    }
  };

  // ── Initial loading state ──────────────────────────────────────────────────
  if (loading && pins.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#e60023]" />
        <p className="text-gray-500 text-sm font-medium">Searching for "{q}"…</p>
      </div>
    );
  }

  // ── Error state (when no pins loaded yet) ──────────────────────────────────
  if (error && pins.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center px-6">
        <span className="text-4xl">😕</span>
        <p className="text-gray-700 font-semibold text-lg">Couldn't load search results</p>
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

  // ── Empty state (no pins matched search query) ────────────────────────────
  if (!loading && pins.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center px-6">
        <div className="p-4 bg-gray-100 rounded-full text-gray-400 mb-2">
          <Search size={36} />
        </div>
        <p className="text-gray-900 font-bold text-2xl">No pins found for "{q}"</p>
        <p className="text-gray-500 text-sm max-w-md">
          Try searching for different keywords or browse the full feed for inspiration.
        </p>
        <Link
          to="/dashboard"
          className="mt-4 inline-flex items-center gap-2 px-6 py-2.5 bg-[#e60023] hover:bg-[#c9001e] text-white font-semibold rounded-full shadow-sm transition"
        >
          <ArrowLeft size={16} />
          <span>Back to feed</span>
        </Link>
      </div>
    );
  }

  // ── Results feed ──────────────────────────────────────────────────────────
  return (
    <div className="pb-10 relative">
      {/* Header bar */}
      <div className="flex items-center justify-between mb-6 px-1">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-black transition"
            >
              <ArrowLeft size={14} />
              <span>All Pins</span>
            </Link>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Results for "{q}"
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Showing matching pins by title
          </p>
        </div>
      </div>

      {/* Masonry grid */}
      <MasonryGrid1
        pins={pins}
        onPinClick={(pin) => setSelectedPinId(pin._id)}
        onOpenPin={(id) => setSelectedPinId(id)}
        onToggleLike={toggleLike}
        currentUserId={currentUserId ?? apiUser?._id}
        onDelete={handleDeletePin}
      />

      {/* Sentinel for infinite scroll */}
      <div ref={sentinelRef} className="h-1" />

      {/* Loading more state */}
      {loading && pins.length > 0 && (
        <div className="flex flex-col items-center justify-center py-8 gap-2">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#e60023]" />
          <p className="text-gray-500 text-sm font-medium">Loading more results...</p>
        </div>
      )}

      {/* Inline retry on load-more error */}
      {error && pins.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 py-6 text-center">
          <p className="text-sm text-red-600">Failed to load more results: {error}</p>
          <button
            onClick={retry}
            className="px-4 py-1.5 bg-[#e60023] hover:bg-[#c9001e] text-white text-sm font-semibold rounded-full transition-colors"
          >
            Retry
          </button>
        </div>
      )}

      {/* End of results indicator */}
      {!hasMore && pins.length > 0 && (
        <p className="text-center text-gray-500 text-sm py-8 font-medium">
          No more results
        </p>
      )}

      {/* Pin Detail Modal */}
      <PinDetailModal
        pin={selectedPin}
        currentUserId={currentUserId ?? apiUser?._id}
        onClose={() => setSelectedPinId(null)}
        onToggleLike={toggleLike}
        onCommentCountChange={(count) => {
          if (selectedPinId) {
            updatePin(selectedPinId, { commentCount: count });
          }
        }}
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

export default SearchResults;
