import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import routes from "@/routes";
import path from "path";

const app = express();

// 🔐 Middlewares globales
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// 📦 Rutas principales
app.use("/api", routes);
// Servir carpeta de imágenes
app.use("/uploads/profile-images", express.static(path.join(__dirname, "../uploads/profile-images")));


export default app;
