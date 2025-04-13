import { Router } from "express";
import {
  registerUser,
  forgotPassword,
  resetPassword,
} from "@/controllers/public.controller"; // Asegúrate de tener estos métodos definidos

const router = Router();

/**
 * 📋 Rutas públicas sin autenticación
 */

// 🧑 Registro de nuevo usuario
router.post("/register", registerUser);

// 🔑 Olvido de contraseña - envía token por email
router.post("/forgot-password", forgotPassword);

// 🔁 Reinicio de contraseña con token válido
router.post("/reset-password", resetPassword);

export default router;
