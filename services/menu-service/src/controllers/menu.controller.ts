import { Request, Response } from "express";
import * as MenuService from "@services/menu.service";

// 🔹 GET /menus
export const getAllMenus = async (req: Request, res: Response) => {
  try {
    const menus = await MenuService.getAllMenus();
    return res.json(menus);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};

// 🔹 GET /menus/:id
export const getMenuById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const menu = await MenuService.getMenuById(+id);
    return res.json(menu);
  } catch (err: any) {
    return res.status(404).json({ error: err.message });
  }
};

// 🔹 POST /menus
export const createMenu = async (req: Request, res: Response) => {
  try {
    const menu = await MenuService.createMenu(req.body);
    return res.status(201).json(menu);
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
};

// 🔹 PUT /menus/:id
export const updateMenu = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updated = await MenuService.updateMenu(+id, req.body);
    return res.json(updated);
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
};

// 🔹 DELETE /menus/:id
export const deleteMenu = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await MenuService.deleteMenu(+id);
    return res.json({ message: "Menú eliminado correctamente" });
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
};
