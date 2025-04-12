// src/middlewares/csrf.middleware.ts
import { Request, Response, NextFunction } from "express";

export const verifyCsrfToken = (
    req: Request,
    res: Response,
    next: NextFunction
  ): void => {
    const csrfCookie = req.cookies["csrfToken"];
    const csrfHeader = req.headers["x-csrf-token"];
  
    if (!csrfCookie || !csrfHeader || csrfCookie !== csrfHeader) {
      res.status(403).json({ error: "CSRF token inválido" });
      return;
    }
  
    next();
  };
  