// src/middlewares/auth.middleware.ts
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

// Tipo para extender Request con información del usuario
export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    username: string;
    email: string;
    dni: string;
  };
}

export const authenticateToken = (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): void => {
    const token = req.headers.authorization?.split(" ")[1];
  
    if (!token) {
      res.status(401).json({ error: "Token no proporcionado" });
      return;
    }
  
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as AuthenticatedRequest["user"];
      req.user = decoded;
      next();
    } catch {
      res.status(403).json({ error: "Token inválido o expirado" });
    }
  };
  