// ✅ Cargar variables de entorno antes de cualquier otra cosa
import dotenv from "dotenv";
dotenv.config();

import app from "./app";
import { sequelize } from "./config/sequelize";

async function main() {
  try {
    await sequelize.authenticate();
    console.log("✅ Conexión a la base de datos exitosa");

    await sequelize.sync(); // Solo en desarrollo

    const PORT = process.env.PORT || 3001;
    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Error al iniciar el servidor:", error);
  }
}

main();
