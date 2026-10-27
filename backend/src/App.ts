import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import { connectDB } from "./config/db";

dotenv.config();
connectDB();

const app = express();

// ── Middleware ──────────────────────────────────────────────────────────────
app.use(cors({ origin: "*", credentials: true }));
app.use(helmet());
app.use(express.json());

// ── Routes ──────────────────────────────────────────────────────────────────
import authRoutes from "./modules/auth/auth.routes";
import pinRoutes from "./modules/pin/pin.routes";
import userRoutes from "./modules/user/user.routes";

app.use("/api/auth", authRoutes);
app.use("/api/pins", pinRoutes);
app.use("/api/user", userRoutes);

app.get("/", (_, res) => res.send("Pinterest Backend API Running..."));

export default app;
