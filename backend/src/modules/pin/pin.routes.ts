import { Router } from "express";
import { requireAuth } from "../../middleware/auth.middleware";
import { getFeed, getPinById } from "./pin.controller";

const router = Router();

// GET /api/pins/feed — personalised feed (auth required)
router.get("/feed", requireAuth, getFeed);

// GET /api/pins/:id — single pin detail (auth required)
router.get("/:id", requireAuth, getPinById);

export default router;
