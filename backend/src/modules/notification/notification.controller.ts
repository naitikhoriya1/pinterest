import { Response } from "express";
import { AuthRequest } from "../../middleware/auth.middleware";
import Notification from "./notification.model";
import User from "../auth/auth.model";
import { parseCursor } from "../../utils/cursor";

/**
 * Helper to get the authenticated user's notificationsLastReadAt timestamp.
 * Falls back to user.createdAt, or epoch if neither exists.
 */
const getUserLastReadAt = async (userId?: string): Promise<Date> => {
  if (!userId) return new Date(0);
  const user = await User.findById(userId).select("notificationsLastReadAt createdAt").lean();
  return user?.notificationsLastReadAt ?? user?.createdAt ?? new Date(0);
};

/**
 * GET /api/notifications?limit=20&cursor=
 * Lists broadcast notifications excluding those where actor == current user.
 * Supports cursor pagination.
 */
export const listNotifications = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const rawLimit = parseInt(req.query.limit as string, 10);
    const limit = !isNaN(rawLimit) && rawLimit > 0 ? Math.min(rawLimit, 50) : 20;
    const cursor = req.query.cursor as string | undefined;

    let query: Record<string, unknown> = {
      actor: { $ne: req.userId },
    };

    if (cursor) {
      const parsed = parseCursor(cursor);
      if (!parsed) {
        res.status(400).json({ success: false, message: "Invalid cursor" });
        return;
      }

      query = {
        $and: [
          { actor: { $ne: req.userId } },
          {
            $or: [
              { createdAt: { $lt: parsed.date } },
              { createdAt: parsed.date, _id: { $lt: parsed.objectId } },
            ],
          },
        ],
      };
    }

    const notifications = await Notification.find(query)
      .sort({ createdAt: -1, _id: -1 })
      .limit(limit + 1)
      .lean();

    const hasMore = notifications.length > limit;
    const data = hasMore ? notifications.slice(0, limit) : notifications;

    const nextCursor =
      hasMore && data.length > 0
        ? `${new Date(data[data.length - 1].createdAt).toISOString()}_${data[data.length - 1]._id.toString()}`
        : null;

    const lastReadAt = await getUserLastReadAt(req.userId);
    const unreadCount = await Notification.countDocuments({
      actor: { $ne: req.userId },
      createdAt: { $gt: lastReadAt },
    });

    const serverTime = new Date().toISOString();

    const formattedData = data.map((item) => ({
      ...item,
      isRead: new Date(item.createdAt) <= new Date(lastReadAt),
    }));

    res.json({
      success: true,
      data: formattedData,
      nextCursor,
      unreadCount,
      serverTime,
    });
  } catch (err: any) {
    console.error("[notification.controller:listNotifications] ❌ Error:", err?.message || err);
    res.status(500).json({ success: false, message: err.message || "Server error" });
  }
};

/**
 * GET /api/notifications/new?since=<ISO>
 * Returns recent notifications with createdAt >= since for HTTP polling.
 */
export const getNewNotifications = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const since = req.query.since as string | undefined;
    if (!since || typeof since !== "string") {
      res.status(400).json({ success: false, message: "Missing required query parameter 'since'" });
      return;
    }

    const sinceDate = new Date(since);
    if (isNaN(sinceDate.getTime())) {
      res.status(400).json({ success: false, message: "Invalid ISO date string for 'since'" });
      return;
    }

    const notifications = await Notification.find({
      actor: { $ne: req.userId },
      createdAt: { $gte: sinceDate },
    })
      .sort({ createdAt: -1, _id: -1 })
      .limit(20)
      .lean();

    const lastReadAt = await getUserLastReadAt(req.userId);
    const unreadCount = await Notification.countDocuments({
      actor: { $ne: req.userId },
      createdAt: { $gt: lastReadAt },
    });

    const serverTime = new Date().toISOString();

    const formattedData = notifications.map((item) => ({
      ...item,
      isRead: new Date(item.createdAt) <= new Date(lastReadAt),
    }));

    res.json({
      success: true,
      data: formattedData,
      unreadCount,
      serverTime,
    });
  } catch (err: any) {
    console.error("[notification.controller:getNewNotifications] ❌ Error:", err?.message || err);
    res.status(500).json({ success: false, message: err.message || "Server error" });
  }
};

/**
 * POST /api/notifications/read
 * Marks all notifications as read by updating user.notificationsLastReadAt to now.
 */
export const markAllRead = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const now = new Date();
    await User.findByIdAndUpdate(req.userId, {
      notificationsLastReadAt: now,
    });

    res.json({
      success: true,
      unreadCount: 0,
      serverTime: now.toISOString(),
    });
  } catch (err: any) {
    console.error("[notification.controller:markAllRead] ❌ Error:", err?.message || err);
    res.status(500).json({ success: false, message: err.message || "Server error" });
  }
};
