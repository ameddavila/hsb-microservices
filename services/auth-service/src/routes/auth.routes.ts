// src/routes/auth.routes.ts
import { Router } from "express";
import { login, refresh, logout } from "@controllers/auth.controller";
import { verifyCsrfToken } from "@middlewares/csrf.middleware";

const router = Router();

// Login: Emite tokens (no requiere CSRF)
router.post("/login", login);

// Refresh token: requiere verificación CSRF (el middleware puede ubicarse aquí o en el controlador)
router.post("/refresh", verifyCsrfToken, refresh);

// Logout
router.post("/logout", logout);

export default router;
