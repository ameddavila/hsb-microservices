import { Request, Response, NextFunction } from "express";

/**
 * ✅ Verifica que el token CSRF del header coincida con la cookie "_csrf"
 * Recomendado cuando usas JWT sin sesiones (stateless)
 */
// export const verifyCsrfToken = (req: Request, res: Response, next: NextFunction): void => {
//   const headerToken = req.headers["x-csrf-token"];
//   const cookieToken = req.cookies["_csrf"];

//   if (!headerToken || !cookieToken || headerToken !== cookieToken) {
//     console.warn("⚠️ CSRF token inválido o faltante");
//     res.status(403).json({ error: "Token CSRF inválido o faltante" });
//     return;
//   }

//   next();
// };

/**
 * 🔍 Middleware de depuración opcional
 */
export const logCsrfDetails = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  const headerToken = req.headers["x-csrf-token"];
  const cookieToken = req.cookies["_csrf"];

  console.log("🔐 [CSRF Debug]");
  console.log("Header x-csrf-token:", headerToken);
  console.log("Cookie _csrf:", cookieToken);
  next();
};
