import UserModel from "./user.model";
import RoleModel from "./role.model";
import PermissionModel from "./permission.model";
import UserRoleModel from "./userRole.model";
import RolePermissionModel from "./rolePermission.model";

// Exportar en un array para el registro en Sequelize
export const userModels = [
  UserModel,
  RoleModel,
  PermissionModel,
  UserRoleModel,
  RolePermissionModel,
];

// Exportar también individualmente si se desea importar por nombre
export {
  UserModel,
  RoleModel,
  PermissionModel,
  UserRoleModel,
  RolePermissionModel,
};
