import { Op } from "sequelize";
import bcrypt from "bcrypt";
import UserModel from "@/models/user.model";
import RoleModel from "@/models/role.model";
import UserRoleModel from "@/models/userRole.model";

const SALT_ROUNDS = 10;

export class UserService {
  static async createUser(data: Partial<UserModel>) {
    const exists = await UserModel.findOne({
      where: {
        [Op.or]: [
          { email: data.email },
          { username: data.username },
        ],
      },
    });

    if (exists) throw new Error("Ya existe un usuario con ese email o username");

    const hashed = await bcrypt.hash(data.password!, SALT_ROUNDS);

    const user = await UserModel.create({
      ...data,
      password: hashed,
    });

    return user;
  }

  static async getAllUsers() {
    return await UserModel.findAll({
      include: [{ model: RoleModel }],
    });
  }

  static async getUserById(id: string) {
    const user = await UserModel.findByPk(id, {
      include: [{ model: RoleModel }],
    });
    if (!user) throw new Error("Usuario no encontrado");
    return user;
  }

  static async assignRole(userId: string, roleId: number) {
    const user = await UserModel.findByPk(userId);
    const role = await RoleModel.findByPk(roleId);

    if (!user || !role) throw new Error("Usuario o Rol no encontrados");

    await UserRoleModel.create({ userId, roleId });
    return { message: "Rol asignado correctamente" };
  }

  static async getUserPermissions(userId: string): Promise<string[]> {
    const user = await UserModel.findByPk(userId, {
      include: {
        model: RoleModel,
        include: ['permissions'], // Asegúrate de que la asociación esté definida como 'permissions' en el modelo
      },
    });
  
    if (!user || !user.roles) return [];
  
    const permissions = new Set<string>();
  
    for (const role of user.roles) {
      const rolePermissions = await role.getPermissions(); // Sequelize magic method
      for (const perm of rolePermissions) {
        permissions.add(`${perm.action}:${perm.module}`);
      }
    }
  
    return Array.from(permissions);
  }
  
}
