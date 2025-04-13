import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "./authenticateToken";

/**
 * Middleware para verificar si el usuario tiene al menos uno de los roles permitidos.
 */
export const checkRole = (allowedRoles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    console.log("🔐 [checkRole] Verificando rol de usuario...");

    if (!req.user) {
      console.warn("⛔ [checkRole] Usuario no autenticado (req.user ausente)");
      return res.status(401).json({ error: "No autenticado" });
    }

    const userRoles = req.user.roles ?? [];

    console.log("🔍 [checkRole] Roles del usuario:", userRoles);
    console.log("✅ [checkRole] Roles permitidos:", allowedRoles);

    const hasPermission = userRoles.some((role) => allowedRoles.includes(role));

    if (!hasPermission) {
      console.warn(`🚫 [checkRole] Ninguno de los roles del usuario está autorizado`);
      return res.status(403).json({ error: "Acceso denegado por rol" });
    }

    console.log("✅ [checkRole] Acceso permitido, continuando...");
    next();
  };
};
