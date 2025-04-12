// src/services/user.service.ts
import bcrypt from "bcrypt";
import { z } from "zod";
import { Op } from "sequelize";
import UserModel from "@models/user.model";
import {
  CreateUserSchema,
  UpdateUserSchema,
  UserIdParamSchema,
} from "@validators/user.validator";
import RefreshTokenModel from "@models/refreshToken.model";

type CreateUserInput = z.infer<typeof CreateUserSchema>;
type UpdateUserInput = z.infer<typeof UpdateUserSchema>;

const SALT_ROUNDS = 10;

export class UserService {
  // Crear usuario
  static async createUser(input: CreateUserInput) {
    const data = CreateUserSchema.parse(input);

    const exists = await UserModel.findOne({
      where: {
        [Op.or]: [
          { email: data.email },
          { username: data.username },
          { dni: data.dni },
        ],
      },
    });

    if (exists) {
      throw new Error("Ya existe un usuario con ese email, username o DNI");
    }

    const hashedPassword = await bcrypt.hash(data.password, SALT_ROUNDS);
    const user = await UserModel.create({ ...data, password: hashedPassword });
    return user;
  }

  static async getAllUsers() {
    return await UserModel.findAll();
  }

  static async getUserById(id: string) {
    UserIdParamSchema.parse({ id });
    const user = await UserModel.findByPk(id);
    if (!user) throw new Error("Usuario no encontrado");
    return user;
  }

  static async updateUser(id: string, input: UpdateUserInput) {
    UserIdParamSchema.parse({ id });
    const data = UpdateUserSchema.parse(input);
    const user = await UserModel.findByPk(id);
    if (!user) throw new Error("Usuario no encontrado");

    // Validar duplicados para email, username o dni
    const conditions: any[] = [];
    if (data.email) conditions.push({ email: data.email });
    if (data.username) conditions.push({ username: data.username });
    if (data.dni) conditions.push({ dni: data.dni });
    
    const duplicate = await UserModel.findOne({
      where: {
        [Op.and]: [
          { id: { [Op.ne]: id } },
          { [Op.or]: conditions },
        ],
      },
    });
    if (duplicate) {
      throw new Error("Ya existe otro usuario con ese email, username o DNI");
    }

    if (data.password) {
      data.password = await bcrypt.hash(data.password, SALT_ROUNDS);
    }

    await user.update(data);
    return user;
  }

  static async deleteUser(id: string) {
    UserIdParamSchema.parse({ id });
    const user = await UserModel.findByPk(id);
    if (!user) throw new Error("Usuario no encontrado");
    await user.destroy();
    return { message: "Usuario eliminado correctamente" };
  }

  // Login: Verifica credenciales
  static async loginUser(identifier: string, password: string) {
    const user = await UserModel.findOne({
      where: {
        [Op.or]: [
          { email: identifier },
          { username: identifier },
          { dni: identifier },
        ],
      },
    });
    if (!user) throw new Error("Credenciales inválidas");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error("Credenciales inválidas");

    return user;
  }

  // Gestión de Refresh Tokens (ejemplo simplificado)
  static async storeRefreshToken(userId: string, token: string, expiresAt: Date, deviceId = "default-device") {
    await RefreshTokenModel.create({
      userId,
      token,
      deviceId,
      expiresAt,
      lastUsedAt: new Date(),
      isActive: true,
    });
  }

  static async verifyRefreshToken(token: string) {
    const record = await RefreshTokenModel.findOne({
      where: { token, isActive: true },
      include: [UserModel],
    });
  
    if (!record || record.expiresAt < new Date()) return null;
  
    // Opcional: actualizar `lastUsedAt`
    record.lastUsedAt = new Date();
    await record.save();
  
    return record.user;
  }
  

  static async invalidateRefreshToken(token: string) {
    await RefreshTokenModel.update(
      { isActive: false },
      { where: { token } }
    );
  }
  static async invalidateAllRefreshTokens(userId: string) {
    await RefreshTokenModel.update(
      { isActive: false },
      { where: { userId } }
    );
  }
  

  
}
