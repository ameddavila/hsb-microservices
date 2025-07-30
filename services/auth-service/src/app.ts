// src/app.ts
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./auth/auth.routes";

const app = express();

// ✅ Habilitar CORS con frontend configurado desde .env
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true, // 🔐 permite enviar cookies (como el CSRF)
  })
);

// ✅ Middlewares esenciales
app.use(cookieParser());     // 🔐 Necesario para leer cookies (_csrf, accessToken)
app.use(express.json());     // 📦 Para recibir cuerpos JSON

// 🔍 Log opcional para depuración (puedes quitar en producción)
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log("🍪 CSRF Cookie:", req.cookies._csrf);
  console.log("🔐 CSRF Header:", req.headers["x-csrf-token"]);
  next();
});

// ✅ Rutas autenticación protegidas con CSRF por ruta
app.use("/auth", authRoutes);

// 🛡️ Manejo global de errores CSRF (recomendado)
app.use(
  (err: any, req: Request, res: Response, next: NextFunction): void => {
    if (err.code === "EBADCSRFTOKEN") {
      console.warn("⛔ Token CSRF inválido o faltante");
      res.status(403).json({ error: "Token CSRF inválido o faltante" });
      return;
    }
    next(err);
  }
);

export default app;
