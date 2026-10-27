import { Router } from "express";
import { requireAuth } from "../../middleware/auth.middleware";
import { upload } from "../../middleware/upload.middleware";
import {
  getFeed,
  getMyPins,
  getPinById,
  createPin,
  updatePin,
  deletePin,
} from "./pin.controller";

const router = Router();

// ── GET routes ───────────────────────────────────────────────────────────────
// Keep /feed and /user/me before /:id so Express doesn't match them as an ID param
router.get("/feed", requireAuth, getFeed);
router.get("/user/me", requireAuth, getMyPins);
router.get("/:id", requireAuth, getPinById);

// ── Mutation routes (Create, Update, Delete) ─────────────────────────────────
router.post("/", requireAuth, upload.single("image"), createPin);
router.patch("/:id", requireAuth, updatePin);
router.put("/:id", requireAuth, updatePin);
router.delete("/:id", requireAuth, deletePin);

export default router;
