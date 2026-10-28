import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import { connectDB } from "./config/db";

dotenv.config();
connectDB();

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  process.env.CLIENT_URL,
].filter(Boolean) as string[];

app.use(
  cors({
    origin: (origin, callback) => {
      // allow requests with no origin (like mobile apps, curl) or if origin is in allowedOrigins
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(null, true); // Allow all dev origins while supporting credentials
      }
    },
    credentials: true,
  })
);
app.use(helmet());
app.use(express.json());

// ── Routes ──────────────────────────────────────────────────────────────────
import authRoutes from "./modules/auth/auth.routes";
import pinRoutes from "./modules/pin/pin.routes";
import userRoutes from "./modules/user/user.routes";
import notificationRoutes from "./modules/notification/notification.routes";
import commentRoutes from "./modules/comment/comment.routes";

app.use("/api/auth", authRoutes);
app.use("/api/pins", pinRoutes);
app.use("/api/user", userRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api", commentRoutes);

app.get("/", (_, res) => res.send("Pinterest Backend API Running..."));

export default app;
