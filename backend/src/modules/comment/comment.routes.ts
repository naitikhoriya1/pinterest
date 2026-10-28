import { Router } from "express";
import { requireAuth } from "../../middleware/auth.middleware";
import {
  listComments,
  addComment,
  deleteComment,
} from "./comment.controller";

const router = Router();

router.get("/pins/:id/comments", requireAuth, listComments);
router.post("/pins/:id/comments", requireAuth, addComment);
router.delete("/comments/:commentId", requireAuth, deleteComment);

export default router;
