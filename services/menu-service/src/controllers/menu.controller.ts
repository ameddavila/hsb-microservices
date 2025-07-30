import { Request, Response } from "express";
import { AuthenticatedRequest } from "@middlewares/authenticateToken";
import Menu from "../models/menu.model";
import { MenuAttributes } from "../types/menu.types";

export const getAllMenus = async (req: Request, res: Response) => {
  try {
    const menus = await Menu.findAll();
    res.json(menus);
  } catch (err) {
    console.error("Error al obtener menús:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const getMenuById = async (req: Request, res: Response) => {
  try {
    const menu = await Menu.findByPk(req.params.id);
    if (!menu) {
      return res.status(404).json({ error: "Menú no encontrado" });
    }
    res.json(menu);
  } catch (err) {
    console.error("Error al obtener menú:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const createMenu = async (req: Request, res: Response) => {
  try {
    const nuevoMenu = await Menu.create(req.body);
    res.status(201).json(nuevoMenu);
  } catch (err) {
    console.error("Error al crear menú:", err);
    res.status(400).json({ error: "Datos inválidos" });
  }
};

export const updateMenu = async (req: Request, res: Response) => {
  try {
    const menu = await Menu.findByPk(req.params.id);
    if (!menu) {
      return res.status(404).json({ error: "Menú no encontrado" });
    }

    await menu.update(req.body);
    res.json(menu);
  } catch (err) {
    console.error("Error al actualizar menú:", err);
    res.status(400).json({ error: "Datos inválidos" });
  }
};

export const deleteMenu = async (req: Request, res: Response) => {
  try {
    const menu = await Menu.findByPk(req.params.id);
    if (!menu) {
      return res.status(404).json({ error: "Menú no encontrado" });
    }

    await menu.destroy();
    res.json({ message: "Menú eliminado correctamente" });
  } catch (err) {
    console.error("Error al eliminar menú:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Obtener árbol de menús jerárquico con control por permisos
export const getMenuTree = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userPermissions: string[] = req.user?.permissions || [];

    console.log("🧾 Permisos del usuario:", userPermissions);

    // Obtener todos los menús activos
    const menus = await Menu.findAll({
      where: { isActive: true },
      order: [["sortOrder", "ASC"]],
    });

    console.log(`📦 Total de menús obtenidos de la BD: ${menus.length}`);

    // Convertir a objetos planos
    const flatMenus = menus.map((menu) =>
      menu.get({ plain: true }) as MenuAttributes
    );

    // Filtrar por permisos del usuario
    const permittedMenus = flatMenus.filter((menu) => {
      const permitido = !menu.permission || userPermissions.includes(menu.permission);
      if (!permitido) {
        console.log(`⛔ Menú "${menu.name}" filtrado por falta de permiso: ${menu.permission}`);
      }
      return permitido;
    });

    console.log(`✅ Total de menús permitidos al usuario: ${permittedMenus.length}`);

    // Construcción del árbol
    const map = new Map<number, MenuAttributes & { children: any[] }>();
    const roots: (MenuAttributes & { children: any[] })[] = [];

    permittedMenus.forEach((menu) => {
      map.set(menu.id, { ...menu, children: [] });
    });

    map.forEach((menu) => {
      if (menu.parentId && map.has(menu.parentId)) {
        map.get(menu.parentId)!.children.push(menu);
      } else {
        roots.push(menu);
      }
    });

    console.log("🌳 Árbol final de menús retornado al frontend:", JSON.stringify(roots, null, 2));

    res.json(roots);
  } catch (err) {
    console.error("❌ Error al obtener árbol de menús:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};
