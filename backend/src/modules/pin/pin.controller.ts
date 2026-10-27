import { Response } from "express";
import { Types } from "mongoose";
import { AuthRequest } from "../../middleware/auth.middleware";
import Pin from "./pin.model";
import cloudinary from "../../config/cloudinary";
import { uploadToCloudinary } from "../../middleware/upload.middleware";

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

    let query: Record<string, unknown> = {};

    if (cursor) {
      if (typeof cursor !== "string") {
        res.status(400).json({ success: false, message: "Invalid cursor" });
        return;
      }

      const parts = cursor.split("_");
      if (parts.length !== 2) {
        res.status(400).json({ success: false, message: "Invalid cursor" });
        return;
      }

      const [dateStr, idStr] = parts;
      const date = new Date(dateStr);

      if (
        isNaN(date.getTime()) ||
        !Types.ObjectId.isValid(idStr) ||
        !/^[0-9a-fA-F]{24}$/.test(idStr)
      ) {
        res.status(400).json({ success: false, message: "Invalid cursor" });
        return;
      }

      const objectId = new Types.ObjectId(idStr);
      query = {
        $or: [
          { createdAt: { $lt: date } },
          { createdAt: date, _id: { $lt: objectId } },
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

    res.json({ success: true, data, nextCursor });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || "Server error" });
  }
};

/**
 * GET /api/pins/user/me
 * Returns all pins created by the currently logged-in user.
 */
export const getMyPins = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const pins = await Pin.find({ owner: req.userId })
      .sort({ createdAt: -1 })
      .lean();
    res.json({ success: true, data: pins });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || "Server error" });
  }
};

/**
 * GET /api/pins/:id
 * Returns a single pin by its id.
 */
export const getPinById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const pin = await Pin.findById(req.params.id)
      .populate("owner", "username email avatarUrl")
      .lean();
    if (!pin) {
      res.status(404).json({ success: false, message: "Pin not found" });
      return;
    }
    res.json({ success: true, data: pin });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || "Server error" });
  }
};

/**
 * POST /api/pins
 * Creates a new pin with image upload to Cloudinary.
 * Supports multipart/form-data (image file in req.file) or JSON (imageUrl in req.body).
 */
export const createPin = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { title, description } = req.body;

    if (!title || typeof title !== "string" || !title.trim()) {
      res.status(400).json({ success: false, message: "Pin title is required" });
      return;
    }

    let imageUrl = "";
    let width = 800;
    let height = 1200;
    let cloudinaryId = "";

    if (req.file) {
      // 1. Upload local file buffer directly to Cloudinary
      const uploadResult = await uploadToCloudinary(req.file.buffer, "pinterest_pins");
      imageUrl = uploadResult.secure_url;
      width = uploadResult.width;
      height = uploadResult.height;
      cloudinaryId = uploadResult.public_id;
    } else if (req.body.imageUrl) {
      // 2. Upload from remote image URL or base64 data to Cloudinary
      const uploadResult = await cloudinary.uploader.upload(req.body.imageUrl, {
        folder: "pinterest_pins",
      });
      imageUrl = uploadResult.secure_url;
      width = uploadResult.width;
      height = uploadResult.height;
      cloudinaryId = uploadResult.public_id;
    } else {
      res.status(400).json({ success: false, message: "Image file or imageUrl is required" });
      return;
    }

    // Process tags
    let tags: string[] = [];
    if (Array.isArray(req.body.tags)) {
      tags = req.body.tags.map((t: string) => String(t).trim().toLowerCase()).filter(Boolean);
    } else if (typeof req.body.tags === "string") {
      try {
        const parsed = JSON.parse(req.body.tags);
        if (Array.isArray(parsed)) {
          tags = parsed.map((t: string) => String(t).trim().toLowerCase()).filter(Boolean);
        } else {
          tags = req.body.tags.split(",").map((t: string) => t.trim().toLowerCase()).filter(Boolean);
        }
      } catch {
        tags = req.body.tags.split(",").map((t: string) => t.trim().toLowerCase()).filter(Boolean);
      }
    }

    const pin = await Pin.create({
      owner: req.userId,
      title: title.trim(),
      description: (description || "").trim(),
      imageUrl,
      width,
      height,
      tags,
      cloudinaryId,
    });

    const populatedPin = await Pin.findById(pin._id)
      .populate("owner", "username email avatarUrl")
      .lean();

    res.status(201).json({ success: true, data: populatedPin });
  } catch (err: any) {
    console.error("Create pin error:", err);
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
    const pin = await Pin.findById(req.params.id);

    if (!pin) {
      res.status(404).json({ success: false, message: "Pin not found" });
      return;
    }

    if (pin.owner.toString() !== req.userId?.toString()) {
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
    const updated = await Pin.findById(pin._id)
      .populate("owner", "username email avatarUrl")
      .lean();

    res.json({ success: true, data: updated });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || "Failed to update pin" });
  }
};

/**
 * DELETE /api/pins/:id
 * Deletes a pin and deletes its image asset from Cloudinary.
 */
export const deletePin = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const pin = await Pin.findById(req.params.id);

    if (!pin) {
      res.status(404).json({ success: false, message: "Pin not found" });
      return;
    }

    if (pin.owner.toString() !== req.userId?.toString()) {
      res.status(403).json({ success: false, message: "You are not authorized to delete this pin" });
      return;
    }

    // Delete image from Cloudinary if public_id exists
    if (pin.cloudinaryId) {
      try {
        await cloudinary.uploader.destroy(pin.cloudinaryId);
      } catch (cloudErr) {
        console.warn("Failed to delete Cloudinary asset:", cloudErr);
      }
    }

    await pin.deleteOne();
    res.json({
      success: true,
      message: "Pin deleted successfully",
      data: { _id: pin._id },
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || "Failed to delete pin" });
  }
};
