import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import { connectDB } from "./config/db";

dotenv.config();
connectDB();

const app = express();

// middleware
app.use(cors());
app.use(helmet());
app.use(express.json());
import authRoutes from "./modules/auth/auth.routes";
// routes
app.use("/api/auth", authRoutes);

app.get("/", (_, res) => res.send("Pinterest Backend API Running..."));

export default app;
