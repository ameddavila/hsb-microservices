// src/utils/token.util.ts

import jwt, {
    JwtPayload as DefaultJwtPayload,
    Secret,
    SignOptions,
    JsonWebTokenError,
  } from "jsonwebtoken";
  import crypto from "crypto";
  
  // ✅ JWT_SECRET debe estar definido y tipado correctamente como Secret
  const JWT_SECRET: Secret = process.env.JWT_SECRET ?? "defaultsecret";
  
  // 🧾 Payload personalizado que incluirás en el token
  export interface JwtPayload extends DefaultJwtPayload {
    id: string;
    username: string;
    email: string;
    dni: string;
  }
  
  // 🔐 Genera un Access Token con expiración configurable
  export const generateAccessToken = (
    payload: JwtPayload,
    expiresIn: SignOptions["expiresIn"] = "15m"
  ): string => {
    return jwt.sign(payload, JWT_SECRET, { expiresIn });
  };
  
  // 🔍 Verifica un token y devuelve el payload
  export const verifyToken = (token: string): JwtPayload => {
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      return decoded as JwtPayload;
    } catch (error) {
      if (error instanceof JsonWebTokenError) {
        throw new Error("Token inválido o expirado");
      }
      throw error;
    }
  };
  
  // 🔁 Genera un Refresh Token aleatorio (seguro, largo y único)
  export const generateRefreshToken = (): string => {
    return crypto.randomBytes(64).toString("hex"); // 128 caracteres hex = 512 bits
  };
  
  // 🛡️ Genera un CSRF Token firmado (HMAC con timestamp opcional para unicidad)
  export const generateCsrfToken = (userId: string): string => {
    const timestamp = Date.now().toString();
    const hmac = crypto.createHmac("sha256", JWT_SECRET);
    hmac.update(`${userId}:${timestamp}`);
    return hmac.digest("hex");
  };
  