import { Router } from "express";
import { register, login, clerkSync } from "./auth.controller";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/clerk-sync", clerkSync);

export default router;
