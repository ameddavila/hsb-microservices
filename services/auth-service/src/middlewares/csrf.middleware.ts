// src/middlewares/csrf.middleware.ts
import { Request, Response, NextFunction } from "express";

export const verifyCsrfToken = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const csrfCookie = req.cookies["csrfToken"];
  const csrfHeader = req.headers["x-csrf-token"];

  console.log("🔐 [CSRF Middleware]");
  console.log("Cookie:", csrfCookie);
  console.log("Header:", csrfHeader);

  if (!csrfCookie || !csrfHeader || csrfCookie !== csrfHeader) {
    console.warn("🚨 CSRF token inválido");
    res.status(403).json({ error: "CSRF token inválido" });
    return;
  }

  console.log("✅ CSRF token válido");
  next();
};
