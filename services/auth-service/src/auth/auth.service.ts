// src/auth/auth.service.ts
import axios from "axios";
import bcrypt from "bcrypt";
import { z } from "zod";
import { Op } from "sequelize";
import UserModel from "@models/user.model";
import RefreshTokenModel from "@models/refreshToken.model";
import {
  CreateUserSchema,
} from "./auth.validator";
import { UserClientService } from "@services/user-client.service";

type CreateUserInput = z.infer<typeof CreateUserSchema>;

const USER_SERVICE_URL = process.env.USER_SERVICE_URL || "http://localhost:3002";
const SALT_ROUNDS = 10;

export class AuthService {

  // ─────────────────────────────────────────────
  // 🔐 Login
  // ─────────────────────────────────────────────
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
  
    // 📦 Obtener roles y permisos del user-service
    const userInfo = await UserClientService.getUserWithRoles(user.id);
    const roles = userInfo.roles.map((r) => r.name);
    const permissions = userInfo.roles.flatMap((r) =>
      r.permissions?.map((p) => `${p.action}:${p.module}`) || []
    );
  
    return {
      ...user.toJSON(),
      roles,
      permissions,
    };
  }

  // ─────────────────────────────────────────────
  // ♻️ Refresh Token Management
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
