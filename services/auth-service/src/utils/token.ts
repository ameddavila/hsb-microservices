import jwt, {
  JwtPayload as DefaultJwtPayload,
  Secret,
  SignOptions,
  JsonWebTokenError,
  TokenExpiredError,
} from "jsonwebtoken";
import crypto from "crypto";

// 🧾 Estructura del payload que firmamos en el token
export interface JwtPayload extends DefaultJwtPayload {
  id: string;
  username: string;
  email: string;
}

// 🔐 Secreto JWT centralizado
const JWT_SECRET: Secret = process.env.JWT_SECRET ?? "supersecretkey";

// 📦 Tiempo de vida por defecto para tokens
const DEFAULT_ACCESS_EXPIRATION = "15m";

/**
 * 🔐 Genera un Access Token firmado
 */
export const generateAccessToken = (
  payload: JwtPayload,
  expiresIn: SignOptions["expiresIn"] = DEFAULT_ACCESS_EXPIRATION
): string => {
  console.log("🔐 JWT_SECRET:", process.env.JWT_SECRET);
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
};

/**
 * 🔍 Verifica un JWT y devuelve su payload
 * @throws Error si el token es inválido o expirado
 */
export const verifyToken = (token: string): JwtPayload => {
  try {
    console.log("paso verifyToken",JWT_SECRET);
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded as JwtPayload;
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      throw new Error("El token ha expirado");
    }
    if (error instanceof JsonWebTokenError) {
      throw new Error("Token inválido");
    }
    throw error;
  }
};

/**
 * 🔁 Genera un Refresh Token seguro (string aleatorio)
 */
export const generateRefreshToken = (): string => {
  return crypto.randomBytes(64).toString("hex"); // 512 bits
};

/**
 * 🛡️ Genera un token CSRF firmado con HMAC
 * - Usa el userId como base para unicidad
 * - Incluye timestamp para entropía
 */
export const generateCsrfToken = (userId: string): string => {
  const timestamp = Date.now().toString();
  const hmac = crypto.createHmac("sha256", JWT_SECRET);
  console.log("🔐 JWT_SECRET:", process.env.JWT_SECRET);
  hmac.update(`${userId}:${timestamp}`);
  return hmac.digest("hex");
};
