import { Response } from "express";
import { Types } from "mongoose";
import { AuthRequest } from "../../middleware/auth.middleware";
import Like from "./like.model";
import Pin from "../pin/pin.model";

/**
 * PUT /api/pins/:id/like
 * Idempotently likes a pin for the authenticated user.
 * Increments Pin.likeCount only if newly inserted.
 */
export const likePin = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const me = req.userId;

    if (!me || !Types.ObjectId.isValid(me)) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }

    if (!id || !Types.ObjectId.isValid(id) || !/^[0-9a-fA-F]{24}$/.test(id)) {
      res.status(400).json({ success: false, message: "Invalid pin id" });
      return;
    }

    const pin = await Pin.findById(id).select("_id likeCount").lean();
    if (!pin) {
      res.status(404).json({ success: false, message: "Pin not found" });
      return;
    }

    let upserted = false;
    try {
      const updateResult = await Like.updateOne(
        { user: new Types.ObjectId(me), pin: new Types.ObjectId(id) },
        { $setOnInsert: { user: new Types.ObjectId(me), pin: new Types.ObjectId(id) } },
        { upsert: true }
      );
      upserted = updateResult.upsertedCount === 1;
    } catch (upsertErr: any) {
      // Duplicate key (code 11000) from concurrent requests: treat as already liked
      if (upsertErr.code === 11000) {
        upserted = false;
      } else {
        throw upsertErr;
      }
    }

    if (upserted) {
      await Pin.updateOne({ _id: id }, { $inc: { likeCount: 1 } });
    }

    const fresh = await Pin.findById(id).select("likeCount").lean();
    const likeCount = fresh?.likeCount ?? 0;

    console.log(
      `[like.controller:likePin] User ${me} liked pin ${id}: newlyUpserted=${upserted}, freshLikeCount=${likeCount}`
    );

    res.status(200).json({
      success: true,
      liked: true,
      likeCount,
    });
  } catch (err: any) {
    console.error("[like.controller:likePin] ❌ Error:", err?.message || err);
    res.status(500).json({ success: false, message: err?.message || "Failed to like pin" });
  }
};

/**
 * DELETE /api/pins/:id/like
 * Idempotently unlikes a pin for the authenticated user.
 * Decrements Pin.likeCount only if deleted and count > 0.
 */
export const unlikePin = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const me = req.userId;

    if (!me || !Types.ObjectId.isValid(me)) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }

    if (!id || !Types.ObjectId.isValid(id) || !/^[0-9a-fA-F]{24}$/.test(id)) {
      res.status(400).json({ success: false, message: "Invalid pin id" });
      return;
    }

    const pin = await Pin.findById(id).select("_id likeCount").lean();
    if (!pin) {
      res.status(404).json({ success: false, message: "Pin not found" });
      return;
    }

    const deleteResult = await Like.deleteOne({
      user: new Types.ObjectId(me),
      pin: new Types.ObjectId(id),
    });

    if (deleteResult.deletedCount === 1) {
      await Pin.updateOne({ _id: id, likeCount: { $gt: 0 } }, { $inc: { likeCount: -1 } });
    }

    const fresh = await Pin.findById(id).select("likeCount").lean();
    const likeCount = fresh?.likeCount ?? 0;

    console.log(
      `[like.controller:unlikePin] User ${me} unliked pin ${id}: deleted=${deleteResult.deletedCount === 1}, freshLikeCount=${likeCount}`
    );

    res.status(200).json({
      success: true,
      liked: false,
      likeCount,
    });
  } catch (err: any) {
    console.error("[like.controller:unlikePin] ❌ Error:", err?.message || err);
    res.status(500).json({ success: false, message: err?.message || "Failed to unlike pin" });
  }
};
