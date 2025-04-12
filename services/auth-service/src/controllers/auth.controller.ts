import { Request, Response } from "express";
import { z } from "zod";
import { UserService } from "@services/user.service";
import {
  generateAccessToken,
  generateRefreshToken,
  generateCsrfToken,
} from "@utils/token.util";

// ✅ Validación de entrada con Zod
const LoginSchema = z.object({
  identifier: z.string().min(3),
  password: z.string().min(8),
});

// ✅ Opciones estándar para cookies
const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict" as const,
  path: "/",
};

const ACCESS_TOKEN_EXPIRATION = 15 * 60 * 1000; // 15 min
const REFRESH_TOKEN_EXPIRATION = 7 * 24 * 60 * 60 * 1000; // 7 días

/**
 * 🔐 Login Handler
 * - Valida credenciales
 * - Genera Access/Refresh tokens
 * - Emite cookie con CSRF token
 */
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { identifier, password } = LoginSchema.parse(req.body);
    const user = await UserService.loginUser(identifier, password);

    const payload = {
      id: user.id,
      username: user.username,
      email: user.email,
      dni: user.dni,
    };

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken();
    const csrfToken = generateCsrfToken(user.id);

    await UserService.storeRefreshToken(
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

/**
 * 🔄 Refresh Handler
 * - Verifica el refresh token y CSRF
 * - Retorna nuevo access token y CSRF token
 */
export const refresh = async (req: Request, res: Response): Promise<void> => {
  try {
    const refreshToken = req.cookies["refreshToken"];
    const csrfCookie = req.cookies["csrfToken"];
    const csrfHeader = req.headers["x-csrf-token"];

    if (!refreshToken || !csrfCookie || csrfCookie !== csrfHeader) {
      res.status(403).json({ error: "Token refresh o CSRF inválidos" });
      return;
    }

    const user = await UserService.verifyRefreshToken(refreshToken);
    if (!user) {
      res.status(403).json({ error: "Refresh token inválido o expirado" });
      return;
    }

    const payload = {
      id: user.id,
      username: user.username,
      email: user.email,
      dni: user.dni,
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

/**
 * 🔓 Logout Handler
 * - Invalida el refresh token
 * - Limpia todas las cookies relacionadas a la sesión
 */
export const logout = async (req: Request, res: Response): Promise<void> => {
  try {
    const refreshToken = req.cookies["refreshToken"];
    if (refreshToken) {
      await UserService.invalidateRefreshToken(refreshToken);
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
