import { Request, Response } from "express";
import * as AuthService from "./auth.service";

export const register = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;
    console.log("[auth.controller:register] Registering user:", { username, email });
    const user = await AuthService.registerUser(username, email, password);
    console.log("[auth.controller:register] User registered successfully:", user._id);
    res.status(201).json({ success: true, message: "User registered", data: user });
  } catch (err: any) {
    console.error("[auth.controller:register] Error registering user:", err.message);
    res.status(400).json({ success: false, message: err.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    console.log("[auth.controller:login] Logging in user:", email);
    const { user, token } = await AuthService.loginUser(email, password);
    console.log("[auth.controller:login] Login successful for user:", user._id);
    res.status(200).json({ success: true, message: "Login successful", token, data: user });
  } catch (err: any) {
    console.error("[auth.controller:login] Login error:", err.message);
    res.status(400).json({ success: false, message: err.message });
  }
};

/**
 * POST /api/auth/clerk-sync
 * Body: { clerkId, email, username, avatarUrl? }
 * Returns a custom JWT for use with all /api/* protected endpoints.
 */
export const clerkSync = async (req: Request, res: Response) => {
  try {
    const { clerkId, email, username, avatarUrl } = req.body;
    console.log("[auth.controller:clerkSync] Received Clerk sync request:", {
      clerkId,
      email,
      username,
    });

    if (!clerkId || !email || !username) {
      console.warn("[auth.controller:clerkSync] ⚠️ Missing required fields (clerkId, email, username).");
      res.status(400).json({ success: false, message: "clerkId, email and username are required" });
      return;
    }

    const { user, token } = await AuthService.clerkSyncUser({ clerkId, email, username, avatarUrl });
    console.log("[auth.controller:clerkSync] ✅ Successfully synced user with database:", {
      userId: user._id,
      email: user.email,
      tokenIssued: Boolean(token),
    });

    res.status(200).json({ success: true, token, data: user });
  } catch (err: any) {
    console.error("[auth.controller:clerkSync] ❌ Error syncing Clerk user:", err.message || err);
    res.status(400).json({ success: false, message: err.message });
  }
};
