import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import routes from "@/routes";

const app = express();

// 🔐 Middlewares globales
app.use(cors({
  origin: true,            // Ajusta con tu frontend
  credentials: true,       // Permite cookies
}));
app.use(express.json());
app.use(cookieParser());

// 📦 Rutas principales
app.use("/api", routes);

// 🧪 Ruta de prueba
app.get("/health", (_req, res) => {
  res.json({ status: "OK", service: "biometrico-service" });
});

export default app;
