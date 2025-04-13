import { Request, Response, NextFunction } from "express";
import { AuthenticatedRequest } from "@middlewares/authenticateToken";
import { UserService } from "@/services/user.service";

/**
 * Middleware para validar si el usuario tiene un permiso específico.
 * @param requiredPermission Ej: "read:menus", "write:users"
 */
export const checkPermission = (requiredPermission: string) => {
  return async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: "Usuario no autenticado" });
      }

      const userId = req.user.id;

      // ✅ Verificar si el usuario tiene el rol "Administrador"
      if (req.user.roles.includes("Administrador")) {
        return next();
      }

      // ✅ Obtener permisos desde base de datos
      const { permissions } = await UserService.getUserRolesAndPermissions(userId);

      if (permissions.includes(requiredPermission)) {
        return next();
      }

      return res.status(403).json({ error: "No tienes permiso para acceder a esta ruta" });
    } catch (error) {
      console.error("❌ Error en checkPermission:", error);
      return res.status(500).json({ error: "Error al verificar permisos" });
    }
  };
};
