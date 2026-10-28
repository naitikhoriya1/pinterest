import React, { useEffect, useState } from "react";
import Masonry from "react-masonry-css";
import { Trash2 } from "lucide-react";
import type { Pin } from "../types/pin";

const breakpointColumnsObj = {
  default: 5,
  1280: 4,
  1024: 3,
  640: 2,
};

interface MasonryGrid1Props {
  pins: Pin[];
  onPinClick?: (pin: Pin) => void;
  currentUserId?: string;
  onDelete?: (pinId: string) => Promise<void>;
}

const MasonryGrid1: React.FC<MasonryGrid1Props> = ({
  pins,
  onPinClick,
  currentUserId,
  onDelete,
}) => {
  const [failedPinIds, setFailedPinIds] = useState<Set<string>>(new Set());
  const [deleteTargetPinId, setDeleteTargetPinId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  useEffect(() => {
    console.log(`[MasonryGrid1] Rendering grid with ${pins.length} pins.`);
  }, [pins.length]);

  // Close confirm dialog on Escape
  useEffect(() => {
    if (!deleteTargetPinId) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isDeleting) {
        setDeleteTargetPinId(null);
        setDeleteError(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [deleteTargetPinId, isDeleting]);

  const targetPin = deleteTargetPinId
    ? pins.find((p) => p._id === deleteTargetPinId)
    : null;
  const isOwnerOfTarget = Boolean(
    targetPin && currentUserId && targetPin.owner === currentUserId
  );

  return (
    <>
      <Masonry
        breakpointCols={breakpointColumnsObj}
        className="flex gap-4"
        columnClassName="flex flex-col gap-4"
      >
        {pins.map((pin) => {
          const isOwner = Boolean(
            currentUserId && pin.owner && pin.owner === currentUserId
          );

          return (
            <div
              key={pin._id}
              onClick={() => {
                console.log("[MasonryGrid1] Pin clicked:", {
                  id: pin._id,
                  title: pin.title,
                  imageUrl: pin.imageUrl,
                  tags: pin.tags,
                });
                onPinClick?.(pin);
              }}
              className="group relative rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer bg-gray-100"
            >
              {/* Trash button: only for owner, hover on desktop, always visible on touch */}
              {isOwner && (
                <button
                  type="button"
                  aria-label="Delete pin"
                  onClick={(e) => {
                    e.stopPropagation();
                    setDeleteError(null);
                    setDeleteTargetPinId(pin._id);
                  }}
                  className="absolute top-3 right-3 z-10 p-2 bg-white/90 hover:bg-white text-gray-700 hover:text-red-600 rounded-full shadow-md backdrop-blur-sm transition-all duration-200 opacity-0 group-hover:opacity-100 [@media(hover:none)]:opacity-100"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}

              {/* Neutral gray placeholder if image fails, or image with referrerPolicy="no-referrer" */}
              {failedPinIds.has(pin._id) ? (
                <div
                  style={{
                    aspectRatio:
                      pin.width && pin.height ? `${pin.width} / ${pin.height}` : "2/3",
                  }}
                  className="w-full bg-gray-200 rounded-2xl flex flex-col items-center justify-center p-4 text-center text-gray-500"
                >
                  <span className="text-xs font-semibold text-gray-600 line-clamp-3">
                    {pin.title}
                  </span>
                  <span className="text-[10px] text-gray-400 mt-1">Image unavailable</span>
                </div>
              ) : (
                <img
                  src={pin.imageUrl}
                  alt={pin.title}
                  width={pin.width}
                  height={pin.height}
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  onError={() => {
                    console.error("[MasonryGrid1] ❌ Pin image failed to load:", {
                      pinId: pin._id,
                      title: pin.title,
                      failedUrl: pin.imageUrl,
                    });
                    setFailedPinIds((prev) => {
                      const next = new Set(prev);
                      next.add(pin._id);
                      return next;
                    });
                  }}
                  className="w-full h-auto object-cover rounded-2xl block"
                />
              )}

              {/* Hover overlay showing title and save count */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-2xl flex flex-col justify-between p-3 pointer-events-none">
                {/* Save count badge (positioned top-left so trash button is clear on top-right) */}
                <div className="flex justify-start">
                  <span className="bg-white/20 backdrop-blur-sm text-white text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1">
                    ♥ {pin.saveCount}
                  </span>
                </div>

                {/* Title at bottom */}
                <p className="text-white font-semibold text-sm leading-snug line-clamp-2 drop-shadow-md">
                  {pin.title}
                </p>
              </div>
            </div>
          );
        })}
      </Masonry>

      {/* Confirm Delete Dialog (Only rendered for target owner) */}
      {deleteTargetPinId && isOwnerOfTarget && (
        <div
          role="presentation"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget && !isDeleting) {
              setDeleteTargetPinId(null);
              setDeleteError(null);
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-dialog-title"
            className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h3
              id="delete-dialog-title"
              className="text-lg font-bold text-gray-900"
            >
              Delete this pin?
            </h3>
            <p className="text-sm text-gray-600">This can't be undone.</p>

            {deleteError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 font-medium">
                {deleteError}
              </div>
            )}

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => {
                  setDeleteTargetPinId(null);
                  setDeleteError(null);
                }}
                className="px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={async () => {
                  if (!onDelete || isDeleting || !deleteTargetPinId) return;
                  setIsDeleting(true);
                  setDeleteError(null);
                  try {
                    await onDelete(deleteTargetPinId);
                    setDeleteTargetPinId(null);
                  } catch (err: any) {
                    setDeleteError(err?.message || "Failed to delete pin");
                  } finally {
                    setIsDeleting(false);
                  }
                }}
                className="px-4 py-2 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-full transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MasonryGrid1;
