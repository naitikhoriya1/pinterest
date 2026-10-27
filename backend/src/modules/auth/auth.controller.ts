import { Request, Response } from "express";
import * as AuthService from "./auth.service";

export const register = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;
    const user = await AuthService.registerUser(username, email, password);
    res.status(201).json({ success: true, message: "User registered", data: user });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const { user, token } = await AuthService.loginUser(email, password);
    res.status(200).json({ success: true, message: "Login successful", token, data: user });
  } catch (err: any) {
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
    if (!clerkId || !email || !username) {
      res.status(400).json({ success: false, message: "clerkId, email and username are required" });
      return;
    }
    const { user, token } = await AuthService.clerkSyncUser({ clerkId, email, username, avatarUrl });
    res.status(200).json({ success: true, token, data: user });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};
