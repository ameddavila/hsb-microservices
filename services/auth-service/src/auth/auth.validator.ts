import { z } from "zod";

// 🔐 Esquema para login
export const LoginSchema = z.object({
  identifier: z.string().min(3, "El identificador debe tener al menos 3 caracteres"),
  password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
});

// 🔄 Esquema para verificación de token externo
export const VerifyTokenSchema = z.object({
  token: z.string().min(10, "El token es requerido y debe tener al menos 10 caracteres"),
});

// 🧾 Esquema para crear usuario (si se usa en auth-service)
export const CreateUserSchema = z.object({
  email: z.string().email("Email inválido"),
  username: z.string().min(3),
  dni: z.string().min(6),
  password: z.string().min(8),
});

// ✏️ Esquema para actualizar usuario (opcional en auth-service)
export const UpdateUserSchema = z.object({
  email: z.string().email().optional(),
  username: z.string().min(3).optional(),
  dni: z.string().min(6).optional(),
  password: z.string().min(8).optional(),
});

// 🆔 Validación de parámetro ID
export const UserIdParamSchema = z.object({
  id: z.string().uuid("ID inválido"),
});
