import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "defaultsecret";

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    username: string;
    email: string;
    dni: string;
    roles: string[];
    permissions: string[];
  };
}


export const authenticateToken = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  // 🧩 Permitir llamadas internas de microservicios
  if (req.headers["x-internal-call"] === "true") {
    console.log("🔁 Llamada interna detectada, sin verificación de token");
    return next();
  }

  const token = req.cookies["accessToken"];
  const csrfHeader = req.headers["x-csrf-token"];
  const csrfCookie = req.cookies["csrfToken"];
  console.log("🍪 Cookie accessToken:", req.cookies["accessToken"]);
  console.log("🛡️ Header x-csrf-token:", csrfHeader);
  console.log("🍪 Cookie csrfToken:", csrfCookie);

  if (!token || !csrfHeader || csrfHeader !== csrfCookie) {
    return res.status(403).json({ error: "No autorizado o CSRF inválido" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AuthenticatedRequest["user"];
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ error: "Token inválido o expirado" });
  }
};

