// src/app.ts
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import menuRoutes from "./routes/menu.routes";

const app = express();

app.use(cors({
  origin: true,            // Ajusta con tu frontend
  credentials: true,       // Permite cookies
}));

app.use(express.json());
app.use(cookieParser());//menu

// Rutas
app.use("/menus", menuRoutes);

export default app;
