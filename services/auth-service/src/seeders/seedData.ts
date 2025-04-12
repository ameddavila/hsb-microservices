import bcrypt from "bcrypt";
import { sequelize } from "@/config/sequelize";
import UserModel from "@/models/user.model";
import RefreshTokenModel from "@/models/refreshToken.model";
import { v4 as uuidv4 } from "uuid";

const SALT_ROUNDS = 10;

async function seedAdminUser() {
  try {
    await sequelize.authenticate();
    console.log("✅ Conectado a la base de datos");

    const exists = await UserModel.findOne({ where: { email: "admin@admin.com" } });

    if (exists) {
      console.log("⚠️ Usuario admin ya existe.");
      return;
    }

    const hashedPassword = await bcrypt.hash("Admin1234!", SALT_ROUNDS);

    const adminUser = await UserModel.create({
      username: "admin",
      email: "admin@admin.com",
      dni: "99999999",
      firstName: "Super",
      lastName: "Admin",
      password: hashedPassword,
      isActive: true,
    });

    // Refresh Token opcional
    const refreshToken = uuidv4(); // o usa generateRefreshToken()
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 días

    await RefreshTokenModel.create({
      userId: adminUser.id,
      token: refreshToken,
      deviceId: "seed-device",
      expiresAt,
      isActive: true,
    });

    console.log("✅ Usuario admin creado con éxito.");
  } catch (error) {
    console.error("❌ Error al crear usuario admin:", error);
  } finally {
    await sequelize.close();
    console.log("🔌 Conexión cerrada.");
  }
}

seedAdminUser();
