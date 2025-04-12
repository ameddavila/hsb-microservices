import { Request, Response } from "express";
import { UserService } from "@/services/user.service";
import {
  CreateUserSchema,
  AssignRoleSchema,
  UserIdParamSchema,
} from "@/validators/user.validator";

// Crear nuevo usuario (registro)
export const createUser = async (req: Request, res: Response) => {
  try {
    const data = CreateUserSchema.parse(req.body);
    const user = await UserService.createUser(data);
    return res.status(201).json({ user });
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
};

// Obtener todos los usuarios
export const getAllUsers = async (_req: Request, res: Response) => {
  try {
    const users = await UserService.getAllUsers();
    return res.json({ users });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

// Obtener usuario por ID
export const getUserById = async (req: Request, res: Response) => {
  try {
    const { id } = UserIdParamSchema.parse(req.params);
    const user = await UserService.getUserById(id);
    return res.json({ user });
  } catch (error: any) {
    return res.status(404).json({ error: error.message });
  }
};

// Asignar rol a un usuario
export const assignRole = async (req: Request, res: Response) => {
  try {
    const { userId, roleId } = AssignRoleSchema.parse(req.body);
    const result = await UserService.assignRole(userId, roleId);
    return res.json(result);
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
};
