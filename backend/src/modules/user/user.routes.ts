import { Router } from "express";
import { requireAuth } from "../../middleware/auth.middleware";
import { getMe, setInterests, bumpInterests } from "./user.controller";

const router = Router();

// All routes require auth
router.use(requireAuth);

router.get("/me", getMe);
router.post("/interests", setInterests);
router.post("/interests/bump", bumpInterests);

export default router;
