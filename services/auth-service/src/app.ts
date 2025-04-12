// src/app.ts
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./auth/auth.routes";

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

export default app;
