import { Response } from "express";
import { AuthRequest } from "../../middleware/auth.middleware";
import Pin from "./pin.model";
import User from "../auth/auth.model";
import Notification from "../notification/notification.model";
import cloudinary from "../../config/cloudinary";
import { uploadToCloudinary } from "../../middleware/upload.middleware";
import { parseCursor } from "../../utils/cursor";

/**
 * GET /api/pins/feed?limit=<number>&cursor=<ISO_createdAt>_<ObjectId>
 *
 * Returns a global feed of all pins, newest first, using cursor-based pagination.
 * Query params:
 *   - limit: default 20, max 50
 *   - cursor: `<ISO createdAt>_<ObjectId>`
 *
 * Response: { success: true, data: Pin[], nextCursor: string | null }
 */
export const getFeed = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const rawLimit = parseInt(req.query.limit as string, 10);
    const limit = !isNaN(rawLimit) && rawLimit > 0 ? Math.min(rawLimit, 50) : 20;
    const cursor = req.query.cursor as string | undefined;

    console.log("[pin.controller:getFeed] Request:", {
      userId: req.userId,
      limit,
      cursor: cursor || "(initial page)",
    });

    let query: Record<string, unknown> = {};

    if (cursor) {
      const parsed = parseCursor(cursor);
      if (!parsed) {
        console.warn("[pin.controller:getFeed] ⚠️ Invalid cursor:", cursor);
        res.status(400).json({ success: false, message: "Invalid cursor" });
        return;
      }

      query = {
        $or: [
          { createdAt: { $lt: parsed.date } },
          { createdAt: parsed.date, _id: { $lt: parsed.objectId } },
        ],
      };
    }

    const pins = await Pin.find(query)
      .sort({ createdAt: -1, _id: -1 })
      .limit(limit + 1)
      .populate("owner", "username email avatarUrl")
      .lean();

    const hasMore = pins.length > limit;
    const data = hasMore ? pins.slice(0, limit) : pins;

    const nextCursor =
      hasMore && data.length > 0
        ? `${new Date(data[data.length - 1].createdAt).toISOString()}_${data[data.length - 1]._id.toString()}`
        : null;

    console.log("[pin.controller:getFeed] ✅ Success:", {
      returnedCount: data.length,
      hasMore,
      nextCursor,
    });

    res.json({ success: true, data, nextCursor });
  } catch (err: any) {
    console.error("[pin.controller:getFeed] ❌ Server error:", err?.message || err);
    res.status(500).json({ success: false, message: err.message || "Server error" });
  }
};

/**
 * GET /api/pins/search?q=<query>&limit=<number>&cursor=<ISO_createdAt>_<ObjectId>
 *
 * Searches pins by title with case-insensitive partial matching and cursor-based pagination.
 * Query params:
 *   - q: required search term (trimmed, max 100 chars)
 *   - limit: default 20, max 50
 *   - cursor: `<ISO createdAt>_<ObjectId>`
 *
 * Response: { success: true, data: Pin[], nextCursor: string | null, query: string }
 */
export const searchPins = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const rawQ = typeof req.query.q === "string" ? req.query.q : "";
    let q = rawQ.trim();

    if (!q) {
      console.warn("[pin.controller:searchPins] ⚠️ Missing search query 'q'.");
      res.status(400).json({ success: false, message: "Search query is required" });
      return;
    }

    if (q.length > 100) {
      q = q.slice(0, 100);
    }

    const rawLimit = parseInt(req.query.limit as string, 10);
    const limit = !isNaN(rawLimit) && rawLimit > 0 ? Math.min(rawLimit, 50) : 20;
    const cursor = req.query.cursor as string | undefined;

    console.log("[pin.controller:searchPins] Request:", {
      userId: req.userId,
      query: q,
      limit,
      cursor: cursor || "(initial page)",
    });

    // Escape regex special characters to prevent regex injection or invalid syntax
    const escaped = q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const titleFilter = { title: { $regex: escaped, $options: "i" } };

    let query: Record<string, unknown> = titleFilter;

    if (cursor) {
      const parsed = parseCursor(cursor);
      if (!parsed) {
        console.warn("[pin.controller:searchPins] ⚠️ Invalid cursor:", cursor);
        res.status(400).json({ success: false, message: "Invalid cursor" });
        return;
      }

      const cursorFilter = {
        $or: [
          { createdAt: { $lt: parsed.date } },
          { createdAt: parsed.date, _id: { $lt: parsed.objectId } },
        ],
      };

      query = {
        $and: [titleFilter, cursorFilter],
      };
    }

    const pins = await Pin.find(query)
      .sort({ createdAt: -1, _id: -1 })
      .limit(limit + 1)
      .populate("owner", "username email avatarUrl")
      .lean();

    const hasMore = pins.length > limit;
    const data = hasMore ? pins.slice(0, limit) : pins;

    const nextCursor =
      hasMore && data.length > 0
        ? `${new Date(data[data.length - 1].createdAt).toISOString()}_${data[data.length - 1]._id.toString()}`
        : null;

    console.log("[pin.controller:searchPins] ✅ Success:", {
      query: q,
      returnedCount: data.length,
      hasMore,
      nextCursor,
    });

    res.json({ success: true, data, nextCursor, query: q });
  } catch (err: any) {
    console.error("[pin.controller:searchPins] ❌ Server error:", err?.message || err);
    res.status(500).json({ success: false, message: err.message || "Server error" });
  }
};

/**
 * GET /api/pins/user/me
 * Returns all pins created by the currently logged-in user.
 */
export const getMyPins = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    console.log("[pin.controller:getMyPins] Request for userId:", req.userId);
    const pins = await Pin.find({ owner: req.userId })
      .sort({ createdAt: -1 })
      .lean();
    console.log("[pin.controller:getMyPins] Found", pins.length, "pins for user.");
    res.json({ success: true, data: pins });
  } catch (err: any) {
    console.error("[pin.controller:getMyPins] ❌ Error:", err?.message || err);
    res.status(500).json({ success: false, message: err.message || "Server error" });
  }
};

/**
 * GET /api/pins/:id
 * Returns a single pin by its id.
 */
export const getPinById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    console.log("[pin.controller:getPinById] Fetching pin ID:", req.params.id);
    const pin = await Pin.findById(req.params.id)
      .populate("owner", "username email avatarUrl")
      .lean();
    if (!pin) {
      console.warn("[pin.controller:getPinById] ⚠️ Pin not found:", req.params.id);
      res.status(404).json({ success: false, message: "Pin not found" });
      return;
    }
    console.log("[pin.controller:getPinById] ✅ Pin found:", {
      id: pin._id,
      title: pin.title,
    });
    res.json({ success: true, data: pin });
  } catch (err: any) {
    console.error("[pin.controller:getPinById] ❌ Error:", err?.message || err);
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * POST /api/pins
 * Creates a new pin with an image URL.
 * Validates title, description, imageUrl, width, height, tags.
 * Assigns owner from req.userId.
 */
export const createPin = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { title, description, imageUrl, width, height, tags } = req.body;

    console.log("[pin.controller:createPin] Pin creation request:", {
      userId: req.userId,
      title,
      imageUrl,
      width,
      height,
      tagsCount: Array.isArray(tags) ? tags.length : undefined,
    });

    // 1. Title validation: required string, trimmed, 1-100 chars
    if (!title || typeof title !== "string" || !title.trim() || title.trim().length > 100) {
      console.warn("[pin.controller:createPin] ⚠️ Invalid title:", title);
      res.status(400).json({
        success: false,
        message: "Title is required and must be between 1 and 100 characters",
      });
      return;
    }

    // 2. Description validation: optional string, max 500 chars
    if (description !== undefined && description !== null && description !== "") {
      if (typeof description !== "string" || description.trim().length > 500) {
        console.warn("[pin.controller:createPin] ⚠️ Invalid description length");
        res.status(400).json({
          success: false,
          message: "Description must be at most 500 characters",
        });
        return;
      }
    }

    // 3. Image URL validation: required, max 2000 chars, protocol must be http: or https:
    if (!imageUrl || typeof imageUrl !== "string" || !imageUrl.trim() || imageUrl.trim().length > 2000) {
      console.warn("[pin.controller:createPin] ⚠️ Invalid imageUrl format or length");
      res.status(400).json({
        success: false,
        message: "Image URL is required and must be at most 2000 characters",
      });
      return;
    }

    let parsedUrl: URL;
    try {
      parsedUrl = new URL(imageUrl.trim());
    } catch {
      console.warn("[pin.controller:createPin] ⚠️ Malformed imageUrl:", imageUrl);
      res.status(400).json({ success: false, message: "Invalid image URL format" });
      return;
    }

    if (parsedUrl.protocol !== "http:" && parsedUrl.protocol !== "https:") {
      console.warn("[pin.controller:createPin] ⚠️ Disallowed protocol:", parsedUrl.protocol);
      res.status(400).json({
        success: false,
        message: "Image URL must use http: or https: protocol",
      });
      return;
    }

    // 4. Width and height validation: finite numbers, integers between 1 and 10000
    // If provided, must be finite integer between 1 and 10000. If omitted, default to 800x1200.
    let numWidth = 800;
    let numHeight = 1200;

    if (width !== undefined && width !== null && width !== "") {
      const parsedW = typeof width === "number" ? width : Number(width);
      if (
        !Number.isFinite(parsedW) ||
        !Number.isInteger(parsedW) ||
        parsedW < 1 ||
        parsedW > 10000
      ) {
        console.warn("[pin.controller:createPin] ⚠️ Invalid width:", width);
        res.status(400).json({
          success: false,
          message: "Width and height must be integers between 1 and 10000",
        });
        return;
      }
      numWidth = parsedW;
    }

    if (height !== undefined && height !== null && height !== "") {
      const parsedH = typeof height === "number" ? height : Number(height);
      if (
        !Number.isFinite(parsedH) ||
        !Number.isInteger(parsedH) ||
        parsedH < 1 ||
        parsedH > 10000
      ) {
        console.warn("[pin.controller:createPin] ⚠️ Invalid height:", height);
        res.status(400).json({
          success: false,
          message: "Width and height must be integers between 1 and 10000",
        });
        return;
      }
      numHeight = parsedH;
    }

    // 5. Tags validation: optional array of strings, trim and lowercase, drop empties, de-dupe, max 10 tags, each max 30 chars
    let processedTags: string[] = [];
    if (tags !== undefined && tags !== null) {
      if (!Array.isArray(tags)) {
        res.status(400).json({ success: false, message: "Tags must be an array of strings" });
        return;
      }

      const seen = new Set<string>();
      for (const rawTag of tags) {
        if (typeof rawTag !== "string") continue;
        const clean = rawTag.trim().toLowerCase();
        if (!clean) continue;
        if (clean.length > 30) {
          res.status(400).json({
            success: false,
            message: "Each tag must be 30 characters or fewer",
          });
          return;
        }
        if (!seen.has(clean)) {
          seen.add(clean);
          processedTags.push(clean);
        }
        if (processedTags.length > 10) {
          res.status(400).json({
            success: false,
            message: "A maximum of 10 tags is allowed",
          });
          return;
        }
      }
    }

    // Store pin (owner is always req.userId; req.body.owner is ignored)
    const pin = await Pin.create({
      owner: req.userId,
      title: title.trim(),
      description: typeof description === "string" ? description.trim() : "",
      imageUrl: imageUrl.trim(),
      width: numWidth,
      height: numHeight,
      tags: processedTags,
    });

    console.log("[pin.controller:createPin] ✅ Pin record created in MongoDB:", pin._id);

    // Create broadcast notification for all other users
    try {
      const uploader = await User.findById(req.userId).lean();
      const actorName = uploader?.username || "Someone";
      const actorAvatar = uploader?.avatarUrl;

      await Notification.create({
        type: "NEW_PIN",
        actor: req.userId,
        pin: pin._id,
        actorName,
        actorAvatar,
        pinTitle: pin.title,
        pinImageUrl: pin.imageUrl,
      });

      console.log(
        "[pin.controller:createPin] ✅ Broadcast notification created for pin:",
        pin._id
      );
    } catch (notifErr: any) {
      console.error(
        "[pin.controller:createPin] ⚠️ Failed to create notification (non-fatal):",
        notifErr?.message || notifErr
      );
    }

    const populatedPin = await Pin.findById(pin._id)
      .populate("owner", "username email avatarUrl")
      .lean();

    res.status(201).json({ success: true, data: populatedPin });
  } catch (err: any) {
    console.error("[pin.controller:createPin] ❌ Pin creation error:", err?.message || err);
    res.status(500).json({ success: false, message: err.message || "Failed to create pin" });
  }
};

/**
 * PATCH /api/pins/:id
 * Updates an existing pin's title, description, or tags.
 */
export const updatePin = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { title, description, tags } = req.body;
    console.log("[pin.controller:updatePin] Updating pin ID:", req.params.id, "by user:", req.userId);

    const pin = await Pin.findById(req.params.id);

    if (!pin) {
      console.warn("[pin.controller:updatePin] ⚠️ Pin not found:", req.params.id);
      res.status(404).json({ success: false, message: "Pin not found" });
      return;
    }

    if (pin.owner.toString() !== req.userId?.toString()) {
      console.warn("[pin.controller:updatePin] ⛔ Unauthorized update attempt. Owner:", pin.owner, "Requester:", req.userId);
      res.status(403).json({ success: false, message: "You are not authorized to edit this pin" });
      return;
    }

    if (title !== undefined) pin.title = title.trim();
    if (description !== undefined) pin.description = description.trim();
    if (tags !== undefined) {
      pin.tags = Array.isArray(tags)
        ? tags.map((t: string) => t.trim().toLowerCase()).filter(Boolean)
        : typeof tags === "string"
        ? tags.split(",").map((t: string) => t.trim().toLowerCase()).filter(Boolean)
        : pin.tags;
    }

    await pin.save();
    console.log("[pin.controller:updatePin] ✅ Pin updated successfully:", pin._id);

    const updated = await Pin.findById(pin._id)
      .populate("owner", "username email avatarUrl")
      .lean();

    res.json({ success: true, data: updated });
  } catch (err: any) {
    console.error("[pin.controller:updatePin] ❌ Update error:", err?.message || err);
    res.status(500).json({ success: false, message: err.message || "Failed to update pin" });
  }
};

/**
 * DELETE /api/pins/:id
 * Deletes a pin and deletes its image asset from Cloudinary.
 */
export const deletePin = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    console.log("[pin.controller:deletePin] Deleting pin ID:", req.params.id, "by user:", req.userId);
    const pin = await Pin.findById(req.params.id);

    if (!pin) {
      console.warn("[pin.controller:deletePin] ⚠️ Pin not found:", req.params.id);
      res.status(404).json({ success: false, message: "Pin not found" });
      return;
    }

    if (pin.owner.toString() !== req.userId?.toString()) {
      console.warn("[pin.controller:deletePin] ⛔ Unauthorized delete attempt. Owner:", pin.owner, "Requester:", req.userId);
      res.status(403).json({ success: false, message: "You are not authorized to delete this pin" });
      return;
    }

    // Delete image from Cloudinary if public_id exists
    if (pin.cloudinaryId) {
      try {
        console.log("[pin.controller:deletePin] Destroying Cloudinary asset:", pin.cloudinaryId);
        await cloudinary.uploader.destroy(pin.cloudinaryId);
        console.log("[pin.controller:deletePin] ✅ Cloudinary asset destroyed:", pin.cloudinaryId);
      } catch (cloudErr: any) {
        console.warn("[pin.controller:deletePin] ⚠️ Failed to delete Cloudinary asset:", cloudErr?.message || cloudErr);
      }
    }

    await pin.deleteOne();
    console.log("[pin.controller:deletePin] ✅ Pin record deleted from MongoDB:", pin._id);

    res.json({
      success: true,
      message: "Pin deleted successfully",
      data: { _id: pin._id },
    });
  } catch (err: any) {
    console.error("[pin.controller:deletePin] ❌ Delete error:", err?.message || err);
    res.status(500).json({ success: false, message: err.message || "Failed to delete pin" });
  }
};
