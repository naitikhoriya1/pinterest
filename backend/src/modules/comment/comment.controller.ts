import { Response } from "express";
import { Types } from "mongoose";
import { AuthRequest } from "../../middleware/auth.middleware";
import Comment from "./comment.model";
import Pin from "../pin/pin.model";
import User from "../auth/auth.model";
import { parseCursor } from "../../utils/cursor";

/**
 * GET /api/pins/:id/comments?limit=20&cursor=
 * Lists comments on a pin in newest-first cursor order.
 */
export const listComments = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    if (!id || !Types.ObjectId.isValid(id) || !/^[0-9a-fA-F]{24}$/.test(id)) {
      res.status(400).json({ success: false, message: "Invalid pin id" });
      return;
    }

    const rawLimit = parseInt(req.query.limit as string, 10);
    const limit = !isNaN(rawLimit) && rawLimit > 0 ? Math.min(rawLimit, 50) : 20;
    const cursor = req.query.cursor as string | undefined;

    const filter: Record<string, unknown> = { pin: new Types.ObjectId(id) };

    if (cursor) {
      const parsed = parseCursor(cursor);
      if (!parsed) {
        res.status(400).json({ success: false, message: "Invalid cursor" });
        return;
      }

      filter.$or = [
        { createdAt: { $lt: parsed.date } },
        { createdAt: parsed.date, _id: { $lt: parsed.objectId } },
      ];
    }

    const comments = await Comment.find(filter)
      .sort({ createdAt: -1, _id: -1 })
      .limit(limit + 1)
      .lean();

    const hasMore = comments.length > limit;
    const data = hasMore ? comments.slice(0, limit) : comments;

    const nextCursor =
      hasMore && data.length > 0
        ? `${new Date(data[data.length - 1].createdAt).toISOString()}_${data[data.length - 1]._id.toString()}`
        : null;

    res.json({ success: true, data, nextCursor });
  } catch (err: any) {
    console.error("[comment.controller:listComments] ❌ Error:", err?.message || err);
    res.status(500).json({ success: false, message: err?.message || "Failed to list comments" });
  }
};

/**
 * POST /api/pins/:id/comments
 * Adds a new comment to a pin.
 * Denormalizes author identity from the database.
 */
export const addComment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const me = req.userId;

    if (!id || !Types.ObjectId.isValid(id) || !/^[0-9a-fA-F]{24}$/.test(id)) {
      res.status(400).json({ success: false, message: "Invalid pin id" });
      return;
    }

    const pin = await Pin.findById(id).select("_id").lean();
    if (!pin) {
      res.status(404).json({ success: false, message: "Pin not found" });
      return;
    }

    const { text } = req.body;
    if (typeof text !== "string") {
      res.status(400).json({ success: false, message: "Comment text must be a string" });
      return;
    }

    const trimmed = text.trim();
    if (!trimmed) {
      res.status(400).json({ success: false, message: "Comment cannot be empty" });
      return;
    }

    if (trimmed.length > 500) {
      res.status(400).json({ success: false, message: "Comment cannot exceed 500 characters" });
      return;
    }

    // Set author, authorName, authorAvatar strictly from the authenticated user
    const user = await User.findById(me).select("username avatarUrl email").lean();
    const authorName = user?.username || user?.email?.split("@")[0] || "Someone";
    const authorAvatar = user?.avatarUrl || "";

    const comment = await Comment.create({
      pin: new Types.ObjectId(id),
      author: new Types.ObjectId(me),
      authorName,
      authorAvatar,
      text: trimmed,
    });

    await Pin.updateOne({ _id: id }, { $inc: { commentCount: 1 } });

    const fresh = await Pin.findById(id).select("commentCount").lean();
    const commentCount = fresh?.commentCount ?? 0;

    res.status(201).json({
      success: true,
      data: comment,
      commentCount,
    });
  } catch (err: any) {
    console.error("[comment.controller:addComment] ❌ Error:", err?.message || err);
    res.status(500).json({ success: false, message: err?.message || "Failed to add comment" });
  }
};

/**
 * DELETE /api/comments/:commentId
 * Only the author can delete their own comment.
 */
export const deleteComment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { commentId } = req.params;
    const me = req.userId;

    if (!commentId || !Types.ObjectId.isValid(commentId) || !/^[0-9a-fA-F]{24}$/.test(commentId)) {
      res.status(400).json({ success: false, message: "Invalid comment id" });
      return;
    }

    const comment = await Comment.findById(commentId);
    if (!comment) {
      res.status(404).json({ success: false, message: "Comment not found" });
      return;
    }

    if (comment.author.toString() !== me?.toString()) {
      res.status(403).json({ success: false, message: "You can only delete your own comments" });
      return;
    }

    const deleteResult = await Comment.deleteOne({
      _id: new Types.ObjectId(commentId),
      author: new Types.ObjectId(me),
    });

    if (deleteResult.deletedCount === 1) {
      await Pin.updateOne({ _id: comment.pin, commentCount: { $gt: 0 } }, { $inc: { commentCount: -1 } });
    }

    const fresh = await Pin.findById(comment.pin).select("commentCount").lean();
    const commentCount = fresh?.commentCount ?? 0;

    res.status(200).json({
      success: true,
      id: commentId,
      commentCount,
    });
  } catch (err: any) {
    console.error("[comment.controller:deleteComment] ❌ Error:", err?.message || err);
    res.status(500).json({ success: false, message: err?.message || "Failed to delete comment" });
  }
};
