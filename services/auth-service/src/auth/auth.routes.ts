import { Router } from "express";
import {
  login,
  refresh,
  logout,
  verifyToken,
} from "./auth.controller";
import { verifyCsrfToken } from "@middlewares/csrf.middleware"; // Usa alias si está configurado

const router = Router();

// 🔐 Login: genera access + refresh + csrf tokens
router.post("/login", login);

// 🔄 Refresh: requiere refresh token válido + CSRF
router.post("/refresh", verifyCsrfToken, refresh);

// 🚪 Logout: invalida refresh token y elimina cookies
router.post("/logout", logout);

// ✅ Verificación externa del access token (uso por otros microservicios)
router.post("/verify-token", verifyToken);

export default router;
