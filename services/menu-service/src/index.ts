// src/index.ts
import dotenv from "dotenv";
dotenv.config();
import app from "./app";
import { sequelize } from "./config/sequelize";

const PORT = process.env.PORT || 4002;

async function main() {
  try {
    await sequelize.authenticate();
    console.log("✅ Conexión establecida con la base de datos.");

    // Sincroniza modelos con la DB (crear tablas si no existen)
    await sequelize.sync(); // ✅ No uses force: true si ya hay datos

    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("❌ Error al iniciar la aplicación:", err);
  }
}

main();
