import { Router } from "express";
import { requireAuth } from "../../middleware/auth.middleware";
import {
  getFeed,
  searchPins,
  getMyPins,
  getPinById,
  createPin,
  updatePin,
  deletePin,
} from "./pin.controller";
import { likePin, unlikePin } from "../like/like.controller";

const router = Router();

// ── Mutation routes (Create declared before /:id) ───────────────────────────
router.post("/", requireAuth, createPin);

// ── GET routes ───────────────────────────────────────────────────────────────
router.get("/feed", requireAuth, getFeed);
router.get("/search", requireAuth, searchPins);
router.get("/user/me", requireAuth, getMyPins);
router.get("/:id", requireAuth, getPinById);

// ── Like / Unlike routes ────────────────────────────────────────────────────
router.put("/:id/like", requireAuth, likePin);
router.delete("/:id/like", requireAuth, unlikePin);

// ── Remaining Mutation routes ───────────────────────────────────────────────
router.patch("/:id", requireAuth, updatePin);
router.put("/:id", requireAuth, updatePin);
router.delete("/:id", requireAuth, deletePin);

export default router;
