import { Request, Response } from "express";
import { RoleService } from "@/services/role.service";

export const createRole = async (req: Request, res: Response) => {
  try {
    const role = await RoleService.createRole(req.body);
    return res.status(201).json({ role });
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
};

export const getAllRoles = async (_req: Request, res: Response) => {
  try {
    const roles = await RoleService.getAllRoles();
    return res.json({ roles });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const getRoleById = async (req: Request, res: Response) => {
  try {
    const role = await RoleService.getRoleById(Number(req.params.id));
    return res.json({ role });
  } catch (error: any) {
    return res.status(404).json({ error: error.message });
  }
};
