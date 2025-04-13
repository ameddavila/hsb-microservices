// ✅ FILE: src/scripts/reset-database.ts
import { sequelize } from "@/config/sequelize";

async function resetDatabase() {
  try {
    await sequelize.authenticate();
    console.log("✅ Conectado a la base de datos");

    console.log("⚠️ Eliminando todas las tablas...");
    await sequelize.drop(); // Elimina todas las tablas

    console.log("📦 Creando tablas desde los modelos...");
    await sequelize.sync({ force: true }); // Vuelve a crearlas limpias

    console.log("✅ Base de datos reiniciada con éxito.");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error al reiniciar la base de datos:", error);
    process.exit(1);
  }
}

resetDatabase();
