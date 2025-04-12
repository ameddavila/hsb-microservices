import MenuModel from "./menu.model";
import RoleMenuModel from "./roleMenu.model";
import RoleModel from "./role.model"; // Si usas una versión simplificada en este microservicio

export const menuModels = [
  MenuModel,
  RoleMenuModel,
  RoleModel, // Opcional: solo si estás usando una copia del modelo de roles en este servicio
];

export {
  MenuModel,
  RoleMenuModel,
  RoleModel, // Exportado solo si está presente en este microservicio
};
