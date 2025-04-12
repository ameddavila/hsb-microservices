import { Request, Response } from "express";
import { z } from "zod";
import { AuthService } from "./auth.service";
import {
  generateAccessToken,
  generateRefreshToken,
  generateCsrfToken,
} from "@utils/token";
import jwt from "jsonwebtoken";
import { VerifyTokenSchema } from "./auth.validator";

// ✅ Login input validation
const LoginSchema = z.object({
  identifier: z.string().min(3),
  password: z.string().min(8),
});

// ✅ Default cookie config
const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict" as const,
  path: "/",
};

const ACCESS_TOKEN_EXPIRATION = 15 * 60 * 1000; // 15 min
const REFRESH_TOKEN_EXPIRATION = 7 * 24 * 60 * 60 * 1000; // 7 días

// ─────────────────────────────────────────────
// 🔐 Login
// ─────────────────────────────────────────────
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log("Usuario Login",req.body);
    const { identifier, password } = LoginSchema.parse(req.body);
    const user = await AuthService.loginUser(identifier, password);

    const payload = {
      id: user.id,
      username: user.username,
      email: user.email,
    };

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
    res.status(400).json({ error: err.message });
  }
};

// ─────────────────────────────────────────────
// 🔄 Refresh token
// ─────────────────────────────────────────────
export const refresh = async (req: Request, res: Response): Promise<void> => {
  try {
    const refreshToken = req.cookies["refreshToken"];
    const csrfCookie = req.cookies["csrfToken"];
    const csrfHeader = req.headers["x-csrf-token"];

    if (!refreshToken || !csrfCookie || csrfCookie !== csrfHeader) {
      res.status(403).json({ error: "Token refresh o CSRF inválidos" });
      return;
    }

    const user = await AuthService.verifyRefreshToken(refreshToken);
    if (!user) {
      res.status(403).json({ error: "Refresh token inválido o expirado" });
      return;
    }

    const payload = {
      id: user.id,
      username: user.username,
      email: user.email,
    };

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
    res.status(400).json({ error: err.message });
  }
};

// ─────────────────────────────────────────────
// 🔓 Logout
// ─────────────────────────────────────────────
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
    res.status(400).json({ error: err.message });
  }
};

// ─────────────────────────────────────────────
// ✅ Verificación de token para microservicios
// ─────────────────────────────────────────────
export const verifyToken = (req: Request, res: Response): void => {
  try {
    const { token } = VerifyTokenSchema.parse(req.body);

    const payload = jwt.verify(token, process.env.JWT_SECRET!);
    res.status(200).json({ valid: true, payload });
  } catch (err: any) {
    if (err.name === "ZodError") {
      res.status(400).json({ valid: false, error: "Token inválido o ausente" });
    } else {
      res.status(401).json({ valid: false, error: err.message });
    }
  }
};
