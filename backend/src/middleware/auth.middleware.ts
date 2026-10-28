import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
  userId?: string;
}

export const requireAuth = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    console.warn(
      `[requireAuth] ⚠️ 401 Unauthorized for ${req.method} ${req.originalUrl}: Missing or malformed Authorization header.`
    );
    res.status(401).json({ success: false, message: "Unauthorized: Missing Bearer token" });
    return;
  }

  const token = header.split(" ")[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET as string) as {
      id: string;
    };
    req.userId = payload.id;
    next();
  } catch (err: any) {
    console.error(
      `[requireAuth] ❌ 401 Invalid or expired token for ${req.method} ${req.originalUrl}:`,
      err?.message || err
    );
    res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
};
