import { Router } from "express";
import { requireAuth } from "../../middleware/auth.middleware";
import {
  listNotifications,
  getNewNotifications,
  markAllRead,
} from "./notification.controller";

const router = Router();

// Declare /new and /read before anything with a param
router.get("/new", requireAuth, getNewNotifications);
router.post("/read", requireAuth, markAllRead);
router.get("/", requireAuth, listNotifications);

export default router;
