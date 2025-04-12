import { Op } from "sequelize";
import bcrypt from "bcrypt";
import { randomBytes } from "crypto";
import { addMinutes, isAfter } from "date-fns";

import UserModel from "@/models/user.model";
import RoleModel from "@/models/role.model";
import UserRoleModel from "@/models/userRole.model";

const SALT_ROUNDS = 10;

export class UserService {
  // 🔐 Registro de nuevo usuario
  static async createUser(data: Partial<UserModel>) {
    const exists = await UserModel.findOne({
      where: {
        [Op.or]: [{ email: data.email }, { username: data.username }],
      },
    });
  
    if (exists) throw new Error("Ya existe un usuario con ese email o username");
  
    const hashed = await bcrypt.hash(data.password!, SALT_ROUNDS);
  
    const user = await UserModel.create({
      ...data,
      password: hashed,
    });
  
    // 🔐 Asignar rol "Invitado" automáticamente
    const guestRole = await RoleModel.findOne({ where: { name: "Invitado" } });
  
    if (!guestRole) {
      console.warn("⚠️ Rol 'Invitado' no encontrado. El usuario se creó sin rol.");
    } else {
      await UserRoleModel.create({ userId: user.id, roleId: guestRole.id });
    }
  
    return user;
  }
  

  // 📥 Obtener todos los usuarios
  static async getAllUsers() {
    return await UserModel.findAll({
      include: [{ model: RoleModel }],
    });
  }

  // 🔍 Obtener usuario por ID
  static async getUserById(id: string) {
    const user = await UserModel.findByPk(id, {
      include: [{ model: RoleModel }],
    });
    if (!user) throw new Error("Usuario no encontrado");
    return user;
  }

  // 🧑‍🏫 Asignar rol a usuario
  static async assignRole(userId: string, roleId: number) {
    const user = await UserModel.findByPk(userId);
    const role = await RoleModel.findByPk(roleId);
    if (!user || !role) throw new Error("Usuario o Rol no encontrados");

    await UserRoleModel.create({ userId, roleId });
    return { message: "Rol asignado correctamente" };
  }

  // ✅ Obtener permisos del usuario
  static async getUserPermissions(userId: string): Promise<string[]> {
    const user = await UserModel.findByPk(userId, {
      include: {
        model: RoleModel,
        include: ["permissions"],
      },
    });

    if (!user || !user.roles) return [];

    const permissions = new Set<string>();
    for (const role of user.roles) {
      const rolePermissions = await role.getPermissions();
      for (const perm of rolePermissions) {
        permissions.add(`${perm.action}:${perm.module}`);
      }
    }

    return Array.from(permissions);
  }

  // 📧 Solicitar recuperación de contraseña
  static async generateResetToken(email: string) {
    const user = await UserModel.findOne({ where: { email } });
    if (!user) throw new Error("Usuario no encontrado");

    const token = randomBytes(32).toString("hex");
    const expires = addMinutes(new Date(), 15); // Token válido por 15 min

    user.passwordResetToken = token;
    user.passwordResetExpires = expires;
    await user.save();

    return { email, token, expires }; // Puedes aquí enviar correo
  }

  // 🔄 Restablecer contraseña usando token
  static async resetPassword(token: string, newPassword: string) {
    // 🔍 Buscar usuario con el token de recuperación
    const user = await UserModel.findOne({
      where: { passwordResetToken: token },
    });

    // 🛑 Validaciones
    if (!user) {
      throw new Error("Token inválido");
    }

    if (!user.passwordResetExpires || isAfter(new Date(), user.passwordResetExpires)) {
      throw new Error("Token expirado");
    }

    // 🔐 Hashear la nueva contraseña
    const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);

    // ✏️ Actualizar datos del usuario
    user.password = hashedPassword;
    user.passwordResetToken = undefined; // ✅ o null si tu modelo lo permite
    user.passwordResetExpires = undefined;

    await user.save();

    return { message: "Contraseña actualizada correctamente" };
  }
}
