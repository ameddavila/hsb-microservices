// src/config/sequelize.ts
import { Sequelize } from "sequelize-typescript";
import dotenv from "dotenv";
import path from "path";

import UserModel from "@models/user.model";
import RefreshTokenModel from "@models/refreshToken.model"; // importa todos los modelos que uses

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

console.log("🔧 Config DB:", {
  host: process.env.DB_HOST,
  instance: process.env.DB_INSTANCE,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  name: process.env.DB_NAME,
});

export const sequelize = new Sequelize({
  dialect: "mssql",
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  dialectOptions: {
    options: {
      instanceName: process.env.DB_INSTANCE,
      encrypt: false,
    },
  },
  models: [UserModel, RefreshTokenModel], // ✅ explícito y funcional
  logging: false,
});
