// src/services/user.service.ts
//import UserModel from "@/models/user.model";
import RoleModel from "@/models/role.model";
import PermissionModel from "@/models/permission.model";
import UserModel, { UserAttributes } from "@/models/user.model";


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

  async updateUser(userId: string, data: Partial<UserAttributes>) {
  const user = await UserModel.findByPk(userId);
  if (!user) return null;

  return await user.update(data);
},

 async getUserRolesAndPermissions(userId: string) {
  const user = await UserModel.findByPk(userId, {
    include: [
      {
        model: RoleModel,
        through: { attributes: [] },
        include: [
          {
            model: PermissionModel,
            through: { attributes: [] },
          },
        ],
      },
    ],
  });

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
    firstName: user.firstName,
    lastName: user.lastName,
    phone: user.phone,
    profileImage: user.profileImage,
    roles,
    permissions,
  };
}
};
