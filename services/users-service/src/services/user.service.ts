// src/services/user.service.ts
import UserModel from "@/models/user.model";
import RoleModel from "@/models/role.model";
import PermissionModel from "@/models/permission.model";

export const UserService = {
  async createUser(data: any) {
    return await UserModel.create(data);
  },

  async getAllUsers() {
    return await UserModel.findAll({
      include: [{ model: RoleModel, as: "roles", through: { attributes: [] } }],
    });
  },

  async getUserById(userId: string) {
    const user = await UserModel.findByPk(userId, {
      include: [{ model: RoleModel, as: "roles", through: { attributes: [] } }],
    });

    return user;
  },

  async assignRole(userId: string, roleId: number) {
    const user = await UserModel.findByPk(userId);
    if (!user) throw new Error("Usuario no encontrado");

    await user.$add("roles", roleId);
    return { message: "Rol asignado correctamente" };
  },

  async getUserRolesAndPermissions(userId: string) {
    const user = await UserModel.findByPk(userId, {
      include: [
        {
          model: RoleModel,
          include: [PermissionModel]
        }
      ]
    });
    console.log("👤 Usuario:", user?.username);
console.log("🔐 Roles:", user?.roles?.map(r => r.name));
console.log("🔑 Permisos:", user?.roles?.flatMap(r => r.permissions?.map(p => `${p.action}:${p.module}`)));

  
    if (!user) throw new Error("Usuario no encontrado");
  
    const roles = user.roles?.map((role) => role.name) || [];
  
    const permissions = user.roles?.flatMap((role) =>
      role.permissions?.map((perm) => `${perm.action}:${perm.module}`) || []
    ) || [];
  
    return {
      id: user.id,
      dni: user.dni,
      username: user.username,
      email: user.email,
      roles,
      permissions
    };
  }
};
