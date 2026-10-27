import { useEffect, useRef } from "react";
import { useFeed } from "../hooks/useFeed";
import MasonryGrid1 from "../Components/MasonryGrid1";

// ── Dashboard Page ────────────────────────────────────────────────────────────
// Renders the personalised pin feed (GET /api/pins/feed) inside DashboardLayout.
// Uses infinite scroll — loads next page when the sentinel div enters the viewport.

const Dashboard = () => {
  const { pins, loading, hasMore, error, loadMore, refresh } = useFeed();
  const sentinelRef = useRef<HTMLDivElement>(null);

  // Infinite scroll: trigger loadMore when sentinel comes into view
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          loadMore();
        }
      },
      { rootMargin: "300px" } // start loading 300px before the user hits the bottom
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, loading, loadMore]);

  // ── Initial loading state ──────────────────────────────────────────────────
  if (loading && pins.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#e60023]" />
        <p className="text-gray-500 text-sm font-medium">Loading your feed…</p>
      </div>
    );
  }

  // ── Error state ────────────────────────────────────────────────────────────
  if (error && pins.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center px-6">
        <span className="text-4xl">😕</span>
        <p className="text-gray-700 font-semibold text-lg">Couldn't load your feed</p>
        <p className="text-gray-400 text-sm">{error}</p>
        <button
          onClick={refresh}
          className="mt-2 px-6 py-2 bg-[#e60023] hover:bg-[#c9001e] text-white font-semibold rounded-full transition-colors"
        >
          Try again
        </button>
      </div>
    );
  }

  // ── Empty state (logged in but no pins match interests yet) ────────────────
  if (!loading && pins.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center px-6">
        <span className="text-5xl">🌱</span>
        <p className="text-gray-700 font-semibold text-xl">Your feed is empty right now</p>
        <p className="text-gray-400 text-sm max-w-sm">
          We're still finding pins that match your interests. Check back soon, or explore new topics.
        </p>
      </div>
    );
  }

  // ── Feed ───────────────────────────────────────────────────────────────────
  return (
    <div className="pb-10">
      {/* Masonry pin grid */}
      <MasonryGrid1 pins={pins} />

      {/* Infinite-scroll sentinel — when it enters view, loadMore fires */}
      <div ref={sentinelRef} className="h-1" />

      {/* Loading spinner for subsequent pages */}
      {loading && pins.length > 0 && (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#e60023]" />
        </div>
      )}

      {/* End-of-feed indicator */}
      {!hasMore && pins.length > 0 && (
        <p className="text-center text-gray-400 text-sm py-8">
          You've seen it all! •{" "}
          <button
            onClick={refresh}
            className="text-[#e60023] font-semibold hover:underline"
          >
            Refresh
          </button>
        </p>
      )}
    </div>
  );
};

export default Dashboard;
