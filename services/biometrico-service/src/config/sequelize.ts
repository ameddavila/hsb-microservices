import { Sequelize } from "sequelize-typescript";
import path from "path";
import dotenv from "dotenv";
import { rrhhModels } from "@/models"; // o "../models" si no usas alias

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
      instanceName: process.env.DB_INSTANCE,
    },
  },
  models: rrhhModels,
  logging: false,
});