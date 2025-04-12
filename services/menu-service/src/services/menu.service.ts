import { Op } from "sequelize";
import MenuModel  from "@models/menu.model";
import RoleMenuModel from "@models/roleMenu.model";

export async function getAllMenus() {
  return await MenuModel.findAll();
}

// 🔹 Obtener un menú por ID
export async function getMenuById(id: number) {
  const menu = await MenuModel.findByPk(id);
  if (!menu) throw new Error("Menú no encontrado");
  return menu;
}

// 🔹 Crear un nuevo menú
export async function createMenu(data: Partial<MenuModel>) {
  return await MenuModel.create(data);
}

// 🔹 Actualizar un menú
export async function updateMenu(id: number, data: Partial<MenuModel>) {
  const menu = await MenuModel.findByPk(id);
  if (!menu) throw new Error("Menú no encontrado");
  await menu.update(data);
  return menu;
}

// 🔹 Eliminar un menú
export async function deleteMenu(id: number) {
  const menu = await MenuModel.findByPk(id);
  if (!menu) throw new Error("Menú no encontrado");
  await menu.destroy();
}
