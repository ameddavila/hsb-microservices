import { z } from "zod";

export const CreateUserSchema = z.object({
  username: z.string().min(3).max(50),
  email: z.string().email(),
  password: z.string().min(8).max(255),
  firstName: z.string().min(1).max(50),
  lastName: z.string().min(1).max(50),
  phone: z.string().optional(),
  profileImage: z.string().url().optional(),
  dni: z.string().min(6).max(20),
});

export const UpdateUserSchema = CreateUserSchema.partial(); // todos los campos opcionales

export const UserIdParamSchema = z.object({
  id: z.string().uuid(),
});
