// src/services/user.service.ts
import UserModel from "@/models/user.model";
import RoleModel from "@/models/role.model";

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
};
