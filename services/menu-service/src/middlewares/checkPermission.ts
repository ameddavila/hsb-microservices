import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "./authenticateToken";

export const checkPermission = (requiredPermission: string) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const permissions = req.user?.permissions || [];

    console.log("🛂 [Permisos] Requiere:", requiredPermission);
    console.log("🧾 [Permisos] Del usuario:", permissions);

    if (!permissions.includes(requiredPermission)) {
      console.warn(`⛔ [Permisos] Usuario sin permiso: ${requiredPermission}`);
      return res.status(403).json({ error: "Permiso denegado" });
    }

    console.log("✅ [Permisos] Permiso concedido:", requiredPermission);
    next();
  };
};
