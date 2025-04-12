import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "./authenticateToken";

export const checkRole = (allowedRoles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const role = req.user?.role;
    if (!role || !allowedRoles.includes(role)) {
      return res.status(403).json({ error: "Acceso denegado" });
    }
    next();
  };
};
