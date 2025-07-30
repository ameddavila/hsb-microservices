import { Sequelize } from "sequelize-typescript";
import dotenv from "dotenv";
import { menuModels } from "../models"; // ← Importa desde index.ts

dotenv.config();

export const sequelize = new Sequelize({
  dialect: "mssql",
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  dialectOptions: {
    options: {
      encrypt: false,
      instanceName: process.env.DB_INSTANCE || undefined,
    },
  },
  models: menuModels,
  logging: false,
});
