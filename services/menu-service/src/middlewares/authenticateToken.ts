import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

interface CustomJwtPayload {
  id: string;
  username: string;
  email: string;
  dni: string;
  role: string;
  permissions: string[];
  iat?: number;
  exp?: number;
}

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    username: string;
    email: string;
    dni: string;
    role: string;
    permissions: string[];
  };
}

export const authenticateToken = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const accessToken = req.cookies?.accessToken;
  const csrfHeader = req.headers["x-csrf-token"];
  const csrfCookie = req.cookies?.csrfToken;

  console.log("🛡️ Middleware: authenticateToken");
  console.log("📥 Cookies recibidas:", req.cookies);
  console.log("📥 Header x-csrf-token:", csrfHeader);

  if (!accessToken) {
    console.warn("❌ [Auth] Token no encontrado en cookies");
    return res.status(401).json({ error: "Access token no encontrado" });
  }

  if (!csrfHeader || !csrfCookie || csrfHeader !== csrfCookie) {
    console.warn("⚠️ [Auth] CSRF token inválido");
    console.warn("🧩 Header CSRF:", csrfHeader);
    console.warn("🧩 Cookie CSRF:", csrfCookie);
    return res.status(403).json({ error: "CSRF token inválido" });
  }

  try {
    const decoded = jwt.verify(accessToken, JWT_SECRET) as CustomJwtPayload;

    req.user = {
      id: decoded.id,
      username: decoded.username,
      email: decoded.email,
      dni: decoded.dni,
      role: decoded.role,
      permissions: decoded.permissions || [],
    };

    console.log("✅ [Auth] Token verificado correctamente.");
    console.log("👤 Usuario:", req.user);

    next();
  } catch (error) {
    console.error("❌ [Auth] Error al verificar token:", error);
    return res.status(403).json({ error: "Access token inválido o expirado" });
  }
};