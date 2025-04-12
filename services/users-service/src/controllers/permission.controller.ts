import { Request, Response } from "express";
import { PermissionService } from "@/services/permission.service";

export const createPermission = async (req: Request, res: Response) => {
  try {
    const permission = await PermissionService.createPermission(req.body);
    return res.status(201).json({ permission });
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
};

export const getAllPermissions = async (_req: Request, res: Response) => {
  try {
    const permissions = await PermissionService.getAllPermissions();
    return res.json({ permissions });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const getPermissionById = async (req: Request, res: Response) => {
  try {
    const permission = await PermissionService.getPermissionById(Number(req.params.id));
    return res.json({ permission });
  } catch (error: any) {
    return res.status(404).json({ error: error.message });
  }
};
