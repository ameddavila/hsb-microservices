import { z } from "zod";

export const CreateUserSchema = z.object({
  dni: z.string().min(7),
  username: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(8),
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  phone: z.string().optional(),
  isActive: z.boolean().optional(),
  profileImage: z.string().url().optional(),
});

export const UserIdParamSchema = z.object({
  id: z.string().uuid(),
});

export const AssignRoleSchema = z.object({
  userId: z.string().uuid(),
  roleId: z.number().int().positive(),
});

// Registro de usuario
export const RegisterUserSchema = z.object({
    dni: z.string().min(6),
    username: z.string().min(3),
    email: z.string().email(),
    password: z.string().min(8),
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    phone: z.string().optional(),
  });
  
  // Envío de solicitud para recuperar contraseña
  export const ForgotPasswordSchema = z.object({
    email: z.string().email(),
  });
  
  // Token + nueva contraseña
  export const ResetPasswordSchema = z.object({
    token: z.string().min(10),
    newPassword: z.string().min(8),
  });

  export const UpdateUserSchema = z.object({
  username: z.string().optional(),
  email: z.string().email().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  phone: z.string().optional(),
  profileImage: z.string().optional(),
});
