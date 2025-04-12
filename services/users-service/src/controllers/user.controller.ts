import { Request, Response } from "express";
import { UserService } from "@/services/user.service";

export const createUser = async (req: Request, res: Response) => {
  try {
    const user = await UserService.createUser(req.body);
    return res.status(201).json({ user });
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
};

export const getAllUsers = async (_req: Request, res: Response) => {
  try {
    const users = await UserService.getAllUsers();
    return res.json({ users });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const user = await UserService.getUserById(req.params.id);
    return res.json({ user });
  } catch (error: any) {
    return res.status(404).json({ error: error.message });
  }
};

export const assignRole = async (req: Request, res: Response) => {
  try {
    const { userId, roleId } = req.body;
    const result = await UserService.assignRole(userId, roleId);
    return res.json(result);
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
};
