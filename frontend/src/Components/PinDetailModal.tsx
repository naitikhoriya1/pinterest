import React, { useState } from "react";
import { X, Heart, Edit3, Trash2, ExternalLink, Loader2, User } from "lucide-react";
import { api } from "../lib/api";
import type { Pin, PinOwner } from "../types/pin";

interface PinDetailModalProps {
  pin: Pin | null;
  currentUserId?: string;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (pin: Pin) => void;
  onDelete: (pinId: string) => void;
}

const PinDetailModal: React.FC<PinDetailModalProps> = ({
  pin,
  currentUserId,
  isOpen,
  onClose,
  onEdit,
  onDelete,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !pin) return null;

  // Check ownership
  const ownerId =
    typeof pin.owner === "string"
      ? pin.owner
      : (pin.owner as PinOwner)?._id;

  const isOwner = Boolean(currentUserId && ownerId && currentUserId === ownerId);

  const ownerObj = typeof pin.owner === "object" ? (pin.owner as PinOwner) : null;
  const ownerName = ownerObj?.username || ownerObj?.email?.split("@")[0] || "Pinterest User";
  const ownerAvatar = ownerObj?.avatarUrl;

  const handleDelete = async () => {
    setIsDeleting(true);
    setError(null);
    try {
      await api.delete(`/api/pins/${pin._id}`);
      onDelete(pin._id);
      onClose();
    } catch (err: any) {
      setError(err?.message || "Failed to delete pin");
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden my-6 border border-gray-100 flex flex-col md:flex-row max-h-[90vh]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2.5 bg-white/80 hover:bg-white text-gray-700 hover:text-black rounded-full shadow-md backdrop-blur-sm transition"
          aria-label="Close modal"
        >
          <X size={20} />
        </button>

        {/* Left Column: Full-bleed Image */}
        <div className="md:w-1/2 bg-black flex items-center justify-center overflow-hidden min-h-[300px]">
          <img
            src={pin.imageUrl}
            alt={pin.title}
            className="w-full h-full object-contain max-h-[85vh]"
          />
        </div>

        {/* Right Column: Details & Actions */}
        <div className="md:w-1/2 p-8 flex flex-col justify-between overflow-y-auto bg-white">
          <div className="space-y-6">
            {/* Top Toolbar */}
            <div className="flex items-center justify-between">
              <a
                href={pin.imageUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-black hover:bg-gray-100 px-3 py-1.5 rounded-full border border-gray-200 transition"
              >
                <ExternalLink size={14} />
                <span>Open original</span>
              </a>

              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-50 text-red-600 rounded-full font-semibold text-xs">
                  <Heart size={14} className="fill-red-500" />
                  <span>{pin.saveCount}</span>
                </span>

                {isOwner && (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onEdit(pin)}
                      title="Edit pin"
                      className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition"
                    >
                      <Edit3 size={18} />
                    </button>
                    <button
                      onClick={() => setShowConfirmDelete(true)}
                      title="Delete pin"
                      className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm">
                {error}
              </div>
            )}

            {/* Delete confirmation banner */}
            {showConfirmDelete && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-2xl space-y-3">
                <p className="text-sm font-semibold text-red-900">
                  Are you sure you want to delete this pin?
                </p>
                <p className="text-xs text-red-700">
                  This will permanently delete the pin and remove its image from Cloudinary.
                </p>
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setShowConfirmDelete(false)}
                    disabled={isDeleting}
                    className="px-3 py-1.5 text-xs font-semibold text-gray-700 bg-white border border-gray-200 rounded-full hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-white bg-red-600 rounded-full hover:bg-red-700 shadow"
                  >
                    {isDeleting ? (
                      <>
                        <Loader2 size={12} className="animate-spin" />
                        <span>Deleting…</span>
                      </>
                    ) : (
                      <span>Yes, delete</span>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Title & Description */}
            <div>
              <h1 className="text-2xl font-bold text-gray-900 leading-tight">
                {pin.title}
              </h1>
              {pin.description && (
                <p className="mt-3 text-gray-600 text-sm leading-relaxed whitespace-pre-line">
                  {pin.description}
                </p>
              )}
            </div>

            {/* Tags */}
            {pin.tags && pin.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {pin.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full text-xs font-semibold cursor-default transition"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Creator / Owner info */}
            <div className="flex items-center gap-3 pt-6 border-t border-gray-100">
              {ownerAvatar ? (
                <img
                  src={ownerAvatar}
                  alt={ownerName}
                  className="w-10 h-10 rounded-full object-cover border"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600">
                  <User size={20} />
                </div>
              )}
              <div>
                <p className="text-sm font-semibold text-gray-900 leading-none">
                  {ownerName}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Added on {new Date(pin.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PinDetailModal;
