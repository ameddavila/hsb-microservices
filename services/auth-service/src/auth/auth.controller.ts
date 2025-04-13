// src/auth/auth.controller.ts
import { Request, Response } from "express";
import { z } from "zod";
import jwt from "jsonwebtoken";
import { AuthService } from "./auth.service";
import {
  generateAccessToken,
  generateRefreshToken,
  generateCsrfToken,
} from "@utils/token";
import { VerifyTokenSchema } from "./auth.validator";

// Validación de login
const LoginSchema = z.object({
  identifier: z.string().min(3),
  password: z.string().min(8),
});

// Configuración de cookies seguras
const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict" as const,
  path: "/",
};

const ACCESS_TOKEN_EXPIRATION = 15 * 60 * 1000; // 15 min
const REFRESH_TOKEN_EXPIRATION = 7 * 24 * 60 * 60 * 1000; // 7 días

// Función para generar el payload estándar del usuario
const buildUserPayload = (user: any) => ({
  id: user.id,
  username: user.username,
  email: user.email,
  dni: user.dni,
  roles: user.roles ?? [],
  permissions: user.permissions ?? [],
});

// 🔐 Login
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log("📥 [Login] Solicitud recibida:", req.body);
    const { identifier, password } = LoginSchema.parse(req.body);

    const user = await AuthService.loginUser(identifier, password);
    const payload = buildUserPayload(user);

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken();
    const csrfToken = generateCsrfToken(user.id);

    await AuthService.storeRefreshToken(
      user.id,
      refreshToken,
      new Date(Date.now() + REFRESH_TOKEN_EXPIRATION)
    );

    res
      .cookie("accessToken", accessToken, {
        ...cookieOptions,
        maxAge: ACCESS_TOKEN_EXPIRATION,
      })
      .cookie("refreshToken", refreshToken, {
        ...cookieOptions,
        maxAge: REFRESH_TOKEN_EXPIRATION,
      })
      .cookie("csrfToken", csrfToken, {
        ...cookieOptions,
        httpOnly: false,
        maxAge: ACCESS_TOKEN_EXPIRATION,
      })
      .json({ user: payload });
  } catch (err: any) {
    console.error("❌ [Login] Error:", err.message);
    res.status(400).json({ error: err.message });
  }
};

// ♻️ Refresh token
export const refresh = async (req: Request, res: Response): Promise<void> => {
  try {
    const refreshToken = req.cookies["refreshToken"];
    const csrfCookie = req.cookies["csrfToken"];
    const csrfHeader = req.headers["x-csrf-token"];

    if (!refreshToken || !csrfCookie || csrfCookie !== csrfHeader) {
      console.warn("⚠️ [Refresh] CSRF inválido o token ausente");
      res.status(403).json({ error: "Token refresh o CSRF inválidos" });
      return;
    }

    const user = await AuthService.verifyRefreshToken(refreshToken);
    if (!user) {
      res.status(403).json({ error: "Refresh token inválido o expirado" });
      return;
    }

    // 🧠 Si quieres incluir roles/permissions, debes obtenerlos nuevamente
    const fullUser = await AuthService.loginUser(user.username, user.password); // Opcional si tienes hash
    const payload = buildUserPayload(fullUser);

    const newAccessToken = generateAccessToken(payload);
    const newCsrfToken = generateCsrfToken(user.id);

    res
      .cookie("accessToken", newAccessToken, {
        ...cookieOptions,
        maxAge: ACCESS_TOKEN_EXPIRATION,
      })
      .cookie("csrfToken", newCsrfToken, {
        ...cookieOptions,
        httpOnly: false,
        maxAge: ACCESS_TOKEN_EXPIRATION,
      })
      .json({ user: payload });
  } catch (err: any) {
    console.error("❌ [Refresh] Error:", err.message);
    res.status(400).json({ error: err.message });
  }
};

// 🔓 Logout
export const logout = async (req: Request, res: Response): Promise<void> => {
  try {
    const refreshToken = req.cookies["refreshToken"];
    if (refreshToken) {
      await AuthService.invalidateRefreshToken(refreshToken);
    }

    res
      .clearCookie("accessToken", cookieOptions)
      .clearCookie("refreshToken", cookieOptions)
      .clearCookie("csrfToken", cookieOptions)
      .json({ message: "Sesión cerrada" });
  } catch (err: any) {
    console.error("❌ [Logout] Error:", err.message);
    res.status(400).json({ error: err.message });
  }
};

// ✅ Verificación de token (público para otros servicios)
export const verifyToken = (req: Request, res: Response): void => {
  try {
    const { token } = VerifyTokenSchema.parse(req.body);
    const payload = jwt.verify(token, process.env.JWT_SECRET!);
    res.status(200).json({ valid: true, payload });
  } catch (err: any) {
    const errorMsg =
      err.name === "ZodError" ? "Token inválido o ausente" : err.message;
    const status = err.name === "ZodError" ? 400 : 401;
    console.error("❌ [VerifyToken] Error:", errorMsg);
    res.status(status).json({ valid: false, error: errorMsg });
  }
};
