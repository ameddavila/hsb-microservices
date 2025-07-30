// src/auth/auth.routes.ts
import { Router } from "express";
import {
  login,
  refresh,
  logout,
  verifyToken,
  getSessionInfo,
  getCsrfToken,
} from "./auth.controller";

import csrf from "csurf";
import { logCsrfDetails } from "@middlewares/csrf.middleware";
import { authenticateToken } from "@middlewares/auth.middleware";

const router = Router();

/* -------------------------------------------------------------------------- */
/* 🧩 Middleware de generación de token CSRF                                  */
/* -------------------------------------------------------------------------- */
const generateCsrf = csrf({
  cookie: {
    key: "_csrf",
    httpOnly: false, // accesible por el frontend
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  },
});

/* -------------------------------------------------------------------------- */
/* 🔓 RUTAS PÚBLICAS                                                          */
/* -------------------------------------------------------------------------- */

// 🔐 Iniciar sesión (no requiere CSRF porque aún no hay cookies)
router.post("/login", login);

// 🎯 Obtener token CSRF inicial para el frontend
router.get("/csrf", generateCsrf, getCsrfToken);

/* -------------------------------------------------------------------------- */
/* 🔒 RUTAS PROTEGIDAS (requieren CSRF + JWT si aplica)                      */
/* -------------------------------------------------------------------------- */

// ♻️ Refrescar token de sesión (CSRF + cookie + JWT si lo usas)
router.post("/refresh", generateCsrf, logCsrfDetails, refresh);

// 🚪 Cerrar sesión (CSRF + cookie + JWT si lo usas)
router.post("/logout", generateCsrf, logCsrfDetails, logout);

/* -------------------------------------------------------------------------- */
/* 🔒 RUTAS CON SOLO JWT (sin CSRF)                                           */
/* -------------------------------------------------------------------------- */

router.post("/verify-token", verifyToken);
router.get("/me", authenticateToken, getSessionInfo);

export default router;
