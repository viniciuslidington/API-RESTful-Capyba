import express from "express";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import itemRoutes from "./routes/itemRoutes.js";
import emailRoutes from "./routes/emailRouter.js";
import interesseRoutes from "./routes/interesseRoutes.js";

dotenv.config();

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Rotas
app.use("/api/auth", authRoutes);
app.use("/api/items", itemRoutes);
app.use("/api/email", emailRoutes);
app.use("/api/interesse", interesseRoutes);

export default app;