import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "./authenticateToken";

/**
 * Middleware para verificar si el usuario tiene un rol permitido.
 * @param allowedRoles Lista de roles válidos (ej: ["admin", "moderador"])
 */
export const checkRole = (allowedRoles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    console.log("🔐 [checkRole] Verificando rol de usuario...");

    if (!req.user) {
      console.warn("⛔ [checkRole] Usuario no autenticado (req.user ausente)");
      return res.status(401).json({ error: "No autenticado" });
    }

    const role = req.user.role;

    console.log(`🔍 [checkRole] Rol del usuario: ${role}`);
    console.log(`✅ [checkRole] Roles permitidos: ${allowedRoles.join(", ")}`);

    if (!allowedRoles.includes(role)) {
      console.warn(`🚫 [checkRole] Rol '${role}' no autorizado para esta acción`);
      return res.status(403).json({ error: "Acceso denegado por rol" });
    }

    console.log("✅ [checkRole] Acceso permitido, continuando con la siguiente función...");
    next();
  };
};
