import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./auth/auth.routes";

const app = express();

// ✅ CORS con frontend configurado desde .env
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:3000",
  credentials: true,
}));

// ✅ Middlewares base
app.use(express.json());
app.use(cookieParser());

// ✅ Rutas de autenticación
app.use("/auth", authRoutes);

export default app;
