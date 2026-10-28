import React, { useState, useEffect } from "react";
import { X, Heart, MessageCircle, ExternalLink, Loader2 } from "lucide-react";
import { apiFetch } from "../lib/api";
import type { Pin } from "../types/pin";
import type { Comment } from "../types/comment";
import { formatCount, timeAgo } from "../utils/formatCount";

interface PinDetailModalProps {
  pin: Pin | null;
  currentUserId?: string;
  onClose: () => void;
  onToggleLike: (pin: Pin) => void;
  onCommentCountChange: (count: number) => void;
}

const PinDetailModal: React.FC<PinDetailModalProps> = ({
  pin,
  currentUserId,
  onClose,
  onToggleLike,
  onCommentCountChange,
}) => {
  // Comments state
  const [comments, setComments] = useState<Comment[]>([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [commentsError, setCommentsError] = useState<string | null>(null);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [loadingMore, setLoadingMore] = useState(false);

  // Comment submission state
  const [commentText, setCommentText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Inline comment delete state
  const [deletingCommentId, setDeletingCommentId] = useState<string | null>(null);
  const [isDeletingComment, setIsDeletingComment] = useState(false);

  // Lock body scroll while modal is open
  useEffect(() => {
    if (!pin) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [pin]);

  // Close on Escape key
  useEffect(() => {
    if (!pin) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [pin, onClose]);

  // Fetch comments when pin opens
  useEffect(() => {
    if (!pin) return;
    let isCancelled = false;

    const fetchInitialComments = async () => {
      setLoadingComments(true);
      setCommentsError(null);
      try {
        const res = await apiFetch<{
          success: boolean;
          data: Comment[];
          nextCursor: string | null;
        }>(`/api/pins/${pin._id}/comments?limit=20`);

        if (!isCancelled) {
          setComments(res.data || []);
          setNextCursor(res.nextCursor);
        }
      } catch (err: any) {
        if (!isCancelled) {
          setCommentsError(err?.message || "Failed to load comments");
        }
      } finally {
        if (!isCancelled) {
          setLoadingComments(false);
        }
      }
    };

    fetchInitialComments();

    return () => {
      isCancelled = true;
    };
  }, [pin?._id]);

  if (!pin) return null;

  // Load more comments
  const handleLoadMore = async () => {
    if (!nextCursor || loadingMore) return;
    setLoadingMore(true);
    try {
      const res = await apiFetch<{
        success: boolean;
        data: Comment[];
        nextCursor: string | null;
      }>(`/api/pins/${pin._id}/comments?limit=20&cursor=${encodeURIComponent(nextCursor)}`);

      setComments((prev) => {
        const existingIds = new Set(prev.map((c) => c._id));
        const fresh = (res.data || []).filter((c) => !existingIds.has(c._id));
        return [...prev, ...fresh];
      });
      setNextCursor(res.nextCursor);
    } catch (err: any) {
      console.error("[PinDetailModal] Failed to load more comments:", err);
    } finally {
      setLoadingMore(false);
    }
  };

  // Add new comment
  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = commentText.trim();
    if (!trimmed || trimmed.length > 500 || isSubmitting) return;

    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const res = await apiFetch<{
        success: boolean;
        data: Comment;
        commentCount: number;
      }>(`/api/pins/${pin._id}/comments`, {
        method: "POST",
        body: JSON.stringify({ text: trimmed }),
      });

      // Prepend comment, clear form, update comment count
      setComments((prev) => [res.data, ...prev.filter((c) => c._id !== res.data._id)]);
      setCommentText("");
      onCommentCountChange(res.commentCount);
    } catch (err: any) {
      setSubmitError(err?.message || "Failed to post comment");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete a comment
  const handleDeleteComment = async (commentId: string) => {
    setIsDeletingComment(true);
    try {
      const res = await apiFetch<{
        success: boolean;
        id: string;
        commentCount: number;
      }>(`/api/comments/${commentId}`, {
        method: "DELETE",
      });

      setComments((prev) => prev.filter((c) => c._id !== commentId));
      setDeletingCommentId(null);
      onCommentCountChange(res.commentCount);
    } catch (err: any) {
      if (err?.status === 404 || err?.message?.includes("404")) {
        // A 404 counts as already deleted
        setComments((prev) => prev.filter((c) => c._id !== commentId));
        setDeletingCommentId(null);
        return;
      }
      console.error("[PinDetailModal] Failed to delete comment:", err);
    } finally {
      setIsDeletingComment(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={pin.title}
      className="fixed inset-0 z-50 flex items-center justify-center p-0 md:p-6 bg-black/75 backdrop-blur-sm overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className="relative w-full max-w-5xl bg-white rounded-none md:rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-screen md:max-h-[90vh] my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-4 right-4 z-20 p-2.5 bg-white/90 hover:bg-white text-gray-700 hover:text-black rounded-full shadow-md backdrop-blur-sm transition"
        >
          <X size={20} />
        </button>

        {/* Left Column: Full-bleed Media */}
        <div className="md:w-1/2 bg-black flex items-center justify-center overflow-hidden min-h-[300px] max-h-[45vh] md:max-h-full">
          <img
            src={pin.imageUrl}
            alt={pin.title}
            className="w-full h-full object-contain"
          />
        </div>

        {/* Right Column: Details & Comments */}
        <div className="md:w-1/2 p-6 md:p-8 flex flex-col justify-between overflow-y-auto bg-white min-h-[400px]">
          <div className="space-y-6">
            {/* Top Toolbar */}
            <div className="flex items-center justify-between pr-8">
              <a
                href={pin.imageUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-gray-600 hover:text-black hover:bg-gray-100 px-3.5 py-1.5 rounded-full border border-gray-200 transition font-medium"
              >
                <ExternalLink size={14} />
                <span>Open original</span>
              </a>

              {/* Action row: Like button and comment count */}
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  aria-label={pin.likedByMe ? "Unlike pin" : "Like pin"}
                  aria-pressed={Boolean(pin.likedByMe)}
                  onClick={() => onToggleLike(pin)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gray-200 hover:bg-red-50 text-gray-700 hover:text-red-600 transition active:scale-95"
                >
                  <Heart
                    className={`w-4 h-4 transition-colors ${
                      pin.likedByMe ? "fill-current text-red-500" : "text-gray-600"
                    }`}
                  />
                  <span className="text-xs font-semibold">{formatCount(pin.likeCount ?? 0)}</span>
                </button>

                <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 px-3 py-1.5 rounded-full bg-gray-50 border border-gray-100">
                  <MessageCircle className="w-4 h-4" />
                  <span>{formatCount(pin.commentCount ?? 0)}</span>
                </div>
              </div>
            </div>

            {/* Title & Description */}
            <div>
              <h1 className="text-2xl font-bold text-gray-900 leading-tight">
                {pin.title}
              </h1>
              {pin.description && (
                <p className="mt-2.5 text-gray-600 text-sm leading-relaxed whitespace-pre-line">
                  {pin.description}
                </p>
              )}
            </div>

            {/* Tags */}
            {pin.tags && pin.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {pin.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Comments Section */}
            <div className="border-t border-gray-100 pt-5 space-y-4">
              <h2 className="text-base font-bold text-gray-900 flex items-center justify-between">
                <span>Comments</span>
                <span className="text-xs font-normal text-gray-500">
                  {formatCount(pin.commentCount ?? 0)} total
                </span>
              </h2>

              {/* Comments list */}
              {loadingComments ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-[#e60023]" />
                </div>
              ) : commentsError ? (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 space-y-2">
                  <p>{commentsError}</p>
                  <button
                    type="button"
                    onClick={() => {
                      setLoadingComments(true);
                      setCommentsError(null);
                      apiFetch<{
                        success: boolean;
                        data: Comment[];
                        nextCursor: string | null;
                      }>(`/api/pins/${pin._id}/comments?limit=20`)
                        .then((res) => {
                          setComments(res.data || []);
                          setNextCursor(res.nextCursor);
                        })
                        .catch((err) => setCommentsError(err?.message || "Failed to load comments"))
                        .finally(() => setLoadingComments(false));
                    }}
                    className="font-semibold underline hover:text-red-800"
                  >
                    Retry
                  </button>
                </div>
              ) : comments.length === 0 ? (
                <div className="py-6 text-center text-gray-400 text-sm font-medium">
                  Be the first to comment
                </div>
              ) : (
                <div className="space-y-3.5 max-h-[220px] overflow-y-auto pr-1">
                  {comments.map((comment) => {
                    const isAuthor = Boolean(
                      currentUserId && comment.author === currentUserId
                    );
                    const isConfirmingDelete = deletingCommentId === comment._id;

                    return (
                      <div
                        key={comment._id}
                        className="flex items-start gap-2.5 text-xs group"
                      >
                        {/* Avatar / initial */}
                        {comment.authorAvatar ? (
                          <img
                            src={comment.authorAvatar}
                            alt={comment.authorName}
                            className="w-7 h-7 rounded-full object-cover flex-shrink-0"
                          />
                        ) : (
                          <div className="w-7 h-7 rounded-full bg-gray-200 flex-shrink-0 flex items-center justify-center font-bold text-gray-600 uppercase">
                            {comment.authorName?.[0] || "U"}
                          </div>
                        )}

                        {/* Comment Body */}
                        <div className="flex-1 bg-gray-50 rounded-2xl p-2.5">
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <span className="font-semibold text-gray-900">
                              {comment.authorName}
                            </span>
                            <span className="text-[10px] text-gray-400">
                              {timeAgo(comment.createdAt)}
                            </span>
                          </div>

                          {/* Plain text display: whitespace-pre-wrap break-words */}
                          <p className="text-gray-800 whitespace-pre-wrap break-words leading-relaxed text-xs">
                            {comment.text}
                          </p>

                          {/* Inline Two-step delete control for author */}
                          {isAuthor && (
                            <div className="mt-1.5 pt-1 border-t border-gray-100 flex items-center justify-end">
                              {isConfirmingDelete ? (
                                <div className="flex items-center gap-2 text-[11px]">
                                  <span className="text-red-600 font-medium">Delete?</span>
                                  <button
                                    type="button"
                                    disabled={isDeletingComment}
                                    onClick={() => handleDeleteComment(comment._id)}
                                    className="font-bold text-red-600 hover:underline disabled:opacity-50"
                                  >
                                    Yes
                                  </button>
                                  <button
                                    type="button"
                                    disabled={isDeletingComment}
                                    onClick={() => setDeletingCommentId(null)}
                                    className="text-gray-600 hover:underline disabled:opacity-50"
                                  >
                                    No
                                  </button>
                                </div>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => setDeletingCommentId(comment._id)}
                                  className="text-[11px] text-gray-400 hover:text-red-600 transition"
                                >
                                  Delete
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}

                  {/* Load more comments button */}
                  {nextCursor && (
                    <div className="pt-2 text-center">
                      <button
                        type="button"
                        disabled={loadingMore}
                        onClick={handleLoadMore}
                        className="text-xs font-semibold text-gray-600 hover:text-black hover:underline disabled:opacity-50 inline-flex items-center gap-1"
                      >
                        {loadingMore && <Loader2 size={12} className="animate-spin" />}
                        <span>Load more comments</span>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Comment Form */}
          <form onSubmit={handleAddComment} className="pt-4 border-t border-gray-100 mt-4 space-y-2">
            {submitError && (
              <p className="text-xs text-red-600 bg-red-50 p-2 rounded-lg font-medium">
                {submitError}
              </p>
            )}

            <div className="relative">
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Add a comment…"
                rows={2}
                maxLength={500}
                className="w-full text-xs p-3 pr-16 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-1 focus:ring-black resize-none"
              />
              <span className="absolute bottom-2.5 right-3 text-[10px] text-gray-400 pointer-events-none">
                {commentText.length}/500
              </span>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={!commentText.trim() || commentText.length > 500 || isSubmitting}
                className="px-4 py-1.5 bg-[#e60023] hover:bg-[#c9001e] text-white text-xs font-semibold rounded-full shadow-sm transition disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5"
              >
                {isSubmitting && <Loader2 size={12} className="animate-spin" />}
                <span>{isSubmitting ? "Posting…" : "Post"}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PinDetailModal;
