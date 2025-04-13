import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "./authenticateToken";

/**
 * Middleware para verificar si el usuario tiene al menos uno de los roles permitidos.
 * El usuario ya debe estar autenticado y tener `req.user.roles` cargado desde el token.
 */
export const checkPermission = (allowedRoles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user || !req.user.roles) {
      return res.status(403).json({ error: "No autorizado" });
    }

    const hasPermission = req.user.roles.some((role) =>
      allowedRoles.includes(role)
    );

    if (!hasPermission) {
      return res.status(403).json({ error: "Acceso denegado: rol no permitido" });
    }

    next();
  };
};
