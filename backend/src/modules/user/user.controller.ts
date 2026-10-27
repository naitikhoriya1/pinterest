import { Response } from "express";
import { AuthRequest } from "../../middleware/auth.middleware";
import User from "../auth/auth.model";

type BumpAction = "view" | "click" | "save";
const WEIGHTS: Record<BumpAction, number> = { view: 1, click: 1, save: 3 };

/**
 * GET /api/user/me
 * Returns the authenticated user's profile including interests.
 */
export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) { res.status(404).json({ success: false, message: "User not found" }); return; }
    res.json({ success: true, data: user });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * POST /api/user/interests
 * Body: { tags: string[] }  — saves onboarding interests, weight 3 each.
 * Idempotent: merges with existing weights (won't downgrade existing tags).
 */
export const setInterests = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { tags }: { tags: string[] } = req.body;
    if (!Array.isArray(tags) || tags.length === 0) {
      res.status(400).json({ success: false, message: "tags array is required" });
      return;
    }

    const user = await User.findById(req.userId);
    if (!user) { res.status(404).json({ success: false, message: "User not found" }); return; }

    // Set weight 3 for each selected topic (don't downgrade existing)
    for (const tag of tags) {
      const t = tag.toLowerCase().trim();
      const existing = user.interests.get(t) ?? 0;
      user.interests.set(t, Math.max(existing, 3));
    }
    await user.save();

    res.json({ success: true, data: user.interests });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * POST /api/user/interests/bump
 * Body: { tags: string[], action: "view" | "click" | "save" }
 * Increments weights: view +1, click +1, save +3.
 */
export const bumpInterests = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { tags, action }: { tags: string[]; action: BumpAction } = req.body;
    if (!Array.isArray(tags) || !action || !(action in WEIGHTS)) {
      res.status(400).json({ success: false, message: "tags and valid action are required" });
      return;
    }

    const delta = WEIGHTS[action];
    const user = await User.findById(req.userId);
    if (!user) { res.status(404).json({ success: false, message: "User not found" }); return; }

    for (const tag of tags) {
      const t = tag.toLowerCase().trim();
      user.interests.set(t, (user.interests.get(t) ?? 0) + delta);
    }
    await user.save();

    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};
