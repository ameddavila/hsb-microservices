// src/auth/auth.service.ts
import bcrypt from "bcrypt";
import { z } from "zod";
import { Op } from "sequelize";
import UserModel from "@models/user.model";
import RefreshTokenModel from "@models/refreshToken.model";
import { CreateUserSchema } from "./auth.validator";
import { UserClientService } from "@services/user-client.service";

type CreateUserInput = z.infer<typeof CreateUserSchema>;
const SALT_ROUNDS = 10;

export class AuthService {
  // ─────────────────────────────────────────────
  // 🔐 Login
  // ─────────────────────────────────────────────
  static async loginUser(identifier: string, password: string) {
    console.log("🔐 [AuthService] Iniciando login...");

    const user = await UserModel.findOne({
      where: {
        [Op.or]: [
          { email: identifier },
          { username: identifier },
          { dni: identifier },
        ],
      },
    });

    if (!user) {
      console.warn("❌ Usuario no encontrado:", identifier);
      throw new Error("Credenciales inválidas");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.warn("❌ Contraseña incorrecta para usuario:", user.username);
      throw new Error("Credenciales inválidas");
    }

    // 📦 Obtener roles y permisos desde user-service
    const userInfo = await UserClientService.getUserWithRoles(user.id);

    //console.log(userInfo);
    console.log("✅ [auth.service]Login exitoso:", user.username);
    //console.log("✅ [auth.service]user:", user.toJSON());
    console.log("✅ [auth.service]userInfo:", userInfo);
    //console.log("🧑‍💼 [auth.service]Roles:", userInfo.roles);
    //console.log("🔐 [auth.service]Permisos:", userInfo.permissions);

    return {
      id: user.id,
      username: user.username,
      email: user.email,
      dni: userInfo.dni,
      firstName: userInfo.firstName,
      lastName: userInfo.lastName,
      phone: userInfo.phone,
      profileImage: userInfo.profileImage,
      roles: userInfo.roles,
      permissions: userInfo.permissions,
    };

  }

  // ─────────────────────────────────────────────
  // ♻️ Almacenar Refresh Token
  // ─────────────────────────────────────────────
  static async storeRefreshToken(
    userId: string,
    token: string,
    expiresAt: Date,
    deviceId = "default-device"
  ) {
    await RefreshTokenModel.create({
      userId,
      token,
      deviceId,
      expiresAt,
      lastUsedAt: new Date(),
      isActive: true,
    });
  }

  // ─────────────────────────────────────────────
  // ✅ Verificar Refresh Token
  // ─────────────────────────────────────────────
  static async verifyRefreshToken(token: string) {
    const record = await RefreshTokenModel.findOne({
      where: { token, isActive: true },
      include: [UserModel],
    });

    if (!record || record.expiresAt < new Date()) return null;

    record.lastUsedAt = new Date();
    await record.save();

    return record.user;
  }

  // ─────────────────────────────────────────────
  // 🔚 Invalidar Refresh Token
  // ─────────────────────────────────────────────
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
