// src/auth/auth.service.ts

import bcrypt from "bcrypt";
import { z } from "zod";
import { Op } from "sequelize";
import UserModel from "@models/user.model";
import RefreshTokenModel from "@models/refreshToken.model";
import {
  CreateUserSchema,
} from "./auth.validator";

type CreateUserInput = z.infer<typeof CreateUserSchema>;

const SALT_ROUNDS = 10;

export class AuthService {
  // ─────────────────────────────────────────────
  // 🧑‍💻 Registro de nuevo usuario
  // ─────────────────────────────────────────────
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

    return user;
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
