import { Response } from "express";
import { AuthRequest } from "../../middleware/auth.middleware";
import Pin from "./pin.model";
import User from "../auth/auth.model";

/**
 * GET /api/pins/feed?cursor=<iso-date>&limit=<number>
 *
 * Returns pins whose tags overlap with the authenticated user's interest map.
 * Tags are sorted by weight (heaviest first) so top-interest content appears
 * more often. Uses cursor-based pagination on `createdAt` (newest first).
 *
 * Response: { success, data: Pin[], nextCursor: string | null }
 */
export const getFeed = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      res.status(404).json({ success: false, message: "User not found" });
      return;
    }

    // Build tag list sorted by interest weight (highest first)
    const tagEntries = [...user.interests.entries()].sort((a, b) => b[1] - a[1]);
    const tags = tagEntries.map(([tag]) => tag);

    const limit = Math.min(Number(req.query.limit) || 20, 50);
    const cursor = req.query.cursor as string | undefined;

    // Build mongo query
    const query: Record<string, unknown> = {};
    if (tags.length > 0) query.tags = { $in: tags };
    if (cursor) query.createdAt = { $lt: new Date(cursor) };

    // Fetch one extra pin to detect if there is a next page
    const pins = await Pin.find(query)
      .sort({ createdAt: -1 })
      .limit(limit + 1)
      .lean();

    const hasMore = pins.length > limit;
    const data = hasMore ? pins.slice(0, limit) : pins;
    const nextCursor = hasMore
      ? (data[data.length - 1].createdAt as Date).toISOString()
      : null;

    res.json({ success: true, data, nextCursor });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * GET /api/pins/:id
 * Returns a single pin by its id.
 */
export const getPinById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const pin = await Pin.findById(req.params.id).lean();
    if (!pin) {
      res.status(404).json({ success: false, message: "Pin not found" });
      return;
    }
    res.json({ success: true, data: pin });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};
