import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    username: string;
    email: string;
    dni: string;
    role: string;
  };
}

export const authenticateToken = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const accessToken = req.cookies?.accessToken;
  const csrfHeader = req.headers["x-csrf-token"];
  const csrfToken = req.cookies?.csrfToken;

  // 🔐 Verificar presencia de tokens
  if (!accessToken) {
    return res.status(401).json({ error: "Access token no encontrado" });
  }

  if (!csrfToken || !csrfHeader || csrfToken !== String(csrfHeader)) {
    return res.status(403).json({ error: "CSRF token inválidoaaaa" });
  }

  try {
    const decoded = jwt.verify(accessToken, JWT_SECRET) as JwtPayload;

    // Puedes usar solo los campos que te interesen
    req.user = {
      id: decoded.id,
      username: decoded.username,
      email: decoded.email,
      dni: decoded.dni,
      role: decoded.role,
    };

    next();
  } catch (error) {
    return res.status(403).json({ error: "Access token inválido o expirado" });
  }
};
