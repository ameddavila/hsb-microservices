import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { CreateUserSchema, ForgotPasswordSchema, ResetPasswordSchema } from "@/validators/user.validator";
import UserModel from "@/models/user.model";
import RoleModel from "@/models/role.model";
import UserRoleModel from "@/models/userRole.model";
import crypto from "crypto";

const SALT_ROUNDS = 10;

// 🧑 Registro de usuario público
export const registerUser = async (req: Request, res: Response) => {
  try {
    const data = CreateUserSchema.parse(req.body);

    const existingUser = await UserModel.findOne({
      where: {
        email: data.email,
      },
    });

    if (existingUser) {
      return res.status(409).json({ error: "El email ya está registrado" });
    }

    const hashedPassword = await bcrypt.hash(data.password, SALT_ROUNDS);

    const user = await UserModel.create({
      ...data,
      password: hashedPassword,
      isActive: true,
    });

    const guestRole = await RoleModel.findOne({ where: { name: "Invitado" } });
    if (guestRole) {
      await UserRoleModel.create({ userId: user.id, roleId: guestRole.id });
    }

    res.status(201).json({ user });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

// 🔐 Solicitud de restablecimiento de contraseña
export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = ForgotPasswordSchema.parse(req.body);

    const user = await UserModel.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ error: "No se encontró el usuario" });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 3600 * 1000); // 1 hora

    await user.update({
      resetToken,
      resetTokenExpiresAt: expiresAt,
    });

    // Aquí deberías enviar el token por correo electrónico (solo ejemplo)
    console.log("📧 Token de recuperación:", resetToken);

    res.json({ message: "Se ha enviado un enlace para restablecer la contraseña" });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

// 🔄 Restablecer contraseña usando token
export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { token, newPassword } = ResetPasswordSchema.parse(req.body);

    const user = await UserModel.findOne({
      where: {
        resetToken: token,
      },
    });

    if (!user || !user.passwordResetExpires || user.passwordResetExpires < new Date()) {
      return res.status(400).json({ error: "Token inválido o expirado" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);

    await user.update({
      password: hashedPassword,
      resetToken: null,
      resetTokenExpiresAt: null,
    });

    res.json({ message: "Contraseña actualizada correctamente" });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};
