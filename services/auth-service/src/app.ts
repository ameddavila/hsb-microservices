// src/app.ts
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";

const app = express();

// Configurar CORS para permitir credenciales y orígenes específicos
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:3000",
  credentials: true,
}));

// Middlewares para parsear JSON y cookies
app.use(express.json());
app.use(cookieParser());

// Registrar rutas
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

export default app;
